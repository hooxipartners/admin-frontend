# Shadcn Admin

A modern admin dashboard built with React, TypeScript, and Shadcn UI.

## Environment Setup

This project supports multiple environments for API calls:

### Local Development
```bash
# Run with local environment
npm run dev:local
# or
pnpm dev:local
```

### Development Server
```bash
# Run with development environment
npm run dev:development
# or
pnpm dev:development
```

### Production Build
```bash
# Build for production
npm run build:production
# or
pnpm build:production
```

## Environment Variables

Create the following environment files in the project root:

### `.env.dev-local` (for local development)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### `.env.development` (for development server)
```env
VITE_API_BASE_URL=https://dev-api.yourdomain.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### `.env.production` (for production/operational environment)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

## Environment Modes

| Mode | Description | API URL | Use Case |
|------|-------------|---------|----------|
| `dev-local` | 로컬 개발 환경 | `http://localhost:3000/api` | 로컬 개발 |
| `development` | 개발 서버 환경 | `https://dev-api.yourdomain.com/api` | 개발 서버 테스트 |
| `production` | 운영 환경 | `https://api.yourdomain.com/api` | 실제 운영 서비스 |

## API Configuration

The project uses a centralized API client (`src/lib/api.ts`) that automatically:

- Sets the correct base URL based on the environment
- Adds authentication tokens to requests
- Handles common error responses (401, 403, 500)
- Provides predefined API endpoints

### Usage Example

```typescript
import { useUsers, useCreateUser } from '@/lib/api-hooks'

// In your component
const { data: users, isLoading } = useUsers()
const createUserMutation = useCreateUser()

// Create a new user
createUserMutation.mutate({
  name: 'John Doe',
  email: 'john@example.com'
})
```

## Available Scripts

- `dev` - Start development server (default mode)
- `dev:local` - Start development server with local environment
- `dev:development` - Start development server with development environment
- `build` - Build for production (default mode)
- `build:local` - Build for local environment
- `build:development` - Build for development environment
- `build:production` - Build for production environment
- `preview` - Preview production build
- `lint` - Run ESLint
- `format:check` - Check code formatting
- `format` - Format code
- `knip` - Run Knip for unused code detection

## Deployment

### Local Development
```bash
pnpm dev:local
```

### Development Server Deployment
```bash
pnpm build:development
# Deploy the dist folder to your development server
```

### Production Deployment
```bash
pnpm build:production
# Deploy the dist folder to your production server
```

The production build includes:
- Code minification with Terser
- Manual chunk splitting for better caching
- Optimized bundle size
- No source maps (for security)

# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

**Auth (partial):** [Clerk](https://go.clerk.com/GttUAaK)

## Run Locally

Clone the project

```bash
  git clone https://github.com/satnaing/shadcn-admin.git
```

Go to the project directory

```bash
  cd shadcn-admin
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Sponsoring this project ❤️

If you find this project helpful or use this in your own work, consider [sponsoring me](https://github.com/sponsors/satnaing) to support development and maintenance. You can [buy me a coffee](https://buymeacoffee.com/satnaing) as well. Don't worry, every penny helps. Thank you! 🙏

For questions or sponsorship inquiries, feel free to reach out at [contact@satnaing.dev](mailto:contact@satnaing.dev).

### Current Sponsor

- [Clerk](https://go.clerk.com/GttUAaK) - for backing the implementation of Clerk in this project

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
