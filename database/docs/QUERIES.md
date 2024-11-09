To interact with your `matatu_db` database using the `psql` command-line tool, follow these steps:

1. **Connect to the Database**:
   Since you've configured password-based authentication (`md5`), you can connect as `matatu_user` by entering the following command and providing the password when prompted:

   ```bash
   psql -U matatu_user -d matatu_db
   ```

   If you encounter any issues, ensure that the PostgreSQL service is running and that the authentication settings in `pg_hba.conf` are correctly configured.

2. **Explore the Database Schema**:
   Once connected, you can use the following `psql` meta-commands to examine the database structure:

   - **List All Tables**:

     ```sql
     \dt
     ```

     This command displays all tables in the current database.

   - **Describe a Specific Table**:

     ```sql
     \d table_name
     ```

     Replace `table_name` with the name of the table you want to inspect. This command provides details about the table's columns, types, and constraints.

   - **List All Databases**:

     ```sql
     \l
     ```

     This command lists all databases available on the server.

   - **Switch to Another Database**:

     ```sql
     \c database_name
     ```

     Replace `database_name` with the name of the database you wish to connect to.

   - **List All Users/Roles**:

     ```sql
     \du
     ```

     This command displays all roles and their attributes.

   - **Get Help on SQL Commands**:

     ```sql
     \h
     ```

     This command provides help on SQL syntax and usage.

   - **Exit `psql`**:
     ```sql
     \q
     ```
     This command quits the `psql` session.

   For a comprehensive list of `psql` commands and their descriptions, you can refer to the official PostgreSQL documentation:

3. **Execute SQL Queries**:
   You can perform standard SQL operations within the `psql` session. For example:

   - **Select Data from a Table**:

     ```sql
     SELECT * FROM table_name;
     ```

     This query retrieves all records from the specified table.

   - **Insert Data into a Table**:

     ```sql
     INSERT INTO table_name (column1, column2) VALUES ('value1', 'value2');
     ```

     This command inserts a new record into the table.

   - **Update Data in a Table**:

     ```sql
     UPDATE table_name SET column1 = 'new_value' WHERE condition;
     ```

     This command updates existing records that meet the specified condition.

   - **Delete Data from a Table**:
     ```sql
     DELETE FROM table_name WHERE condition;
     ```
     This command removes records that satisfy the given condition.

   Ensure that each SQL statement ends with a semicolon (`;`) to execute it.

Using the \! Command: The \! meta-command allows you to execute shell commands directly from within psql. To clear the screen, you can use:

```sql
\! clear
```

By utilizing these commands and queries, you can effectively navigate and manage your `matatu_db` database using the `psql` interface.
