<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Branch extends Model
{
    protected $table = 'branches';

    protected $primaryKey = 'branch_id';

    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'department_id',
        'branch_code',
        'branch_name',
        'parenthesis_detail',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }
}
