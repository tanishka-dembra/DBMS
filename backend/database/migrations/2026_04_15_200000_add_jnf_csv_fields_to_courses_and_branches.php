<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('type', 20)->nullable()->after('course_name');
            $table->string('admission_type', 50)->nullable()->after('duration');
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->string('parenthesis_detail', 150)->nullable()->after('branch_name');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('parenthesis_detail');
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['type', 'admission_type']);
        });
    }
};
