using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ModelContextProtocol.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

var authority = $"https://{builder.Configuration["Auth0:Domain"]}/";
var audience = builder.Configuration["Auth0:Audience"];
var mcpServerBaseUrl = builder.Configuration["McpServer:BaseUrl"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultChallengeScheme = McpAuthenticationDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = authority;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = audience,
        ValidIssuer = authority
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully.");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        }
    };
})
.AddMcp(options =>
{
    options.ResourceMetadata = new()
    {
        Resource = mcpServerBaseUrl ?? audience ?? string.Empty,
        AuthorizationServers = { authority },
        ScopesSupported = ["tool:getsystemstate", "tool:setsystemstate"],
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("GetSystemStatePolicy", policy =>
        policy.RequireClaim("permissions", "tool:getsystemstate"));

    options.AddPolicy("SetSystemStatePolicy", policy =>
        policy.RequireClaim("permissions", "tool:setsystemstate"));
});

// Add the MCP services: the transport to use (http) and the tools to register.
builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .AddAuthorizationFilters()
    .WithTools<RandomNumberTools>()
    .WithTools<SystemTools>();

var app = builder.Build();

app.MapMcp().RequireAuthorization();

app.Run(mcpServerBaseUrl);
