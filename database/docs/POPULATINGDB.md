# Creating Users with Proper Password Hashing Using Postman

To ensure that user passwords are securely hashed, it's essential to create users through your backend API rather than inserting them directly into the database. This approach leverages your backend's password hashing mechanism (e.g., bcrypt) to store secure password hashes.

Below, you'll find a step-by-step guide to creating 10 users (2 admins and 8 operators) using Postman. Each user creation request will send a POST request to the `/api/auth/register` endpoint with the necessary data. After creating the users, you can use their credentials to log in and perform authenticated actions within your application.

## Prerequisites

- **Postman Installed**: Ensure you have Postman installed on your machine.
- **Backend Server Running**: Your backend server should be running and accessible at `http://localhost:5000`.
- **Environment Setup (Optional but Recommended)**: Set up a Postman environment to manage variables like `{{baseUrl}}`.

### 1. Setting Up Postman Environment (Optional)

Setting up an environment in Postman allows you to manage variables like the base URL, tokens, and user IDs efficiently.

**Create a New Environment:**

1. Open Postman.
2. Click on the Gear Icon ⚙️ (Manage Environments) in the top right corner.
3. Click **Add** to create a new environment.
   - **Name**: `Matatu-Link Backend`
   - **Variables**:
     - `baseUrl`: `http://localhost:5000`
     - `adminToken`: *(to be filled after login)*
     - `operatorToken`: *(to be filled after login)*
4. Click **Add** to save the environment.

**Select the Environment:**

- In the top right corner of Postman, select the newly created environment (`Matatu-Link Backend`) from the dropdown.

### 2. Creating Users via `/api/auth/register` Endpoint

Each user creation involves sending a **POST** request with the following JSON payload:

- `username`: Unique username for the user.
- `email`: Unique email address.
- `password`: Plain-text password (will be hashed by the backend).
- `phone_number`: Contact number.
- `role_id`: `1` for admin, `2` for operator.

**Note**: Replace the `password` field with a secure password of your choice.

#### 2.1. Admin Users

We'll create **2 admin users**.

**Admin User 1**

- **Request Name**: `Register Admin User 1`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "admin_juma",
  "email": "juma.admin@example.com",
  "password": "AdminPass123",
  "phone_number": "0712345678",
  "role_id": 1
}
```

**Tests (Optional):**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Admin User 2**

- **Request Name**: `Register Admin User 2`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "admin_wafula",
  "email": "wafula.admin@example.com",
  "password": "AdminPass456",
  "phone_number": "0723456789",
  "role_id": 1
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

#### 2.2. Operator Users

We'll create **8 operator users**.

**Operator User 1**

- **Request Name**: `Register Operator User 1`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_kik",
  "email": "kik.operator@example.com",
  "password": "OperatorPass123",
  "phone_number": "0734567890",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 2**

- **Request Name**: `Register Operator User 2`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_imba",
  "email": "imba.operator@example.com",
  "password": "OperatorPass456",
  "phone_number": "0745678901",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 3**

- **Request Name**: `Register Operator User 3`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_chura",
  "email": "chura.operator@example.com",
  "password": "OperatorPass789",
  "phone_number": "0756789012",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 4**

- **Request Name**: `Register Operator User 4`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_maji",
  "email": "maji.operator@example.com",
  "password": "OperatorPass321",
  "phone_number": "0767890123",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 5**

- **Request Name**: `Register Operator User 5`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_nairobi",
  "email": "nairobi.operator@example.com",
  "password": "OperatorPass654",
  "phone_number": "0778901234",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 6**

- **Request Name**: `Register Operator User 6`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_kasarani",
  "email": "kasarani.operator@example.com",
  "password": "OperatorPass987",
  "phone_number": "0789012345",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 7**

- **Request Name**: `Register Operator User 7`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_karura",
  "email": "karura.operator@example.com",
  "password": "OperatorPass654",
  "phone_number": "0790123456",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

**Operator User 8**

- **Request Name**: `Register Operator User 8`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "username": "operator_ruai",
  "email": "ruai.operator@example.com",
  "password": "OperatorPass321",
  "phone_number": "0701234567",
  "role_id": 2
}
```

