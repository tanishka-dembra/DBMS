<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'company_name' => ['required', 'string', 'max:150'],
            'website' => ['nullable', 'url', 'max:255'],
        ]);

        $plainToken = Str::random(80);

        $user = User::query()->create([
            'name' => $validated['name'] ?? null,
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'company',
            'api_token' => hash('sha256', $plainToken),
        ]);

        $company = Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => $validated['company_name'],
            'website' => $validated['website'] ?? null,
        ]);

        User::query()->where('role', 'admin')->get()->each(function (User $admin) use ($company): void {
            $this->notifications->notifyUser(
                $admin,
                'New company registration',
                "{$company->company_name} has registered on the placement portal.",
                'info',
                'company',
                $company->company_id,
                emailType: 'notification',
            );
        });

        return response()->json([
            'token' => $plainToken,
            'user' => $user->fresh('company'),
            'company' => $company,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $validated['email'])->first();

        if ($user === null || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }

        $plainToken = Str::random(80);
        $user->forceFill(['api_token' => hash('sha256', $plainToken)])->save();

        return response()->json([
            'token' => $plainToken,
            'user' => $user->fresh('company'),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('company'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->forceFill(['api_token' => null])->save();

        return response()->json(['message' => 'Logged out.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->where('email', $validated['email'])->first();

        if ($user !== null) {
            $plainToken = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert([
                'email' => $user->email,
            ], [
                'token' => hash('sha256', $plainToken),
                'expires_at' => now()->addMinutes(30),
                'used_at' => null,
                'created_at' => now(),
            ]);

            $resetUrl = rtrim((string) config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/')
                .'/reset-password?email='.urlencode($user->email).'&token='.$plainToken;

            $emailLog = $this->notifications->sendAndLogEmail(
                $user,
                'Reset your placement portal password',
                "Use this link to reset your password. It expires in 30 minutes.\n\n{$resetUrl}",
                'notification',
                $user->company,
            );

            if ($emailLog->status === 'failed') {
                return response()->json([
                    'message' => 'Password reset email could not be sent. Check SMTP configuration.',
                ], 500);
            }
        }

        return response()->json([
            'message' => 'If that email exists, a password reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $validated['email'])->first();

        if (
            $record === null
            || $record->used_at !== null
            || now()->greaterThan($record->expires_at)
            || ! hash_equals($record->token, hash('sha256', $validated['token']))
        ) {
            return response()->json(['message' => 'Invalid or expired password reset token.'], 422);
        }

        $user = User::query()->where('email', $validated['email'])->firstOrFail();
        $user->forceFill([
            'password' => $validated['password'],
            'api_token' => null,
        ])->save();

        DB::table('password_reset_tokens')->where('email', $validated['email'])->update([
            'used_at' => now(),
        ]);

        return response()->json(['message' => 'Password reset successful.']);
    }
}
