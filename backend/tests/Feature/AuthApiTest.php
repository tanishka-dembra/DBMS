<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'company_name' => 'Example Labs',
            'website' => 'https://example.com',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'hr@example.com')
            ->assertJsonPath('user.role', 'company')
            ->assertJsonPath('company.company_name', 'Example Labs')
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('companies', [
            'company_name' => 'Example Labs',
        ]);
    }

    public function test_company_can_login_and_fetch_current_user(): void
    {
        User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => Hash::make('password123'),
            'role' => 'company',
        ]);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'hr@example.com',
            'password' => 'password123',
        ]);

        $token = $login->assertOk()->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'hr@example.com');
    }

    public function test_invalid_token_is_rejected(): void
    {
        $this->withHeader('Authorization', 'Bearer wrong-token')
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();
    }
}
