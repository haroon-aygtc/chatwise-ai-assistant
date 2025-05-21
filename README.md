# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Chatwise AI Assistant

A powerful AI chat assistant platform with multiple language model integrations.

## Supported AI Providers

The application supports the following AI providers:

- OpenAI (GPT-3.5, GPT-4)
- Anthropic Claude
- Google Gemini
- More providers can be added via the modular provider system

## Project Structure

This project consists of:

- **Frontend**: React application with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Laravel 12 PHP application providing API endpoints and AI service integration

## Google Gemini Integration

The application includes full support for Google's Gemini AI models with the following features:

- API key validation and configuration
- Customizable model parameters (temperature, maxTokens, topP, topK)
- Testing interface for Gemini responses
- Seamless integration with existing chat workflows

### Gemini Configuration

To use Google Gemini models:

1. Obtain a Google Gemini API key
2. Configure the model in the admin interface under AI Configuration
3. Adjust parameters as needed for your use case

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PHP 8.1+ and Composer
- MySQL or PostgreSQL database

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd chatwise-ai-assistant

# Install frontend dependencies
npm i

# Install backend dependencies
composer install

# Start the development server
npm run dev
```

## Deployment

For deployment instructions, see the [deployment documentation](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

## Technologies Used

This project is built with:

- Frontend:
  - Vite
  - TypeScript
  - React
  - shadcn-ui
  - Tailwind CSS
  
- Backend:
  - Laravel 12
  - PHP 8.1+

# Chatwise AI Assistant - Setup Guide

This documentation provides a comprehensive guide for setting up and running the Chatwise AI Assistant application, including both frontend and backend components.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Port Configuration](#port-configuration)
4. [Development Workflow](#development-workflow)
5. [Environment Variables](#environment-variables)
6. [Manual Configuration](#manual-configuration)
7. [Troubleshooting](#troubleshooting)

## System Requirements

### Backend Requirements
- PHP 8.1 or higher
- Composer 2.x
- Laravel 10.x
- MySQL 5.7+ or MariaDB 10.3+

### Frontend Requirements
- Node.js 16.x or higher
- npm 7.x or higher

## Installation

### Automatic Installation (Recommended)

The easiest way to set up the project is to use the automated installation script:

```bash
# From the project root
node install.js
```

This script will:
1. Install all frontend and backend dependencies
2. Create environment files if they don't exist
3. Set up the database (optional)
4. Configure port settings for both frontend and backend
5. Generate startup scripts

### Manual Installation

If you prefer to install manually:

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   composer install
   ```

3. Create environment files:
   ```bash
   # Frontend (.env)
   cp .env.example .env  # (if .env.example exists)
   
   # Backend (.env)
   cd backend
   cp .env.example .env  # (if .env.example exists)
   ```

4. Set up the database:
   ```bash
   cd backend
   php artisan migrate:fresh --seed
   ```

5. Configure port settings:
   ```bash
   cd backend
   php artisan app:sync-ports
   ```

## Port Configuration

The application uses a sophisticated port synchronization system to ensure that frontend and backend servers can communicate correctly.

### Using the Port Configuration Utility

```bash
# From the project root
npm run setup
```

or

```bash
# From the project root
node setup-dev.js
```

This utility will:
1. Prompt for backend and frontend port numbers
2. Update all necessary configuration files
3. Clear Laravel configuration cache
4. Create a startup batch file (Windows only)

### How Port Configuration Works

The port configuration system synchronizes settings across multiple files:

1. **Backend .env**: Updates `APP_PORT` and `FRONTEND_URL`
2. **Frontend .env**: Updates `VITE_API_URL` and `VITE_PORT`
3. **CORS Configuration**: Updates allowed origins in `config/cors.php`
4. **Sanctum Configuration**: Updates stateful domains in `config/sanctum.php`

The `SyncPorts` Artisan command handles all these updates automatically.

## Development Workflow

### Starting the Development Servers

#### Option 1: Using npm scripts

```bash
# Start both servers concurrently
npm run dev:all

# Start servers individually
npm run dev:backend
npm run dev:frontend
```

#### Option 2: Using direct commands

```bash
# Terminal 1 (Backend)
cd backend
php artisan serve --port=8000

# Terminal 2 (Frontend)
npm run dev -- --port=5173
```

#### Option 3: Windows batch file (if generated)

```bash
# Double-click on start-dev.bat
# Or run from command line:
start-dev.bat
```

### Accessing the Application

- Frontend: http://localhost:5173 (or your configured port)
- Backend API: http://localhost:8000/api (or your configured port)

## Environment Variables

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Full URL to the backend API | `http://localhost:8000/api` |
| `VITE_PORT` | Port for the frontend dev server | `5173` |
| `VITE_BACKEND_PORT` | Backend server port (alternative to VITE_API_URL) | `8000` |
| `VITE_BACKEND_HOST` | Backend server host (alternative to VITE_API_URL) | `localhost` |
| `VITE_BACKEND_PROTOCOL` | Backend protocol (alternative to VITE_API_URL) | `http` |
| `VITE_BACKEND_PATH` | Backend API path (alternative to VITE_API_URL) | `api` |
| `VITE_PUBLIC_API_MODE` | Whether to run API in public mode | `false` |

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_PORT` | Port for the backend server | `8000` |
| `FRONTEND_URL` | URL of the frontend application | `http://localhost:5173` |
| `SANCTUM_STATEFUL_DOMAINS` | Domains for Sanctum authentication | Generated dynamically |
| `PUBLIC_API_MODE` | Whether to run API in public mode | `false` |

## Manual Configuration

### Manually Updating Port Settings

If you need to update port settings manually:

#### Backend

1. Edit `backend/.env`:
   ```
   APP_PORT=8000
   FRONTEND_URL=http://localhost:5173
   ```

2. Update CORS configuration in `backend/config/cors.php`
3. Update Sanctum domains in `backend/config/sanctum.php`
4. Clear configuration cache:
   ```bash
   php artisan config:clear
   ```

#### Frontend

1. Edit `.env`:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_PORT=5173
   ```

## Troubleshooting

### CORS Issues

If you're experiencing CORS errors:

1. Make sure both servers are running
2. Verify that port settings are in sync
3. Check the CORS configuration:
   ```bash
   cd backend
   php artisan app:sync-ports
   php artisan config:clear
   ```
4. Ensure the frontend is making requests to the correct API URL

### Authentication Issues

If authentication is failing:

1. Check that cookies are being properly sent/received
2. Verify Sanctum stateful domains include your frontend domain
3. Ensure `SANCTUM_STATEFUL_DOMAINS` includes the frontend domain with port
4. Check that the frontend is using credentials in API requests

### Port Conflicts

If you encounter port conflicts:

1. Run the setup script to choose different ports:
   ```bash
   npm run setup
   ```
2. Or manually change ports in environment files
3. Restart both servers

### NPM Script Issues

If you're getting errors like `'concurrently' is not recognized as an internal or external command`:

1. Make sure you've installed all dev dependencies:
   ```bash
   npm install
   # or specifically
   npm install concurrently --save-dev
   ```
2. Try running the commands individually if concurrently is still causing issues:
   ```bash
   # In one terminal
   npm run dev:backend
   
   # In another terminal
   npm run dev:frontend
   ```

### Database Connection Issues

If you're having issues connecting to the database:

1. Check your database credentials in `backend/.env`
2. Ensure your database server is running
3. Run the migrations again:
   ```bash
   cd backend
   php artisan migrate:fresh --seed
   ```

For more assistance, refer to the Laravel documentation or open an issue in the project repository.
