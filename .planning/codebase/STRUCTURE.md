# Structure

## Directory Layout

```
/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service clients (Supabase)
│   ├── lib/               # Utility functions and shared logic
│   ├── pages/             # Page components (routed)
│   ├── test/              # Test setup and utilities
│   ├── App.tsx            # Main application component & routes
│   ├── index.css          # Global styles (Tailwind)
│   └── main.tsx           # Entry point
├── .env                   # Environment variables
├── components.json        # shadcn/ui configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Locations
- **Pages**: `src/pages/`
- **Components**: `src/components/`
- **Supabase Client**: `src/integrations/supabase/client.ts`
- **Global Styles**: `src/index.css`
