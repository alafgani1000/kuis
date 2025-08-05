<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\QuizCategory as Category;
use Illuminate\Support\Facades\Storage;

class QuizCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $categories = Category::where(function (Builder $query) use ($search) {
            return $query->where('name', 'like', '%' . $search . '%');
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
        $image = $request->file('image');
        $path = null;
        if (!is_null($image)) {
            $file_name = $image->hashName();
            $name = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();
            $size = $image->getSize();
            $path = $image->store('quiz_categories', 'public');
        }

        Category::create([
            'name' => strtolower($request->name),
            'thumbnail' => $path
        ]);
        return 'Input Success';
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ]);
        $image = $request->file('image');
        $path = null;
        $category = Category::find($id);
        if (!is_null($image)) {
            $file_name = $image->hashName();
            $name = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();
            $size = $image->getSize();
            $path = $image->store('quiz_categories', 'public');

            if (Storage::exists('public/' . $category->thumbnail)) {
                Storage::delete('public/' . $category->thumbnail);
            }
        }
        $category->name = strtolower($request->name);
        $category->thumbnail = $path;
        $category->save();
        return 'Update Success';
    }

    public function delete(Request $request, $id)
    {
        $category = Category::find($id);
        $quiz = $category->quizzes()->first();
        if ($quiz) {
            return response()->json(['error' => 'Category cannot be deleted because it has associated quizzes'], 422);
        }
        if (!is_null($category)) {
            if (Storage::exists('public/' . $category->thumbnail)) {
                Storage::delete('public/' . $category->thumbnail);
            }
        }
        $category->delete();
        return 'Delete Success';
    }
}
