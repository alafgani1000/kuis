<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\ParticipantQuizController;
use App\Http\Controllers\QuizCategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ParticipantQuizController::class, 'home'])->name('home');

// get category quizes
Route::get('/quiz/category', [ParticipantQuizController::class, 'byCategoryQuiz'])->name('participant.by_category_quiz');
// get new quiz
Route::get('/quiz/new', [ParticipantQuizController::class, 'newQuiz'])->name('participant.new_quiz');

Route::middleware('auth')->group(function () {
    // profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('role:participant')->group(function () {
        Route::get('/dashboard', [ParticipantQuizController::class, 'dashoard'])->name('participant.dashboard');
        Route::get('/quiz/{id}/start', [ParticipantQuizController::class, 'takeQuiz'])->name('participant.take_quiz');
        Route::post('/quiz/sync-answers', [ParticipantQuizController::class, 'syncAnswers'])->name('participant.sync_answers');
        Route::get('/quiz/{id}/sync-answers', [ParticipantQuizController::class, 'getSyncAnswers'])->name('participant.get_sync_answers');
        Route::post('/quiz/sync-time-taken', [ParticipantQuizController::class, 'syncTimeTaken'])->name('participant.sync_time_taken');
        Route::get('/quiz/{id}/sync-time-taken', [ParticipantQuizController::class, 'getSyncTimeTaken'])->name('participant.get_sync_time_taken');
        Route::put('/quiz/{id}/evaluate', [ParticipantQuizController::class, 'evaluateQuiz'])->name('participant.evaluate_quiz');
        Route::get('/quiz/{id}/score', [ParticipantQuizController::class, 'showScore'])->name('participant.show_score');
    });

    Route::middleware(['role:admin|creator'])->prefix('admin')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard');
        })->middleware(['verified'])->name('dashboard');

        // user
        Route::get('/users', [UserController::class, 'index'])->name('user.index');
        Route::post('/user', [UserController::class, 'store'])->name('user.store');
        Route::put('/user/{id}/update', [UserController::class, 'update'])->name('user.update');
        Route::put('user/{id}/change-role', [UserController::class, 'changeRole'])->name('user.change-role');

        // role
        Route::get('/roles', [RoleController::class, 'index'])->name('role.index');
        Route::post('/role', [RoleController::class, 'store'])->name('role.store');
        Route::put('/role/{id}/update', [RoleController::class, 'update'])->name('role.update');
        Route::delete('/role/{id}/delete', [RoleController::class, 'delete'])->name('role.delete');

        // permission
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permission.index');
        Route::post('/permission', [PermissionController::class, 'store'])->name('permission.store');
        Route::put('/permission/{id}/update', [PermissionController::class, 'update'])->name('permission.update');
        Route::delete('/permission/{id}/delete', [PermissionController::class, 'delete'])->name('permission.delete');

        // Role have permission
        Route::get('/role-permissions', [RolePermissionController::class, 'index'])->name('role-perms.index');
        Route::post('/role-permission', [RolePermissionController::class, 'store'])->name('role-perms.store');
        Route::post('/role-permission-revoke', [RolePermissionController::class, 'revoke'])->name('role-perms.revoke');
        Route::get('/role-permission/{id}/data', [RolePermissionCOntroller::class, 'dataPermission'])->name('role-perms.data');

        // Type
        Route::get('/types', [TypeController::class, 'index'])->name('type.index');
        Route::post('/type', [TypeController::class, 'store'])->name('type.store');
        Route::put('/type/{id}/update', [TypeController::class, 'update'])->name('type.update');
        Route::delete('/type/{id}/delete', [TypeController::class, 'delete'])->name('type.delete');
        Route::get('/type/data', [TypeController::class, 'data'])->name('type.data');

        // Category
        Route::get('/cateories', [CategoryController::class, 'index'])->name('category.index');
        Route::post('/category', [CategoryController::class, 'store'])->name('category.store');
        Route::put('/category/{id}/update', [CategoryController::class, 'update'])->name('category.update');
        Route::delete('/category/{id}/delete', [CategoryController::class, 'delete'])->name('category.delete');
        Route::get('/category/data', [CategoryController::class, 'data'])->name('category.data');

        // Category
        Route::get('/quiz-categories', [QuizCategoryController::class, 'index'])->name('quizcategory.index');
        Route::post('/quiz-category', [QuizCategoryController::class, 'store'])->name('quizcategory.store');
        Route::post('/quiz-category/{id}/update', [QuizCategoryController::class, 'update'])->name('quizcategory.update');
        Route::delete('/quiz-category/{id}/delete', [QuizCategoryController::class, 'delete'])->name('quizcategory.delete');
        Route::get('/quiz-category/data', [QuizCategoryController::class, 'data'])->name('quizcategory.data');

        // Question
        Route::get('/question', [QuestionController::class, 'index'])->name('question.index');
        Route::post('/question', [QuestionController::class, 'store'])->name('question.store');
        Route::put('/question/{id}/update', [QuestionController::class, 'update'])->name('question.update');
        Route::delete('/question/{id}/delete', [QuestionController::class, 'delete'])->name('question.delete');
        Route::get('/question/data', [QuestionController::class, 'data'])->name('question.data');
        Route::get('/question/datas', [QuestionController::class, 'datas'])->name('question.datas');

        // Quiz
        Route::get('/quiz', [QuizController::class, 'index'])->name('quiz.index');
        Route::post('/quiz', [QuizController::class, 'store'])->name('quiz.store');
        Route::post('/quiz/{id}/update', [QuizController::class, 'update'])->name('quiz.update');
        Route::delete('/quiz/{id}/delete', [QuizController::class, 'destroy'])->name('quiz.delete');
        Route::put('/quiz/{id}/publish', [QuizController::class, 'publish'])->name('quiz.publish');
        Route::put('/quiz/{id}/unpublish', [QuizController::class, 'unpublish'])->name('quiz.unpublish');

        // Quiz question
        Route::get('/quiz/{quiz_id}/question', [QuizQuestionController::class, 'index'])->name('quiz.question.index');
        Route::put('/quiz/{quiz_id}/question', [QuizQuestionController::class, 'store'])->name('quiz.question.store');
        Route::get('/quiz/{id}/question-check', [QuizQuestionController::class, 'check'])->name('quiz.question.check');
        Route::put('/quiz/question/{id}/update', [QuizQuestionController::class, 'update'])->name('quiz.question.update');
        Route::delete('/quiz/question/{id}/delete', [QuizQuestionController::class, 'delete'])->name('quiz.question.delete');
        Route::get('/quiz/{quiz_id}/question-data', [QuizQuestionController::class, 'data'])->name('quiz.question.data');
    });
});

require __DIR__ . '/auth.php';
