using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Api.Data;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerConfiguration();
        services.AddDatabaseConfiguration(configuration);
        services.AddCorsConfiguration(configuration);
        
        // Add your application services here
        // services.AddScoped<IMyService, MyService>();
        
        return services;
    }

    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Budget API",
                Version = "v1",
                Description = "Budget Management API"
            });
        });
        
        return services;
    }

    public static IServiceCollection AddDatabaseConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=budget.db";
            
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(connectionString));
            
        return services;
    }

    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var frontendUrl = configuration.GetValue<string>("FrontendUrl") 
            ?? "http://localhost:5173";
            
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(frontendUrl)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });
        
        return services;
    }
}
