# Chatwise AI Assistant - Backend

This is the Laravel 10 backend for the Chatwise AI Assistant application. It provides the API, authentication, and database services for the frontend.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [API Services](#api-services)
5. [Database](#database)
6. [Authentication](#authentication)
7. [CORS Configuration](#cors-configuration)
8. [Port Management](#port-management)

## Requirements

- PHP 8.1+
- Composer 2.x
- MySQL/MariaDB
- Laravel 10.x

## Installation

### Option 1: Using the installation script (from project root)

```bash
node install.js
```

### Option 2: Manual installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh --seed

# Clear caches
php artisan clear:all
php artisan cache:clear
```

## Configuration

### Key Files

- `.env` - Environment variables
- `config/cors.php` - CORS configuration
- `config/sanctum.php` - Authentication configuration
- `config/database.php` - Database configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_PORT` | Port for the backend server | `8000` |
| `FRONTEND_URL` | URL of the frontend application | `http://localhost:5173` |
| `DB_CONNECTION` | Database connection type | `mysql` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `3306` |
| `DB_DATABASE` | Database name | `laravel` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `` |
| `SANCTUM_STATEFUL_DOMAINS` | Domains for Sanctum authentication | Generated dynamically |
| `PUBLIC_API_MODE` | Whether to run API in public mode | `false` |

## API Services

The backend provides several core services:

- **Authentication** - User registration, login, and token management
- **User Management** - User CRUD operations and role management
- **AI Configuration** - AI model management and configuration
- **Knowledge Base** - Document and resource management
- **Chat** - Chat session management and messaging
- **Widget** - Widget configuration and management

### API Routes

All API routes are prefixed with `/api`. The main route groups include:

- `/api/auth` - Authentication routes
- `/api/users` - User management routes
- `/api/settings` - Application settings
- `/api/ai-models` - AI model configuration
- `/api/knowledge-base` - Knowledge base resources
- `/api/chat` - Chat functionality
- `/api/widgets` - Widget management

## Database

### Migrations

Database migrations are located in `database/migrations`. Run them with:

```bash
php artisan migrate
```

### Seeders

Database seeders are located in `database/seeders`. Run them with:

```bash
php artisan db:seed
```

### Models

Eloquent models are located in `app/Models`. The main models include:

- `User` - User accounts
- `AIModel` - AI model configuration
- `KnowledgeResource` - Knowledge base resources
- `ChatSession` - Chat sessions
- `ChatMessage` - Chat messages
- `Widget` - Widget configuration

## Authentication

The backend uses Laravel Sanctum for API authentication with the following features:

- Token-based authentication
- CSRF protection
- Stateful authentication for SPA
- Role-based access control

### Configuration

Sanctum is configured in `config/sanctum.php`. Key settings include:

- `stateful` - Domains that should receive stateful cookies
- `expiration` - Token expiration time
- `middleware` - Middleware for authentication

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured in `config/cors.php`. The configuration supports:

- Dynamic allowed origins based on environment variables
- Pattern matching for development environments
- Public API mode for open access
- Credential handling for authentication

### Updating CORS Settings

The CORS settings are automatically updated by the `SyncPorts` Artisan command:

```bash
php artisan app:sync-ports --backend-port=8000 --frontend-port=5173
```

## Port Management

### The SyncPorts Command

The backend includes a custom Artisan command to synchronize port settings across the application:

```bash
php artisan app:sync-ports [options]
```

#### Options

- `--backend-port` - Port for the backend server (default: 8000)
- `--frontend-port` - Port for the frontend server (default: 5173)

### What the Command Does

1. Updates backend `.env` file with:
   - `APP_PORT`
   - `FRONTEND_URL`
   - `SANCTUM_STATEFUL_DOMAINS`

2. Updates frontend `.env` file with:
   - `VITE_API_URL`
   - `VITE_PORT`

3. Clears configuration cache:
   - `php artisan config:clear`

### Running on Different Ports

To run the backend on a different port:

```bash
php artisan serve --port=8001
```

This should be combined with updating the configuration:

```bash
php artisan app:sync-ports --backend-port=8001 --frontend-port=5173
```
