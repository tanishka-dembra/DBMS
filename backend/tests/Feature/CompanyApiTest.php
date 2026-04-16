<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CompanyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_user_can_only_see_their_own_company(): void
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'One',
            'email' => 'one@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $otherUser = User::query()->create([
            'name' => 'Two',
            'email' => 'two@example.com',
            'password' => 'password',
            'role' => 'company',
        ]);

        Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => 'Visible Company',
        ]);

        Company::query()->create([
            'user_id' => $otherUser->user_id,
            'company_name' => 'Hidden Company',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/companies')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.company_name', 'Visible Company');
    }

    public function test_admin_can_create_company_for_company_user(): void
    {
        $token = Str::random(80);
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'api_token' => hash('sha256', $token),
        ]);

        $companyUser = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'recruiter@example.com',
            'password' => 'password',
            'role' => 'company',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/companies', [
                'user_id' => $companyUser->user_id,
                'company_name' => 'Admin Created Co',
                'category' => 'private',
                'industry_tags' => ['fintech', 'saas'],
            ])
            ->assertCreated()
            ->assertJsonPath('data.company_name', 'Admin Created Co');

        $this->assertDatabaseHas('companies', [
            'user_id' => $companyUser->user_id,
            'company_name' => 'Admin Created Co',
        ]);
    }

    public function test_company_user_cannot_delete_company(): void
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $company = Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => 'Example Labs',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/v1/companies/'.$company->company_id)
            ->assertForbidden();
    }
}
