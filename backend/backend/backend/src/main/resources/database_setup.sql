-- Database creation and setup script for Task Management Application

-- Create the database (run this first)
CREATE DATABASE IF NOT EXISTS taskmanagement;

-- Use the database
USE taskmanagement;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS user;

-- Create the user table
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiration DATETIME
);

-- Create the task table with foreign key to user
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Add sample data (optional)
-- Add a test user (password is "password" in this example)
INSERT INTO user (username, first_name, last_name, email, password) VALUES 
('testuser', 'Test', 'User', 'test@example.com', '$2a$10$eDzc0Pu4uzEBzFgJ.H0o5Ozbw3GonBwYsCAwDYnGHavDONgMeV.5q'),
('admin', 'Admin', 'User', 'admin@example.com', '$2a$10$eDzc0Pu4uzEBzFgJ.H0o5Ozbw3GonBwYsCAwDYnGHavDONgMeV.5q');

-- Add some sample tasks
INSERT INTO task (title, description, due_date, user_id) VALUES
('Complete project', 'Finish the task management project', NOW() + INTERVAL 7 DAY, 1),
('Review code', 'Review the Spring Boot application code', NOW() + INTERVAL 3 DAY, 1),
('Update documentation', 'Update project documentation', NOW() + INTERVAL 5 DAY, 2),
('Team meeting', 'Attend weekly team meeting', NOW() + INTERVAL 1 DAY, 1);

-- Create indexes for better performance
CREATE INDEX idx_task_user_id ON task(user_id);
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_reset_token ON user(reset_token);
