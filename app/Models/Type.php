<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;

class Type extends Model
{
    use HasFactory;

    protected $table = 'types';

    protected $fillable = ['code', 'name'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