**Tests:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains success message", function () {
  pm.expect(pm.response.json().message).to.eql("User registered successfully");
});
```

### 3. Executing the Postman Requests

1. Open Postman and ensure your environment (`Matatu-Link Backend`) is selected.
2. **Create a New Request** for each user as detailed above:
   - Click **New** > **Request**.
   - Name the request (e.g., "Register Admin User 1").
   - Select the appropriate collection or create a new one (e.g., "User Registration").
   - Set the **Method** to `POST`.
   - Enter the **URL**: `{{baseUrl}}/api/auth/register`.
   - Go to the **Headers** tab and set `Content-Type` to `application/json`.
   - Go to the **Body** tab, select **raw**, and choose **JSON** from the dropdown.
   - Paste the respective JSON payload for each user.
   - Go to the **Tests** tab and paste the provided test scripts.
   - Click **Save** to store the request in your collection.
3. **Run the Requests**:
   - Execute each request sequentially by clicking the **Send** button.
   - Ensure that each response returns a `201 Created` status and the success message `"User registered successfully"`.
4. **Verify User Creation**:
   - After creating all users, you can log in with each user to verify that their passwords are hashed and that they have the correct roles.
   - Optionally, query your database to inspect the `users` table and confirm that `password_hash` fields contain bcrypt hashes.

### 4. Logging In and Storing Tokens (Optional for Further Testing)

To perform authenticated actions (e.g., creating matatus, routes, etc.), you'll need JWT tokens. Here's how to log in and store tokens in Postman environment variables.

#### 4.1. Login Admin User 1

- **Request Name**: `Login Admin User 1`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "email": "juma.admin@example.com",
  "password": "AdminPass123"
}
```

**Tests:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
  pm.expect(pm.response.json()).to.have.property("token");
});

pm.test("Store adminToken", function () {
  var jsonData = pm.response.json();
  pm.environment.set("adminToken", jsonData.token);
});
```

#### 4.2. Login Admin User 2

- **Request Name**: `Login Admin User 2`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "email": "wafula.admin@example.com",
  "password": "AdminPass456"
}
```

**Tests:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
  pm.expect(pm.response.json()).to.have.property("token");
});

pm.test("Store adminToken2", function () {
  var jsonData = pm.response.json();
  pm.environment.set("adminToken2", jsonData.token);
});
```

#### 4.3. Login Operator Users

Repeat the login process for each operator to store their tokens.

**Example for Operator User 1:**

- **Request Name**: `Login Operator User 1`
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**: Raw JSON

```json
{
  "email": "kik.operator@example.com",
  "password": "OperatorPass123"
}
```

**Tests:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
  pm.expect(pm.response.json()).to.have.property("token");
});

pm.test("Store operatorToken1", function () {
  var jsonData = pm.response.json();
  pm.environment.set("operatorToken1", jsonData.token);
});
```

Repeat the above login steps for Operator Users 2 through 8, adjusting the email, password, and environment variable names accordingly (e.g., `operatorToken2`, `operatorToken3`, etc.).

### 5. Linking Operators to the Operators Table

After creating users, you need to link operator users to the `operators` table by assigning `user_id` references. Since `user_id` is auto-generated, you need to retrieve each user's `user_id` to insert into the `operators` table.

**Approach:**

**Retrieve Users' IDs:**

- **Option 1**: Modify your register endpoint to return the created `user_id`.
- **Option 2**: Query the `users` table directly after registration.

**Insert Operators:**

Use SQL `INSERT` statements to populate the `operators` table with the corresponding `user_id`.

**Example SQL Insert Statements:**

```sql
-- Assuming user_id for operator_kik is 3, operator_imba is 4, etc.

INSERT INTO operators (operator_id, name, contact_info, address, user_id) VALUES
(1, 'Matatu Express Ltd.', 'info@matatuexpress.co.ke', 'Nairobi CBD, Kenyatta Avenue', 3),
(2, 'Maua Motors', 'contact@mawamotors.com', 'Kasarani, Nairobi', 4),
(3, 'Imba Transport', 'support@imbatransport.co.ke', 'Ruai Road, Nairobi', 5),
(4, 'Chura Matatus', 'services@churamatatus.com', 'Ruaraka, Nairobi', 6),
(5, 'Nairobi Movers', 'admin@nairobi-movers.co.ke', 'Parklands, Nairobi', 7),
(6, 'Kasarani Transit', 'kasarani@transit.co.ke', 'Kasarani, Nairobi', 8),
(7, 'Karura Riders', 'karura@riders.co.ke', 'Karura Forest, Nairobi', 9),
(8, 'Ruai Lines', 'info@rualines.co.ke', 'Ruai, Nairobi', 10);
```

