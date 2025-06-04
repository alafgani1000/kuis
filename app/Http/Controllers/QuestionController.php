<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Question;
use App\Models\QuizQuestion;
use App\Models\Type;
use App\Models\Answer;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $questions = Question::with('answers','type','category')->with('type')->where(function (Builder $query) use($search) {
            return $query->where('question', 'like', '%'.$search.'%');
        })->orderBy($sort)->paginate($perPage);
        $types = Type::all();
        return Inertia::render('Question/Question', [
            'questions' => $questions,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort,
            'types' => $types
        ]);
    }

    public function store(Request $request)
    {
        $error = array();
        $question = $request->question;
        if ($question['content'] == "") {
            $error['question.content'] = 'A Question is required';
        }
        if ($question['category'] == "") {
            $error['question.category'] == 'A category is required';
        }
        $type = Type::find($request->type);
        if (!$type) {
            return response()->json(['message' => 'Type not found'], 404);
        }
        if ($type->code != 'short_answer') {
            foreach ($question['answers'] as $answer) {
                if ($answer['content'] == "") {
                    $error['answer'.$answer['id']] = 'A answer is required';
                }
            }
        } else {
            if ($question['answer'] == "") {
                $error['answer'] = 'A answer is required';
            }
        }
        if (count($error)) {
            return response()->json($error, 422);
        } else {
            if ($type->code == 'short_answer') {
                DB::beginTransaction();
                try {
                    $create = Question::create([
                        'type_id' => $request->type,
                        'category_id' => $question['category'],
                        'question' => $question['content'],
                        'created_by' => Auth::id(),
                        'active' => 1
                    ]);
                    $create->answers()->create([
                        'content' => strtolower($question['answer']),
                        'correct' => 1,
                        'active' => 1
                    ]);

                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
                DB::commit();
            } else {
                DB::beginTransaction();
                try {
                    $create = Question::create([
                        'type_id' => $request->type,
                        'category_id' => $question['category'],
                        'question' => $question['content'],
                        'created_by' => Auth::id(),
                        'active' => 1
                    ]);
                    foreach ($question['answers'] as $answer) {
                        $create->answers()->create([
                            'content' => $answer['content'],
                            'correct' => $answer['correct'],
                            'active' => '1'
                        ]);
                    }

                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
                DB::commit();
            }
        }
        return 'Store Success';
    }

    public function update(Request $request, $id)
    {
       $error = array();
        $question = $request->question;
        if ($question['content'] == "") {
            $error['question.content'] = 'A Question is required';
        }
        if ($question['category'] == "") {
            $error['question.category'] = 'A Question Category is required';
        }
        $type = Type::find($request->type);
        if (!$type) {
            return response()->json(['message' => 'Type not found'], 404);
        }
        if ($type->code != 'short_answer') {
            foreach ($question['answers'] as $answer) {
                if ($answer['content'] == "") {
                    $error['answer'.$answer['id']] = 'A answer is required';
                }
            }
        } else {
            if ($question['answer'] == "") {
                $error['answer'] = 'A answer is required';
            }
        }

        if (count($error)) {
            return response()->json($error, 422);
        } else {
            if ($type->code == 'short_answer') {
                $update = Question::where('id', $id)->update([
                    'type_id' => $request->type,
                    'category_id' => $question['category'],
                    'question' => $question['content'],
                    'created_by' => Auth::id(),
                    'active' => 1
                ]);
                $updateAnswer = Answer::where('id', $question['answer_id'])->update([
                    'content' => strtolower($question['answer']),
                    'correct' => 1,
                    'active' => 1
                ]);
            } else {
                DB::beginTransaction();
                try {
                    $update = Question::where('id', $id)->update([
                        'type_id' => $request->type,
                        'category_id' => $question['category'],
                        'question' => $question['content'],
                        'created_by' => Auth::id(),
                        'active' => 1
                    ]);
                    $delete = Answer::where('question_id', $id)->delete();
                    foreach ($question['answers'] as $answer) {
                        Answer::create([
                            'question_id' => $id,
                            'content' => $answer['content'],
                            'correct' => $answer['correct'],
                            'active' => '1'
                        ]);
                    }

                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
                DB::commit();
            }
        }
        return 'Update Success';
    }

    public function delete(Request $request, $id)
    {
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        DB::beginTransaction();
        try {
            $question->answers()->delete();
            $question->delete();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();
        return 'Delete Success';
    }

    public function data($id)
    {
        $question = Question::with('answers')->find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        return response()->json($question);
    }

    public function datas(Request $request)
    {
        $quizQuestions = QuizQuestion::where('quiz_id', $request->quiz)->get();
        if (isset($quizQuestions)) {
            $questions = Question::with('answers','type','category')
                ->whereNotIn('id', $quizQuestions->pluck('question_id'))
                ->get();
        } else {

            $questions = Question::with('answers','type','category')
                ->get();
        }
        return response()->json($questions);
    }
}
