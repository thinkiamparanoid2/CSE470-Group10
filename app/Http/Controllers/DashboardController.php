<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Vendor;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalMaterials = Material::count();
        $lowStockMaterials = Material::whereColumn('quantity', '<=', 'reorder_level')->get();
        $totalVendors = Vendor::count();
        
        $activeMilestonesCount = Milestone::whereIn('status', ['Pending', 'In Progress'])->count();
        $upcomingMilestones = Milestone::whereIn('status', ['Pending', 'In Progress'])
            ->orderBy('start_date', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalMaterials' => $totalMaterials,
                'lowStockCount' => $lowStockMaterials->count(),
                'totalVendors' => $totalVendors,
                'activeMilestonesCount' => $activeMilestonesCount,
            ],
            'lowStockMaterials' => $lowStockMaterials,
            'upcomingMilestones' => $upcomingMilestones,
        ]);
    }
}
