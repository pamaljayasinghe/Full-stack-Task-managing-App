#!/bin/bash

# Script to start the User Task Management application
# This script should be run from the project root directory

echo "Starting User Task Management Application..."
echo "Checking if XAMPP MySQL is running..."

# Check if MySQL is running
if nc -z localhost 3306; then
    echo "MySQL is running. Good to go!"
else
    echo "MySQL does not appear to be running!"
    echo "Please start MySQL in XAMPP Control Panel first."
    exit 1
fi

echo "Building and starting the Spring Boot application..."
cd "$(dirname "$0")"
./mvnw spring-boot:run

echo "Application shutdown."
