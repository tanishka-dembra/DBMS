<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Inf extends Model
{
    protected $table = 'infs';

    protected $primaryKey = 'inf_id';

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

    public function internshipProfile(): HasOne
    {
        return $this->hasOne(InternshipProfile::class, 'inf_id', 'inf_id');
    }
}
