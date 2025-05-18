# Authentication Module

This module provides a centralized authentication system for the application. It includes services for token management, authentication API calls, and React context/hooks for authentication state management.

## Structure

- **services/** - Authentication-related services
  - `authService.ts` - Service for handling authentication API calls
  - `tokenService.ts` - Service for managing authentication tokens
  
- **hooks/** - React hooks for authentication
  - `useAuth.tsx` - Hook and context provider for authentication state
  
- **components/** - Authentication-related components
  - `ProtectedRoute.tsx` - Component for protecting routes based on authentication status
  - Other auth components (login forms, etc.)
  
- **types.ts** - TypeScript types for authentication

## Usage

### Authentication Context

Wrap your application with the `AuthProvider` to provide authentication state:

```tsx
import { AuthProvider } from '@/modules/auth/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### Using Authentication State

Use the `useAuth` hook to access authentication state and functions:

```tsx
import { useAuth } from '@/modules/auth/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    signup,
    hasRole,
    hasPermission,
    updateUser,
    refreshAuth
  } = useAuth();
  
  // Use authentication state and functions
}
```

### Protecting Routes

Use the `ProtectedRoute` component to protect routes:

```tsx
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>

// With role or permission requirements
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

### Direct API Calls

You can also use the auth services directly:

```tsx
import authService from '@/modules/auth/services/authService';
import tokenService from '@/modules/auth/services/tokenService';

// Check if token is valid
const isValid = tokenService.validateToken();

// Make auth API calls
const login = async () => {
  try {
    const response = await authService.login('user@example.com', 'password', true);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

## Authentication Flow

1. User logs in with credentials
2. Server validates credentials and returns a JWT token
3. Token is stored in localStorage (if remember me) or sessionStorage
4. Token is included in API requests via Authorization header
5. Protected routes check authentication status before rendering
6. Token expiration is checked periodically
7. User is logged out when token expires

## Token Management

The token service handles:

- Storing tokens in localStorage or sessionStorage
- Retrieving tokens
- Validating tokens
- Checking token expiration
- Decoding token payload
- CSRF token management for Laravel Sanctum

## Error Handling

Authentication errors are handled consistently:

- Login/signup errors show toast notifications
- Expired tokens trigger automatic logout
- API 401 responses redirect to login page
- API 419 responses (CSRF token mismatch) refresh the page
