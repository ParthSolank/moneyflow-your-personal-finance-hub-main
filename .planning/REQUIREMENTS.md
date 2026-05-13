# Requirements

## REQ-01: Authentication & Authorization
- [ ] JWT-based auth system in .NET 8.
- [ ] Register/Login APIs with password hashing (ASP.NET Identity).
- [ ] Refresh token support.
- [ ] Role-based authorization.
- [ ] Secure protected routes in React frontend.
- [ ] Persist sessions (Refresh token rotation).

## REQ-02: Database Design
- [ ] PostgreSQL database setup.
- [ ] EF Core migrations.
- [ ] Entities: Users, Accounts, Transactions, Categories, Budgets, Imports.
- [ ] User-scoped data isolation.

## REQ-03: Backend Architecture
- [ ] Clean Architecture structure (Domain, Application, Infrastructure, API).
- [ ] Repository pattern & CQRS (MediatR).
- [ ] FluentValidation & AutoMapper.
- [ ] Serilog logging & Global Exception Handling.
- [ ] Swagger/OpenAPI with Versioning.

## REQ-04: Transactions Module
- [ ] Backend: Complete CRUD APIs for transactions.
- [ ] Backend: Filter by date, category, account, type.
- [ ] Frontend: Replace mock data with React Query.
- [ ] Frontend: Optimistic updates for CRUD operations.

## REQ-05: Accounts / Ledgers
- [ ] Backend: CRUD APIs for accounts.
- [ ] Backend: Balance calculation logic.
- [ ] Frontend: Account management and live balance updates.

## REQ-06: Dashboard Analytics
- [ ] Backend: Analytics APIs (total balance, income/expense, trends).
- [ ] Frontend: Recharts implementation for spending and trends.

## REQ-07: AI Statement Import
- [ ] Backend: CSV upload and parsing service.
- [ ] Backend: Auto transaction mapping.
- [ ] Frontend: Drag-and-drop UI with preview.

## REQ-08: Budgeting System
- [ ] Backend: Monthly budget management.
- [ ] Frontend: Progress indicators and limit alerts.

## REQ-09: Security & DevOps
- [ ] Input validation & SQLi protection.
- [ ] Rate limiting & CORS configuration.
- [ ] Docker & Docker Compose setup.
- [ ] Environment configurations (appsettings.json).

## REQ-10: UI/UX Improvements
- [ ] Mobile responsive layout.
- [ ] Skeleton loaders & Toast notifications.
- [ ] Dark/Light theme support.
