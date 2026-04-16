<?php

namespace App\Http\Controllers\Api;

use App\Models\Course;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $courses = Course::with([
                'branches' => fn ($query) => $query
                    ->where('is_active', true)
                    ->orderBy('branch_id'),
            ])
            ->where('is_active', true)
            ->where('type', 'JNF')
            ->orderByRaw("case course_code
                when 'btech' then 1
                when 'dual_degree' then 2
                when 'integrated_mtech' then 3
                when 'mtech' then 4
                when 'msc_tech' then 5
                when 'mba' then 6
                when 'msc' then 7
                else 99
            end")
            ->get();

        return response()->json(
            $courses->map(fn ($course) => [
                'course_id' => $course->course_id,
                'course_name' => $course->course_name,
                'admission_type' => $course->admission_type,
                'branches' => $course->branches
                    ->map(fn ($branch) => [
                        'branch_id' => $branch->branch_id,
                        'branch_name' => $branch->parenthesis_detail
                            ? "{$branch->branch_name} ({$branch->parenthesis_detail})"
                            : $branch->branch_name,
                        'department_name' => null,
                    ])
                    ->values(),
            ])->values()
        );
    }
}
