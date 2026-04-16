<?php

namespace App\Services;

use App\Models\Company;
use App\Models\EmailLog;
use App\Models\FormStatusHistory;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NotificationService
{
    public function notifyUser(
        User $user,
        string $title,
        ?string $message = null,
        string $type = 'info',
        ?string $relatedEntity = null,
        ?int $relatedId = null,
        bool $sendEmail = true,
        ?Company $company = null,
        string $emailType = 'notification',
    ): Notification {
        $notification = Notification::query()->create([
            'user_id' => $user->user_id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'related_entity' => $relatedEntity,
            'related_id' => $relatedId,
        ]);

        if ($sendEmail) {
            $this->sendAndLogEmail($user, $title, $message ?? $title, $emailType, $company);
        }

        return $notification;
    }

    public function logStatusChange(
        string $submissionType,
        Model $submission,
        ?User $actor,
        ?string $fromStatus,
        string $toStatus,
        ?string $remarks = null,
    ): FormStatusHistory {
        return FormStatusHistory::query()->create([
            'submission_type' => $submissionType,
            'submission_id' => (int) $submission->getKey(),
            'actor_id' => $actor?->user_id,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'remarks' => $remarks,
        ]);
    }

    public function sendAndLogEmail(
        User $user,
        string $subject,
        string $body,
        string $emailType = 'notification',
        ?Company $company = null,
    ): EmailLog {
        $status = 'sent';

        try {
            Mail::raw($body, function ($message) use ($user, $subject): void {
                $message->to($user->email)->subject($subject);
            });
        } catch (Throwable) {
            $status = 'failed';
        }

        return EmailLog::query()->create([
            'user_id' => $user->user_id,
            'company_id' => $company?->company_id,
            'email_type' => $emailType,
            'recipient_email' => $user->email,
            'subject' => $subject,
            'body' => $body,
            'status' => $status,
        ]);
    }
}
