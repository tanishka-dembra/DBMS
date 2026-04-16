<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $table = 'email_logs';

    protected $primaryKey = 'email_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'company_id',
        'email_type',
        'recipient_email',
        'subject',
        'body',
        'status',
    ];
}