**Note**: Replace the `user_id` values with the actual IDs from your `users` table.

### 6. Verification

After executing the user registration requests:

**Verify Users in Database:**

- Connect to your PostgreSQL database.
- Run the following query to ensure users are created with hashed passwords.

```sql
SELECT user_id, username, email, password_hash, role_id FROM users;
```

**Verify Operators in Database:**

- Ensure that the `operators` table correctly references the `user_id` from the `users` table.

```sql
SELECT * FROM operators;
```

**Test Authentication:**

- Attempt to log in with each user to confirm that authentication works and tokens are generated correctly.

### 7. Best Practices

**Secure Passwords:**

- Always use strong, unique passwords for each user.
- Never store plain-text passwords; rely on your backend's hashing mechanism.

**Environment Variables:**

- Manage sensitive data like `JWT_SECRET` and database credentials using environment variables.
- Ensure `.env` files are excluded from version control (`.gitignore`).

**Token Management:**

- Store JWT tokens securely on the client side.
- Implement token expiration and refresh mechanisms as needed.

**Error Handling:**

- Ensure your backend provides meaningful error messages for failed requests.
- Handle errors gracefully on the client side to enhance user experience.

**Role-Based Access Control (RBAC):**

- Regularly review and update role permissions to align with your application's requirements.
- Ensure that sensitive operations are restricted to appropriate roles.

**Data Validation:**

- Implement comprehensive validation on both client and server sides to maintain data integrity.
- Use libraries like `express-validator` to streamline validation processes.

### 8. Conclusion

By following the above steps, you can effectively create users with properly hashed passwords using Postman, ensuring secure authentication and role management within your Matatu-Link application. This setup lays a strong foundation for building and scaling your application's features, providing a reliable and secure user management system.

If you encounter any issues during the process or need further assistance with specific functionalities, feel free to reach out!

---

# Populating the Matatu-Link Database with Realistic, Culturally Relevant Data

To ensure your Matatu-Link application's backend functions seamlessly, it's crucial to populate your PostgreSQL database with realistic and culturally relevant data. Below, you'll find SQL `INSERT` statements for each table, structured in the correct order to respect primary and foreign key dependencies. The data reflects Nairobi's culture and transportation landscape.

**Table Insertion Order:**

1. `user_roles`
2. `users`
3. `operators`
4. `routes`
5. `stops`
6. `matatus`
7. `route_stops`
8. `matatu_locations`
9. `contributions`
10. `votes`
11. `reports`
12. `fares`
13. `notifications`

## 1. User Roles

**Table**: `user_roles`

This table defines the roles available within the application. We've already inserted the admin and operator roles as per your initial setup.

```sql
-- Insert roles if they don't exist
INSERT INTO user_roles (role_id, role_name) VALUES (1, 'admin') ON CONFLICT DO NOTHING;
INSERT INTO user_roles (role_id, role_name) VALUES (2, 'operator') ON CONFLICT DO NOTHING;
```

## 2. Users

**Table**: `users`

This table stores user information. We'll insert 2 admin users and 8 operator users. Password hashes are placeholders and should be replaced with actual bcrypt hashes in a real-world scenario.

```sql
-- Insert Admin Users
INSERT INTO users (user_id, username, email, password_hash, phone_number, date_joined, role_id, is_active) VALUES
(1, 'admin_juma', 'juma.admin@example.com', '$2b$10$abcdefghijklmnopqrstuv', '0712345678', '2023-01-15', 1, TRUE),
(2, 'admin_wafula', 'wafula.admin@example.com', '$2b$10$1234567890abcdefghijkl', '0723456789', '2023-02-20', 1, TRUE);

-- Insert Operator Users
INSERT INTO users (user_id, username, email, password_hash, phone_number, date_joined, role_id, is_active) VALUES
(3, 'operator_kik', 'kik.operator@example.com', '$2b$10$mnopqrstuvabcdefghijkl', '0734567890', '2023-03-10', 2, TRUE),
(4, 'operator_imba', 'imba.operator@example.com', '$2b$10$abcdefghijklmnopqrstu', '0745678901', '2023-04-05', 2, TRUE),
(5, 'operator_chura', 'chura.operator@example.com', '$2b$10$abcdefg1234567890hijklm', '0756789012', '2023-05-12', 2, TRUE),
(6, 'operator_maji', 'maji.operator@example.com', '$2b$10$hijklmnopqrstu1234567890', '0767890123', '2023-06-18', 2, TRUE),
(7, 'operator_nairobi', 'nairobi.operator@example.com', '$2b$10$mnopqrstu1234567890abcdef', '0778901234', '2023-07-22', 2, TRUE),
(8, 'operator_kasarani', 'kasarani.operator@example.com', '$2b$10$qrstuv1234567890abcdefgh', '0789012345', '2023-08-30', 2, TRUE),
(9, 'operator_karura', 'karura.operator@example.com', '$2b$10$abcdefgh1234567890ijklmn', '0790123456', '2023-09-14', 2, TRUE),
(10, 'operator_ruai', 'ruai.operator@example.com', '$2b$10$1234567890abcdefghijklmnop', '0701234567', '2023-10-25', 2, TRUE);
```

