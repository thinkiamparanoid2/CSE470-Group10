<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage users',
            'manage materials',
            'view materials',
            'use materials',
            'manage vendors',
            'rate vendors',
            'view vendors',
            'manage milestones',
            'view milestones',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Create roles and assign existing permissions
        
        // SuperAdmin
        $superAdmin = Role::findOrCreate('SuperAdmin');
        $superAdmin->givePermissionTo(Permission::all());

        // Project Manager
        $projectManager = Role::findOrCreate('Project Manager');
        $projectManager->givePermissionTo([
            'manage materials',
            'view materials',
            'use materials',
            'manage vendors',
            'rate vendors',
            'view vendors',
            'manage milestones',
            'view milestones',
        ]);

        // Site Engineer
        $siteEngineer = Role::findOrCreate('Site Engineer');
        $siteEngineer->givePermissionTo([
            'view materials',
            'use materials',
            'view vendors',
            'rate vendors',
            'view milestones',
        ]);

        // Vendor
        $vendor = Role::findOrCreate('Vendor');
        $vendor->givePermissionTo([
            'view materials',
            'view vendors',
            'view milestones',
        ]);
    }
}
