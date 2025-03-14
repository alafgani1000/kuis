<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\TypeController;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

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

});

require __DIR__.'/auth.php';
