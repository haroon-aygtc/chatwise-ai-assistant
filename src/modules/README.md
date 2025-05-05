
# Modules Architecture

This directory contains the modular architecture of the application. Each module is self-contained with its own:

- Components
- Services
- Types
- Hooks
- Utils

## Module Structure

Each module follows this structure:
- `components/`: UI components specific to this module
- `services/`: API services and business logic
- `types/`: TypeScript interfaces and types
- `hooks/`: Custom React hooks
- `utils/`: Utility functions
- `index.ts`: Exports all public interfaces of the module

## Available Modules

- `auth`: Authentication and authorization
- `users`: User management
- `roles`: Role and permission management
- `common`: Shared components and utilities
