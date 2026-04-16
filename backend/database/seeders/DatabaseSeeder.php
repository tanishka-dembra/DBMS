<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Inf;
use App\Models\InternshipProfile;
use App\Models\Jnf;
use App\Models\JobProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedCoursesAndBranches();

        $admin = User::query()->updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Portal Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $companyUser = User::query()->updateOrCreate([
            'email' => 'recruiter@example.com',
        ], [
            'name' => 'Sample Recruiter',
            'password' => Hash::make('password'),
            'role' => 'company',
        ]);

        $company = Company::query()->updateOrCreate([
            'user_id' => $companyUser->user_id,
        ], [
            'company_name' => 'Atlas Mining Analytics',
            'website' => 'https://example.com',
            'sector' => 'Analytics',
            'category' => 'private',
            'company_description' => 'Sample recruiter profile for local admin review.',
        ]);

        $jnf = Jnf::query()->updateOrCreate([
            'company_id' => $company->company_id,
            'title' => 'Data Science Analyst',
        ], [
            'description' => 'Submitted sample JNF for admin review.',
            'status' => 'submitted',
        ]);

        JobProfile::query()->updateOrCreate([
            'jnf_id' => $jnf->jnf_id,
        ], [
            'profile_name' => 'Campus Hiring 2026',
            'job_designation' => 'Data Science Analyst',
            'place_of_posting' => 'Bengaluru',
            'work_location_mode' => 'hybrid',
            'expected_hires' => 12,
            'minimum_hires' => 4,
            'required_skills' => ['Python', 'SQL', 'Machine Learning'],
            'job_description' => 'Analyze mining and industrial datasets, build dashboards, and ship predictive models.',
        ]);

        $inf = Inf::query()->updateOrCreate([
            'company_id' => $company->company_id,
            'title' => 'Summer Analytics Intern',
        ], [
            'description' => 'Submitted sample INF for admin review.',
            'status' => 'submitted',
        ]);

        InternshipProfile::query()->updateOrCreate([
            'inf_id' => $inf->inf_id,
        ], [
            'profile_name' => 'Summer Internship 2026',
            'internship_role' => 'Analytics Intern',
            'place_of_posting' => 'Remote',
            'work_location_mode' => 'remote',
            'expected_hires' => 8,
            'minimum_hires' => 2,
            'duration_months' => 2,
            'required_skills' => ['Excel', 'SQL', 'Python'],
            'job_description' => 'Work with the analytics team on dashboards, data cleaning, and exploratory analysis.',
            'ppo_available' => true,
        ]);
    }

    private function seedCoursesAndBranches(): void
    {
        $dataPath = database_path('seeders/data');
        $courses = $this->readCsv($dataPath.'/courses.csv');
        $branches = $this->readCsv($dataPath.'/branches.csv');

        $activeCourseIds = [];
        foreach ($courses as $course) {
            DB::table('courses')->updateOrInsert([
                'course_code' => $course['id'],
            ], [
                'course_name' => $course['name'],
                'type' => $course['type'],
                'duration' => is_numeric($course['duration'] ?? null) ? (int) $course['duration'] : null,
                'admission_type' => $course['admission_type'] ?: null,
                'is_active' => true,
            ]);

            $activeCourseIds[$course['id']] = DB::table('courses')->where('course_code', $course['id'])->value('course_id');
        }

        $this->validateJnfCsvData($courses, $branches);

        DB::table('branches')->delete();

        foreach ($branches as $branch) {
            $courseId = $activeCourseIds[$branch['course_id']] ?? null;
            if ($courseId === null) {
                throw new RuntimeException("Unknown course_id [{$branch['course_id']}] for branch [{$branch['id']}]");
            }

            DB::table('branches')->insert([
                'course_id' => $courseId,
                'branch_code' => $branch['id'],
                'department_id' => null,
                'branch_name' => $branch['name'],
                'parenthesis_detail' => $branch['parenthesis_detail'] ?: null,
                'is_active' => true,
            ]);
        }
    }

    /**
     * @return list<array<string, string>>
     */
    private function readCsv(string $path): array
    {
        if (! file_exists($path)) {
            return [];
        }

        $handle = fopen($path, 'r');
        if ($handle === false) {
            return [];
        }

        $headers = fgetcsv($handle);
        if ($headers === false) {
            fclose($handle);
            return [];
        }

        $rows = [];
        while (($row = fgetcsv($handle)) !== false) {
            $rows[] = array_combine($headers, $row);
        }

        fclose($handle);

        return $rows;
    }

    /**
     * @param  list<array<string, string>>  $courses
     * @param  list<array<string, string>>  $branches
     */
    private function validateJnfCsvData(array $courses, array $branches): void
    {
        $courseIds = array_map(fn (array $course) => $course['id'], $courses);
        $branchIds = [];
        $branchCountsByCourse = array_fill_keys($courseIds, 0);

        foreach ($courses as $course) {
            if (($course['type'] ?? '') !== 'JNF') {
                throw new RuntimeException("Course [{$course['id']}] must have type JNF");
            }
        }

        foreach ($branches as $branch) {
            if (isset($branchIds[$branch['id']])) {
                throw new RuntimeException("Duplicate branch id [{$branch['id']}] in branches.csv");
            }

            if (! in_array($branch['course_id'], $courseIds, true)) {
                throw new RuntimeException("Unknown course_id [{$branch['course_id']}] in branches.csv");
            }

            $branchIds[$branch['id']] = true;
            $branchCountsByCourse[$branch['course_id']]++;
        }

        foreach ($branchCountsByCourse as $courseId => $count) {
            if ($count === 0) {
                throw new RuntimeException("Course [{$courseId}] has no branches in branches.csv");
            }
        }
    }
}
