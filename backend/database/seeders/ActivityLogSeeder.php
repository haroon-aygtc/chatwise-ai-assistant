<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();
        $manager = User::where('email', 'manager@example.com')->first();
        $user = User::where('email', 'user@example.com')->first();

        // Sample activity logs for demonstration
        $this->createSampleLogs($admin, $manager, $user);
    }

    /**
     * Create sample activity logs for demonstration
     */
    private function createSampleLogs($admin, $manager, $user): void
    {
        // Admin activities
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'User Login',
            'description' => 'Admin logged in successfully',
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'created_at' => now()->subDays(5),
        ]);

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'Role Created',
            'description' => 'Created new role: Editor',
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'created_at' => now()->subDays(5)->addHours(1),
        ]);


        // Manager activities
        ActivityLog::create([
            'user_id' => $manager->id,
            'action' => 'User Login',
            'description' => 'Manager logged in successfully',
            'ip_address' => '192.168.1.2',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            'created_at' => now()->subDays(4),
        ]);

        ActivityLog::create([
            'user_id' => $manager->id,
            'action' => 'User Status Changed',
            'description' => "Changed user {$user->email} status from pending to active",
            'ip_address' => '192.168.1.2',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            'created_at' => now()->subDays(4)->addHours(1),
        ]);


        // User activities
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'User Login',
            'description' => 'User logged in successfully',
            'ip_address' => '192.168.1.4',
            'user_agent' => 'Mozilla/5.0 (Linux; Android 11)',
            'created_at' => now()->subDays(2),
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'User Update',
            'description' => 'User updated their profile - name, avatar_url',
            'ip_address' => '192.168.1.4',
            'user_agent' => 'Mozilla/5.0 (Linux; Android 11)',
            'created_at' => now()->subDays(2)->addHours(1),
        ]);

        // More recent activities
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'Permissions Updated',
            'description' => 'Updated permissions for role: Manager',
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'created_at' => now()->subDay(),
        ]);

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'Role Assignment',
            'description' => "Assigned roles [editor] to user: {$user->email}",
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'created_at' => now()->subHours(12),
        ]);

        // System activities
        ActivityLog::create([
            'user_id' => null,
            'action' => 'System Backup',
            'description' => 'Weekly backup completed successfully',
            'ip_address' => 'localhost',
            'user_agent' => 'System',
            'created_at' => now()->subHours(6),
        ]);
    }
}