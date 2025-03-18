<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Question;
use App\Models\Type;
use App\Models\Answer;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $questions = Question::where(function (Builder $query) use($search) {
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
        $request->validate([
            'name' => 'required'
        ]);
        Question::create([
            'name' => $request->name
        ]);
        return 'Store Success';
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ]);
        Role::where('id',$id)->update([
            'name' => $request->name
        ]);
        return 'Update Success';
    }

    public function delete(Request $request, $id)
    {
        Role::where('id',$id)->delete();
        return 'Delete Success';
    }
}
