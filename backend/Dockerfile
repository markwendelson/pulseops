# ==========================================
# Stage 1: Build Stage (.NET 8 SDK)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Copy csproj and restore dependencies first (for Docker layer caching)
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

# Copy remaining source files and publish release build
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# Stage 2: Runtime Stage (.NET 8 ASP.NET Runtime)
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Run as non-root user for enterprise container security
USER app

# Copy published output from build stage
COPY --from=build /app/publish .

# Expose port 8080 (default non-root port in .NET 8 containers)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV EnableSwagger=true

ENTRYPOINT ["dotnet", "backend.dll"]
