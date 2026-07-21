<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Milestone;
use App\Models\User;
use App\Models\Vendor;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SprintOneVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    #[Test]
    public function company_homepage_renders_successfully()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    #[Test]
    public function superadmin_can_access_user_management_and_update_roles()
    {
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('SuperAdmin');

        $regularUser = User::factory()->create();

        $response = $this->actingAs($superAdmin)->get('/admin/users');
        $response->assertStatus(200);

        $this->actingAs($superAdmin)->post("/admin/users/{$regularUser->id}/role", [
            'role' => 'Project Manager',
        ])->assertRedirect();

        $this->assertTrue($regularUser->fresh()->hasRole('Project Manager'));
    }

    #[Test]
    public function non_superadmin_cannot_access_user_management()
    {
        $pm = User::factory()->create();
        $pm->assignRole('Project Manager');

        $response = $this->actingAs($pm)->get('/admin/users');
        $response->assertStatus(403);
    }

    #[Test]
    public function project_manager_can_manage_materials()
    {
        $pm = User::factory()->create();
        $pm->assignRole('Project Manager');

        // Create
        $response = $this->actingAs($pm)->post('/materials', [
            'name' => 'BSRM Steel 500W',
            'unit' => 'Tons',
            'quantity' => 100,
            'reorder_level' => 20,
            'price' => 850.50,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('materials', ['name' => 'BSRM Steel 500W']);

        $material = Material::where('name', 'BSRM Steel 500W')->first();

        // Update
        $this->actingAs($pm)->patch("/materials/{$material->id}", [
            'name' => 'BSRM Steel 500W Grade A',
            'unit' => 'Tons',
            'quantity' => 120,
            'reorder_level' => 25,
            'price' => 860.00,
        ])->assertRedirect();

        $this->assertDatabaseHas('materials', ['name' => 'BSRM Steel 500W Grade A']);

        // Stock Update - Add
        $this->actingAs($pm)->post("/materials/{$material->id}/stock", [
            'type' => 'add',
            'amount' => 30,
        ])->assertRedirect();
        $this->assertEquals(150, $material->fresh()->quantity);

        // Stock Update - Consume
        $this->actingAs($pm)->post("/materials/{$material->id}/stock", [
            'type' => 'consume',
            'amount' => 50,
        ])->assertRedirect();
        $this->assertEquals(100, $material->fresh()->quantity);

        // Delete
        $this->actingAs($pm)->delete("/materials/{$material->id}")->assertRedirect();
        $this->assertDatabaseMissing('materials', ['id' => $material->id]);
    }

    #[Test]
    public function site_engineer_can_view_and_consume_materials_but_not_create()
    {
        $engineer = User::factory()->create();
        $engineer->assignRole('Site Engineer');

        $material = Material::create([
            'name' => 'Holcim ReadyMix',
            'unit' => 'Bags',
            'quantity' => 50,
            'reorder_level' => 10,
            'price' => 12.00,
        ]);

        // Can view index
        $this->actingAs($engineer)->get('/materials')->assertStatus(200);

        // Cannot create
        $this->actingAs($engineer)->post('/materials', [
            'name' => 'Brick Batch 1',
            'unit' => 'Pcs',
            'quantity' => 1000,
            'reorder_level' => 100,
            'price' => 0.50,
        ])->assertStatus(403);

        // Can update stock
        $this->actingAs($engineer)->post("/materials/{$material->id}/stock", [
            'type' => 'consume',
            'amount' => 10,
        ])->assertRedirect();
        $this->assertEquals(40, $material->fresh()->quantity);
    }

    #[Test]
    public function vendor_management_and_rating_workflow()
    {
        $pm = User::factory()->create();
        $pm->assignRole('Project Manager');

        // Create vendor
        $this->actingAs($pm)->post('/vendors', [
            'name' => 'Apex Steel Ltd',
            'email' => 'sales@apexsteel.com',
            'phone' => '+8801700000000',
            'company_name' => 'Apex Industries',
            'category' => 'Steel',
        ])->assertRedirect();

        $this->assertDatabaseHas('vendors', ['company_name' => 'Apex Industries']);
        $vendor = Vendor::where('company_name', 'Apex Industries')->first();

        // Rate vendor
        $this->actingAs($pm)->post("/vendors/{$vendor->id}/rate", [
            'rating' => 5,
        ])->assertRedirect();

        $this->assertEquals(5, $vendor->fresh()->rating_sum);
        $this->assertEquals(1, $vendor->fresh()->rating_count);
        $this->assertEquals(5.0, $vendor->fresh()->average_rating);
    }

    #[Test]
    public function milestone_tracking_workflow()
    {
        $pm = User::factory()->create();
        $pm->assignRole('Project Manager');

        // Create milestone
        $this->actingAs($pm)->post('/milestones', [
            'title' => 'Piling Phase 1',
            'description' => 'Deep foundation piling for North Tower',
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-30',
            'status' => 'Pending',
            'color' => '#3b82f6',
        ])->assertRedirect();

        $this->assertDatabaseHas('milestones', ['title' => 'Piling Phase 1']);
        $milestone = Milestone::where('title', 'Piling Phase 1')->first();

        // Update milestone status
        $this->actingAs($pm)->patch("/milestones/{$milestone->id}", [
            'title' => 'Piling Phase 1 Completed',
            'description' => 'Deep foundation piling finished',
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-30',
            'status' => 'Completed',
            'color' => '#10b981',
        ])->assertRedirect();

        $this->assertEquals('Completed', $milestone->fresh()->status);

        // Delete milestone
        $this->actingAs($pm)->delete("/milestones/{$milestone->id}")->assertRedirect();
        $this->assertDatabaseMissing('milestones', ['id' => $milestone->id]);
    }
}
