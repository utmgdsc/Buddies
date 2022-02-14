using Buddies.API.Database;
using Buddies.API.Entities;
using Buddies.API.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    // workaround for unreleased fix https://github.com/dotnet/aspnetcore/issues/17999
    .AddNewtonsoftJson(options => options.UseCamelCasing(true));

// route matching is always case insensitive, this is just for how routes are displayed in OpenAPI
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

// URL versioning
builder.Services.AddApiVersioning();

// Postgres DB connection

var connectionString = builder.Configuration.GetConnectionString("ApiContext");

builder.Services.AddDbContext<ApiContext>(options => options.UseNpgsql(connectionString));

// set up authentication
builder.Services.AddIdentity<User, Role>(options => options.User.RequireUniqueEmail = true)
    .AddEntityFrameworkStores<ApiContext>()
    .AddErrorDescriber<CustomIdentityErrorDescriber>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.KnownProxies.Add(IPAddress.Parse("10.0.0.100"));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// for test project DI
public partial class Program {}