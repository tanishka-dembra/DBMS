<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inf;
use App\Models\Jnf;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminJnfController extends Controller
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $status = (string) $request->query('status', 'submitted');
        $jnfs = Jnf::query()
            ->with([
                'company:company_id,company_name,sector,website,user_id',
                'company.user:user_id,name,email',
                'jobProfile',
            ])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->get()
            ->map(fn (Jnf $jnf) => $this->formatSubmission($jnf, 'jnf'));

        $infs = Inf::query()
            ->with([
                'company:company_id,company_name,sector,website,user_id',
                'company.user:user_id,name,email',
                'internshipProfile',
            ])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->get()
            ->map(fn (Inf $inf) => $this->formatSubmission($inf, 'inf'));

        return response()->json([
            'data' => $jnfs
                ->concat($infs)
                ->sortByDesc('created_at')
                ->values(),
        ]);
    }

    public function indexInfs(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $status = (string) $request->query('status', 'submitted');
        $infs = Inf::query()
            ->with([
                'company:company_id,company_name,sector,website,user_id',
                'company.user:user_id,name,email',
                'internshipProfile',
            ])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Inf $inf) => $this->formatSubmission($inf, 'inf'));

        return response()->json(['data' => $infs->values()]);
    }

    public function show(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->formatSubmission($jnf->load(['company.user:user_id,name,email', 'jobProfile']), 'jnf', true),
        ]);
    }

    public function showInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->formatSubmission($inf->load(['company.user:user_id,name,email', 'internshipProfile']), 'inf', true),
        ]);
    }

    public function approve(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $fromStatus = $jnf->status;
        $jnf->update(['status' => 'approved']);
        $this->afterAdminDecision($request, $jnf, 'jnf', $fromStatus, 'approved', 'Your JNF has been approved.');

        return response()->json(['data' => $this->formatSubmission($jnf->fresh(['company.user', 'jobProfile']), 'jnf')]);
    }

    public function reject(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $fromStatus = $jnf->status;
        $jnf->update(['status' => 'rejected']);
        $this->afterAdminDecision($request, $jnf, 'jnf', $fromStatus, 'rejected', 'Your JNF has been rejected.');

        return response()->json(['data' => $this->formatSubmission($jnf->fresh(['company.user', 'jobProfile']), 'jnf')]);
    }

    public function requestEdit(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'notes' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $this->openForEdit($jnf, 'jnf', $validated['notes']);

        return response()->json(['data' => $this->formatSubmission($jnf->fresh(['company.user', 'jobProfile']), 'jnf')]);
    }

    public function approveInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $fromStatus = $inf->status;
        $inf->update(['status' => 'approved']);
        $this->afterAdminDecision($request, $inf, 'inf', $fromStatus, 'approved', 'Your INF has been approved.');

        return response()->json(['data' => $this->formatSubmission($inf->fresh(['company.user', 'internshipProfile']), 'inf')]);
    }

    public function rejectInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $fromStatus = $inf->status;
        $inf->update(['status' => 'rejected']);
        $this->afterAdminDecision($request, $inf, 'inf', $fromStatus, 'rejected', 'Your INF has been rejected.');

        return response()->json(['data' => $this->formatSubmission($inf->fresh(['company.user', 'internshipProfile']), 'inf')]);
    }

    public function transitionJnf(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAdmin($request);
        $validated = $this->validateTransition($request);
        $fromStatus = $jnf->status;

        $jnf->update(['status' => $this->normalizeStatus($validated['status'])]);
        $this->afterAdminDecision($request, $jnf, 'jnf', $fromStatus, $jnf->status, $validated['remarks'] ?? null);

        return response()->json(['data' => $this->formatSubmission($jnf->fresh(['company.user', 'jobProfile']), 'jnf')]);
    }

    public function transitionInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAdmin($request);
        $validated = $this->validateTransition($request);
        $fromStatus = $inf->status;

        $inf->update(['status' => $this->normalizeStatus($validated['status'])]);
        $this->afterAdminDecision($request, $inf, 'inf', $fromStatus, $inf->status, $validated['remarks'] ?? null);

        return response()->json(['data' => $this->formatSubmission($inf->fresh(['company.user', 'internshipProfile']), 'inf')]);
    }

    public function requestInfEdit(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'notes' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $this->openForEdit($inf, 'inf', $validated['notes']);

        return response()->json(['data' => $this->formatSubmission($inf->fresh(['company.user', 'internshipProfile']), 'inf')]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_if($request->user()?->role !== 'admin', 403, 'Admin access required.');
    }

    private function openForEdit(Model $submission, string $type, string $notes): void
    {
        abort_if((int) $submission->edit_request_count >= 1, 409, 'This submission has already been opened for edit once.');

        $submission->update([
            'status' => 'open_edit',
            'edit_request_notes' => $notes,
            'edit_request_count' => ((int) $submission->edit_request_count) + 1,
            'edit_requested_at' => now(),
        ]);

        $submission->loadMissing('company.user');

        $this->notifications->logStatusChange($type, $submission, request()->user(), $submission->getOriginal('status'), 'open_edit', $notes);
        $this->notifications->notifyUser(
            $submission->company->user,
            strtoupper($type).' opened for edit',
            $notes,
            'warning',
            $type,
            (int) $submission->getKey(),
            company: $submission->company,
        );
    }

    private function formatSubmission(Model $submission, string $type, bool $full = false): array
    {
        $idKey = $type === 'jnf' ? 'jnf_id' : 'inf_id';
        $profileRelation = $type === 'jnf' ? 'jobProfile' : 'internshipProfile';
        $profile = $submission->{$profileRelation};
        $id = $submission->getKey();

        $payload = [
            'id' => $id,
            'type' => $type,
            $idKey => $id,
            'title' => $submission->title,
            'description' => $submission->description,
            'status' => $submission->status,
            'edit_request_notes' => $submission->edit_request_notes,
            'edit_request_count' => $submission->edit_request_count,
            'edit_requested_at' => $submission->edit_requested_at,
            'created_at' => $submission->created_at,
            'company' => $submission->company,
            'profile' => $profile,
            'job_profile' => $type === 'jnf' ? $profile : null,
            'internship_profile' => $type === 'inf' ? $profile : null,
        ];

        if ($full) {
            $payload['details'] = $this->detailRows($type, $id);
        }

        return $payload;
    }

    private function detailRows(string $type, int $id): array
    {
        $key = $type === 'jnf' ? 'jnf_id' : 'inf_id';

        return [
            'salaries' => DB::table('salaries')->where($key, $id)->get(),
            'global_criteria' => DB::table('global_criteria')->where($key, $id)->get(),
            'eligibility' => DB::table('eligibility')->where($key, $id)->get(),
            'special_criteria' => DB::table('special_criteria')->where($key, $id)->get(),
            'selection_process' => DB::table('selection_process')->where($key, $id)->get(),
            'status_history' => DB::table('form_status_histories')
                ->where('submission_type', $type)
                ->where('submission_id', $id)
                ->orderByDesc('created_at')
                ->get(),
        ];
    }

    private function afterAdminDecision(Request $request, Model $submission, string $type, ?string $fromStatus, string $toStatus, ?string $remarks): void
    {
        $submission->loadMissing('company.user');
        $message = $remarks ?: strtoupper($type)." status changed to {$toStatus}.";

        $this->notifications->logStatusChange($type, $submission, $request->user(), $fromStatus, $toStatus, $message);
        $this->notifications->notifyUser(
            $submission->company->user,
            strtoupper($type).' status updated',
            $message,
            $toStatus === 'rejected' ? 'error' : 'success',
            $type,
            (int) $submission->getKey(),
            company: $submission->company,
            emailType: $toStatus === 'rejected' ? 'rejection' : 'approval',
        );
    }

    private function validateTransition(Request $request): array
    {
        return $request->validate([
            'status' => ['required', 'in:under_review,accepted,approved,rejected,open_edit'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function normalizeStatus(string $status): string
    {
        return $status === 'accepted' ? 'approved' : $status;
    }
}
