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
use Illuminate\Support\Facades\Redis;

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

    public function syncAnswers(Request $request)
    {
        // redis save quiz answer
        // Redis::hset('quiz-answers:{$userId}:{quizId}', $questionId, $quiz);
        // Redis::hgetall('quiz-answers:{$userId}:{quizId}');
        $userId = Auth::user()->id;
        $quizId = $request->quiz_id;
        $questions = $request->questions;
        $key = "quiz-answers:{$userId}:{$quizId}";
        Redis::hset($key, 'quiz', json_encode($questions));
        $ttl = Redis::ttl($key);
        if ($ttl === -1) {
            Redis::expire($key, 3600);
        }
        return response()->json(['status' => 'synced']);
    }

    public function syncTimeTaken(Request $request)
    {
        $userId = Auth::user()->id;
        $quizId = $request->quiz_id;
        $timeTaken = $request->time_taken;
        // get data from redis
        $key = "quiz-time-taken:{$userId}:{$quizId}";
        Redis::hset($key, 'time_taken', $timeTaken);
        if (Redis::ttl($key) === -1) {
            Redis::expire($key, $request->time);
        }
        return response()->json(['status' => 'time taken synced']);
    }

    public function getSyncTimeTaken($id)
    {
        $userId = Auth::user()->id;
        $timeTaken = Redis::hget("quiz-time-taken:{$userId}:{$id}", 'time_taken');
        return response()->json(['time_taken' => $timeTaken]);
    }

    public function getSyncAnswers(Request $request)
    {
        $userId = Auth::user()->id;
        
    }

    public function evaluateQuiz(Request $request)
    {

    }
}
