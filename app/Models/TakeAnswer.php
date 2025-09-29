<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TakeAnswer extends Model
{
    use HasFactory;

    protected $table = 'take_answers';

    protected $fillable = [
        'take_id',
        'quiz_question_id',
        'quiz_question_answer_id',
        'content',
        'correct',
        'score'
    ];

    public function take()
    {
        return $this->belongsTo(Take::class, 'take_id');
    }

    public function quizQuestion()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    public function quizAnswer()
    {
        return $this->belongsTo(QuizQuestionAnswer::class, 'quiz_question_answer_id');
    }
}
