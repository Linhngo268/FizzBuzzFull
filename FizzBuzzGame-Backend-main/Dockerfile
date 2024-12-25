# Use .NET SDK to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy all source files and build the project
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Use a runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose the port used by the application
EXPOSE 5001

# Command to run the application
ENTRYPOINT ["dotnet", "GameAPI.dll"]
