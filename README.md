# trackyHawkim

## Supabase setup

- Create a Supabase project and a table named `weeks` (or adjust the code to use your table name).
- Add at least one row with fields like `id`, `title`, `summary` for the UI to display.

## Environment variables

Copy `.env.example` to `.env.local` for local development, or set these variables in your hosting provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

For Vite the variables must be available at build time.

## Deployment notes

- For GitHub Pages: ensure `vite.config.ts` has `base: '/<repo-name>/'` (already set to `/trackyHawkim/`).
- Use the included GitHub Action to build and publish the `dist` folder, and add your Supabase keys to the repository secrets if you need server-side access.