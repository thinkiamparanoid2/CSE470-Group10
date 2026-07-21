<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole('SuperAdmin')) {
            abort(403, 'Unauthorized');
        }

        $users = User::all()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ];
        });

        $roles = Role::pluck('name');

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        if (!auth()->user()->hasRole('SuperAdmin')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        // Sync roles (user gets exactly this role)
        $user->syncRoles([$validated['role']]);

        return redirect()->back()->with('message', "User role updated to {$validated['role']}.");
    }
}
