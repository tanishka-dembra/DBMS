<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Jnf extends Model
{
    protected $table = 'jnfs';

    protected $primaryKey = 'jnf_id';

    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'status',
        'edit_request_notes',
        'edit_request_count',
        'edit_requested_at',
    ];

    protected $casts = [
        'edit_requested_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    public function jobProfile(): HasOne
    {
        return $this->hasOne(JobProfile::class, 'jnf_id', 'jnf_id');
    }
}
