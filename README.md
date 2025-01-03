
# FizzBuzz Full

A web application that demonstrates the FizzBuzz problem using a React front-end (with TypeScript), a C# .NET back-end, and a MySQL database for storing FizzBuzz results.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [License](#license)

## Overview

The FizzBuzz app is a simple implementation of the FizzBuzz problem. The app allows users to input a number, and it will return "Fizz" if the number is divisible by 3, "Buzz" if divisible by 5, or "FizzBuzz" if divisible by both. It also stores the results in a MySQL database and allows users to view past results.

-**FizzBuzzGame-main**: Built using React with TypeScript for a dynamic user interface.
- **FizzBuzzGame-Backend_main**: C# .NET 6 Web API that handles FizzBuzz logic and communicates with the MySQL database.
- **Database**: MySQL for storing FizzBuzz results.

## Features

- Input a number and see the corresponding FizzBuzz result.
- View a history of previously calculated results.
- Backend handles all FizzBuzz logic and saves results to MySQL.

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

## Installation

### Frontend Setup

1. Clone the repository:

    
   git clone https://github.com/your-repo/fizzbuzz-app.git
   cd fizzbuzz-app
   

2. Navigate to the frontend directory:

   
   cd frontend
    

3. Install the required dependencies:

    
   npm install
   

4. Start the development server:

    
   npm start
   

   The React app will be running at [http://localhost:3000](http://localhost:3000).

### Backend Setup

1. Navigate to the backend directory:

    
   cd backend
   

2. Open the project in Visual Studio or your preferred C# editor.

3. Update the `appsettings.json` file with your MySQL connection string:

   json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=fizzbuzzgame;User=root;Password=Linhquan123@;"
   }
   

4. Build and run the backend:

    
   dotnet build
   dotnet run
   

   The backend will be running at [http://localhost:5001](http://localhost:5001).

### Database Setup

1. Ensure MySQL is installed and running on your machine.
2. Create a database named `fizzbuzzgame` (or the name you prefer).
3. Run the following SQL command to create the table for storing FizzBuzz results:

    
   

## Usage

- Open the app in your browser at [http://localhost:3000](http://localhost:3000).
- Enter a number into the input field, click "Get FizzBuzz", and the result will be displayed.
- The result will also be saved to the database, and you can view past results in the history section.

 

 
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Notes:
1. Replace `your-repo` with your actual GitHub repository name.
2. If you're using a different database or have specific configurations, adjust the steps accordingly.
