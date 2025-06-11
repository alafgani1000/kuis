<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\QuizCategory as Category;

class QuizCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $categories = Category::where(function (Builder $query) use($search) {
            return $query->where('name', 'like', '%'.$search.'%');
        })->orderBy($sort)->paginate($perPage);
        return Inertia::render('QuizCategory/QuizCategory', [
            'categories' => $categories,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort
        ]);
    }

    public function data()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);
        Category::create([
            'name' => strtolower($request->name)
        ]);
        return 'Input Success';
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ]);
        Category::where('id',$id)->update([
            'name' => strtolower($request->name)
        ]);
        return 'Update Success';
    }

    public function delete(Request $request, $id)
    {
        Category::where('id',$id)->delete();
        return 'Delete Success';
    }
}
