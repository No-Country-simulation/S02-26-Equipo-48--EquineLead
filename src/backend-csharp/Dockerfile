# ============================================================
# Backend C# - Dockerfile
# Build multi-etapa para .NET 8.0
# ============================================================

# --- Etapa 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar csproj y restaurar dependencias primero (cache de capas)
COPY *.csproj ./
RUN dotnet restore

# Copiar el resto del código y compilar
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# --- Etapa 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiar solo el artefacto de publicación
COPY --from=build /app/publish .

# Exponer el puerto HTTP (ASPNETCORE_URLS lo sobreescribe docker-compose)
EXPOSE 80

ENTRYPOINT ["dotnet", "Project-No-Country-E48.dll"]
