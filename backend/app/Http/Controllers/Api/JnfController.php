<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Jnf;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JnfController extends Controller
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = Jnf::query()->with(['company', 'jobProfile'])->orderByDesc('created_at');

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

        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => $validated['title'] ?? $validated['job_profile']['job_designation'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => 'draft',
        ]);

        $jnf->jobProfile()->create($validated['job_profile'] ?? []);

        return response()->json(['data' => $jnf->fresh(['company', 'jobProfile'])], 201);
    }

    public function autosaveStore(Request $request): JsonResponse
    {
        return $this->store($request);
    }

    public function show(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);

        return response()->json(['data' => $jnf->load(['company', 'jobProfile'])]);
    }

    public function update(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);
        abort_unless(in_array($jnf->status, ['draft', 'open_edit'], true), 409, 'Only draft or open-edit JNFs can be updated.');

        $validated = $this->validatePayload($request, partial: true);

        $jnf->update([
            'title' => $validated['title'] ?? $jnf->title,
            'description' => $validated['description'] ?? $jnf->description,
            'status' => $jnf->status === 'open_edit' ? 'draft' : $jnf->status,
        ]);

        if (array_key_exists('job_profile', $validated)) {
            $jnf->jobProfile()->updateOrCreate(['jnf_id' => $jnf->jnf_id], $validated['job_profile']);
        }

        return response()->json(['data' => $jnf->fresh(['company', 'jobProfile'])]);
    }

    public function autosaveUpdate(Request $request, Jnf $jnf): JsonResponse
    {
        return $this->update($request, $jnf);
    }

    public function submit(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);
        abort_unless(in_array($jnf->status, ['draft', 'open_edit'], true), 409, 'This JNF is not editable.');

        $fromStatus = $jnf->status;
        $jnf->update(['status' => 'submitted']);
        $this->notifications->logStatusChange('jnf', $jnf, $request->user(), $fromStatus, 'submitted', 'Submitted by company.');
        $jnf->loadMissing('company');

        User::query()->where('role', 'admin')->get()->each(function (User $admin) use ($jnf): void {
            $this->notifications->notifyUser(
                $admin,
                'New JNF submitted',
                "{$jnf->company?->company_name} submitted {$jnf->title} for review.",
                'info',
                'jnf',
                $jnf->jnf_id,
                sendEmail: false,
                company: $jnf->company,
            );
        });

        $this->notifications->sendAndLogEmail(
            $request->user(),
            'JNF submitted',
            "Your JNF {$jnf->title} has been submitted for admin review.",
            'submission',
            $jnf->company,
        );

        return response()->json(['data' => $jnf->fresh(['company', 'jobProfile'])]);
    }

    public function destroy(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);
        abort_if($jnf->status !== 'draft', 409, 'Only draft JNFs can be deleted.');

        $jnf->delete();

        return response()->json(status: 204);
    }

    private function validatePayload(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$partial ? 'sometimes' : 'nullable', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'job_profile' => [$partial ? 'sometimes' : 'required', 'array'],
            'job_profile.profile_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'job_profile.job_designation' => [$required, 'nullable', 'string', 'max:255'],
            'job_profile.place_of_posting' => ['sometimes', 'nullable', 'string', 'max:255'],
            'job_profile.work_location_mode' => ['sometimes', 'nullable', Rule::in(['onsite', 'remote', 'hybrid'])],
            'job_profile.expected_hires' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'job_profile.minimum_hires' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'job_profile.tentative_joining_month' => ['sometimes', 'nullable', 'date'],
            'job_profile.required_skills' => ['sometimes', 'nullable', 'array'],
            'job_profile.required_skills.*' => ['string', 'max:100'],
            'job_profile.job_description' => ['sometimes', 'nullable', 'string'],
            'job_profile.jd_pdf_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'job_profile.additional_info' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'job_profile.bond_details' => ['sometimes', 'nullable', 'string'],
            'job_profile.registration_link' => ['sometimes', 'nullable', 'url', 'max:255'],
            'job_profile.onboarding_details' => ['sometimes', 'nullable', 'string'],
        ]);
    }

    private function companyFor(Request $request): Company
    {
        $company = $request->user()->company;
        abort_if($company === null, 422, 'Create a company profile before creating a JNF.');

        return $company;
    }

    private function authorizeAccess(Request $request, Jnf $jnf): void
    {
        if ($request->user()->role === 'admin') {
            return;
        }

        abort_if($jnf->company_id !== $this->companyFor($request)->company_id, 403, 'Forbidden.');
    }
}
