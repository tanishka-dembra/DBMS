<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_status_histories', function (Blueprint $table) {
            $table->increments('history_id');
            $table->enum('submission_type', ['jnf', 'inf']);
            $table->unsignedInteger('submission_id');
            $table->unsignedInteger('actor_id')->nullable();
            $table->string('from_status', 50)->nullable();
            $table->string('to_status', 50);
            $table->text('remarks')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('actor_id')->references('user_id')->on('users');
            $table->index(['submission_type', 'submission_id']);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 100)->primary();
            $table->string('token', 64);
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('form_status_histories');
    }
};
