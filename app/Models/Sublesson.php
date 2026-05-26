<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sublesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'content',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }
}
