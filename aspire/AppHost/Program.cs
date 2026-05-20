var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.Api>("api")
    .WithHttpHealthCheck("/health");

// Must end with /api — see apps/web/src/lib/apiBaseUrl.ts
var apiBaseUrl = ReferenceExpression.Create($"{api.GetEndpoint("http")}/api");

var web = builder.AddViteApp("web", "../../apps/web")
    .WithReference(api)
    .WaitFor(api)
    .WithEnvironment("VITE_API_BASE_URL", apiBaseUrl)
    .WithEnvironment("VITE_API_PROXY_TARGET", api.GetEndpoint("http"))
    .WithExternalHttpEndpoints();

builder.Build().Run();
