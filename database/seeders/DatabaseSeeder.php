<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run Roles and Permissions Seeder
        $this->call([
            RolesAndPermissionsSeeder::class,
            MaterialSeeder::class,
            VendorSeeder::class,
            MilestoneSeeder::class,
        ]);

        // Create default users
        $admin = User::firstOrCreate(
            ['email' => 'admin@smartconstruct.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('SuperAdmin');

        $pm = User::firstOrCreate(
            ['email' => 'pm@smartconstruct.com'],
            [
                'name' => 'Project Manager',
                'password' => Hash::make('password'),
            ]
        );
        $pm->assignRole('Project Manager');

        $engineer = User::firstOrCreate(
            ['email' => 'engineer@smartconstruct.com'],
            [
                'name' => 'Site Engineer',
                'password' => Hash::make('password'),
            ]
        );
        $engineer->assignRole('Site Engineer');

        $vendor = User::firstOrCreate(
            ['email' => 'vendor@smartconstruct.com'],
            [
                'name' => 'Vendor Supplier',
                'password' => Hash::make('password'),
            ]
        );
        $vendor->assignRole('Vendor');
    }
}
