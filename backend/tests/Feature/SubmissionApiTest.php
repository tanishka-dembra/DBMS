<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inf;
use App\Models\Jnf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class SubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_can_create_and_submit_jnf(): void
    {
        [$token] = $this->createCompanyUser();

        $create = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/jnfs', [
                'title' => 'Graduate Engineer Trainee',
                'description' => 'Campus role',
                'job_profile' => [
                    'job_designation' => 'GET',
                    'place_of_posting' => 'Dhanbad',
                    'work_location_mode' => 'onsite',
                    'expected_hires' => 5,
                    'required_skills' => ['Mining', 'Safety'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.job_profile.job_designation', 'GET');

        $jnfId = $create->json('data.jnf_id');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/jnfs/'.$jnfId.'/submit')
            ->assertOk()
            ->assertJsonPath('data.status', 'submitted');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/jnfs/'.$jnfId, [
                'title' => 'Changed',
            ])
            ->assertStatus(409);
    }

    public function test_company_can_create_and_submit_inf(): void
    {
        [$token] = $this->createCompanyUser();

        $create = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/infs', [
                'title' => 'Summer Intern',
                'description' => 'Internship role',
                'internship_profile' => [
                    'internship_role' => 'Analytics Intern',
                    'place_of_posting' => 'Remote',
                    'work_location_mode' => 'remote',
                    'expected_hires' => 3,
                    'duration_months' => 2,
                    'ppo_available' => true,
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.internship_profile.internship_role', 'Analytics Intern');

        $infId = $create->json('data.inf_id');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/infs/'.$infId.'/submit')
            ->assertOk()
            ->assertJsonPath('data.status', 'submitted');
    }

    public function test_company_can_save_and_read_jnf_details(): void
    {
        [$token, , $company] = $this->createCompanyUser();
        [$courseId, $branchId] = $this->createCourseAndBranch();

        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Detailed JNF',
            'status' => 'draft',
        ]);
        $jnf->jobProfile()->create(['job_designation' => 'Engineer']);

        $payload = [
            'salaries' => [[
                'course_id' => $courseId,
                'currency' => 'INR',
                'ctc' => 1200000,
                'base_salary' => 900000,
                'in_hand' => 70000,
                'components' => [[
                    'component_name' => 'Joining Bonus',
                    'amount' => 100000,
                    'description' => 'Paid after joining',
                ]],
            ]],
            'global_criteria' => [
                'min_cgpa' => 7.5,
                'backlog_allowed' => false,
                'apply_to_all' => true,
            ],
            'eligibility' => [[
                'branch_id' => $branchId,
                'min_cgpa' => 7,
                'backlog_allowed' => false,
            ]],
            'special_criteria' => [
                'phd_allowed' => true,
                'ma_digital_humanities' => false,
                'high_school_percentage' => 75,
                'gender_filter' => 'all',
            ],
            'selection_process' => [
                'pre_placement_talk' => true,
                'resume_shortlisting' => true,
                'selection_mode' => 'online',
                'rounds' => [[
                    'round_type' => 'technical',
                    'mode' => 'online',
                    'duration_minutes' => 60,
                    'interview_mode' => 'video',
                    'round_order' => 1,
                ]],
            ],
        ];

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/jnfs/'.$jnf->jnf_id.'/details', $payload)
            ->assertOk()
            ->assertJsonPath('data.salaries.0.components.0.component_name', 'Joining Bonus')
            ->assertJsonPath('data.global_criteria.apply_to_all', 1)
            ->assertJsonPath('data.eligibility.0.branch_id', $branchId)
            ->assertJsonPath('data.selection_process.rounds.0.round_type', 'technical');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/jnfs/'.$jnf->jnf_id.'/details')
            ->assertOk()
            ->assertJsonPath('data.salaries.0.currency', 'INR')
            ->assertJsonPath('data.special_criteria.gender_filter', 'all');
    }

    public function test_company_can_save_and_read_inf_details(): void
    {
        [$token, , $company] = $this->createCompanyUser();
        [$courseId, $branchId] = $this->createCourseAndBranch();

        $inf = Inf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Detailed INF',
            'status' => 'draft',
        ]);
        $inf->internshipProfile()->create([
            'internship_role' => 'Analytics Intern',
            'duration_months' => 2,
            'ppo_available' => true,
        ]);

        $payload = [
            'salaries' => [[
                'course_id' => $courseId,
                'currency' => 'INR',
                'stipend' => 50000,
                'components' => [[
                    'component_name' => 'Performance Bonus',
                    'amount' => 10000,
                ]],
            ]],
            'global_criteria' => [
                'min_cgpa' => 7,
                'backlog_allowed' => true,
                'apply_to_all' => true,
            ],
            'eligibility' => [[
                'branch_id' => $branchId,
                'min_cgpa' => 7,
                'backlog_allowed' => true,
            ]],
            'selection_process' => [
                'resume_shortlisting' => true,
                'interview' => true,
                'selection_mode' => 'online',
                'rounds' => [[
                    'round_type' => 'hr',
                    'mode' => 'online',
                    'duration_minutes' => 30,
                    'interview_mode' => 'video',
                ]],
            ],
        ];

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/infs/'.$inf->inf_id.'/details', $payload)
            ->assertOk()
            ->assertJsonPath('data.salaries.0.stipend', 50000)
            ->assertJsonPath('data.selection_process.rounds.0.round_type', 'hr');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/infs/'.$inf->inf_id.'/details')
            ->assertOk()
            ->assertJsonPath('data.global_criteria.backlog_allowed', 1)
            ->assertJsonPath('data.eligibility.0.branch_id', $branchId);
    }

    private function createCompanyUser(): array
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => Str::random(8).'@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $company = Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => 'Example Labs',
        ]);

        return [$token, $user, $company];
    }

    private function createCourseAndBranch(): array
    {
        $courseId = DB::table('courses')->insertGetId([
            'course_name' => 'B.Tech',
        ]);
        $branchId = DB::table('branches')->insertGetId([
            'course_id' => $courseId,
            'branch_name' => 'Computer Science and Engineering',
        ]);

        return [$courseId, $branchId];
    }
}
