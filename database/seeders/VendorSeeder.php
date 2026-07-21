<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = [
            [
                'name' => 'Engr. Rafiqul Islam',
                'email' => 'sales@bsrm.com',
                'phone' => '+880 1711-890123',
                'company_name' => 'BSRM Steels Ltd (Corporate Sales)',
                'category' => 'Steel',
                'rating_sum' => 24,
                'rating_count' => 5,
            ],
            [
                'name' => 'LafargeHolcim Corporate Sales',
                'email' => 'contact@lafargeholcim.bd.com',
                'phone' => '+880 1819-234567',
                'company_name' => 'LafargeHolcim Bangladesh PLC',
                'category' => 'Cement',
                'rating_sum' => 23,
                'rating_count' => 5,
            ],
            [
                'name' => 'Shun Shing Group',
                'email' => 'info@sevenringscement.com',
                'phone' => '+880 1912-345678',
                'company_name' => 'Seven Rings Cement Industries',
                'category' => 'Cement',
                'rating_sum' => 19,
                'rating_count' => 4,
            ],
            [
                'name' => 'Mir ReadyMix Division',
                'email' => 'supply@mirconcrete.com',
                'phone' => '+880 1730-456789',
                'company_name' => 'Mir Concrete Products Ltd',
                'category' => 'Concrete',
                'rating_sum' => 18,
                'rating_count' => 4,
            ],
            [
                'name' => 'Berger Architectural Coatings',
                'email' => 'projects@bergerbd.com',
                'phone' => '+880 1713-987654',
                'company_name' => 'Berger Paints Bangladesh Ltd',
                'category' => 'Paint & Finishes',
                'rating_sum' => 15,
                'rating_count' => 3,
            ],
            [
                'name' => 'RFL Industrial Piping',
                'email' => 'piping@rflbd.com',
                'phone' => '+880 1841-567890',
                'company_name' => 'RFL Building Materials Division',
                'category' => 'Plumbing & MEP',
                'rating_sum' => 14,
                'rating_count' => 3,
            ]
        ];

        foreach ($vendors as $vendor) {
            Vendor::create($vendor);
        }
    }
}
