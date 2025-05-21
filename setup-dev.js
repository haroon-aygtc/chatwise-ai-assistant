#!/usr/bin/env node

/**
 * Development Environment Setup Script
 * 
 * This script helps configure both frontend and backend port settings
 * and ensures they're in sync across all configuration files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Default ports
const DEFAULT_BACKEND_PORT = 8000;
const DEFAULT_FRONTEND_PORT = 5173;

console.log('\n🔧 Chatwise AI Assistant - Development Environment Setup\n');

async function promptForPorts() {
    return new Promise((resolve) => {
        rl.question(`Backend port [${DEFAULT_BACKEND_PORT}]: `, (backendPortInput) => {
            const backendPort = backendPortInput.trim() || DEFAULT_BACKEND_PORT;

            rl.question(`Frontend port [${DEFAULT_FRONTEND_PORT}]: `, (frontendPortInput) => {
                const frontendPort = frontendPortInput.trim() || DEFAULT_FRONTEND_PORT;
                resolve({ backendPort, frontendPort });
            });
        });
    });
}

async function main() {
    try {
        // Get port settings from user
        const { backendPort, frontendPort } = await promptForPorts();
        console.log(`\nConfiguring with Backend: ${backendPort}, Frontend: ${frontendPort}`);

        // Run the Artisan command to sync ports
        console.log('\n📡 Syncing port settings...');
        const artisanPath = path.join(__dirname, 'backend', 'artisan');

        if (!fs.existsSync(artisanPath)) {
            console.error('❌ Artisan file not found. Make sure you are running this from the project root.');
            process.exit(1);
        }

        execSync(`php "${artisanPath}" app:sync-ports --backend-port=${backendPort} --frontend-port=${frontendPort}`,
            { stdio: 'inherit' });

        console.log('\n✅ Port configuration completed successfully!\n');
        console.log('👉 Run these commands to start development:');
        console.log(`   - Backend: cd backend && php artisan serve --port=${backendPort}`);
        console.log(`   - Frontend: npm run dev -- --port=${frontendPort}\n`);

        // Create a developer batch file for Windows users
        if (process.platform === 'win32') {
            const batchContent = `@echo off
echo Starting development servers...
start cmd /k "cd backend && php artisan serve --port=${backendPort}"
start cmd /k "npm run dev -- --port=${frontendPort}"
echo Servers started successfully!
`;
            fs.writeFileSync('start-dev.bat', batchContent);
            console.log('💻 A "start-dev.bat" file has been created for Windows users.');
            console.log('   You can double-click it to start both servers at once.\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

main(); 