<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id');
            $table->string('name', 100)->nullable();
            $table->string('email', 100)->unique();
            $table->string('password', 255);
            $table->enum('role', ['admin', 'company']);
            $table->string('api_token', 64)->nullable()->unique();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('companies', function (Blueprint $table) {
            $table->increments('company_id');
            $table->unsignedInteger('user_id')->unique();
            $table->string('company_name', 150);
            $table->string('website', 255)->nullable();
            $table->text('postal_address')->nullable();
            $table->integer('no_of_employees')->nullable();
            $table->string('sector', 100)->nullable();
            $table->string('company_logo', 255)->nullable();
            $table->enum('category', ['startup', 'mnc', 'psu', 'private', 'other'])->nullable();
            $table->date('date_of_establishment')->nullable();
            $table->decimal('annual_turnover', 15, 2)->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->json('industry_tags')->nullable();
            $table->boolean('is_mnc')->default(false);
            $table->string('hq_country', 100)->nullable();
            $table->string('hq_city', 100)->nullable();
            $table->string('nature_of_business', 255)->nullable();
            $table->text('company_description')->nullable();
            $table->string('pdf_path', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('user_id')->on('users');
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->increments('department_id');
            $table->string('department_code', 50)->unique();
            $table->string('department_name', 150);
            $table->string('type', 50)->nullable();
            $table->boolean('is_active')->default(true);
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->increments('course_id');
            $table->string('course_code', 50)->unique()->nullable();
            $table->string('course_name', 100);
            $table->unsignedTinyInteger('duration')->nullable();
            $table->boolean('is_active')->default(true);
        });

        Schema::create('branches', function (Blueprint $table) {
            $table->increments('branch_id');
            $table->unsignedInteger('course_id');
            $table->unsignedInteger('department_id')->nullable();
            $table->string('branch_code', 50)->nullable();
            $table->string('branch_name', 150);
            $table->boolean('is_active')->default(true);

            $table->foreign('course_id')->references('course_id')->on('courses');
            $table->foreign('department_id')->references('department_id')->on('departments');
        });

        Schema::create('jnfs', function (Blueprint $table) {
            $table->increments('jnf_id');
            $table->unsignedInteger('company_id');
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'open_edit'])->default('draft');
            $table->text('edit_request_notes')->nullable();
            $table->unsignedTinyInteger('edit_request_count')->default(0);
            $table->timestamp('edit_requested_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('company_id')->references('company_id')->on('companies');
        });

        Schema::create('job_profiles', function (Blueprint $table) {
            $table->unsignedInteger('jnf_id')->primary();
            $table->string('profile_name', 255)->nullable();
            $table->string('job_designation', 255)->nullable();
            $table->string('place_of_posting', 255)->nullable();
            $table->enum('work_location_mode', ['onsite', 'remote', 'hybrid'])->nullable();
            $table->integer('expected_hires')->nullable();
            $table->integer('minimum_hires')->nullable();
            $table->date('tentative_joining_month')->nullable();
            $table->json('required_skills')->nullable();
            $table->text('job_description')->nullable();
            $table->string('jd_pdf_path', 255)->nullable();
            $table->string('additional_info', 1000)->nullable();
            $table->text('bond_details')->nullable();
            $table->string('registration_link', 255)->nullable();
            $table->text('onboarding_details')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('jnf_id')->references('jnf_id')->on('jnfs')->cascadeOnDelete();
        });

        Schema::create('infs', function (Blueprint $table) {
            $table->increments('inf_id');
            $table->unsignedInteger('company_id');
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'open_edit'])->default('draft');
            $table->text('edit_request_notes')->nullable();
            $table->unsignedTinyInteger('edit_request_count')->default(0);
            $table->timestamp('edit_requested_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('company_id')->references('company_id')->on('companies');
        });

        Schema::create('internship_profiles', function (Blueprint $table) {
            $table->unsignedInteger('inf_id')->primary();
            $table->string('profile_name', 255)->nullable();
            $table->string('internship_role', 255)->nullable();
            $table->string('place_of_posting', 255)->nullable();
            $table->enum('work_location_mode', ['onsite', 'remote', 'hybrid'])->nullable();
            $table->integer('expected_hires')->nullable();
            $table->integer('minimum_hires')->nullable();
            $table->integer('duration_months')->nullable();
            $table->date('internship_start_month')->nullable();
            $table->json('required_skills')->nullable();
            $table->text('job_description')->nullable();
            $table->string('jd_pdf_path', 255)->nullable();
            $table->string('additional_info', 1000)->nullable();
            $table->boolean('ppo_available')->default(false);
            $table->string('registration_link', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('inf_id')->references('inf_id')->on('infs')->cascadeOnDelete();
        });

        Schema::create('salaries', function (Blueprint $table) {
            $table->increments('salary_id');
            $table->unsignedInteger('jnf_id')->nullable();
            $table->unsignedInteger('inf_id')->nullable();
            $table->unsignedInteger('course_id')->nullable();
            $table->enum('currency', ['INR', 'USD', 'EUR'])->default('INR');
            $table->decimal('ctc', 12, 2)->nullable();
            $table->decimal('base_salary', 12, 2)->nullable();
            $table->decimal('in_hand', 12, 2)->nullable();
            $table->decimal('stipend', 10, 2)->nullable();

            $table->foreign('jnf_id')->references('jnf_id')->on('job_profiles');
            $table->foreign('inf_id')->references('inf_id')->on('internship_profiles');
            $table->foreign('course_id')->references('course_id')->on('courses');
        });

        Schema::create('salary_components', function (Blueprint $table) {
            $table->increments('component_id');
            $table->unsignedInteger('salary_id');
            $table->string('component_name', 100)->nullable();
            $table->decimal('amount', 12, 2)->nullable();
            $table->text('description')->nullable();

            $table->foreign('salary_id')->references('salary_id')->on('salaries');
        });

        Schema::create('global_criteria', function (Blueprint $table) {
            $table->increments('global_id');
            $table->unsignedInteger('jnf_id')->nullable();
            $table->unsignedInteger('inf_id')->nullable();
            $table->decimal('min_cgpa', 3, 2)->nullable();
            $table->boolean('backlog_allowed')->nullable();
            $table->boolean('apply_to_all')->nullable();

            $table->foreign('jnf_id')->references('jnf_id')->on('job_profiles');
            $table->foreign('inf_id')->references('inf_id')->on('internship_profiles');
        });

        Schema::create('eligibility', function (Blueprint $table) {
            $table->increments('eligibility_id');
            $table->unsignedInteger('jnf_id')->nullable();
            $table->unsignedInteger('inf_id')->nullable();
            $table->unsignedInteger('branch_id');
            $table->decimal('min_cgpa', 3, 2)->nullable();
            $table->boolean('backlog_allowed')->nullable();

            $table->foreign('jnf_id')->references('jnf_id')->on('job_profiles');
            $table->foreign('inf_id')->references('inf_id')->on('internship_profiles');
            $table->foreign('branch_id')->references('branch_id')->on('branches');
        });

        Schema::create('special_criteria', function (Blueprint $table) {
            $table->increments('criteria_id');
            $table->unsignedInteger('jnf_id')->nullable();
            $table->unsignedInteger('inf_id')->nullable();
            $table->boolean('phd_allowed')->nullable();
            $table->boolean('ma_digital_humanities')->nullable();
            $table->decimal('high_school_percentage', 5, 2)->nullable();
            $table->enum('gender_filter', ['all', 'male', 'female', 'others'])->nullable();

            $table->foreign('jnf_id')->references('jnf_id')->on('job_profiles');
            $table->foreign('inf_id')->references('inf_id')->on('internship_profiles');
        });

        Schema::create('selection_process', function (Blueprint $table) {
            $table->increments('selection_id');
            $table->unsignedInteger('jnf_id')->nullable();
            $table->unsignedInteger('inf_id')->nullable();
            $table->boolean('pre_placement_talk')->default(false);
            $table->boolean('resume_shortlisting')->default(false);
            $table->boolean('written_test')->default(false);
            $table->boolean('group_discussion')->default(false);
            $table->boolean('interview')->default(false);
            $table->enum('selection_mode', ['online', 'offline', 'hybrid'])->nullable();
            $table->boolean('psychometric_test')->default(false);
            $table->boolean('medical_test')->default(false);
            $table->text('other_screening')->nullable();
            $table->text('infrastructure_details')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('jnf_id')->references('jnf_id')->on('job_profiles');
            $table->foreign('inf_id')->references('inf_id')->on('internship_profiles');
        });

        Schema::create('selection_rounds', function (Blueprint $table) {
            $table->increments('round_id');
            $table->unsignedInteger('selection_id');
            $table->enum('round_type', ['aptitude', 'technical', 'hr', 'gd', 'other'])->nullable();
            $table->enum('mode', ['online', 'offline', 'hybrid'])->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->enum('interview_mode', ['on-campus', 'telephonic', 'video'])->nullable();
            $table->integer('round_order')->nullable();

            $table->foreign('selection_id')->references('selection_id')->on('selection_process');
        });

        Schema::create('approvals', function (Blueprint $table) {
            $table->increments('approval_id');
            $table->unsignedInteger('jnf_id');
            $table->unsignedInteger('admin_id');
            $table->enum('status', ['pending', 'approved', 'rejected']);
            $table->text('remarks')->nullable();
            $table->timestamp('approved_at')->nullable();

            $table->foreign('jnf_id')->references('jnf_id')->on('jnfs');
            $table->foreign('admin_id')->references('user_id')->on('users');
        });

        Schema::create('email_logs', function (Blueprint $table) {
            $table->increments('email_id');
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('company_id')->nullable();
            $table->enum('email_type', ['otp', 'verification', 'submission', 'approval', 'rejection', 'notification']);
            $table->string('recipient_email', 255);
            $table->string('subject', 255);
            $table->text('body')->nullable();
            $table->enum('status', ['sent', 'failed', 'pending']);
            $table->timestamp('sent_at')->useCurrent();

            $table->foreign('user_id')->references('user_id')->on('users');
            $table->foreign('company_id')->references('company_id')->on('companies');
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('notification_id');
            $table->unsignedInteger('user_id');
            $table->string('title', 255);
            $table->text('message')->nullable();
            $table->enum('type', ['info', 'success', 'warning', 'error'])->default('info');
            $table->enum('related_entity', ['company', 'jnf', 'inf', 'approval', 'email'])->nullable();
            $table->unsignedInteger('related_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('user_id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('email_logs');
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('selection_rounds');
        Schema::dropIfExists('selection_process');
        Schema::dropIfExists('special_criteria');
        Schema::dropIfExists('eligibility');
        Schema::dropIfExists('global_criteria');
        Schema::dropIfExists('salary_components');
        Schema::dropIfExists('salaries');
        Schema::dropIfExists('internship_profiles');
        Schema::dropIfExists('infs');
        Schema::dropIfExists('job_profiles');
        Schema::dropIfExists('jnfs');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('users');
    }
};
