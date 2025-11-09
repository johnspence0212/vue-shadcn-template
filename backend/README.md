# Backend

.NET Console Application with Entity Framework Core and SQLite for the Bookish Dollop personal finance application.

## Current Structure

```
backend/
├── Api/
│   ├── Models/
│   │   ├── BaseEntity.cs         # Base class with Id and CreatedAt
│   │   ├── Enums.cs              # Application enumerations
│   │   └── Income.cs             # Income entity
│   ├── Data/
│   │   ├── AppDbContext.cs       # Main database context
│   │   └── Configurations/
│   │       ├── BaseEntityConfiguration.cs
│   │       └── IncomeConfiguration.cs
│   ├── Program.cs                # Application entry point
│   └── Api.csproj
└── README.md
```

## Getting Started

1. Navigate to Api folder: `cd Api`
2. Restore dependencies: `dotnet restore`
3. Run the application: `dotnet run`

## Database

- **Provider**: SQLite
- **Database File**: `finance.db` (created automatically)
- **ORM**: Entity Framework Core

## Adding New Database Entities

Follow these 3 steps to add a new entity to the database:

### 1. Model Creation

Create your model in `Models/` folder inheriting from `BaseEntity`:

```csharp
// Models/Expense.cs
namespace Api.Models;

public class Expense : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public ExpenseCategory Category { get; set; } // Add to Enums.cs if needed
}
```

**Note**: `BaseEntity` provides `Id` (int) and `CreatedAt` (DateTime) automatically.

### 2. Configuration Creation

Create Entity Framework configuration in `Data/Configurations/`:

```csharp
// Data/Configurations/ExpenseConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations;

public class ExpenseConfiguration : BaseEntityConfiguration<Expense>
{
    public override void Configure(EntityTypeBuilder<Expense> builder)
    {
        // Call base to configure Id and CreatedAt
        base.Configure(builder);

        // Entity-specific configurations
        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(e => e.Category)
            .HasConversion<int>()  // Store enum as integer
            .IsRequired();

        // Optional: Set table name explicitly
        builder.ToTable("Expenses");
    }
}
```

### 3. AppDbContext Update

Add your entity as a DbSet in `Data/AppDbContext.cs`:

```csharp
public class AppDbContext : DbContext
{
    // ... existing code ...

    public DbSet<Income> Incomes { get; set; }
    public DbSet<Expense> Expenses { get; set; }  // Add this line

    // ... rest of class ...
}
```

**That's it!** The configuration is automatically discovered and applied thanks to:

```csharp
modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
```

### Configuration Guidelines

- **Inherit from BaseEntityConfiguration<T>** to get Id and CreatedAt setup automatically
- **Use HasMaxLength()** for string properties to set database column limits
- **Use HasColumnType("decimal(18,2)")** for money amounts
- **Use HasConversion<int>()** for enums to store as integers
- **Use IsRequired()** for non-nullable properties
- **Use ToTable()** to explicitly set table names

## Updating Database Schema

When you modify entity configurations or models, you need to update your database. Here are two approaches:

### Option 1: Fresh Start (Recommended for Development)

Best for early development when you don't have important data:

1. **Delete the existing database:**

   ```bash
   # From the Api directory
   rm budget.db
   ```

2. **Run the application:**

   ```bash
   dotnet run
   ```

3. **New database created** with updated schema automatically!

### Option 2: Entity Framework Migrations (Production Ready)

Use this approach when you have data you want to preserve:

1. **Install EF Tools globally (if not already installed):**

   ```bash
   dotnet tool install --global dotnet-ef
   ```

2. **Create a migration for your changes:**

   ```bash
   # From the Api directory
   dotnet ef migrations add YourMigrationName
   ```

3. **Apply the migration:**

   ```bash
   dotnet ef database update
   ```

4. **Your database is updated** while preserving existing data!

### When to Use Each Approach

- **Option 1 (Fresh Start)**: Early development, no important data, major schema changes
- **Option 2 (Migrations)**: Production environment, existing data, collaborative development

**Note**: The project currently uses `EnsureCreatedAsync()` for simplicity. For production applications, consider switching to migrations for better control and data preservation.

## Controllers & API Endpoints

The API uses a generic base controller pattern that automatically provides full CRUD operations for any entity.

### Adding New Controllers

To create a new API controller for an entity, simply inherit from `BaseController<T>`:

```csharp
// Controllers/ExpenseController.cs
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
public class ExpenseController : BaseController<Expense>
{
    public ExpenseController(AppDbContext context) : base(context)
    {
    }

    // All CRUD operations are inherited automatically!
    // Override any method for custom behavior if needed
}
```

### Automatic API Endpoints

Each controller inheriting from `BaseController<T>` automatically gets these endpoints:

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| GET    | `/api/{controller}`      | Get all entities  |
| GET    | `/api/{controller}/{id}` | Get entity by ID  |
| POST   | `/api/{controller}`      | Create new entity |
| PUT    | `/api/{controller}/{id}` | Update entity     |
| DELETE | `/api/{controller}/{id}` | Delete entity     |

### Example: Income API

- `GET /api/income` - Get all incomes
- `GET /api/income/1` - Get income with ID 1
- `POST /api/income` - Create new income
- `PUT /api/income/1` - Update income with ID 1
- `DELETE /api/income/1` - Delete income with ID 1

### Testing the API

1. **Start the API:**

   ```bash
   dotnet run
   ```

2. **Swagger UI:** Visit `http://localhost:5000/swagger` for interactive API documentation

3. **Postman Example - Create Income:**

   ```
   POST http://localhost:5000/api/income
   Content-Type: application/json

   {
     "name": "John's Salary",
     "amount": 5000,
     "type": 1
   }
   ```

### Custom Controller Behavior

Override base methods when you need custom logic:

```csharp
public class IncomeController : BaseController<Income>
{
    public IncomeController(AppDbContext context) : base(context) { }

    // Override for custom validation
    public override async Task<ActionResult<Income>> Post(Income income)
    {
        // Custom logic here
        if (income.Amount <= 0)
            return BadRequest("Amount must be positive");

        return await base.Post(income); // Call base implementation
    }

    // Add custom endpoints
    [HttpGet("total")]
    public async Task<ActionResult<decimal>> GetTotalIncome()
    {
        return await _dbSet.SumAsync(i => i.Amount);
    }
}
```

### BaseController Features

- ✅ **Generic CRUD operations** for any `BaseEntity`
- ✅ **Proper HTTP status codes** (200, 201, 400, 404)
- ✅ **Entity Framework integration**
- ✅ **Concurrency handling**
- ✅ **Virtual methods** for easy overriding
- ✅ **Automatic route generation**

## Technologies

- **.NET 9.0**
- **Entity Framework Core 9.0**
- **SQLite**
- **C# 12**

## Features

### Current

- Income tracking with Regular/Additional types
- SQLite database with EF Core
- Clean architecture with separated configurations
- Base entity pattern for common properties

### Planned

- Expense tracking
- Budget management
- Category system
- Reporting capabilities
