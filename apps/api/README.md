# apps/api — .NET Web API

.NET 9 Web API with EF Core, JWT auth, Scalar OpenAPI, and Aspire ServiceDefaults.

## Run

```bash
dotnet run
```

- API: http://localhost:5000
- Scalar (dev): http://localhost:5000/scalar
- Health: http://localhost:5000/health

## Configuration (`appsettings.json`)

| Section | Purpose |
|---------|---------|
| `Database:Provider` | `Sqlite`, `SqlServer`, or `PostgreSQL` |
| `Database:ConnectionString` | Provider connection string |
| `WebOrigin` / `WebOrigins` | CORS allowed origins |
| `Jwt` | Signing key, issuer, audience |
| `Seed` | Dev admin user credentials |

Use user-secrets in development for `Jwt:Secret`:

```bash
dotnet user-secrets set "Jwt:Secret" "your-secret-key-at-least-32-chars"
```

## Migrations

```bash
export PATH="$PATH:$HOME/.dotnet/tools"
dotnet ef migrations add MigrationName --project apps/api
dotnet ef database update --project apps/api
```

## Auth endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login` | Anonymous |
| POST | `/api/auth/register` | Anonymous |
| GET | `/api/auth/me` | Bearer |

CRUD controllers inherit `[Authorize]` from `BaseController<T>`.

## Tests

```bash
dotnet test ../api.tests/Api.Tests.csproj
```
