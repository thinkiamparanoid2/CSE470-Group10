<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view vendors')) {
            abort(403, 'Unauthorized');
        }

        $query = Vendor::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $vendors = $query->orderBy('name', 'asc')->get();
        $categories = Vendor::select('category')->distinct()->pluck('category');

        return Inertia::render('Vendors/Index', [
            'vendors' => $vendors,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
            'canManage' => auth()->user()->hasPermissionTo('manage vendors'),
            'canRate' => auth()->user()->hasPermissionTo('rate vendors'),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('manage vendors')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'company_name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
        ]);

        Vendor::create($validated);

        return redirect()->back()->with('message', 'Vendor created successfully.');
    }

    public function rate(Request $request, Vendor $vendor)
    {
        if (!auth()->user()->hasPermissionTo('rate vendors')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $vendor->increment('rating_sum', $validated['rating']);
        $vendor->increment('rating_count');

        return redirect()->back()->with('message', 'Rating submitted successfully.');
    }
}
