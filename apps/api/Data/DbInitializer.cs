using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context, IConfiguration configuration)
    {
        await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
        {
            return;
        }

        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@template.local";
        var adminPassword = configuration["Seed:AdminPassword"] ?? "AdminPassword123!";
        var hasher = new PasswordHasher<User>();

        var admin = new User
        {
            Email = adminEmail,
            DisplayName = "Administrator",
            PasswordHash = hasher.HashPassword(null!, adminPassword)
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}
