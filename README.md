# FizzBuzz Full

A web application that demonstrates the FizzBuzz problem using a React front-end (with TypeScript), a C# .NET back-end, and a MySQL database for storing FizzBuzz results. The app is dockerized and can be run using Docker Compose.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Docker Setup](#docker-setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [License](#license)

## Overview

The FizzBuzz app is a simple implementation of the FizzBuzz problem. The app allows users to input a number, and it will return "Fizz" if the number is divisible by 3, "Buzz" if divisible by 5, or "FizzBuzz" if divisible by both. It also stores the results in a MySQL database and allows users to view past results.

- **FizzBuzzGame-main**: Built using React with TypeScript for a dynamic user interface.
- **FizzBuzzGame-Backend_main**: C# .NET 6 Web API that handles FizzBuzz logic and communicates with the MySQL database.
- **Database**: MySQL for storing FizzBuzz results.

## Features

- Input a number and see the corresponding FizzBuzz result.
- View a history of previously calculated results.
- Backend handles all FizzBuzz logic and saves results to MySQL.
- The application is containerized using Docker and can be run using Docker Compose.

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Axios for HTTP requests
  - CSS/Styled Components for styling
- **Backend**:
  - C# .NET 6 (Web API)
  - Entity Framework Core for data management
- **Database**:
  - MySQL
  - Docker for containerization

## Installation

### Docker Setup

Ensure you have Docker and Docker Compose installed on your machine. To run the application with Docker Compose:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/fizzbuzz-app.git
   ```

2. Run the application with Docker Compose:
   ```sh
   docker-compose up --build
   ```

3. The application will be available at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5001](http://localhost:5001)
   - MySQL Database: Accessible on `localhost:3306`

### Frontend Setup (Without Docker)

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install the required dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

   The React app will be running at [http://localhost:3000](http://localhost:3000).

### Backend Setup (Without Docker)

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```

2. Open the project in Visual Studio or your preferred C# editor.

3. Update the `appsettings.json` file with your MySQL connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=fizzbuzzgame;User=root;Password=yourpassword;"
   }
   ```

4. Build and run the backend:
   ```sh
   dotnet build
   dotnet run
   ```

   The backend will be running at [http://localhost:5001](http://localhost:5001).

### Database Setup (Without Docker)

1. Ensure MySQL is installed and running on your machine.
2. Create a database named `fizzbuzzgame` (or the name you prefer).
3. Run the necessary SQL migrations if needed.

## Usage

- Open the app in your browser at [http://localhost:3000](http://localhost:3000).
- Enter a number into the input field, click "Get FizzBuzz", and the result will be displayed.
- The result will also be saved to the database, and you can view past results in the history section.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Notes:
1. Replace `your-repo` with your actual GitHub repository name.
2. If you're using a different database or have specific configurations, adjust the steps accordingly.

