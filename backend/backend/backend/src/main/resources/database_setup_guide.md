# Database Setup Guide for Task Management Application

This guide will help you set up the MySQL database for the User Task Management application using XAMPP and MySQL Workbench.

## Prerequisites

- XAMPP installed on your computer
- MySQL Workbench installed on your computer

## Step 1: Start MySQL Server in XAMPP

1. Open the XAMPP Control Panel
2. Click "Start" next to MySQL (make sure Apache is also running if you want to use phpMyAdmin)
3. The MySQL server should now be running on port 3306

## Step 2: Connect MySQL Workbench to XAMPP's MySQL Server

1. Open MySQL Workbench
2. On the home screen, click the "+" icon next to "MySQL Connections"
3. Fill in the connection details:
   - Connection Name: `XAMPP MySQL`
   - Hostname: `127.0.0.1` (or `localhost`)
   - Port: `3306`
   - Username: `root`
   - Password: (leave empty for default XAMPP installation)
4. Click "Test Connection" to verify it works
5. Click "OK" to save the connection

## Step 3: Run the Database Setup Script

1. Open the saved connection in MySQL Workbench
2. Go to File → Open SQL Script
3. Navigate to: `/Users/pamaljayasinghe/Documents/Github/user-task-management/backend/backend/backend/src/main/resources/database_setup.sql`
4. Click "Open"
5. Click the lightning bolt button to execute the entire script
   - Alternatively, you can select specific parts of the script and run them separately

## Step 4: Verify the Database Setup

1. In the Navigator panel on the left, right-click in the "SCHEMAS" area and select "Refresh All"
2. You should now see the `taskmanagement` database
3. Expand the database to see the `user` and `task` tables
4. Right-click on each table and select "Select Rows - Limit 1000" to verify the sample data was added correctly

## Step 5: Connect Your Spring Boot Application

Your application is already configured to connect to this database with the following settings in `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagement?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

## Troubleshooting

1. **Connection Refused**: If MySQL Workbench can't connect to the server, make sure MySQL is running in XAMPP.
2. **Access Denied**: If you see "Access denied for user 'root'", you might need to update the password in both the connection settings and your application properties.
3. **Port Conflict**: If port 3306 is already in use, you may need to change the MySQL port in XAMPP's configuration.

## Note on Sample Data

The sample user credentials are:

- Username: `testuser`, Email: `test@example.com`, Password: `password`
- Username: `admin`, Email: `admin@example.com`, Password: `password`

These are for testing purposes only. In a production environment, you would use proper password hashing.

## Manual Database Creation (Alternative)

If you prefer to create the database manually:

1. Connect to MySQL through Workbench
2. Run these commands one by one:
   ```sql
   CREATE DATABASE taskmanagement;
   USE taskmanagement;
   ```
3. The Spring Boot application will create the tables automatically when it starts because of the `spring.jpa.hibernate.ddl-auto=update` setting.
