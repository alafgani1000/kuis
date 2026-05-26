<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('takes', function (Blueprint $table) {
            if (!Schema::hasColumn('takes', 'course_id')) {
                $table->unsignedBigInteger('course_id')->nullable()->after('quiz_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('takes', function (Blueprint $table) {
            if (Schema::hasColumn('takes', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });
    }
};
