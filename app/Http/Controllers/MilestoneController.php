<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MilestoneController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermissionTo('view milestones')) {
            abort(403, 'Unauthorized');
        }

        $milestones = Milestone::orderBy('start_date', 'asc')->get();

        return Inertia::render('Milestones/Index', [
            'milestones' => $milestones,
            'canManage' => auth()->user()->hasPermissionTo('manage milestones'),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('manage milestones')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Pending,In Progress,Completed',
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        Milestone::create($validated);

        return redirect()->back()->with('message', 'Milestone created successfully.');
    }

    public function update(Request $request, Milestone $milestone)
    {
        if (!auth()->user()->hasPermissionTo('manage milestones')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Pending,In Progress,Completed',
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        $milestone->update($validated);

        return redirect()->back()->with('message', 'Milestone updated successfully.');
    }

    public function destroy(Milestone $milestone)
    {
        if (!auth()->user()->hasPermissionTo('manage milestones')) {
            abort(403, 'Unauthorized');
        }

        $milestone->delete();

        return redirect()->back()->with('message', 'Milestone deleted successfully.');
    }
}
