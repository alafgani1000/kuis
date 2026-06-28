<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_courses' => Course::count(),
            'total_quizzes' => Quiz::count(),
            'total_users' => User::count(),
            'total_participants' => User::role('participant')->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}
