<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncPorts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-ports
                            {--backend-port=8000 : Port for the backend server}
                            {--frontend-port=5173 : Port for the frontend server}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize port settings across the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $backendPort = $this->option('backend-port');
        $frontendPort = $this->option('frontend-port');

        $this->info("Synchronizing port settings: Backend=$backendPort, Frontend=$frontendPort");

        // Update backend .env
        $this->updateBackendEnv($backendPort, $frontendPort);

        // Update frontend .env
        $this->updateFrontendEnv($backendPort, $frontendPort);

        // Clear configuration cache
        $this->call('config:clear');

        $this->info('Port settings have been synchronized successfully!');
        $this->info('Run the following commands to apply changes:');
        $this->line('1. In backend: php artisan serve');
        $this->line('2. In frontend: npm run dev');
    }

    /**
     * Update backend .env file
     */
    private function updateBackendEnv($backendPort, $frontendPort)
    {
        $envPath = base_path('.env');

        if (File::exists($envPath)) {
            $env = File::get($envPath);

            // Update APP_PORT
            $env = preg_replace(
                '/APP_PORT=(.*)/',
                "APP_PORT=$backendPort",
                $env
            );

            // Update FRONTEND_URL
            if (preg_match('/FRONTEND_URL=(.*)/', $env)) {
                $env = preg_replace(
                    '/FRONTEND_URL=(.*)/',
                    "FRONTEND_URL=http://localhost:$frontendPort",
                    $env
                );
            } else {
                $env .= "\nFRONTEND_URL=http://localhost:$frontendPort\n";
            }

            // Update SANCTUM_STATEFUL_DOMAINS to include frontend
            if (preg_match('/SANCTUM_STATEFUL_DOMAINS=(.*)/', $env)) {
                $env = preg_replace(
                    '/SANCTUM_STATEFUL_DOMAINS=(.*)/',
                    "SANCTUM_STATEFUL_DOMAINS=localhost:$frontendPort,localhost:$backendPort,127.0.0.1:$frontendPort,127.0.0.1:$backendPort,localhost",
                    $env
                );
            } else {
                $env .= "\nSANCTUM_STATEFUL_DOMAINS=localhost:$frontendPort,localhost:$backendPort,127.0.0.1:$frontendPort,127.0.0.1:$backendPort,localhost\n";
            }

            File::put($envPath, $env);
            $this->info('Backend .env updated successfully.');
        } else {
            $this->error('Backend .env file not found!');
        }
    }

    /**
     * Update frontend .env file
     */
    private function updateFrontendEnv($backendPort, $frontendPort)
    {
        $frontendEnvPath = base_path('../.env');
        $frontendEnvExamplePath = base_path('../.env.example');

        $envContent = "VITE_API_URL=http://localhost:$backendPort/api\n";
        $envContent .= "VITE_PORT=$frontendPort\n";

        if (File::exists($frontendEnvPath)) {
            $currentEnv = File::get($frontendEnvPath);

            // Update API URL
            $currentEnv = preg_replace(
                '/VITE_API_URL=(.*)/',
                "VITE_API_URL=http://localhost:$backendPort/api",
                $currentEnv
            );

            // Update PORT
            if (preg_match('/VITE_PORT=(.*)/', $currentEnv)) {
                $currentEnv = preg_replace(
                    '/VITE_PORT=(.*)/',
                    "VITE_PORT=$frontendPort",
                    $currentEnv
                );
            } else {
                $currentEnv .= "\nVITE_PORT=$frontendPort\n";
            }

            File::put($frontendEnvPath, $currentEnv);
            $this->info('Frontend .env updated successfully.');
        } else {
            // Create frontend .env if not exists
            File::put($frontendEnvPath, $envContent);
            $this->info('Frontend .env created successfully.');
        }

        // Update example file if it exists
        if (File::exists($frontendEnvExamplePath)) {
            File::put($frontendEnvExamplePath, $envContent);
            $this->info('Frontend .env.example updated successfully.');
        }
    }
}
