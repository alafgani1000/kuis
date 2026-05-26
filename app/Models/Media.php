<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'sublesson_id',
        'media_type',
        'media_url',
        'uploaded_at',
    ];

    public function sublesson()
    {
        return $this->belongsTo(Sublesson::class);
    }
}
