<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobProfile extends Model
{
    protected $table = 'job_profiles';

    protected $primaryKey = 'jnf_id';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'jnf_id',
        'profile_name',
        'job_designation',
        'place_of_posting',
        'work_location_mode',
        'expected_hires',
        'minimum_hires',
        'tentative_joining_month',
        'required_skills',
        'job_description',
        'jd_pdf_path',
        'additional_info',
        'bond_details',
        'registration_link',
        'onboarding_details',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'tentative_joining_month' => 'date',
    ];

    public function jnf(): BelongsTo
    {
        return $this->belongsTo(Jnf::class, 'jnf_id', 'jnf_id');
    }
}
