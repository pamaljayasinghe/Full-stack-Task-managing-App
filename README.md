# Full-stack Task Management App

Full-stack User and Task Management application using React, Spring Boot, Java, and MySQL.

## Project Overview

This application allows users to:

- Register and login with secure authentication
- Create, view, edit, and delete tasks
- View tasks for the current day
- Manage user profile information

## Technologies Used

### Frontend

- React.js
- React Router for navigation
- React Bootstrap for UI components
- Axios for API requests
- JWT for authentication

### Backend

- Spring Boot
- Java
- Spring Security
- MySQL Database
- JPA/Hibernate

## Setup Instructions

### Prerequisites

- Node.js and npm
- Java 11 or higher
- Maven
- MySQL

### Backend Setup

1. Navigate to the backend directory
2. Configure your database in `application.properties`
3. Run `mvn spring-boot:run` to start the backend server

### Frontend Setup

1. Navigate to the frontend directory
2. Run `npm install` to install dependencies
3. Create a `.env` file with the following contents:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```
4. Run `npm start` to start the frontend development server

## Features

- Secure authentication and authorization
- Responsive design for all screen sizes
- Task filtering by date
- User profile management
