<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class OperationalApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_and_complete_password_reset(): void
    {
        Mail::fake();

        User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => Hash::make('old-password'),
            'role' => 'company',
        ]);

        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'hr@example.com',
        ])->assertOk();

        $record = DB::table('password_reset_tokens')->where('email', 'hr@example.com')->first();
        $this->assertNotNull($record);

        DB::table('password_reset_tokens')->where('email', 'hr@example.com')->update([
            'token' => hash('sha256', 'plain-reset-token'),
        ]);

        $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'hr@example.com',
            'token' => 'plain-reset-token',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'hr@example.com',
            'password' => 'new-password',
        ]);

        $login->assertOk()->assertJsonStructure(['token']);
    }

    public function test_user_can_list_and_mark_notifications_read(): void
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $notification = Notification::query()->create([
            'user_id' => $user->user_id,
            'title' => 'Review update',
            'message' => 'Your form was reviewed.',
            'type' => 'info',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('meta.unread_count', 1)
            ->assertJsonPath('data.0.title', 'Review update');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/notifications/'.$notification->notification_id.'/read')
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/notifications/mark-all-read')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);
    }
}
