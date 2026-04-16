<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $companies = Company::query()
            ->with('user:user_id,name,email,role,created_at')
            ->when($user->role !== 'admin', fn ($query) => $query->where('user_id', $user->user_id))
            ->orderBy('company_name')
            ->get();

        return response()->json(['data' => $companies]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCompany($request);
        $user = $request->user();

        if ($user->role !== 'admin') {
            if ($user->company()->exists()) {
                return response()->json(['message' => 'Company profile already exists.'], 409);
            }

            $validated['user_id'] = $user->user_id;
        }

        $company = Company::query()->create($validated);

        return response()->json(['data' => $company], 201);
    }

    public function show(Request $request, Company $company): JsonResponse
    {
        $this->authorizeCompanyAccess($request, $company);

        return response()->json([
            'data' => $company->load('user:user_id,name,email,role,created_at'),
        ]);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        $this->authorizeCompanyAccess($request, $company);

        $company->update($this->validateCompany($request, $company));

        return response()->json(['data' => $company->fresh()]);
    }

    public function destroy(Request $request, Company $company): JsonResponse
    {
        $this->authorizeCompanyAccess($request, $company, adminOnly: true);

        $company->delete();

        return response()->json(status: 204);
    }

    private function validateCompany(Request $request, ?Company $company = null): array
    {
        return $request->validate([
            'user_id' => [
                Rule::requiredIf(fn () => $request->user()->role === 'admin' && $company === null),
                'integer',
                'exists:users,user_id',
                Rule::unique('companies', 'user_id')->ignore($company?->company_id, 'company_id'),
            ],
            'company_name' => ['required', 'string', 'max:150'],
            'website' => ['nullable', 'url', 'max:255'],
            'postal_address' => ['nullable', 'string'],
            'no_of_employees' => ['nullable', 'integer', 'min:0'],
            'sector' => ['nullable', 'string', 'max:100'],
            'company_logo' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(['startup', 'mnc', 'psu', 'private', 'other'])],
            'date_of_establishment' => ['nullable', 'date'],
            'annual_turnover' => ['nullable', 'numeric', 'min:0'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'industry_tags' => ['nullable', 'array'],
            'industry_tags.*' => ['string', 'max:100'],
            'is_mnc' => ['nullable', 'boolean'],
            'hq_country' => ['nullable', 'string', 'max:100'],
            'hq_city' => ['nullable', 'string', 'max:100'],
            'nature_of_business' => ['nullable', 'string', 'max:255'],
            'company_description' => ['nullable', 'string'],
            'pdf_path' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function authorizeCompanyAccess(Request $request, Company $company, bool $adminOnly = false): void
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        abort_if($adminOnly || $company->user_id !== $user->user_id, 403, 'Forbidden.');
    }
}
