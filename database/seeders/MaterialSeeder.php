<?php

namespace Database\Seeders;

use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            [
                'name' => 'BSRM Steel 500W Deformed Bar (16mm)',
                'unit' => 'Tons',
                'quantity' => 14,
                'reorder_level' => 5,
                'price' => 92000.00,
            ],
            [
                'name' => 'Seven Rings Gold Composite Cement (50kg)',
                'unit' => 'Bags',
                'quantity' => 520,
                'reorder_level' => 120,
                'price' => 560.00,
            ],
            [
                'name' => 'Holcim Water Protect Cement (50kg)',
                'unit' => 'Bags',
                'quantity' => 45, // Low stock alert!
                'reorder_level' => 100,
                'price' => 580.00,
            ],
            [
                'name' => 'First-Class Machine Made Red Bricks',
                'unit' => 'Pieces',
                'quantity' => 22000,
                'reorder_level' => 5000,
                'price' => 13.50,
            ],
            [
                'name' => 'Sylhet Coarse Sand (FM 2.5)',
                'unit' => 'CFT',
                'quantity' => 850,
                'reorder_level' => 200,
                'price' => 65.00,
            ],
            [
                'name' => 'Jaflong Hard Stone Chips (3/4" Down)',
                'unit' => 'CFT',
                'quantity' => 120, // Low stock alert!
                'reorder_level' => 300,
                'price' => 210.00,
            ],
            [
                'name' => 'ReadyMix High Strength Concrete (C30)',
                'unit' => 'CFT',
                'quantity' => 1500,
                'reorder_level' => 400,
                'price' => 340.00,
            ],
            [
                'name' => 'Berger WeatherCoat Smooth Acrylic Paint',
                'unit' => 'Liters',
                'quantity' => 15, // Low stock alert!
                'reorder_level' => 40,
                'price' => 420.00,
            ],
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }
    }
}
