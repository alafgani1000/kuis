<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantCourseController extends Controller
{
    public function index(\Illuminate\Http\Request $request): Response
    {
        $search = $request->search ?? '';
        $categoryId = $request->category_id ?? '';

        $courses = Course::with('teacher', 'category')
            ->withCount(['lessons', 'quizzes', 'enrollments'])
            ->when($search, function ($query, $search) {
                return $query->where('title', 'like', '%' . $search . '%')
                             ->orWhere('description', 'like', '%' . $search . '%');
            })
            ->when($categoryId, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('CourseCatalog', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
            ]
        ]);
    }

    public function show($id): Response
    {
        $course = Course::with([
            'teacher',
            'category',
            'lessons.sublessons',
            'quizzes' => function ($query) {
                $query->with('category')->withCount('questions');
            },
        ])->withCount(['lessons', 'quizzes', 'enrollments'])->findOrFail($id);

        $isEnrolled = Auth::check()
            ? Enrollment::where('user_id', Auth::id())->where('course_id', $course->id)->exists()
            : false;

        return Inertia::render('CourseDetail', compact('course', 'isEnrolled'));
    }

    public function enroll($id)
    {
        Enrollment::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'course_id' => $id,
            ],
            [
                'enroll_at' => Carbon::now(),
            ]
        );

        return redirect()->route('participant.course.learn', $id);
    }

    public function myCourses(): Response
    {
        $enrollments = Enrollment::with([
            'course.teacher',
            'course.category',
            'course.lessons',
            'course.quizzes',
        ])->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('MyCourses', compact('enrollments'));
    }

    public function learn($id): Response
    {
        $course = Course::with([
            'teacher',
            'category',
            'lessons.sublessons',
            'quizzes' => function ($query) {
                $query->with('category')->withCount('questions');
            },
        ])->findOrFail($id);

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'course_id' => $id,
            ],
            [
                'enroll_at' => Carbon::now(),
            ]
        );

        return Inertia::render('CourseLearn', compact('course', 'enrollment'));
    }

    public function takeCourseQuiz($courseId, $quizId)
    {
        $course = Course::whereHas('quizzes', function ($query) use ($quizId) {
            $query->where('quizzes.id', $quizId);
        })->findOrFail($courseId);

        Enrollment::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'course_id' => $course->id,
            ],
            [
                'enroll_at' => Carbon::now(),
            ]
        );

        return redirect()->route('participant.take_quiz', [
            'id' => $quizId,
            'course_id' => $course->id,
        ]);
    }
    public function rateCourse(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $course = Course::findOrFail($id);

        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->firstOrFail();

        $enrollment->update([
            'rating' => $request->rating,
        ]);

        $averageRating = Enrollment::where('course_id', $course->id)
            ->whereNotNull('rating')
            ->avg('rating');

        $course->update([
            'rating' => $averageRating,
        ]);

        return redirect()->back();
    }
}
