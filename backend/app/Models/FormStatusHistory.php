<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormStatusHistory extends Model
{
    protected $table = 'form_status_histories';

    protected $primaryKey = 'history_id';

    public $timestamps = false;

    protected $fillable = [
        'submission_type',
        'submission_id',
        'actor_id',
        'from_status',
        'to_status',
        'remarks',
    ];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id', 'user_id');
    }
}
