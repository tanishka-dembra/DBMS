<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Jnf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminJnfApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_submitted_jnfs(): void
    {
        $token = Str::random(80);
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'api_token' => hash('sha256', $token),
        ]);

        $company = $this->createCompany();
        Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Submitted Role',
            'description' => 'Ready for review',
            'status' => 'submitted',
        ]);
        Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Draft Role',
            'description' => 'Still editing',
            'status' => 'draft',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/admin/jnfs')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Submitted Role');
    }

    public function test_company_user_cannot_review_admin_jnf_queue(): void
    {
        $token = Str::random(80);
        User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/admin/jnfs')
            ->assertForbidden();
    }

    public function test_admin_can_approve_jnf(): void
    {
        $token = Str::random(80);
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'api_token' => hash('sha256', $token),
        ]);

        $company = $this->createCompany();
        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Submitted Role',
            'description' => 'Ready for review',
            'status' => 'submitted',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/admin/jnfs/'.$jnf->jnf_id.'/approve')
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('jnfs', [
            'jnf_id' => $jnf->jnf_id,
            'status' => 'approved',
        ]);
    }

    public function test_admin_can_open_jnf_for_edit_only_once(): void
    {
        $token = Str::random(80);
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'api_token' => hash('sha256', $token),
        ]);

        $company = $this->createCompany();
        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Needs edits',
            'description' => 'Ready for review',
            'status' => 'submitted',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/admin/jnfs/'.$jnf->jnf_id.'/request-edit', [
                'notes' => 'Please correct the salary breakup before approval.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'open_edit')
            ->assertJsonPath('data.edit_request_count', 1);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/admin/jnfs/'.$jnf->jnf_id.'/request-edit', [
                'notes' => 'Please correct one more thing.',
            ])
            ->assertStatus(409);
    }

    private function createCompany(): Company
    {
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => Str::random(8).'@example.com',
            'password' => 'password',
            'role' => 'company',
        ]);

        return Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => 'Example Labs',
        ]);
    }
}
