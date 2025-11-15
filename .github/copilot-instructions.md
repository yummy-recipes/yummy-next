# GitHub Copilot Instructions for Yummy Recipes

## Project Overview

This is a Next.js-based recipe website called "Kuchnia Yummy" (Yummy Kitchen). The application allows users to browse recipes by category, search for recipes, and view detailed recipe information including ingredients and instructions.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest
- **Search**: Algolia
- **Analytics**: Statsig
- **Error Tracking**: Sentry
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Font**: Exo (Google Fonts)

## Code Style and Conventions

### General Guidelines

- Use TypeScript for all new code
- Follow strict TypeScript configuration
- Use functional components with React hooks
- Prefer async/await over promises
- Use absolute imports with `@/` prefix (configured in tsconfig.json)

### Formatting

- Code formatting is handled by Prettier (default config)
- Run `yarn pretty` to format code
- ESLint is configured with Next.js and Prettier presets
- Run `yarn lint` to check for linting issues
- Husky pre-commit hooks enforce formatting via lint-staged

### Component Structure

- Components are organized in `src/components/` with one folder per component
- Each component folder contains the component file and related files
- Use React Server Components by default in the App Router
- Mark components with "use client" directive only when needed (for interactivity, hooks, browser APIs)

### File Naming

- Use kebab-case for folders and files: `recipe-list-item/recipe-list-item.tsx`
- Use PascalCase for component names in code: `RecipeListItem`

## Architecture Patterns

### App Router Structure

- Routes are defined in `src/app/` using the Next.js App Router
- `page.tsx` files define route pages
- `layout.tsx` files define shared layouts
- `route.ts` files define API routes
- Dynamic routes use bracket syntax: `[categorySlug]/[recipeSlug]/page.tsx`

### Data Fetching

- Use Prisma Client for database queries
- Database is SQLite in development (`prisma/dev.db`)
- Prisma schema is defined in `prisma/schema.prisma`
- Use Server Components to fetch data directly in components
- Use React Query (@tanstack/react-query) for client-side data fetching when needed

### Database Models

Key models in the Prisma schema:
- `Recipe`: Main recipe entity with title, slug, images, preparation time, etc.
- `Category`: Recipe categories (e.g., desserts, main dishes)
- `Tag`: Recipe tags for filtering
- `RecipeIngredientBlock`: Ingredient lists for recipes
- `RecipeInstructionBlock`: Cooking instructions for recipes
- `RecipeGalleryImage`: Additional recipe images

### Search Functionality

- Algolia is used for search functionality
- Search component is located in `src/components/search/`
- Speech recognition is supported via react-speech-recognition

### Styling

- Use Tailwind CSS utility classes
- Responsive design with mobile-first approach
- Common breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Max width container: `max-w-7xl mx-auto px-4 md:px-8 2xl:px-0`

## Common Commands

### Development

```bash
yarn dev          # Start development server (http://localhost:3000)
yarn build        # Build for production
yarn start        # Start production server
yarn test         # Run tests with Vitest
yarn lint         # Run ESLint
yarn pretty       # Format code with Prettier
```

### Database

```bash
yarn prisma studio    # Open Prisma Studio to explore data
yarn prisma migrate deploy  # Run database migrations
yarn seed            # Seed database with dummy data
```

### Scripts

```bash
yarn pull            # Import data from external source
yarn generate:blur   # Generate blur placeholders for images
yarn reindex         # Reindex search data in Algolia
```

### Storybook

```bash
yarn storybook       # Start Storybook dev server
yarn build-storybook # Build Storybook for production
```

## Testing Guidelines

- Write tests using Vitest
- Test files should be co-located with source files or in `__tests__` directories
- Use descriptive test names
- Mock external dependencies when appropriate
- Run `yarn test` to execute tests

## Environment Variables

The application uses environment variables for:
- Statsig configuration (`NEXT_PUBLIC_STATSIG_CLIENT_KEY`, `STATSIG_SERVER_KEY`)
- Sentry error tracking
- Algolia search configuration
- Other external services

Check for `.env.local` or environment-specific configuration files.

## Image Handling

- Custom image loader configured in `image-loader.js`
- Images are hosted on GraphCMS (**.graphassets.com)
- Blur placeholders are generated for better UX
- Use Next.js `Image` component for optimized images

## Internationalization

- Content is primarily in Polish language
- Text content uses Polish labels and descriptions

## CI/CD

- GitHub Actions workflows are in `.github/workflows/`
- CI runs tests, linting, and builds on PRs and master branch
- Deployment happens automatically on master branch after successful build and tests

## When Making Changes

1. Ensure TypeScript types are correct (run `yarn build` to check)
2. Run `yarn lint` to check for linting issues
3. Run `yarn pretty` to format code
4. Run `yarn test` to ensure tests pass
5. Consider database schema changes carefully - migrations should be additive when possible
6. Test responsive design at different breakpoints
7. Verify that Server Components remain server-side unless client interactivity is needed

## Best Practices

- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks or utility functions
- Use TypeScript types instead of `any`
- Optimize images using Next.js Image component
- Follow Next.js App Router conventions for data fetching
- Use Prisma for all database operations
- Keep business logic in server components when possible
- Minimize client-side JavaScript bundle size
