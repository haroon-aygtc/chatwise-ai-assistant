#!/usr/bin/env node

/**
 * Chatwise AI Assistant - Installation Script
 * 
 * This script automates the installation and initial configuration of the project.
 * It installs dependencies, sets up the environment, and configures port settings.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Default settings
const DEFAULT_BACKEND_PORT = 8000;
const DEFAULT_FRONTEND_PORT = 5173;

console.log('\n🚀 Chatwise AI Assistant - Installation\n');

async function promptQuestion(question, defaultValue) {
    return new Promise((resolve) => {
        rl.question(`${question} [${defaultValue}]: `, (input) => {
            resolve(input.trim() || defaultValue);
        });
    });
}

async function main() {
    try {
        console.log('This script will install and configure your development environment.');
        console.log('Press Ctrl+C at any time to abort.\n');

        // 1. Install frontend dependencies
        console.log('📦 Installing frontend dependencies...');
        execSync('npm install', { stdio: 'inherit' });

        // 2. Install backend dependencies
        console.log('\n📦 Installing backend dependencies...');
        execSync('cd backend && composer install', { stdio: 'inherit' });

        // 3. Copy environment files if they don't exist
        if (!fs.existsSync('.env')) {
            console.log('\n📄 Creating frontend environment file...');
            if (fs.existsSync('.env.example')) {
                fs.copyFileSync('.env.example', '.env');
            } else {
                const frontendEnv = `VITE_API_URL=http://localhost:${DEFAULT_BACKEND_PORT}/api
VITE_PORT=${DEFAULT_FRONTEND_PORT}`;
                fs.writeFileSync('.env', frontendEnv);
            }
            console.log('   ✅ Frontend .env created');
        }

        if (!fs.existsSync('backend/.env')) {
            console.log('\n📄 Creating backend environment file...');
            if (fs.existsSync('backend/.env.example')) {
                fs.copyFileSync('backend/.env.example', 'backend/.env');
            } else {
                console.log('   ⚠️ No backend .env.example found, skipping...');
            }
            console.log('   ✅ Backend .env created. You may need to set up database credentials manually.');
        }

        // 4. Set up database if needed
        const setupDb = await promptQuestion('Would you like to set up the database now? (y/n)', 'y');
        if (setupDb.toLowerCase() === 'y') {
            console.log('\n🗄️ Setting up database...');
            try {
                execSync('cd backend && php artisan migrate:fresh --seed', { stdio: 'inherit' });
                console.log('   ✅ Database setup complete');
            } catch (error) {
                console.log('   ⚠️ Database setup failed. You may need to configure database credentials in backend/.env');
            }
        }

        // 5. Get port settings from user
        console.log('\n🔌 Port configuration:');
        const backendPort = await promptQuestion('Backend port', DEFAULT_BACKEND_PORT);
        const frontendPort = await promptQuestion('Frontend port', DEFAULT_FRONTEND_PORT);

        console.log(`\nConfiguring with Backend: ${backendPort}, Frontend: ${frontendPort}`);

        // 6. Run the Artisan command to sync ports
        console.log('\n📡 Syncing port settings...');
        try {
            execSync(`cd backend && php artisan app:sync-ports --backend-port=${backendPort} --frontend-port=${frontendPort}`,
                { stdio: 'inherit' });
        } catch (error) {
            console.log('\n   ⚠️ Port sync failed, but you can run it later with:');
            console.log(`   cd backend && php artisan app:sync-ports --backend-port=${backendPort} --frontend-port=${frontendPort}`);
        }

        // 7. Generate startup scripts
        if (process.platform === 'win32') {
            console.log('\n💻 Creating Windows startup script...');
            const batchContent = `@echo off
echo Starting development servers...
start cmd /k "cd backend && php artisan serve --port=${backendPort}"
start cmd /k "npm run dev -- --port=${frontendPort}"
echo Servers started successfully!
`;
            fs.writeFileSync('start-dev.bat', batchContent);
            console.log('   ✅ Created start-dev.bat');
        }

        console.log('\n✅ Installation completed successfully!');
        console.log('\n👉 To start development:');
        console.log(`   - Backend: cd backend && php artisan serve --port=${backendPort}`);
        console.log(`   - Frontend: npm run dev -- --port=${frontendPort}`);
        console.log(`   - Or use: npm run dev:all\n`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

main(); 