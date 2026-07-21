<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class MaterialController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermissionTo('view materials')) {
            abort(403, 'Unauthorized');
        }

        $materials = Material::orderBy('name', 'asc')->get();

        return Inertia::render('Materials/Index', [
            'materials' => $materials,
            'canManage' => auth()->user()->hasPermissionTo('manage materials'),
            'canUse' => auth()->user()->hasPermissionTo('use materials'),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('manage materials')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'quantity' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        Material::create($validated);

        return redirect()->back()->with('message', 'Material created successfully.');
    }

    public function update(Request $request, Material $material)
    {
        if (!auth()->user()->hasPermissionTo('manage materials')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'quantity' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $material->update($validated);

        return redirect()->back()->with('message', 'Material updated successfully.');
    }

    public function destroy(Material $material)
    {
        if (!auth()->user()->hasPermissionTo('manage materials')) {
            abort(403, 'Unauthorized');
        }

        $material->delete();

        return redirect()->back()->with('message', 'Material deleted successfully.');
    }

    public function updateStock(Request $request, Material $material)
    {
        if (!auth()->user()->hasPermissionTo('use materials')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'type' => 'required|in:add,consume',
            'amount' => 'required|integer|min:1',
        ]);

        if ($validated['type'] === 'consume') {
            if ($material->quantity < $validated['amount']) {
                return redirect()->back()->withErrors(['amount' => 'Insufficient stock.']);
            }
            $material->decrement('quantity', $validated['amount']);
        } else {
            $material->increment('quantity', $validated['amount']);
        }

        return redirect()->back()->with('message', 'Stock updated successfully.');
    }
}
