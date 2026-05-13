# Architecture

## Overview
The project is a React-based Single Page Application (SPA) currently using Supabase as a Backend-as-a-Service (BaaS).

## Patterns & Principles
- **Component-Based UI**: Built with React and shadcn/ui.
- **Client-Side Routing**: Handled by `react-router-dom`.
- **Server State**: Managed by `@tanstack/react-query`.
- **Type Safety**: End-to-end type safety using TypeScript and Zod.
- **BaaS Layer**: Supabase handles Authentication, Database (PostgreSQL), and Realtime features.

## Data Flow
1. **User Interaction**: User interacts with a component (e.g., Dashboard).
2. **Hook Execution**: Component uses a custom hook or React Query to fetch/mutate data.
3. **API Call**: React Query calls the Supabase client.
4. **State Update**: React Query updates the cache and triggers a re-render.

## Entry Points
- **Main**: `src/main.tsx` - Initializes the React app and wraps it in providers (QueryClientProvider, etc.).
- **App**: `src/App.tsx` - Defines routes and global layout.
