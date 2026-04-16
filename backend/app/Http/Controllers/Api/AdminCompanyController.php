<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $search = trim((string) $request->query('search', ''));

        $companies = Company::query()
            ->with('user:user_id,name,email,role,created_at')
            ->withCount(['jnfs', 'infs'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner
                        ->where('company_name', 'like', "%{$search}%")
                        ->orWhere('sector', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($userQuery) => $userQuery->where('email', 'like', "%{$search}%"));
                });
            })
            ->orderBy('company_name')
            ->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'data' => $companies->items(),
            'meta' => [
                'current_page' => $companies->currentPage(),
                'per_page' => $companies->perPage(),
                'total' => $companies->total(),
            ],
        ]);
    }

    public function show(Request $request, Company $company): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $company->load(['user:user_id,name,email,role,created_at', 'jnfs', 'infs']),
        ]);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        $this->authorizeAdmin($request);

        app(CompanyController::class)->update($request, $company);

        return response()->json(['data' => $company->fresh('user:user_id,name,email,role,created_at')]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_if($request->user()?->role !== 'admin', 403, 'Admin access required.');
    }
}
