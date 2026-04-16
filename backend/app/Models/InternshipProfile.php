<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipProfile extends Model
{
    protected $table = 'internship_profiles';

    protected $primaryKey = 'inf_id';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'inf_id',
        'profile_name',
        'internship_role',
        'place_of_posting',
        'work_location_mode',
        'expected_hires',
        'minimum_hires',
        'duration_months',
        'internship_start_month',
        'required_skills',
        'job_description',
        'jd_pdf_path',
        'additional_info',
        'ppo_available',
        'registration_link',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'ppo_available' => 'boolean',
        'internship_start_month' => 'date',
    ];

    public function inf(): BelongsTo
    {
        return $this->belongsTo(Inf::class, 'inf_id', 'inf_id');
    }
}
