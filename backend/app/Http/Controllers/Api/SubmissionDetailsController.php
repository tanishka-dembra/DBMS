<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Inf;
use App\Models\Jnf;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SubmissionDetailsController extends Controller
{
    public function showJnf(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);

        return response()->json(['data' => $this->loadDetails('jnf', $jnf->jnf_id)]);
    }

    public function saveJnf(Request $request, Jnf $jnf): JsonResponse
    {
        $this->authorizeAccess($request, $jnf);
        $this->ensureEditable($jnf, 'JNF');

        $validated = $this->validatePayload($request, 'jnf');

        DB::transaction(fn () => $this->replaceDetails('jnf', $jnf->jnf_id, $validated));

        return response()->json(['data' => $this->loadDetails('jnf', $jnf->jnf_id)]);
    }

    public function showInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);

        return response()->json(['data' => $this->loadDetails('inf', $inf->inf_id)]);
    }

    public function saveInf(Request $request, Inf $inf): JsonResponse
    {
        $this->authorizeAccess($request, $inf);
        $this->ensureEditable($inf, 'INF');

        $validated = $this->validatePayload($request, 'inf');

        DB::transaction(fn () => $this->replaceDetails('inf', $inf->inf_id, $validated));

        return response()->json(['data' => $this->loadDetails('inf', $inf->inf_id)]);
    }

    private function validatePayload(Request $request, string $type): array
    {
        $currencyRule = Rule::in(['INR', 'USD', 'EUR']);
        $modeRule = Rule::in(['online', 'offline', 'hybrid']);

        return $request->validate([
            'salaries' => ['sometimes', 'array'],
            'salaries.*.course_id' => ['nullable', 'integer', 'exists:courses,course_id'],
            'salaries.*.currency' => ['sometimes', $currencyRule],
            'salaries.*.ctc' => ['nullable', 'numeric', 'min:0'],
            'salaries.*.base_salary' => ['nullable', 'numeric', 'min:0'],
            'salaries.*.in_hand' => ['nullable', 'numeric', 'min:0'],
            'salaries.*.stipend' => ['nullable', 'numeric', 'min:0'],
            'salaries.*.components' => ['sometimes', 'array'],
            'salaries.*.components.*.component_name' => ['nullable', 'string', 'max:100'],
            'salaries.*.components.*.amount' => ['nullable', 'numeric', 'min:0'],
            'salaries.*.components.*.description' => ['nullable', 'string'],

            'global_criteria' => ['sometimes', 'nullable', 'array'],
            'global_criteria.min_cgpa' => ['nullable', 'numeric', 'between:0,10'],
            'global_criteria.backlog_allowed' => ['nullable', 'boolean'],
            'global_criteria.apply_to_all' => ['nullable', 'boolean'],

            'eligibility' => ['sometimes', 'array'],
            'eligibility.*.branch_id' => ['required', 'integer', 'exists:branches,branch_id'],
            'eligibility.*.min_cgpa' => ['nullable', 'numeric', 'between:0,10'],
            'eligibility.*.backlog_allowed' => ['nullable', 'boolean'],

            'special_criteria' => ['sometimes', 'nullable', 'array'],
            'special_criteria.phd_allowed' => ['nullable', 'boolean'],
            'special_criteria.ma_digital_humanities' => ['nullable', 'boolean'],
            'special_criteria.high_school_percentage' => ['nullable', 'numeric', 'between:0,100'],
            'special_criteria.gender_filter' => ['nullable', Rule::in(['all', 'male', 'female', 'others'])],

            'selection_process' => ['sometimes', 'nullable', 'array'],
            'selection_process.pre_placement_talk' => ['nullable', 'boolean'],
            'selection_process.resume_shortlisting' => ['nullable', 'boolean'],
            'selection_process.written_test' => ['nullable', 'boolean'],
            'selection_process.group_discussion' => ['nullable', 'boolean'],
            'selection_process.interview' => ['nullable', 'boolean'],
            'selection_process.selection_mode' => ['nullable', $modeRule],
            'selection_process.psychometric_test' => ['nullable', 'boolean'],
            'selection_process.medical_test' => ['nullable', 'boolean'],
            'selection_process.other_screening' => ['nullable', 'string'],
            'selection_process.infrastructure_details' => ['nullable', 'string'],
            'selection_process.rounds' => ['sometimes', 'array'],
            'selection_process.rounds.*.round_type' => ['nullable', Rule::in(['aptitude', 'technical', 'hr', 'gd', 'other'])],
            'selection_process.rounds.*.mode' => ['nullable', $modeRule],
            'selection_process.rounds.*.duration_minutes' => ['nullable', 'integer', 'min:1'],
            'selection_process.rounds.*.interview_mode' => ['nullable', Rule::in(['on-campus', 'telephonic', 'video'])],
            'selection_process.rounds.*.round_order' => ['nullable', 'integer', 'min:1'],
        ]);
    }

    private function replaceDetails(string $type, int $id, array $payload): void
    {
        $key = $this->foreignKey($type);
        $link = [$key => $id];

        if (array_key_exists('salaries', $payload)) {
            $salaryIds = DB::table('salaries')->where($key, $id)->pluck('salary_id');
            DB::table('salary_components')->whereIn('salary_id', $salaryIds)->delete();
            DB::table('salaries')->where($key, $id)->delete();

            foreach ($payload['salaries'] as $salary) {
                $components = $salary['components'] ?? [];
                unset($salary['components']);

                $salaryId = DB::table('salaries')->insertGetId(array_merge($link, [
                    'course_id' => $salary['course_id'] ?? null,
                    'currency' => $salary['currency'] ?? 'INR',
                    'ctc' => $salary['ctc'] ?? null,
                    'base_salary' => $salary['base_salary'] ?? null,
                    'in_hand' => $salary['in_hand'] ?? null,
                    'stipend' => $salary['stipend'] ?? null,
                ]));

                foreach ($components as $component) {
                    DB::table('salary_components')->insert([
                        'salary_id' => $salaryId,
                        'component_name' => $component['component_name'] ?? null,
                        'amount' => $component['amount'] ?? null,
                        'description' => $component['description'] ?? null,
                    ]);
                }
            }
        }

        if (array_key_exists('global_criteria', $payload)) {
            DB::table('global_criteria')->where($key, $id)->delete();
            if ($payload['global_criteria'] !== null) {
                DB::table('global_criteria')->insert(array_merge($link, [
                    'min_cgpa' => $payload['global_criteria']['min_cgpa'] ?? null,
                    'backlog_allowed' => $payload['global_criteria']['backlog_allowed'] ?? null,
                    'apply_to_all' => $payload['global_criteria']['apply_to_all'] ?? null,
                ]));
            }
        }

        if (array_key_exists('eligibility', $payload)) {
            DB::table('eligibility')->where($key, $id)->delete();
            foreach ($payload['eligibility'] as $row) {
                DB::table('eligibility')->insert(array_merge($link, [
                    'branch_id' => $row['branch_id'],
                    'min_cgpa' => $row['min_cgpa'] ?? null,
                    'backlog_allowed' => $row['backlog_allowed'] ?? null,
                ]));
            }
        }

        if (array_key_exists('special_criteria', $payload)) {
            DB::table('special_criteria')->where($key, $id)->delete();
            if ($payload['special_criteria'] !== null) {
                DB::table('special_criteria')->insert(array_merge($link, [
                    'phd_allowed' => $payload['special_criteria']['phd_allowed'] ?? null,
                    'ma_digital_humanities' => $payload['special_criteria']['ma_digital_humanities'] ?? null,
                    'high_school_percentage' => $payload['special_criteria']['high_school_percentage'] ?? null,
                    'gender_filter' => $payload['special_criteria']['gender_filter'] ?? null,
                ]));
            }
        }

        if (array_key_exists('selection_process', $payload)) {
            $selectionIds = DB::table('selection_process')->where($key, $id)->pluck('selection_id');
            DB::table('selection_rounds')->whereIn('selection_id', $selectionIds)->delete();
            DB::table('selection_process')->where($key, $id)->delete();

            if ($payload['selection_process'] !== null) {
                $rounds = $payload['selection_process']['rounds'] ?? [];

                $selectionId = DB::table('selection_process')->insertGetId(array_merge($link, [
                    'pre_placement_talk' => $payload['selection_process']['pre_placement_talk'] ?? false,
                    'resume_shortlisting' => $payload['selection_process']['resume_shortlisting'] ?? false,
                    'written_test' => $payload['selection_process']['written_test'] ?? false,
                    'group_discussion' => $payload['selection_process']['group_discussion'] ?? false,
                    'interview' => $payload['selection_process']['interview'] ?? false,
                    'selection_mode' => $payload['selection_process']['selection_mode'] ?? null,
                    'psychometric_test' => $payload['selection_process']['psychometric_test'] ?? false,
                    'medical_test' => $payload['selection_process']['medical_test'] ?? false,
                    'other_screening' => $payload['selection_process']['other_screening'] ?? null,
                    'infrastructure_details' => $payload['selection_process']['infrastructure_details'] ?? null,
                ]));

                foreach ($rounds as $index => $round) {
                    DB::table('selection_rounds')->insert([
                        'selection_id' => $selectionId,
                        'round_type' => $round['round_type'] ?? null,
                        'mode' => $round['mode'] ?? null,
                        'duration_minutes' => $round['duration_minutes'] ?? null,
                        'interview_mode' => $round['interview_mode'] ?? null,
                        'round_order' => $round['round_order'] ?? $index + 1,
                    ]);
                }
            }
        }
    }

    private function loadDetails(string $type, int $id): array
    {
        $key = $this->foreignKey($type);
        $salaries = DB::table('salaries')->where($key, $id)->get()->map(function ($salary) {
            $salary->components = DB::table('salary_components')->where('salary_id', $salary->salary_id)->get();
            return $salary;
        });

        $selection = DB::table('selection_process')->where($key, $id)->first();
        if ($selection !== null) {
            $selection->rounds = DB::table('selection_rounds')->where('selection_id', $selection->selection_id)->orderBy('round_order')->get();
        }

        return [
            'salaries' => $salaries,
            'global_criteria' => DB::table('global_criteria')->where($key, $id)->first(),
            'eligibility' => DB::table('eligibility')->where($key, $id)->get(),
            'special_criteria' => DB::table('special_criteria')->where($key, $id)->first(),
            'selection_process' => $selection,
        ];
    }

    private function foreignKey(string $type): string
    {
        return $type === 'jnf' ? 'jnf_id' : 'inf_id';
    }

    private function ensureEditable(Model $submission, string $label): void
    {
        abort_unless(in_array($submission->status, ['draft', 'open_edit'], true), 409, "Only draft or open-edit {$label}s can be updated.");
    }

    private function authorizeAccess(Request $request, Model $submission): void
    {
        if ($request->user()->role === 'admin') {
            return;
        }

        abort_if($submission->company_id !== $this->companyFor($request)->company_id, 403, 'Forbidden.');
    }

    private function companyFor(Request $request): Company
    {
        $company = $request->user()->company;
        abort_if($company === null, 422, 'Create a company profile before saving submission details.');

        return $company;
    }
}
