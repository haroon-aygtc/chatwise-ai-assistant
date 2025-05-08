<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ClearAllCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all Laravel caches in one command';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Clearing all caches...');

        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        $this->call('optimize:clear');

        // Clear session files manually
        $this->clearSessions();

        $this->info('All caches cleared successfully!');

        return Command::SUCCESS;
    }

    /**
     * Clear session files manually
     */
    protected function clearSessions()
    {
        $sessionPath = storage_path('framework/sessions');

        if (File::isDirectory($sessionPath)) {
            $this->info('Clearing session files...');
            $files = File::glob($sessionPath . '/*');
            $count = 0;

            foreach ($files as $file) {
                if (File::isFile($file)) {
                    File::delete($file);
                    $count++;
                }
            }

            $this->info("Removed {$count} session files.");
        }
    }
} 