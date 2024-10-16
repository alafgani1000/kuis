<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if (!is_null($request->user())) {
            $roles = $request->user()->roles;

            $roleMaps = $roles->map(function ($role, $index) {
                return [
                    $role->name => true
                ];
            });
            $role = $roleMaps[0];
            $permissions = collect();

            $roles->map(function ($role, $index) use($permissions) {
                $role->permissions->each(function ($item, $key) use($permissions) {
                    $permissions->put($item->name, true);
                });
            });
        } else {
            $role = [];
            $permissions= [];
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'roles' => $role,
                'permissions' => $permissions
            ],
        ];
    }
}
