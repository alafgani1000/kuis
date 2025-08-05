<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizCategory extends Model
{
    use HasFactory;

    protected $table = 'quiz_categories';

    protected $fillable = ['name', 'thumbnail'];

    public function quizzes()
    {
        return  $this->hasMany(Quiz::class, 'quiz_category_id');
    }
}