## 3. Operators

**Table**: `operators`

Each operator is linked to a user (`user_id`). We'll insert 8 operators corresponding to the operator users created above.

```sql
-- Insert Operators
INSERT INTO operators (operator_id, name, contact_info, address, user_id) VALUES
(1, 'Matatu Express Ltd.', 'info@matatuexpress.co.ke', 'Nairobi CBD, Kenyatta Avenue', 3),
(2, 'Maua Motors', 'contact@mawamotors.com', 'Kasarani, Nairobi', 4),
(3, 'Imba Transport', 'support@imbatransport.co.ke', 'Ruai Road, Nairobi', 5),
(4, 'Chura Matatus', 'services@churamatatus.com', 'Ruaraka, Nairobi', 6),
(5, 'Nairobi Movers', 'admin@nairobi-movers.co.ke', 'Parklands, Nairobi', 7),
(6, 'Kasarani Transit', 'kasarani@transit.co.ke', 'Kasarani, Nairobi', 8),
(7, 'Karura Riders', 'karura@riders.co.ke', 'Karura Forest, Nairobi', 9),
(8, 'Ruai Lines', 'info@rualines.co.ke', 'Ruai, Nairobi', 10);
```

## 4. Routes

**Table**: `routes`

We'll insert 7 routes commonly used in Nairobi.

```sql
-- Insert Routes
INSERT INTO routes (route_id, route_name, description, fare, is_active) VALUES
(1, 'CBD to Westlands', 'From Nairobi CBD to Westlands via Kenyatta Avenue', 50.00, TRUE),
(2, 'Kasarani to Ngong', 'From Kasarani to Ngong Hills', 45.00, TRUE),
(3, 'Ruaraka to Parklands', 'From Ruaraka to Parklands', 40.00, TRUE),
(4, 'Embakasi to Karen', 'From Embakasi to Karen Estate', 60.00, TRUE),
(5, 'Nairobi Railway Station to Umoja', 'From Nairobi Railway Station to Umoja', 35.00, TRUE),
(6, 'Westlands to Gigiri', 'From Westlands to Gigiri via Waiyaki Way', 55.00, TRUE),
(7, 'City Park to Karen', 'From City Park to Karen Road', 50.00, TRUE);
```

## 5. Stops

**Table**: `stops`

We'll insert 10 stops located along the routes in Nairobi.

```sql
-- Insert Stops
INSERT INTO stops (stop_id, stop_name, latitude, longitude, description) VALUES
(1, 'Nairobi Railway Station', -1.2833, 36.8167, 'Central railway hub of Nairobi'),
(2, 'Kenyatta Avenue Station', -1.2914, 36.8120, 'Main interchange on Kenyatta Avenue'),
(3, 'Westlands Shopping Mall', -1.2780, 36.8050, 'Popular shopping destination in Westlands'),
(4, 'Kasarani Arena', -1.2975, 36.9110, 'Large sports and events venue'),
(5, 'Ngong Hills', -1.2980, 36.8370, 'Scenic hills offering panoramic views of Nairobi'),
(6, 'Ruaraka Market', -1.2838, 36.8441, 'Bustling local market in Ruaraka'),
(7, 'Parklands Park', -1.2750, 36.8040, 'Green space and recreational area in Parklands'),
(8, 'Embakasi East Station', -1.2990, 36.8140, 'Major transport hub in Embakasi East'),
(9, 'Karen Shopping Centre', -1.3080, 36.7790, 'Upscale shopping area in Karen'),
(10, 'Gigiri Embassy Area', -1.2710, 36.8150, 'Diplomatic area housing multiple embassies');
```

