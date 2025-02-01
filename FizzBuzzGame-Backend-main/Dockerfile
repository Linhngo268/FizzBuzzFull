# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /app

# # Copy project files and restore dependencies
# COPY GameAPI.csproj ./
# RUN dotnet restore

# # Copy the rest of the files and build the main application
# COPY . ./
# RUN dotnet publish GameAPI.csproj -c Release -o /app/publish

# # Use a runtime image for running the application
# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
# WORKDIR /app
# COPY --from=build /app/publish .
# ENTRYPOINT ["dotnet", "GameAPI.dll"]
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY GameAPI.csproj ./
RUN dotnet restore

# Copy the remaining source files and build the application
COPY . ./
RUN dotnet publish GameAPI.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published files from the build stage
COPY --from=build /app/publish ./

# Expose necessary ports (if applicable)
EXPOSE 80
EXPOSE 443

# Define the entry point for the application
ENTRYPOINT ["dotnet", "GameAPI.dll"]
