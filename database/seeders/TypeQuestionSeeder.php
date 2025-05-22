<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Type;

class TypeQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $multiChoice = Type::create([
            'code' => 'multiple_choice',
            'name' => 'Multiple Choice'
        ]);

        $multiResponse = Type::create([
            'code' => 'multiple_response',
            'name' => 'Multiple Response'
        ]);

        $shortAnswer = Type::create([
            'code' => 'short_answer',
            'name' => 'Short Answer'
        ]);
    }
}