## 6. Matatus

**Table**: `matatus`

We'll insert 10 matatus with realistic registration numbers and details, linked to operators and routes.

```sql
-- Insert Matatus
INSERT INTO matatus (matatu_id, operator_id, registration_number, capacity, route_id, current_status, model, make, year) VALUES
(1, 1, 'KAX123A', 15, 1, 'active', 'Toyota', 'Coaster', 2018),
(2, 2, 'KDX456B', 12, 2, 'active', 'Hyundai', 'Matrix', 2020),
(3, 3, 'KEX789C', 18, 3, 'maintenance', 'Mercedes-Benz', 'Sprinter', 2017),
(4, 4, 'KFX012D', 14, 4, 'active', 'Isuzu', 'NQR', 2019),
(5, 5, 'KGX345E', 16, 5, 'inactive', 'Peugeot', 'Traveller', 2016),
(6, 6, 'KHX678F', 20, 6, 'active', 'Scania', 'R-Series', 2021),
(7, 7, 'KIX901G', 15, 7, 'active', 'Fiat', 'Ducato', 2018),
(8, 8, 'KJX234H', 12, 1, 'active', 'Toyota', 'Hiace', 2020),
(9, 8, 'KKX567I', 15, 2, 'active', 'Hyundai', 'H1', 2019),
(10, 7, 'KLX890J', 16, 3, 'active', 'Mercedes-Benz', 'Vario', 2021);
```

## 7. Route Stops

**Table**: `route_stops`

This table maps routes to their respective stops with a defined order.

```sql
-- Insert Route Stops

-- Route 1: CBD to Westlands
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3);

-- Route 2: Kasarani to Ngong
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(2, 4, 1),
(2, 5, 2);

-- Route 3: Ruaraka to Parklands
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(3, 6, 1),
(3, 7, 2);

-- Route 4: Embakasi to Karen
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(4, 8, 1),
(4, 9, 2);

-- Route 5: Nairobi Railway Station to Umoja
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(5, 1, 1),
(5, 10, 2);

-- Route 6: Westlands to Gigiri
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(6, 3, 1),
(6, 10, 2);

-- Route 7: City Park to Karen
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(7, 7, 1),
(7, 9, 2);
```

## 8. Matatu Locations

**Table**: `matatu_locations`

We'll insert the latest location for each matatu.

```sql
-- Insert Matatu Locations
INSERT INTO matatu_locations (location_id, matatu_id, latitude, longitude, timestamp) VALUES
(1, 1, -1.2833, 36.8167, '2024-04-01 08:30:00'),
(2, 2, -1.2914, 36.8120, '2024-04-01 08:35:00'),
(3, 3, -1.2780, 36.8050, '2024-04-01 08:40:00'),
(4, 4, -1.2975, 36.9110, '2024-04-01 08:45:00'),
(5, 5, -1.2980, 36.8370, '2024-04-01 08:50:00'),
(6, 6, -1.2838, 36.8441, '2024-04-01 08:55:00'),
(7, 7, -1.2750, 36.8040, '2024-04-01 09:00:00'),
(8, 8, -1.2990, 36.8140, '2024-04-01 09:05:00'),
(9, 9, -1.3080, 36.7790, '2024-04-01 09:10:00'),
(10, 10, -1.2710, 36.8150, '2024-04-01 09:15:00');
```

## 9. Contributions

**Table**: `contributions`

This table records user contributions related to routes, stops, or matatus.

```sql
-- Insert Contributions
INSERT INTO contributions (contribution_id, user_id, contribution_type, content, date_submitted, status, route_id, stop_id, matatu_id) VALUES
(1, 1, 'route', 'Propose new route from CBD to Westlands via ABC Road.', '2024-03-15', 'pending', 1, NULL, NULL),
(2, 2, 'stop', 'Add a new stop at XYZ Mall.', '2024-03-16', 'approved', NULL, 3, NULL),
(3, 3, 'matatu', 'Recommend upgrading matatu KAX123A to newer model.', '2024-03-17', 'rejected', NULL, NULL, 1),
(4, 4, 'route', 'Extend route 2 to include additional stops in Ngong.', '2024-03-18', 'pending', 2, NULL, NULL),
(5, 5, 'stop', 'Suggest adding a stop near the Nairobi Railway Station.', '2024-03-19', 'approved', NULL, 1, NULL),
(6, 6, 'matatu', 'Report broken seat in matatu KDX456B.', '2024-03-20', 'pending', NULL, NULL, 2),
(7, 7, 'route', 'Propose a circular route connecting major shopping centers.', '2024-03-21', 'approved', 6, NULL, NULL),
(8, 8, 'stop', 'Add a new stop at Karura Forest entrance.', '2024-03-22', 'pending', NULL, 10, NULL),
(9, 9, 'matatu', 'Request maintenance for matatu KEX789C.', '2024-03-23', 'approved', NULL, NULL, 3),
(10, 10, 'route', 'Suggest reducing fare on route 5 to promote usage.', '2024-03-24', 'rejected', 5, NULL, NULL);
```

