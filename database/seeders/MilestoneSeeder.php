<?php

namespace Database\Seeders;

use App\Models\Milestone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class MilestoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = Carbon::today();

        $milestones = [
            [
                'title' => 'Soil Testing & Test Piling (Phase 0)',
                'description' => 'Geotechnical investigation, SPT N-value analysis, and trial bore hole execution.',
                'start_date' => $today->copy()->subDays(25)->format('Y-m-d'),
                'end_date' => $today->copy()->subDays(15)->format('Y-m-d'),
                'status' => 'Completed',
                'color' => '#10b981', // green
            ],
            [
                'title' => 'Cast-in-Situ Piling & Deep Excavation',
                'description' => 'Bored piling up to 120ft depth, bentonite slurry circulation, and sheet piling support.',
                'start_date' => $today->copy()->subDays(14)->format('Y-m-d'),
                'end_date' => $today->copy()->subDays(2)->format('Y-m-d'),
                'status' => 'Completed',
                'color' => '#10b981', // green
            ],
            [
                'title' => 'Basement Mat Foundation Concrete Pouring',
                'description' => 'Mass concrete pouring for basement raft foundation using C30 ReadyMix and BSRM 500W rebar.',
                'start_date' => $today->copy()->subDays(1)->format('Y-m-d'),
                'end_date' => $today->copy()->addDays(6)->format('Y-m-d'),
                'status' => 'In Progress',
                'color' => '#f59e0b', // yellow
            ],
            [
                'title' => 'Ground Floor Column & Slab Casting',
                'description' => 'Formwork assembly, beam reinforcement tying, and floor slab casting.',
                'start_date' => $today->copy()->addDays(8)->format('Y-m-d'),
                'end_date' => $today->copy()->addDays(20)->format('Y-m-d'),
                'status' => 'Pending',
                'color' => '#3b82f6', // blue
            ],
            [
                'title' => 'Exterior Auto-Brick Masonry & Plastering',
                'description' => 'Perimeter wall bricklaying with cement-sand mortar and 1:4 internal plastering.',
                'start_date' => $today->copy()->addDays(22)->format('Y-m-d'),
                'end_date' => $today->copy()->addDays(36)->format('Y-m-d'),
                'status' => 'Pending',
                'color' => '#6366f1', // indigo
            ],
            [
                'title' => 'Concealed Electrical & Plumbing MEP Rough-In',
                'description' => 'Chipping brick walls, installing RFL conduits, PVC drainage pipes, and DB box wiring.',
                'start_date' => $today->copy()->addDays(38)->format('Y-m-d'),
                'end_date' => $today->copy()->addDays(50)->format('Y-m-d'),
                'status' => 'Pending',
                'color' => '#ec4899', // pink
            ]
        ];

        foreach ($milestones as $milestone) {
            Milestone::create($milestone);
        }
    }
}
