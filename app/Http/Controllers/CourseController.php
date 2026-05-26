<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Sublesson;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = $request->perPage ?? 10;
        $sort = $request->sort ?? 'id';

        $courses = Course::with('teacher')
            ->withCount(['lessons', 'quizzes', 'enrollments'])
            ->where(function (Builder $query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->orderBy($sort)
            ->paginate($perPage);

        return Inertia::render('Course/Course', [
            'courses' => $courses,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'teacher_id' => Auth::id(),
        ]);

        return response('Course created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course = Course::findOrFail($id);
        $course->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response('Course updated successfully');
    }

    public function destroy($id)
    {
        $course = Course::withCount(['enrollments'])->findOrFail($id);

        if ($course->enrollments_count > 0) {
            return response()->json([
                'error' => 'Course cannot be deleted because it has enrollments.',
            ], 422);
        }

        $course->quizzes()->detach();
        $course->lessons()->each(function ($lesson) {
            $lesson->sublessons()->delete();
            $lesson->delete();
        });
        $course->delete();

        return response('Course deleted successfully');
    }

    public function builder($id): Response
    {
        $course = Course::with([
            'teacher',
            'lessons.sublessons',
            'quizzes' => function ($query) {
                $query->with('category')->withCount('questions');
            },
        ])->findOrFail($id);

        $availableQuizzes = Quiz::has('questions')
            ->with('category')
            ->withCount('questions')
            ->orderBy('title')
            ->get();

        return Inertia::render('Course/CourseBuilder', compact('course', 'availableQuizzes'));
    }

    public function storeLesson(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Course::findOrFail($courseId)->lessons()->create([
            'title' => $request->title,
            'description' => $request->description ?? '',
        ]);

        return response('Lesson created successfully');
    }

    public function deleteLesson($courseId, $lessonId)
    {
        $lesson = Lesson::where('course_id', $courseId)->findOrFail($lessonId);
        $lesson->sublessons()->delete();
        $lesson->delete();

        return response('Lesson deleted successfully');
    }

    public function storeSublesson(Request $request, $courseId, $lessonId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        Lesson::where('course_id', $courseId)->findOrFail($lessonId)
            ->sublessons()
            ->create([
                'title' => $request->title,
                'content' => $this->cleanCourseContent($request->content),
            ]);

        return response('Sublesson created successfully');
    }

    public function updateSublesson(Request $request, $courseId, $lessonId, $sublessonId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $sublesson = Sublesson::where('lesson_id', $lessonId)->findOrFail($sublessonId);
        $sublesson->update([
            'title' => $request->title,
            'content' => $this->cleanCourseContent($request->content),
        ]);

        return response('Sublesson updated successfully');
    }

    public function deleteSublesson($courseId, $lessonId, $sublessonId)
    {
        Sublesson::where('lesson_id', $lessonId)->findOrFail($sublessonId)->delete();

        return response('Sublesson deleted successfully');
    }

    public function attachQuiz(Request $request, $courseId)
    {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'required' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $course = Course::findOrFail($courseId);
        $course->quizzes()->syncWithoutDetaching([
            $request->quiz_id => [
                'required' => $request->boolean('required'),
                'sort_order' => $request->sort_order ?? 0,
                'unlock_after_lesson_id' => $request->unlock_after_lesson_id,
            ],
        ]);

        return response('Quiz attached successfully');
    }

    public function detachQuiz($courseId, $quizId)
    {
        Course::findOrFail($courseId)->quizzes()->detach($quizId);

        return response('Quiz detached successfully');
    }

    private function cleanCourseContent(string $content): string
    {
        $allowedTags = '<p><br><strong><b><em><i><u><h2><h3><ul><ol><li><blockquote><a><img><div><span>';
        $content = strip_tags($content, $allowedTags);
        $content = preg_replace('/\son\w+="[^"]*"/i', '', $content);
        $content = preg_replace("/\son\w+='[^']*'/i", '', $content);
        $content = preg_replace('/javascript:/i', '', $content);

        return $content;
    }
}
