<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'quiz_category_id',
        'published',
        'published_at',
        'thumbnail',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function category()
    {
        return $this->belongsTo(QuizCategory::class, 'quiz_category_id');
    }
}
