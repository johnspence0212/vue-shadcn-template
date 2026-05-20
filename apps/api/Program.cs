using Api.Data;
using Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services using extension methods
builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.EnsureCreatedAsync();
}

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    Console.WriteLine("🌐 Swagger UI: http://localhost:5000/swagger");
}

app.UseCors("AllowFrontend");
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("🚀 Budget API Started!");
Console.WriteLine($"📊 Database: {builder.Configuration.GetConnectionString("DefaultConnection") ?? "budget.db"}");
Console.WriteLine($"� Allowing CORS from: {builder.Configuration.GetValue<string>("FrontendUrl") ?? "http://localhost:5173"}");

app.Run();