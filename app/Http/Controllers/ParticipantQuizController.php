<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Quiz;
use App\Models\QuizCategory;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionAnswer;
use App\Models\Take;
use App\Models\TakeAnswer;
use Carbon\Carbon;

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
        $quiz = Quiz::has('questions')
            ->with('category', 'questions')
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

    public function resetQuiz($id)
    {
        $userId = Auth::user()->id;
        Redis::del("quiz-answers:{$userId}:{$id}", "quiz");
        Redis::del("quiz-time-taken:{$userId}:{$id}", "time_taken");
        return response()->json(['status' => 'reset']);
    }

    /**
     * evaluate quiz
     * @param Request $request
     * @param $id
     * @return Response
     *
     */
    public function evaluateQuiz(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $userId = Auth::user()->id;
            if (Redis::exists("quiz-answers:{$userId}:{$id}")) {
                // get take quiz
                $take = Take::where('quiz_id', $id)
                    ->where('user_id', $userId)
                    ->whereNull("finished_at")
                    ->first();
                // get quiz data answers
                $data = json_decode(Redis::hget("quiz-answers:{$userId}:{$id}", 'quiz'));
                $questions = collect($data->questions);
                $totalScore = 0;
                foreach ($questions as $question) {
                    $answers = collect($question->answers);
                    if (is_array($question->pick_answers)) {
                        foreach ($question->pick_answers as $pick) {
                            $answer = QuizQuestionAnswer::where('id', $pick)->first();
                            $totalScore += $answer->score ?? 0;
                            $takeAnswer = TakeAnswer::create([
                                'take_id' => $take->id,
                                'quiz_question_id' => $question->id,
                                'quiz_question_answer_id' => $answer->id,
                                'content' => $answer->content,
                                'correct' => $answer->correct,
                                'score' => $answer->score,
                            ]);
                        }
                    } else {
                        $answer = QuizQuestionAnswer::where('id', $question->pick_answers)->first();
                        if (is_null($answer)) {
                            $answer = QuizQuestionAnswer::where('content', 'like', '%' . $question->pick_answers . '%')->first();
                            $totalScore += $answer->score ?? 0;
                            if (is_null($answer)) {
                                $takeAnswer = TakeAnswer::create([
                                    'take_id' => $take->id,
                                    'quiz_question_id' => $question->id,
                                    'quiz_question_answer_id' => $answer->id ?? null,
                                    'content' => $answer->content ?? null,
                                    'correct' => 0,
                                    'score' => $answer->score ?? 0,
                                ]);
                            } else {
                                $takeAnswer = TakeAnswer::create([
                                    'take_id' => $take->id,
                                    'quiz_question_id' => $question->id,
                                    'quiz_question_answer_id' => $answer->id,
                                    'content' => $answer->content,
                                    'correct' => $answer->correct,
                                    'score' => $answer->score,
                                ]);
                            }
                        } else {
                            $totalScore += $answer->score ?? 0;
                            $takeAnswer = TakeAnswer::create([
                                'take_id' => $take->id,
                                'quiz_question_id' => $question->id,
                                'quiz_question_answer_id' => $answer->id,
                                'content' => $answer->content,
                                'correct' => $answer->correct,
                                'score' => $answer->score,
                            ]);
                        }
                    }
                }
                $take->score = $totalScore;
                $take->finished_at = Carbon::now();
                $take->save();
                DB::commit();

                $this->resetQuiz($id);
            } else {
                $take = Take::where('quiz_id', $id)
                    ->where('user_id', $userId)
                    ->whereNull("finished_at")
                    ->first();
                if (!is_null($take)) {
                    $take->score = 0;
                    $take->finished_at = Carbon::now();
                    $take->save();
                } else {
                    return response()->json([
                        'status'    => 'not_found',
                        'message'   => 'Quiz not found',
                    ]);
                }
            }
            return response()->json([
                'status'    => 'evaluated',
                'message'   => 'Quiz evaluated successfully',
                'data'      => $take
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error'     => 'Failed to evaluate quiz',
                    'message'   => $e
                ],
                500
            );
        }

        // dd($request->all());
    }

    /**
     * show score
     * @param $id
     * @return Response Inertia
     */
    public function showScore($id)
    {
        // get data take
        $take = Take::where('id', $id)
            ->first();
        // delete cache data
        $this->resetQuiz($take->quiz_id);
        // return
        if ($take->user_id == Auth::user()->id) {
            return Inertia::render('Score', compact('take'));
        } else {
            return response(404);
        }
    }

    /**
     * participant dashboard
     * @return Response Inertia
     */
    public function participantDashboard()
    {
        // get take quiz data
        $takes = Take::with('quiz')
            ->where('user_id', Auth::user()->id)
            ->where('finished_at', '!=', null)
            ->get();
        return Inertia::render('ParticipantDashboard', compact('takes'));
    }
}
