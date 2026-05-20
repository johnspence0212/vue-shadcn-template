using Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

await app.MigrateAndSeedAsync();
app.UseApiPipeline();
app.MapDefaultEndpoints();

app.Run();

public partial class Program;
