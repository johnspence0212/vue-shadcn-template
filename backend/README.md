# Backend API

ASP.NET Core Web API with Entity Framework Core and SQLite.

## 🚀 Quick Start

1. **Navigate to the API folder:**

   ```bash
   cd backend/Api
   ```

2. **Restore dependencies:**

   ```bash
   dotnet restore
   ```

3. **Run the application:**

   ```bash
   dotnet run
   ```

4. **Access Swagger UI:**
   Open `http://localhost:5000/swagger` in your browser

## 📁 Project Structure

```
backend/Api/
├── Controllers/
│   └── BaseController.cs         # Generic CRUD controller
├── Data/
│   ├── AppDbContext.cs          # Database context
│   └── Configurations/
│       └── BaseEntityConfiguration.cs
├── Extensions/
│   └── ServiceCollectionExtensions.cs  # DI setup
├── Models/
│   └── BaseEntity.cs            # Base class with Id/CreatedAt
├── Program.cs                    # Entry point
├── appsettings.json             # Configuration
└── Api.csproj
```

## ⚙️ Configuration

### Database Settings

Edit `appsettings.json` to configure your database:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=budget.db" // Change database name here
  },
  "FrontendUrl": "http://localhost:5173"
}
```

**Database Provider:** SQLite (no installation required)  
**Database File:** Created automatically in `backend/Api/` folder

## 📦 Adding a New Entity

Follow these 3 simple steps:

### Step 1: Create the Model

Create your model in `Models/` folder, inheriting from `BaseEntity`:

```csharp
// Models/Task.cs
namespace Api.Models;

public class Task : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? DueDate { get; set; }
}
```

> **Note:** `BaseEntity` automatically provides `Id` (int) and `CreatedAt` (DateTime)

### Step 2: Configure the Entity

Create a configuration file in `Data/Configurations/`:

```csharp
// Data/Configurations/TaskConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations;

public class TaskConfiguration : BaseEntityConfiguration<Task>
{
    public override void Configure(EntityTypeBuilder<Task> builder)
    {
        base.Configure(builder);  // Configures Id and CreatedAt

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.ToTable("Tasks");
    }
}
```

**Common Configuration Patterns:**

- `IsRequired()` - Makes property non-nullable
- `HasMaxLength(n)` - Sets max string length
- `HasColumnType("decimal(18,2)")` - For money/decimal values
- `HasConversion<int>()` - Stores enums as integers
- `ToTable("Name")` - Sets table name

### Step 3: Add DbSet to Context

Add your entity to `Data/AppDbContext.cs`:

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Add your new DbSet here
    public DbSet<Task> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurations are auto-discovered
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

**Done!** Restart the app and your new table will be created automatically.

## 🔄 Updating the Database

When you add or modify entities:

### Development (Quick Reset)

```bash
# Delete the database file
rm budget.db

# Restart the app - database recreates automatically
dotnet run
```

### Production (Migrations - Coming Soon)

For preserving data in production, you'll want to use EF Core migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

> **Current Setup:** Uses `EnsureCreatedAsync()` for simplicity - perfect for development!

## 🎮 Adding a Controller

Controllers are automatically generated with full CRUD operations using `BaseController<T>`.

### Create a Controller

```csharp
// Controllers/TaskController.cs
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
public class TaskController : BaseController<Task>
{
    public TaskController(AppDbContext context) : base(context) { }

    // That's it! All CRUD endpoints are inherited automatically
}
```

### Automatic Endpoints

Your controller instantly gets these REST endpoints:

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/task`      | Get all tasks  |
| GET    | `/api/task/{id}` | Get task by ID |
| POST   | `/api/task`      | Create task    |
| PUT    | `/api/task/{id}` | Update task    |
| DELETE | `/api/task/{id}` | Delete task    |

### Testing Your API

**Option 1: Swagger UI (Recommended)**

1. Run `dotnet run`
2. Visit `http://localhost:5000/swagger`
3. Test all endpoints interactively

**Option 2: HTTP Client**

```http
# Create a task
POST http://localhost:5000/api/task
Content-Type: application/json

{
  "title": "Complete README",
  "isCompleted": false
}
```

### Custom Endpoints (Optional)

Add custom logic when needed:

```csharp
public class TaskController : BaseController<Task>
{
    public TaskController(AppDbContext context) : base(context) { }

    // Add custom endpoint
    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<Task>>> GetCompleted()
    {
        var completed = await _dbSet
            .Where(t => t.IsCompleted)
            .ToListAsync();
        return Ok(completed);
    }

    // Override base behavior
    public override async Task<ActionResult<Task>> Post(Task task)
    {
        // Add validation
        if (string.IsNullOrWhiteSpace(task.Title))
            return BadRequest("Title is required");

        return await base.Post(task);
    }
}
```

## 🛠️ Tech Stack

- **.NET 9.0** - Modern web framework
- **Entity Framework Core** - ORM
- **SQLite** - Lightweight database
- **Swagger** - API documentation

## 🏗️ Architecture Features

- ✅ **Generic Base Controller** - Instant CRUD for any entity
- ✅ **Base Entity Pattern** - Consistent Id/CreatedAt across all models
- ✅ **Configuration Classes** - Clean EF Core setup
- ✅ **Dependency Injection** - Organized service registration
- ✅ **CORS Configured** - Ready for frontend integration
- ✅ **Swagger UI** - Interactive API testing

## 📝 Common Tasks

### Change Database Name

Edit `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=myapp.db"
}
```

### Change Frontend URL

Edit `appsettings.json`:

```json
"FrontendUrl": "http://localhost:3000"
```

### Add New Service

Edit `Extensions/ServiceCollectionExtensions.cs`:

```csharp
public static IServiceCollection AddApiServices(...)
{
    // Add your services here
    services.AddScoped<IMyService, MyService>();

    return services;
}
```

## 🚦 Getting Help

- **Swagger UI:** `http://localhost:5000/swagger` - View all endpoints
- **Database File:** Located in `backend/Api/` folder
- **Logs:** Check console output when running the app

---

**Happy Coding! 🎉**
