# Concerns

## Technical Debt
- **Mock Data**: Most pages are currently using mock data and local state, which needs to be replaced with real API calls.
- **Supabase Dependency**: The project is currently wired for Supabase, but the requirement is to move to a custom .NET 8 backend with PostgreSQL.
- **Incomplete Features**: Several features (Budgeting, AI Import) are likely just UI shells or partially implemented.

## Security
- **Hardcoded Secrets**: `.env` contains Supabase keys (standard for client-side, but needs rotation if moved).
- **Validation**: Need robust Zod schemas for all forms to ensure data integrity before API calls.

## Infrastructure
- **Missing Backend**: No .NET backend currently exists in the workspace.
- **Deployment**: No Docker or CI/CD setup present yet.
