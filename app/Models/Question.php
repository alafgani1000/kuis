<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Answer;
use App\Models\Type;
use App\Models\Category;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'type_id', 'question', 'active', 'created_by'];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
