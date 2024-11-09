To design and implement the database schema for the Matatu-Link mobile app on your Ubuntu machine, follow this comprehensive step-by-step guide. This process will cover setting up PostgreSQL, creating the database and tables, and integrating the database with a React Native application.

**1. Install PostgreSQL on Ubuntu**

First, ensure that PostgreSQL is installed on your Ubuntu system.

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

After installation, start the PostgreSQL service and enable it to run on startup:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**2. Configure PostgreSQL**

Switch to the PostgreSQL user and access the PostgreSQL prompt:

```bash
sudo -i -u postgres
psql
```

Create a new database user with a password:

```sql
CREATE USER matatu_user WITH PASSWORD 'your_password';
```

Create a new database owned by this user:

```sql
CREATE DATABASE matatu_db OWNER matatu_user;
```

Grant all privileges on the database to the user:

```sql
GRANT ALL PRIVILEGES ON DATABASE matatu_db TO matatu_user;
```

Exit the PostgreSQL prompt:

```sql
\q
```

**3. Define the Database Schema**

Connect to the `matatu_db` database:

```bash
psql -U matatu_user -d matatu_db
```

Create the tables as per the provided schema. Below are examples for a few tables:

```sql
-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INT REFERENCES user_roles(role_id),
    is_active BOOLEAN DEFAULT TRUE
);

-- User Roles Table
CREATE TABLE user_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL
);

-- Operators Table
CREATE TABLE operators (
    operator_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255),
    address VARCHAR(255)
);

-- Matatus Table
CREATE TABLE matatus (
    matatu_id SERIAL PRIMARY KEY,
    operator_id INT REFERENCES operators(operator_id),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT,
    route_id INT REFERENCES routes(route_id),
    current_status VARCHAR(20),
    model VARCHAR(50)
);

-- Routes Table
CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    fare DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE
);

-- Stops Table
CREATE TABLE stops (
    stop_id SERIAL PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT
);

-- Route Stops Table
CREATE TABLE route_stops (
    route_id INT REFERENCES routes(route_id),
    stop_id INT REFERENCES stops(stop_id),
    stop_order INT,
    PRIMARY KEY (route_id, stop_id)
);

-- Matatu Locations Table
CREATE TABLE matatu_locations (
    location_id BIGSERIAL PRIMARY KEY,
    matatu_id INT REFERENCES matatus(matatu_id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributions Table
CREATE TABLE contributions (
    contribution_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    contribution_type VARCHAR(20) CHECK (contribution_type IN ('route', 'stop', 'matatu')),
    content TEXT,
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    route_id INT REFERENCES routes(route_id),
    stop_id INT REFERENCES stops(stop_id),
    matatu_id INT REFERENCES matatus(matatu_id)
);

-- Votes Table
CREATE TABLE votes (
    vote_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    contribution_id INT REFERENCES contributions(contribution_id),
    vote_type VARCHAR(20) CHECK (vote_type IN ('upvote', 'downvote')),
    date_voted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, contribution_id)
);

-- Reports Table
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    matatu_id INT REFERENCES matatus(matatu_id),
    route_id INT REFERENCES routes(route_id),
    report_type VARCHAR(20) CHECK (report_type IN ('safety', 'security', 'other')),
    description TEXT,
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved'))
);

-- Fares Table
CREATE TABLE fares (
    fare_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    matatu_id INT REFERENCES matatus(matatu_id),
    route_id INT REFERENCES routes(route_id),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'M-Pesa', 'card')),
    date_paid TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(100)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    notification_type VARCHAR(50),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**4. Integrate PostgreSQL with a React Native App**

To connect your React Native app to the PostgreSQL database, you'll need to set up a backend server. A common approach is to use Node.js with Express.js to create RESTful APIs that your React Native app can interact with.

**a. Set Up the Backend Server**

1. **Install Node.js and npm**:

   ```bash
   sudo apt install nodejs npm
   ```

2. **Initialize a New Node.js Project**:

   ```bash
   mkdir matatu_backend
   cd matatu_backend
   npm init -y
   ```

3. **Install Required Dependencies**:

   ```bash
   npm install express pg cors body-parser
   ```

   - `express`: Web framework for Node.js.
   - `pg`: PostgreSQL client for Node.js.
   - `cors`: Middleware to enable Cross-Origin Resource Sharing.
   - `body-parser`: Middleware to parse incoming request bodies.

4. **Create the Server File**:

   Create a file named `index.js` with the following content:

   ```javascript
   const express = require("express");
   const bodyParser = require("body-parser");
   const cors = require("cors");
   const { Pool } = require("pg");

   const app = express();
   const port = 3000;

   app.use(cors());
   app;
   ```
