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
        $quizes = Quiz::has('questions')
            ->with('category')
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $categories = QuizCategory::withCount('quizzes')
            ->orderBy('name')
            ->get();

        return Inertia::render('Welcome', compact('quizes', 'categories'));
    }

    public function dashboard(): Response
    {
        return Inertia::render('Dashboard');
    }

    public function newQuiz()
    {
        $quizes = Quiz::has('questions')
            ->with('category')
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->take(16)
            ->get();

        return Inertia::render('NewQuiz', compact('quizes'));
    }

    public function byCategoryQuiz()
    {
        $categories = QuizCategory::with(
            ['quizzes' => function (Builder $query) {
                $query->take(8)->withCount('questions');
            }]
        )
            ->withCount('quizzes')
            ->orderBy('name')
            ->get();

        return Inertia::render('QuizCategory', compact('categories'));
    }

    public function showCategoryQuiz($id)
    {
        $category = QuizCategory::with([
            'quizzes' => function (Builder $query) {
                $query->has('questions')
                    ->with('category')
                    ->withCount('questions')
                    ->orderBy('created_at', 'desc');
            },
        ])
            ->findOrFail($id);

        return Inertia::render('CategoryQuiz', compact('category'));
    }

    public function takeQuiz(Request $request, $id)
    {
        $userId = Auth::user()->id;
        $courseId = $request->course_id;
        $startTed = Carbon::now();
        // cek sedang ambil quiz ini atau tidak
        $cek = Redis::hget("quiz-answers:{$userId}:{$id}", "quiz");
        if ($cek != null) {
            $quiz = Quiz::with([
                'questions',
                'questions.answers:id,quiz_question_id,content,active',
                'questions.type',
                'category'
            ])
                ->where('id', $id)
                ->first();
            $take = json_decode($cek);
            return Inertia::render('Quiz', [
                'quiz' => $quiz,
                'take' => $take,
                'courseId' => $courseId,
            ]);
        } else {
            // insert new take
            $takeQuiz = new Take();
            $takeQuiz->user_id = $userId;
            $takeQuiz->quiz_id = $id;
            $takeQuiz->course_id = $courseId;
            $takeQuiz->started_at = $startTed;
            $takeQuiz->save();
            // get quiz
            $quiz = Quiz::with(
                'questions',
                'questions.answers:id,quiz_question_id,content,active',
                'questions.type',
                'category'
            )
                ->where('id', $id)
                ->first();
            // return
            return Inertia::render('Quiz', [
                'quiz' => $quiz,
                'courseId' => $courseId,
            ]);
        }
    }

    public function syncAnswers(Request $request)
    {
        // redis save quiz answer
        // Redis::hset('quiz-answers:{$userId}:{quizId}', $questionId, $quiz);
        // Redis::hgetall('quiz-answers:{$userId}:{quizId}');
        if (isset($request->quiz_end)) {
            if ($request->quiz_end == false) {
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
        } else {
            return response()->json(['status' => 'not_synced']);
        }
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
        Redis::del("quiz-answers:{$userId}:{$id}");
        Redis::del("quiz-time-taken:{$userId}:{$id}");
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
        $userId = Auth::user()->id;
        $questions = $request->quiz_data;
        $key = "quiz-answers:{$userId}:{$id}";
        Redis::hset($key, 'quiz', json_encode($questions));
        $ttl = Redis::ttl($key);
        if ($ttl === -1) {
            Redis::expire($key, 3600);
        }
        DB::beginTransaction();
        try {
            $takeQuery = Take::where('quiz_id', $id)
                ->where('user_id', $userId)
                ->whereNull('finished_at');

            if ($request->course_id) {
                $takeQuery->where('course_id', $request->course_id);
            } else {
                $takeQuery->whereNull('course_id');
            }

            $take = $takeQuery->first();

            if (!$take) {
                return response()->json([
                    'status'  => 'not_found',
                    'message' => 'Quiz not found',
                ], 404);
            }

            if (Redis::exists($key)) {
                $data = json_decode(Redis::hget($key, 'quiz'));
                $questions = collect($data->questions ?? []);
                $totalScore = 0;

                foreach ($questions as $question) {
                    if (isset($question->pick_answers)) {
                        if (is_array($question->pick_answers)) {
                            foreach ($question->pick_answers as $pick) {
                                $answer = QuizQuestionAnswer::where('id', $pick)
                                    ->where('quiz_question_id', $question->id)
                                    ->first();

                                $totalScore += $answer->score ?? 0;
                                TakeAnswer::create([
                                    'take_id' => $take->id,
                                    'quiz_question_id' => $question->id,
                                    'quiz_question_answer_id' => $answer->id ?? null,
                                    'content' => $answer->content ?? null,
                                    'correct' => $answer->correct ?? 0,
                                    'score' => $answer->score ?? 0,
                                ]);
                            }
                        } else {
                            $answer = QuizQuestionAnswer::where('id', $question->pick_answers)
                                ->where('quiz_question_id', $question->id)
                                ->first();

                            if (is_null($answer) && is_string($question->pick_answers)) {
                                $answer = QuizQuestionAnswer::where('quiz_question_id', $question->id)
                                    ->where('content', 'like', '%' . $question->pick_answers . '%')
                                    ->first();
                            }

                            $totalScore += $answer->score ?? 0;
                            TakeAnswer::create([
                                'take_id' => $take->id,
                                'quiz_question_id' => $question->id,
                                'quiz_question_answer_id' => $answer->id ?? null,
                                'content' => $answer->content ?? ($question->pick_answers ?? null),
                                'correct' => $answer->correct ?? 0,
                                'score' => $answer->score ?? 0,
                            ]);
                        }
                    } else {
                        TakeAnswer::create([
                            'take_id' => $take->id,
                            'quiz_question_id' => $question->id,
                            'quiz_question_answer_id' => null,
                            'content' => null,
                            'correct' => null,
                            'score' => 0,
                        ]);
                    }
                }

                $take->score = $totalScore;
                $take->finished_at = Carbon::now();
                $take->save();
                DB::commit();
                $this->resetQuiz($id);
            } else {
                $take->score = 0;
                $take->finished_at = Carbon::now();
                $take->save();
                DB::commit();
            }

            return response()->json([
                'status'  => 'evaluated',
                'message' => 'Quiz evaluated successfully',
                'data'    => $take,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error'   => 'Failed to evaluate quiz',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * show score
     * @param $id
     * @return Response Inertia
     */
    public function showScore($id)
    {
        $take = Take::find($id);

        if (!$take || $take->user_id !== Auth::user()->id) {
            return response(404);
        }

        $this->resetQuiz($take->quiz_id);
        return Inertia::render('Score', compact('take'));
    }

    /**
     * participant dashboard
     * @return Response Inertia
     */
    public function participantDashboard()
    {
        // get take quiz data
        $takes = Take::with(['quiz', 'course'])
            ->where('user_id', Auth::user()->id)
            ->where('finished_at', '!=', null)
            ->get();
        return Inertia::render('ParticipantDashboard', compact('takes'));
    }
}