## 10. Votes

**Table**: `votes`

Users can upvote or downvote contributions. We'll insert 10 votes corresponding to the contributions above.

```sql
-- Insert Votes
INSERT INTO votes (vote_id, user_id, contribution_id, vote_type, date_voted) VALUES
(1, 3, 1, 'upvote', '2024-03-16 10:00:00'),
(2, 4, 1, 'upvote', '2024-03-16 10:05:00'),
(3, 5, 2, 'upvote', '2024-03-17 11:00:00'),
(4, 6, 3, 'downvote', '2024-03-17 11:05:00'),
(5, 7, 4, 'upvote', '2024-03-18 12:00:00'),
(6, 8, 5, 'upvote', '2024-03-19 13:00:00'),
(7, 9, 6, 'downvote', '2024-03-20 14:00:00'),
(8, 10, 7, 'upvote', '2024-03-21 15:00:00'),
(9, 1, 8, 'upvote', '2024-03-22 16:00:00'),
(10, 2, 9, 'upvote', '2024-03-23 17:00:00');
```

## 11. Reports

**Table**: `reports`

Users can report issues related to matatus or routes. We'll insert 10 reports.

```sql
-- Insert Reports
INSERT INTO reports (report_id, user_id, matatu_id, route_id, report_type, description, date_reported, status) VALUES
(1, 3, 1, NULL, 'safety', 'Seat belts are not functioning properly.', '2024-04-01', 'pending'),
(2, 4, 2, NULL, 'security', 'Driver was unprofessional and rude.', '2024-04-02', 'reviewed'),
(3, 5, NULL, 1, 'other', 'The matatu was overcrowded during peak hours.', '2024-04-03', 'resolved'),
(4, 6, 3, NULL, 'safety', 'Broken windows need immediate repair.', '2024-04-04', 'pending'),
(5, 7, NULL, 2, 'security', 'Suspicious activity observed near stop 5.', '2024-04-05', 'pending'),
(6, 8, 4, NULL, 'safety', 'Frequent breakdowns causing delays.', '2024-04-06', 'reviewed'),
(7, 9, NULL, 3, 'other', 'Need more matatus on route 3 during evenings.', '2024-04-07', 'resolved'),
(8, 10, 5, NULL, 'security', 'Driver did not follow traffic rules.', '2024-04-08', 'pending'),
(9, 1, NULL, 4, 'safety', 'Poor lighting at stop 8 increases accident risk.', '2024-04-09', 'reviewed'),
(10, 2, 6, NULL, 'other', 'Request for more frequent matatu services.', '2024-04-10', 'resolved');
```

## 12. Fares

**Table**: `fares`

This table records fare transactions made by users.

```sql
-- Insert Fares
INSERT INTO fares (fare_id, user_id, matatu_id, route_id, amount, payment_method, date_paid, transaction_reference) VALUES
(1, 1, 1, 1, 50.00, 'cash', '2024-04-01 08:30:00', 'TXN1001'),
(2, 2, 2, 2, 45.00, 'M-Pesa', '2024-04-01 08:35:00', 'TXN1002'),
(3, 3, 3, 3, 40.00, 'card', '2024-04-01 08:40:00', 'TXN1003'),
(4, 4, 4, 4, 60.00, 'cash', '2024-04-01 08:45:00', 'TXN1004'),
(5, 5, 5, 5, 35.00, 'M-Pesa', '2024-04-01 08:50:00', 'TXN1005'),
(6, 6, 6, 6, 55.00, 'card', '2024-04-01 08:55:00', 'TXN1006'),
(7, 7, 7, 7, 50.00, 'cash', '2024-04-01 09:00:00', 'TXN1007'),
(8, 8, 8, 1, 50.00, 'M-Pesa', '2024-04-01 09:05:00', 'TXN1008'),
(9, 9, 9, 2, 45.00, 'card', '2024-04-01 09:10:00', 'TXN1009'),
(10, 10, 10, 3, 40.00, 'cash', '2024-04-01 09:15:00', 'TXN1010');
```

