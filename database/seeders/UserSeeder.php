<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'admin',
            'email' => 'admin@quiz.test',
            'password' => Hash::make('admin')
        ]);
        $admin->assignRole('admin');

        $quiz_creator = User::create([
            'name' => 'quiz creator',
            'email' => 'creator@quiz.test',
            'password' => Hash::make('creator')
        ]);
        $quiz_creator->assignRole('quiz_creator');

        $participant = User::create([
            'name' => 'participant',
            'email' => 'participant@quiz.test',
            'password' => Hash::make('participant')
        ]);
        $participant->assignRole('participant');

    }
}
