using Buddies.API.Database;
using Buddies.API.Entities;
using Buddies.API.IO;
using Buddies.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
using System.Net;
using Microsoft.Extensions.ML;
using Buddies.API.DataModels;

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
// set up services
builder.Services.AddScoped<TokenService>();

// set up Cookie refresh token & JWT access token
builder.Services.AddAuthentication(options =>
    {
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    // long term refresh token
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest; // DEV = HTTP, PROD = HTTPS
        options.Cookie.SameSite = SameSiteMode.Strict;
    })
    // short term access token
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// prediction engine
builder.Services.AddPredictionEnginePool<BuddyRating, BuddyRatingPrediction>()
    .FromFile(modelName: "BuddyRecommenderModel", filePath: "MLModels/BuddyRecommenderModel.zip", watchForChanges: true);

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
} else {
    app.UseForwardedHeaders();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// for test project DI
public partial class Program {}