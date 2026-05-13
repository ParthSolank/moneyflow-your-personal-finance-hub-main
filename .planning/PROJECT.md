# Project: MoneyFlow

## Vision
Transform MoneyFlow from a frontend prototype into a scalable SaaS-grade AI-powered personal finance platform.

## Technology Stack
- **Frontend**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, React Query, Recharts.
- **Backend**: .NET 8 Web API, Entity Framework Core, PostgreSQL, JWT Authentication.
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API).

## Core Features
- **Auth**: JWT-based authentication with ASP.NET Identity.
- **Accounts**: Multi-account management with live balance calculation.
- **Transactions**: Full CRUD with filtering and optimistic updates.
- **Analytics**: Dashboard with category spending and monthly trends.
- **AI Import**: CSV statement parsing and auto-mapping.
- **Budgeting**: Monthly budgets with progress tracking and alerts.

## Guiding Principles
- **User-Scoped Data**: Every entity must be strictly scoped to the authenticated user.
- **Clean Architecture**: Separation of concerns using Domain-Driven Design principles.
- **Performance**: Optimistic UI updates and efficient backend logic.
- **Security**: Robust validation, secure JWT storage, and CORS protection.
