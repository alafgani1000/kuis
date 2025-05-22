<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Answer;
use App\Models\Type;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['type_id', 'question', 'active', 'created_by'];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }
}
