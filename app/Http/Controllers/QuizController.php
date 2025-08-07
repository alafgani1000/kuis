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
use App\Models\Quiz;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class QuizController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $user = Auth::user();
        if ($user->hasRole('admin')) {
            $quizzes = Quiz::with('category')->withCount('questions')->where(function (Builder $query) use ($search) {
                return $query->where('title', 'like', '%' . $search . '%');
            })->orderBy($sort)->paginate($perPage);
        } else {
            $quizzes = Quiz::with('category')->withCount('questions')->where('host_id', Auth::id())
                ->where(function (Builder $query) use ($search) {
                    return $query->where('title', 'like', '%' . $search . '%');
                })->orderBy($sort)->paginate($perPage);
        }
        Cache::put('user_quiz', 'Agan', 120);
        $value = Cache::get('user_quiz');

        return Inertia::render('Quiz/Quiz', [
            'quizzes' => $quizzes,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort,
            'value' => $value
        ]);
    }

    public function store(Request $request)
    {
        $error = array();
        if ($request->title == "") {
            $error['title'] = 'A Quiz title is required';
        }
        $image = $request->file('image');
        $file_name = $image->hashName();
        $name = $image->getClientOriginalName();
        $extension = $image->getClientOriginalExtension();
        $size = $image->getSize();
        $path = $image->store('quiz_images', 'public');
        if (count($error)) {
            return response()->json($error, 422);
        } else {
            DB::beginTransaction();
            try {
                $create = Quiz::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'quiz_category_id' => $request->category,
                    'host_id' => Auth::id(),
                    'time_limit' => $request->time_limit,
                    'thumbnail' => $path,
                ]);
                DB::commit();
                return response('Quiz created successfully');
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Failed to create quiz'], 500);
            }
        }
    }

    public function update(Request $request, $id)
    {
        $error = array();
        if ($request->title == "") {
            $error['title'] = 'A Quiz title is required';
        }
        $image = $request->file('image');
        $path = null;
        if (count($error)) {
            return response()->json($error, 422);
        } else {
            DB::beginTransaction();
            try {
                $quiz = Quiz::findOrFail($id);
                // delete thumbnail
                if (!is_null($image)) {
                    if (!is_null($quiz)) {
                        if (Storage::exists('public/' . $quiz->thumbnail)) {
                            Storage::delete('public/' . $quiz->thumbnail);
                        }
                    }

                    $file_name = $image->hashName();
                    $name = $image->getClientOriginalName();
                    $extension = $image->getClientOriginalExtension();
                    $size = $image->getSize();
                    $path = $image->store('quiz_images', 'public');
                    $quiz->thumbnail = $path;
                }
                $quiz->title = $request->title;
                $quiz->description = $request->description;
                $quiz->quiz_category_id = $request->category;
                $quiz->time_limit = $request->time_limit;
                $quiz->save();
                DB::commit();
                return response('Quiz updated successfully', 200);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Failed to update quiz'], 500);
            }
        }
    }

    public function destroy($id)
    {
        $check = Quiz::where('id', $id)->first();
        if ($check->questions()->count() > 0) {
            return response()->json(['error' => 'Quiz cannot be deleted because it has associated questions'], 422);
        }
        DB::beginTransaction();
        try {
            $quiz = Quiz::findOrFail($id);
            if (!is_null($quiz)) {
                if (Storage::exists('public/' . $quiz->thumbnail)) {
                    Storage::delete('public/' . $quiz->thumbnail);
                }
            }
            $quiz->delete();
            DB::commit();
            return response('Quiz deleted successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete quiz'], 500);
        }
    }

    public function publish($id)
    {
        $quiz = Quiz::findOrFail($id);
        if ($quiz->published) {
            return response()->json(['error' => 'Quiz is already published'], 422);
        }
        $quiz->published = true;
        $quiz->published_at = Carbon::now();
        $quiz->save();
        return response('Quiz published successfully');
    }

    public function unpublish($id)
    {
        $quiz = Quiz::findOrFail($id);
        $quiz->published = false;
        $quiz->published_at = null;
        $quiz->save();
        return response('Quiz unpublished successfully');
    }
}
