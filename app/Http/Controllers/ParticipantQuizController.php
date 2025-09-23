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
        // cek sedang ambil quiz ini atau tidak
        $cek = Redis::hget("quiz-answers:{$userId}:{$id}", "quiz");
        if ($cek != null) {
             $quiz = Quiz::with(
                'questions',
                'questions.answers',
                'questions.type',
                'category'
            )
                ->where('id', $id)
                ->first();
            $take = json_decode($cek);
            return Inertia::render('Quiz', compact('quiz', 'take'));
        } else {
            // insert new take
            $takeQuiz = new Take();
            $takeQuiz->user_id = $userId;
            $takeQuiz->quiz_id = $id;
            $takeQuiz->started_at = $startTed;
            $takeQuiz->save();
            // get quiz
            $quiz = Quiz::with(
                'questions',
                'questions.answers',
                'questions.type',
                'category'
            )
                ->where('id', $id)
                ->first();
            // return
            return Inertia::render('Quiz', compact('quiz'));
        }

    }

    public function syncAnswers(Request $request)
    {
        // redis save quiz answer
        // Redis::hset('quiz-answers:{$userId}:{quizId}', $questionId, $quiz);
        // Redis::hgetall('quiz-answers:{$userId}:{quizId}');
        $userId = Auth::user()->id;
        $quizId = $request->quiz_id;
        $questions = $request->quiz_data;
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

    public function getSyncAnswers($id)
    {
        $userId = Auth::user()->id;
        $data = Redis::hget("quiz-answers:{$userId}:{$id}", 'quiz');
        return json_decode($data);
    }

    public function evaluateQuiz(Request $request, $id)
    {
        dd($request->all());
    }
}
