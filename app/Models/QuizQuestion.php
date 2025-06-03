<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $table = 'quiz_questions';

    protected $fillable = [
        'quiz_id',
        'question_id',
        'type_id',
        'category_id',
        'question',
        'active',
        'created_by',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function answers()
    {
        return $this->hasMany(QuizQuestionAnswer::class);
    }

    public function takeAnswers()
    {
        return $this->hasMany(QuizQuestionAnswer::class, 'quiz_question_id');
    }

}
