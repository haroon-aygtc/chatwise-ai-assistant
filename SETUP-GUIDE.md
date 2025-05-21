# Chatwise AI Assistant - Technical Setup Guide

This guide provides detailed technical information for developers working with the Chatwise AI Assistant application, focusing on port configuration, cross-domain communication, and environment setup.

## Architecture Overview

The Chatwise AI Assistant consists of two main components:

1. **Frontend**: React application built with Vite, React, TypeScript, and Shadcn UI
2. **Backend**: Laravel 10 API with MySQL database

These components can be run on the same machine with different ports, or on completely separate servers with different domains.

## Port Configuration System

### Design Goals

The port configuration system was designed to solve several key challenges:

1. Eliminate hardcoded port numbers scattered throughout the codebase
2. Maintain synchronized settings between frontend and backend
3. Support both local development and production deployment
4. Handle cross-domain communication securely
5. Simplify developer setup and onboarding

### Key Components

The port configuration system consists of several integrated components:

#### 1. SyncPorts Artisan Command

Located at `backend/app/Console/Commands/SyncPorts.php`, this command:

- Updates backend `.env` variables
- Updates frontend `.env` variables
- Configures CORS and Sanctum for cross-domain communication
- Clears configuration caches

```php
// Example usage
php artisan app:sync-ports --backend-port=8000 --frontend-port=5173
```

#### 2. Dynamic CORS Configuration

Located at `backend/config/cors.php`, this configuration:

- Reads environment variables for domain settings
- Configures allowed origins dynamically based on port settings
- Supports pattern matching for flexible development
- Toggles between secure and public API modes

```php
// Example code snippet
$frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
$backendUrl = env('APP_URL', 'http://localhost:8000');

// Parse ports for dynamic configuration
$frontendPort = parse_url($frontendUrl, PHP_URL_PORT) ?: '5173';
$backendPort = parse_url($backendUrl, PHP_URL_PORT) ?: '8000';
```

#### 3. Dynamic Sanctum Configuration

Located at `backend/config/sanctum.php`, this configuration:

- Generates stateful domains list from environment variables
- Ensures authentication works across domains and ports
- Configures proper credentials behavior

```php
// Example code snippet
$defaultStatefulDomains = implode(',', [
    "localhost:$frontendPort",
    "localhost:$backendPort",
    "127.0.0.1:$frontendPort",
    "127.0.0.1:$backendPort",
    'localhost',
]);
```

#### 4. Flexible API Client Configuration

Located at `src/services/api/config.ts`, this configuration:

- Supports direct URL specification via environment variables
- Provides component-based URL construction as fallback
- Handles public vs. secure API modes

```typescript
// Example code snippet
const getBackendPort = (): string => {
  // If VITE_API_URL is defined, use that directly
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Otherwise construct URL from components
  const port = import.meta.env.VITE_BACKEND_PORT || '8000';
  const host = import.meta.env.VITE_BACKEND_HOST || 'localhost';
  const protocol = import.meta.env.VITE_BACKEND_PROTOCOL || 'http';
  const path = import.meta.env.VITE_BACKEND_PATH || 'api';
  
  return `${protocol}://${host}:${port}/${path}`;
};
```

#### 5. Vite Development Server Configuration

Located at `vite.config.ts`, this configuration:

- Reads environment variables for port settings
- Configures development server port
- Sets up proxy for API requests to avoid CORS issues during development

```typescript
// Example code snippet
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = parseInt(env.VITE_PORT || '5173', 10);
  
  return {
    // ...config
    server: {
      port: port,
      // ...other settings
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
  };
});
```

## Cross-Domain Communication

### Authentication Flow

When running the frontend and backend on different domains:

1. **Cookie-Based Authentication**:
   - Backend sets authentication cookies with the proper domain
   - Sanctum stateful domains include the frontend domain
   - CORS configuration allows credentials from the frontend domain

2. **CSRF Protection**:
   - Frontend fetches CSRF cookie from `/sanctum/csrf-cookie` endpoint
   - All subsequent requests include the CSRF token
   - Backend verifies CSRF token to protect against attacks

### API Request Flow

1. Frontend makes request to backend API
2. Request includes authentication cookies and CSRF token
3. CORS middleware validates the origin against the allowed list
4. Sanctum middleware authenticates the request
5. Backend processes the request and returns a response
6. CORS middleware adds appropriate headers to the response
7. Frontend receives and processes the response

## Setting Up Development Environment

### Recommended Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chatwise-ai-assistant
   ```

2. **Install dependencies and configure the environment**:
   ```bash
   node install.js
   ```

3. **Start the development servers**:
   ```bash
   # Option 1: Start both servers concurrently
   npm run dev:all
   
   # Option 2: Start servers in separate terminals
   # Terminal 1
   npm run dev:backend
   
   # Terminal 2
   npm run dev:frontend
   ```

### Advanced Configuration for Different Hosts

If you need to run the frontend and backend on different machines:

1. **Backend machine**:
   ```bash
   cd backend
   # Update .env with your IP or domain
   APP_URL=http://backend-server.example.com
   FRONTEND_URL=http://frontend-server.example.com
   SANCTUM_STATEFUL_DOMAINS=frontend-server.example.com
   
   # Apply configuration
   php artisan config:clear
   php artisan serve --host=0.0.0.0
   ```

2. **Frontend machine**:
   ```bash
   # Update .env with backend location
   VITE_API_URL=http://backend-server.example.com/api
   
   # Start development server
   npm run dev -- --host
   ```

## Production Deployment

### Recommended Production Setup

For production, it's recommended to:

1. **Backend**:
   - Deploy Laravel backend using a proper web server (Nginx, Apache)
   - Set up SSL certificates for secure communication
   - Configure environment variables for production settings

2. **Frontend**:
   - Build the frontend assets:
     ```bash
     npm run build
     ```
   - Deploy the built assets to a web server or CDN
   - Configure the environment to point to the production backend

### Environment Configuration for Production

#### Backend (.env)

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
SANCTUM_STATEFUL_DOMAINS=app.example.com
```

#### Frontend (.env)

```
VITE_API_URL=https://api.example.com/api
```

## Troubleshooting Common Issues

### CORS Issues

If experiencing CORS errors, check:

1. That the frontend domain is listed in allowed origins in `config/cors.php`
2. That the frontend domain is included in `SANCTUM_STATEFUL_DOMAINS`
3. That the `credentials` option is set to `include` in frontend API requests
4. That the backend is correctly configured to accept the frontend's origin

### Authentication Issues

If authentication is failing:

1. Check that cookies are being properly set and sent
2. Verify that the frontend is included in `SANCTUM_STATEFUL_DOMAINS`
3. Ensure HTTPS is properly configured in production
4. Check that the API client is configured to send credentials

### Port Conflict Issues

If experiencing port conflicts:

1. Use the `SyncPorts` command to switch to available ports
2. Ensure no other applications are using the same ports
3. Verify that your firewall allows traffic on the selected ports 