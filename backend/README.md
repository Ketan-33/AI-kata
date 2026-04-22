# Podcast Planner Backend

Node.js + Express + Prisma + SQLite backend for the Podcast Episode Planner.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Database**: SQLite with Prisma ORM
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Testing**: Jest + Supertest

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Seed data
├── src/
│   ├── config/
│   │   └── database.js    # Prisma client instance
│   ├── controllers/       # Business logic
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── errorHandler.js
│   ├── routes/           # API route definitions
│   ├── services/         # External services (AI, etc.)
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── errors.js     # Custom error classes
│   └── index.js          # Server entry point
├── __tests__/            # Jest tests
├── .env.example
└── package.json
```

## Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Seed database** (optional):
   ```bash
   npm run prisma:seed
   ```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Open Prisma Studio (DB GUI)
npm run prisma:studio
```

## API Conventions

### Authentication
- Use `Authorization: Bearer <token>` header
- `requireAuth` middleware sets `req.user = { id, email }`

### Response Format
**Success**:
```json
{ "data": {...}, "page": 1, "pageSize": 10, "total": 50 }
```
or just the resource object for single items.

**Error**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {...}
  }
}
```

### Error Handling
- Use error helpers from `utils/errors.js`: `badRequest()`, `unauthorized()`, `notFound()`, etc.
- Wrap async routes with `asyncHandler()`
- Never use `res.status().json()` for errors directly

### Validation
- Use Zod schemas at controller boundaries
- Validate all inputs before processing

### Ownership
- Every resource must check `ownerId === req.user.id`

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_field_name

# Reset database (dev only)
npx prisma migrate reset
```

## Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL`: SQLite connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration (e.g., "7d")
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js
```

Test files should be placed in `__tests__/` directory and follow the naming convention `*.test.js`.
