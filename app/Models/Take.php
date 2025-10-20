<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Take extends Model
{
    use HasFactory;

    protected $table = 'takes';

    protected $fillable = ['user_id', 'quiz_id', 'score', 'started_at', 'finished_at', 'log_description'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }
}
