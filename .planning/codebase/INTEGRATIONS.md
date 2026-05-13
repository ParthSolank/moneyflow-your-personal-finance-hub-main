# Integrations

## External Services

### Supabase
- **URL**: `https://nzfmjoufofppjoqhaoly.supabase.co`
- **Purpose**: Current backend provider for Authentication and PostgreSQL database.
- **Client**: `@supabase/supabase-js`
- **Configuration**: `src/integrations/supabase/client.ts`

## Data Sources
- **Bank Statements**: AI Statement Import (planned/prototype in `src/components/StatementImport.tsx` - hypothetical, need to check)

## Authentication
- **Provider**: Supabase Auth (JWT based)
- **Flow**: Register/Login via Supabase client.
