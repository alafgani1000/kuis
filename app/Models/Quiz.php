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
        'published',
        'published_at',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
}
