<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('quiz_id');
            $table->integer('sort_order')->default(0);
            $table->unsignedBigInteger('unlock_after_lesson_id')->nullable();
            $table->boolean('required')->default(false);
            $table->timestamps();

            $table->unique(['course_id', 'quiz_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_quizzes');
    }
};
