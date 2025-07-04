# Supabase Type Generation Scripts

This directory contains scripts to automatically generate TypeScript types from your Supabase database schema.

## Scripts

### 1. Shell Script (`generate-types.sh`)

The main script for generating types from your remote Supabase database.

### 2. TypeScript Script (`generate-types.ts`)

An alternative TypeScript implementation of the type generation script.

## Usage

### Prerequisites

1. **Install Supabase CLI** (if not already installed):

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:

   ```bash
   supabase login
   ```

3. **Set up environment variables** in your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
   SUPABASE_ACCESS_TOKEN=your_access_token
   ```

### Generate Types from Remote Database

```bash
npm run generate-types
```

### Generate Types from Local Database

If you're running Supabase locally:

```bash
npm run generate-types:local
```

### Using the TypeScript Script

```bash
npm run generate-types:ts
```

## Output

The scripts will:

1. Create a `src/types` directory if it doesn't exist
2. Generate `src/types/supabase.ts` with your database types
3. Add a header comment with generation timestamp
4. Provide helpful usage instructions

## Using Generated Types

After running the script, you can import and use the types in your components:

```typescript
import type { Database } from "@/types/supabase";

// Use the types
type User = Database["public"]["Tables"]["users"]["Row"];
type NewUser = Database["public"]["Tables"]["users"]["Insert"];
type UpdateUser = Database["public"]["Tables"]["users"]["Update"];
```

## When to Run

- **After schema changes**: Run whenever you modify your database schema
- **After adding new tables/columns**: To get the latest type definitions
- **During development**: To ensure your types are up to date
- **Before deployment**: To make sure your production types match your schema

## Troubleshooting

### "Project ID not found" error

Make sure your `NEXT_PUBLIC_SUPABASE_PROJECT_ID` is set correctly in your environment variables.

### "Access token not set" warning

Run `supabase login` to authenticate with Supabase CLI.

### Permission denied error

Make sure the shell script is executable:

```bash
chmod +x scripts/generate-types.sh
```

### Types not updating

Try clearing the generated file and regenerating:

```bash
rm src/types/supabase.ts
npm run generate-types
```
