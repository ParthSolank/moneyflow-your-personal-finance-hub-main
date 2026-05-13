# Roadmap

## Phase 1: Foundation & Backend Architecture
- **Goal**: Set up the .NET 8 solution with Clean Architecture and PostgreSQL.
- **Tasks**:
  - Initialize .NET solution with Domain, Application, Infrastructure, and API projects.
  - Configure EF Core and PostgreSQL.
  - Implement Global Exception Handling and Logging.
  - Set up Swagger and API Versioning.

## Phase 2: Authentication & User Management
- **Goal**: Secure the application with JWT and ASP.NET Identity.
- **Tasks**:
  - Implement Identity User and Role entities.
  - Build Auth controller (Register, Login, Refresh).
  - Implement JWT middleware and Authorization policies.
  - Frontend: Auth provider and protected routes.

## Phase 3: Core Financial Modules (Accounts & Transactions)
- **Goal**: Implement CRUD for basic financial entities.
- **Tasks**:
  - Backend: Accounts CRUD and Balance calculation.
  - Backend: Transactions CRUD with advanced filtering.
  - Frontend: Integrate Accounts and Transactions with React Query.
  - Implement optimistic updates for better UX.

## Phase 4: Analytics & Dashboard
- **Goal**: Visualize financial data.
- **Tasks**:
  - Backend: Analytics endpoints (Monthly stats, Category breakdown).
  - Frontend: Recharts implementation in Dashboard.
  - Responsive analytics cards.

## Phase 5: Budgeting & Alerts
- **Goal**: Add financial planning features.
- **Tasks**:
  - Backend: Budget CRUD and Limit tracking.
  - Frontend: Budgeting UI and progress indicators.

## Phase 6: AI Statement Import
- **Goal**: Automate transaction entry.
- **Tasks**:
  - Backend: CSV parsing and mapping logic.
  - Frontend: Upload UI with preview and confirmation.

## Phase 7: Polish, Security & DevOps
- **Goal**: Prepare for production.
- **Tasks**:
  - Dockerize the application.
  - Implement Rate Limiting and CORS.
  - Skeleton loaders, empty states, and accessibility improvements.
  - Final UAT and bug fixes.
