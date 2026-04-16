<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Inf;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InfController extends Controller
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = Inf::query()->with(['company', 'internshipProfile'])->orderByDesc('created_at');

        if ($request->user()->role !== 'admin') {
            $company = $this->companyFor($request);
            $query->where('company_id', $company->company_id);
        }

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $company = $this->companyFor($request);
        $validated = $this->validatePayload($request);

        $inf = Inf::query()->create([
            'company_id' => $company->company_id,
            'title' => $validated['title'] ?? $validated['internship_profile']['internship_role'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => 'draft',
        ]);

        $inf->internshipProfile()->create($validated['internship_profile'] ?? []);

        return response()->json(['data' => $inf->fresh(['company', 'internshipProfile'])], 201);
    }

    public function autosaveStore(Request $request): JsonResponse
    {
        return $this->store($request);
    }

    public function show(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);

        return response()->json(['data' => $inf->load(['company', 'internshipProfile'])]);
    }

    public function update(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);
        abort_unless(in_array($inf->status, ['draft', 'open_edit'], true), 409, 'Only draft or open-edit INFs can be updated.');

        $validated = $this->validatePayload($request, partial: true);

        $inf->update([
            'title' => $validated['title'] ?? $inf->title,
            'description' => $validated['description'] ?? $inf->description,
            'status' => $inf->status === 'open_edit' ? 'draft' : $inf->status,
        ]);

        if (array_key_exists('internship_profile', $validated)) {
            $inf->internshipProfile()->updateOrCreate(['inf_id' => $inf->inf_id], $validated['internship_profile']);
        }

        return response()->json(['data' => $inf->fresh(['company', 'internshipProfile'])]);
    }

    public function autosaveUpdate(Request $request, Inf $inf): JsonResponse
    {
        return $this->update($request, $inf);
    }

    public function submit(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);
        abort_unless(in_array($inf->status, ['draft', 'open_edit'], true), 409, 'This INF is not editable.');

        $fromStatus = $inf->status;
        $inf->update(['status' => 'submitted']);
        $this->notifications->logStatusChange('inf', $inf, $request->user(), $fromStatus, 'submitted', 'Submitted by company.');
        $this->notifications->sendAndLogEmail(
            $request->user(),
            'INF submitted',
            "Your INF {$inf->title} has been submitted for admin review.",
            'submission',
            $inf->company,
        );

        return response()->json(['data' => $inf->fresh(['company', 'internshipProfile'])]);
    }

    public function destroy(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);
        abort_if($inf->status !== 'draft', 409, 'Only draft INFs can be deleted.');

        $inf->delete();

        return response()->json(status: 204);
    }

    private function validatePayload(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$partial ? 'sometimes' : 'nullable', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'internship_profile' => [$partial ? 'sometimes' : 'required', 'array'],
            'internship_profile.profile_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'internship_profile.internship_role' => [$required, 'nullable', 'string', 'max:255'],
            'internship_profile.place_of_posting' => ['sometimes', 'nullable', 'string', 'max:255'],
            'internship_profile.work_location_mode' => ['sometimes', 'nullable', Rule::in(['onsite', 'remote', 'hybrid'])],
            'internship_profile.expected_hires' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'internship_profile.minimum_hires' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'internship_profile.duration_months' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'internship_profile.internship_start_month' => ['sometimes', 'nullable', 'date'],
            'internship_profile.required_skills' => ['sometimes', 'nullable', 'array'],
            'internship_profile.required_skills.*' => ['string', 'max:100'],
            'internship_profile.job_description' => ['sometimes', 'nullable', 'string'],
            'internship_profile.jd_pdf_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'internship_profile.additional_info' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'internship_profile.ppo_available' => ['sometimes', 'boolean'],
            'internship_profile.registration_link' => ['sometimes', 'nullable', 'url', 'max:255'],
        ]);
    }

    private function companyFor(Request $request): Company
    {
        $company = $request->user()->company;
        abort_if($company === null, 422, 'Create a company profile before creating an INF.');

        return $company;
    }

    private function authorizeAccess(Request $request, Inf $inf): void
    {
        if ($request->user()->role === 'admin') {
            return;
        }

        abort_if($inf->company_id !== $this->companyFor($request)->company_id, 403, 'Forbidden.');
    }
}
