<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('id');
    }

    public function quizzes()
    {
        return $this->belongsToMany(Quiz::class, 'course_quizzes')
            ->withPivot(['sort_order', 'unlock_after_lesson_id', 'required'])
            ->withTimestamps()
            ->orderBy('course_quizzes.sort_order');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
