<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Quiz;
use App\Models\QuizCategory;
use App\Models\QuizQuestion;
use App\Models\Take;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ParticipantQuizController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Welcome');
    }

    public function dashboard(): Response
    {
        return Inertia::render('Dashboard');
    }

    public function newQuiz()
    {
        $quiz = Quiz::with('category', 'questions')
            ->withCount('category', 'questions')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();
        return $quiz;
    }

    public function byCategoryQuiz()
    {
        $quiz = QuizCategory::with(
            ['quizzes' => function (Builder $query) {
                $query->take(8);
            }]
        )
            ->withCount('quizzes')
            ->get();
        return $quiz;
    }

    public function takeQuiz($id)
    {
        $userId = Auth::user()->id;
        $startTed = Carbon::now();

        $takeQuiz = new Take();
        $takeQuiz->user_id = $userId;
        $takeQuiz->quiz_id = $id;
        $takeQuiz->started_at = $startTed;
        $takeQuiz->save();

        $quiz = Quiz::with(
            'questions',
            'questions.answers',
            'questions.type',
            'category'
        )
            ->where('id', $id)
            ->first();
        return Inertia::render('Quiz', compact('quiz'));
    }
}
