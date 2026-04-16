<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $table = 'companies';

    protected $primaryKey = 'company_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'company_name',
        'website',
        'postal_address',
        'no_of_employees',
        'sector',
        'company_logo',
        'category',
        'date_of_establishment',
        'annual_turnover',
        'linkedin_url',
        'industry_tags',
        'is_mnc',
        'hq_country',
        'hq_city',
        'nature_of_business',
        'company_description',
        'pdf_path',
    ];

    protected $casts = [
        'industry_tags' => 'array',
        'is_mnc' => 'boolean',
        'date_of_establishment' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function jnfs(): HasMany
    {
        return $this->hasMany(Jnf::class, 'company_id', 'company_id');
    }

    public function infs(): HasMany
    {
        return $this->hasMany(Inf::class, 'company_id', 'company_id');
    }
}
