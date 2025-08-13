<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('take_answers', function (Blueprint $table) {
            $table->id();
            $table->integer('take_id');
            $table->integer('quiz_question_id');
            $table->integer('quiz_question_answer_id');
            $table->string('content');
            $table->integer('correct');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('take_answers');
    }
};
