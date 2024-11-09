To export your entire `matatu_db` database to your desktop and import it on another machine, follow these steps.

### 1. Export the Database

Run the following command to export `matatu_db` as a `.sql` file to your desktop:

```bash
pg_dump -U postgres -d matatu_db -F c -f ~/Desktop/matatu_db_backup.sql
```

Explanation:

- `-U postgres`: Specifies the PostgreSQL user (replace `postgres` with your actual username if different).
- `-d matatu_db`: The name of the database to export.
- `-F c`: Specifies the format as a custom-format archive (alternatively, use `-F p` for plain-text SQL format).
- `-f ~/Desktop/matatu_db_backup.sql`: The path and filename to save the backup (this saves it to your desktop).

### 2. Transfer the Backup File to the Other Machine

If you're using SSH to transfer the file to another machine, you can run:

```bash
scp ~/Desktop/matatu_db_backup.sql username@remote_ip:/path/to/destination
```

Replace `username` and `remote_ip` with the SSH username and IP address of the target machine, and `/path/to/destination` with the path on the other machine where you want to save the file.

### 3. Import the Database on the Other Machine

On the other machine, use the following command to import the `.sql` file:

1. First, create the database if it doesn’t exist:

   ```bash
   createdb -U postgres matatu_db
   ```

2. Import the database:

   ```bash
   pg_restore -U postgres -d matatu_db /path/to/matatu_db_backup.sql
   ```

   - Replace `/path/to/matatu_db_backup.sql` with the actual path to the backup file.
   - If you used `pg_dump` with `-F p` (plain format), use `psql` instead:

     ```bash
     psql -U postgres -d matatu_db -f /path/to/matatu_db_backup.sql
     ```

Your database should now be successfully imported into the new machine! Let me know if you encounter any issues or need further assistance.
