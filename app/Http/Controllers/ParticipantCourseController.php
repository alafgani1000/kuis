<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantCourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::with('teacher')
            ->withCount(['lessons', 'quizzes', 'enrollments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('CourseCatalog', compact('courses'));
    }

    public function show($id): Response
    {
        $course = Course::with([
            'teacher',
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
}
