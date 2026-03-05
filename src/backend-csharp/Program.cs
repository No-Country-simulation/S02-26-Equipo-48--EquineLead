using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Services;
using Project_No_Country_E48.Data;

var builder = WebApplication.CreateBuilder(args);

// Fix para PostgreSQL timestamptz y DateTime.Now
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// ─── CONTROLLERS + JSON ────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Evitar ciclos de referencias en navegaciones EF
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Serializar enums como strings (ej: "B2B" en lugar de 2)
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ─── BASE DE DATOS (PostgreSQL) ────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ─── SERVICIOS DE NEGOCIO ─────────────────────────────────────────────────────
builder.Services.AddScoped<ScoreService>();
builder.Services.AddScoped<InteractionService>();

// ─── DATA SCIENCE HTTP CLIENT ─────────────────────────────────────────────────
// HttpClient tipado para llamar al FastAPI de Python
builder.Services.AddHttpClient<ScoringApiService>(client =>
{
    var baseUrl = builder.Configuration["DataScience:BaseUrl"]
                  ?? "http://localhost:8000";
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(10);
});

// ─── SCRAPPER HTTP CLIENT ───────────────────────────────────────────────────
builder.Services.AddHttpClient("ScrapperClient", client =>
{
    var baseUrl = builder.Configuration["Scrapper:BaseUrl"] ?? "http://localhost:8081";
    client.BaseAddress = new Uri(baseUrl);
});

// ─── SWAGGER / OPENAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── CORS ───────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowAll");

// Habilitar Swagger siempre en este hito para validación
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "EquineLead API V1");
    c.RoutePrefix = "swagger"; // Sirve en /swagger
});

app.UseStaticFiles(); // Necesario para el UI de Swagger en algunos entornos

if (app.Environment.IsDevelopment())
{
    // Bloque adicional si es necesario
}
else
{
    app.UseHttpsRedirection();
}
app.UseAuthorization();
app.MapControllers();
app.Run();
