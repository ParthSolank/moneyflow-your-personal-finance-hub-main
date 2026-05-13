# Conventions

## Code Style
- **Components**: Functional components with Hooks.
- **File Naming**: PascalCase for components (`AppLayout.tsx`), camelCase for others (`client.ts`).
- **Styling**: Tailwind CSS classes directly in JSX.
- **State**: `useState` for local UI state, `useQuery`/`useMutation` (planned) for server state.

## Patterns
- **Imports**: Use `@/` alias for absolute paths from `src/`.
- **UI**: shadcn/ui components for consistent design.
- **Icons**: Lucide React.

## Error Handling
- (Current): Basic conditional rendering or silent failures.
- (Planned): Global exception handling on backend, toast notifications on frontend.

## Data Fetching
- (Current): Local state with mock data.
- (Planned): React Query calling .NET 8 Web API.
