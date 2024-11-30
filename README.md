# Collaborative Blogging Platform

This project includes:
- **React UI**: A frontend user interface for the application.
- **Node.js Backend**: A backend API to manage the application's logic.
- **MongoDB**: A NoSQL database to store application data.

## Prerequisites

Ensure you have the following installed on your system:
- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to set up and run the application:

### Step 1: Clone the Repository

Clone the repository to your local machine:
git clone <repository-url>
cd project

### Step 2: Create .env file and add below var
JWT_SECRET=<>
DB_URI=mongodb://mongo:27017/mydatabase

### Step 3: Run the App
docker compose up --build


### Step 4: Access the Application
Frontend: The React UI is available at http://localhost:3000.

Backend: The Node.js API is available at http://localhost:5000.

MongoDB: The database is running on port 27017.


# Docs for API 
https://docs.google.com/document/d/1qcHBo1YXYfX0ebbTZHL7-rv3RbPBe-P88er9JYa_lyk/edit?usp=sharing