## 13. Notifications

**Table**: `notifications`

Notifications are sent to users regarding various events or updates.

```sql
-- Insert Notifications
INSERT INTO notifications (notification_id, user_id, notification_type, content, is_read, date_sent) VALUES
(1, 1, 'fare_update', 'Fare for route 1 has been updated to KES 55.', FALSE, '2024-04-01 10:00:00'),
(2, 2, 'maintenance', 'Matatu KDX456B is under maintenance until further notice.', FALSE, '2024-04-01 10:05:00'),
(3, 3, 'route_change', 'New stop added to route 2 at Ngong Hills.', FALSE, '2024-04-01 10:10:00'),
(4, 4, 'safety_alert', 'Please ensure all seat belts are in working condition.', FALSE, '2024-04-01 10:15:00'),
(5, 5, 'service_update', 'Increased matatu frequency on route 6 during peak hours.', FALSE, '2024-04-01 10:20:00'),
(6, 6, 'fare_discount', 'Enjoy a 10% discount on all fares paid via M-Pesa.', FALSE, '2024-04-01 10:25:00'),
(7, 7, 'event_notice', 'Road closures expected near Karen Forest this weekend.', FALSE, '2024-04-01 10:30:00'),
(8, 8, 'security_alert', 'Report any suspicious activity to authorities immediately.', FALSE, '2024-04-01 10:35:00'),
(9, 9, 'fare_update', 'Fare for route 5 reduced to KES 30 to encourage usage.', FALSE, '2024-04-01 10:40:00'),
(10, 10, 'maintenance', 'Matatu KLX890J has completed maintenance and is back in service.', FALSE, '2024-04-01 10:45:00');
```

## 14. Additional Data: Users' Password Hashes

**Note**: The `password_hash` values provided in the `users` table are placeholders (`$2b$10$...`). In a real-world scenario, ensure that these are securely hashed using a robust algorithm like bcrypt.

## 15. Final Notes

**Data Integrity**: Ensure that the inserted data respects all foreign key constraints. The provided `INSERT` statements follow the correct order to maintain referential integrity.

**Timestamps**: All `timestamp` and `date_*` fields use realistic dates. Adjust these as needed based on your application's timeline.

**Unique Constraints**: The `registration_number`, `email`, and `username` fields are unique. Ensure that inserted values do not violate these constraints.

**ENUM Constraints**: For fields like `current_status`, `contribution_type`, `vote_type`, `report_type`, and `payment_method`, ensure that the inserted values adhere to the defined ENUM constraints.

### Execution Instructions

**Connect to Your PostgreSQL Database:**

- Open your terminal and connect to the `matatu_db` database using the `matatu_user` role.

```bash
psql -U matatu_user -d matatu_db
```

**Execute the Insert Statements:**

- Copy and paste the `INSERT` statements provided above into your PostgreSQL prompt or execute them as a SQL script.

**Verify the Data:**

After executing the insertions, verify that the data has been populated correctly.

```sql
-- Check Users
SELECT * FROM users;

-- Check Operators
SELECT * FROM operators;

-- Check Routes
SELECT * FROM routes;

-- Check Stops
SELECT * FROM stops;

-- Check Matatus
SELECT * FROM matatus;

-- Check Route Stops
SELECT * FROM route_stops;

-- Check Matatu Locations
SELECT * FROM matatu_locations;

-- Check Contributions
SELECT * FROM contributions;

-- Check Votes
SELECT * FROM votes;

-- Check Reports
SELECT * FROM reports;

-- Check Fares
SELECT * FROM fares;

-- Check Notifications
SELECT * FROM notifications;
```

**Handle Any Errors:**

If you encounter any errors during insertion, review the error messages to identify and correct the issues, ensuring that all foreign keys and constraints are satisfied.

### Conclusion

The provided `INSERT` statements populate your Matatu-Link database with realistic and culturally relevant data tailored to Nairobi's transportation ecosystem. This setup will facilitate effective testing and development of your application's backend functionalities. Ensure to replace placeholder values, especially for sensitive fields like `password_hash`, with secure and appropriately hashed data in a production environment.

Feel free to reach out if you need further assistance with data population or any other aspect of your project!