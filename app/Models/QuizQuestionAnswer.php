<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestionAnswer extends Model
{
    use HasFactory;

    protected $table = 'quiz_question_answers';

    protected $fillable = [
        'quiz_question_id',
        'content',
        'correct',
        'active',
        'score',
    ];

    protected $hidden = ['score'];

    public function quizQuestion()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }
}
