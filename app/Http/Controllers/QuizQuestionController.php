<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\QuizQuestion;
use App\Models\Quiz;
use App\Models\QuizQuestionAnswer;
use App\Models\Question;
use App\Models\Type;
use App\Models\Answer;

class QuizQuestionController extends Controller
{
    public function index(Request $request, $quizId): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $questions = QuizQuestion::with('type','category','answers')->where('quiz_id', $quizId)
            ->where(function (Builder $query) use ($search) {
                return $query->where('question', 'like', '%' . $search . '%');
            })
            ->orderBy($sort)
            ->paginate($perPage);
        $quiz = Quiz::findOrFail($quizId);
        return Inertia::render('Quiz/QuizQuestion', [
            'questions' => $questions,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort,
            'quiz' => $quiz
        ]);
    }

    public function store(Request $request, $quiz_id)
    {
        $request->validate([
            'question' => 'required',
            'score' => 'required|numeric'
        ]);
        $question = Question::with('answers')
            ->where('id', $request->question)
            ->first();
        DB::beginTransaction();
        try {
            $create = QuizQuestion::create([
                'quiz_id' => $quiz_id,
                'type_id' => $question->type_id,
                'category_id' => $question->category_id,
                'question' => $question->question,
                'created_by' => Auth::id(),
                'active' => 1
            ]);
            foreach ($question->answers as $answer) {
                $create->answers()->create([
                    'content' => $answer->content,
                    'correct' => $answer->correct,
                    'active' => '1',
                    'score' => $request->score
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();
        return response('Store Success');
    }

    public function check($id)
    {
        $quizQuestions = QuizQuestion::where('id', $id)->first();
        if ($quizQuestions->takeAnswers()->count() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function checkedData($id)
    {
        $quizQuestions = $this->check($id);
        if ($quizQuestions === true) {
            return response()->json([
                'error' => 'This question has answers and cannot be updated',
                'status' => true
            ], 422);
        } else {
            return response()->json([
                'error' => 'This question has answers and can be updated',
                'status' => false
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $error = array();
        $question = $request->question;
        if ($question['content'] == "") {
            $error['qustion.content'] = 'A Question is required';
        }
        foreach ($question['answers'] as $answer) {
            if ($answer['content'] == "") {
                $error['answer'.$answer['id']] = 'A answer is required';
            }
        }
        if (count($error)) {
            return response()->json($error, 422);
        } else {
            DB::beginTransaction();
            try {
                $quizQuestion = QuizQuestion::findOrFail($id);
                $quizQuestion->update([
                    'type_id' => $request->type,
                    'question' => $question['content'],
                    'active' => 1
                ]);
                foreach ($question['answers'] as $answer) {
                    if (isset($answer['id']) && $answer['id'] != '') {
                        // Update existing answer
                        $quizQuestion->answers()->where('id', $answer['id'])->update([
                            'content' => $answer['content'],
                            'correct' => $answer['correct'],
                            'active' => '1'
                        ]);
                    } else {
                        // Create new answer
                        $quizQuestion->answers()->create([
                            'content' => $answer['content'],
                            'correct' => $answer['correct'],
                            'active' => '1'
                        ]);
                    }
                }
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
            DB::commit();
        }
        return response('Update Success');
    }

    public function destroy($id)
    {
        $check = QuizQuestion::where('id', $id)->first();
        if ($check->takeAnswers()->count() > 0) {
            return response()->json(['error' => 'Question cannot be deleted because it has associated answers'], 422);
        }
        DB::beginTransaction();
        try {
            $quizQuestion = QuizQuestion::findOrFail($id);
            $quizQuestion->answers()->delete(); // Delete associated answers
            $quizQuestion->delete(); // Delete the question itself
            DB::commit();
            return response('Delete Success');
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete question'], 500);
        }
    }

}
