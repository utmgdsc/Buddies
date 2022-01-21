using Buddies.API.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// route matching is always case insensitive, this is just for how routes are displayed in OpenAPI
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

// URL versioning
builder.Services.AddApiVersioning();

// Postgres DB connection

var connectionString = builder.Configuration.GetConnectionString("ApiContext");

builder.Services.AddDbContext<ApiContext>(options => options.UseNpgsql(connectionString));

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
