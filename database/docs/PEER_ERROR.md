The "Peer authentication failed for user 'matatu_user'" error occurs because PostgreSQL's default authentication method for local connections is 'peer', which relies on matching the operating system username with the PostgreSQL username. In this case, the OS user 'salaam' doesn't match the PostgreSQL user 'matatu_user', leading to the authentication failure.

To resolve this issue, you can modify PostgreSQL's authentication method for local connections to 'md5' (password-based authentication). Here's how:

1. **Edit the `pg_hba.conf` File**:

   - Locate the `pg_hba.conf` file, typically found in `/etc/postgresql/16/main/` on Ubuntu systems.
   - Open the file with a text editor using superuser privileges:
     ```bash
     sudo nano /etc/postgresql/16/main/pg_hba.conf
     ```
   - Find the line that looks like:
     ```
     local   all             all                                     peer
     ```
   - Change 'peer' to 'md5':
     ```
     local   all             all                                     md5
     ```
   - Save and exit the editor.

2. **Restart PostgreSQL**:

   - Apply the changes by restarting the PostgreSQL service:
     ```bash
     sudo systemctl restart postgresql
     ```

3. **Connect Using the Password**:
   - Now, when you connect to the database, PostgreSQL will prompt for a password:
     ```bash
     psql -U matatu_user -d matatu_db
     ```
     Enter the password '1595' when prompted.

**Alternative Method**:

If you prefer not to change the authentication method, you can connect as the 'postgres' user and specify the database and user:

```bash
sudo -i -u postgres
psql -d matatu_db -U matatu_user
```

This approach uses the 'postgres' OS user, which matches the PostgreSQL 'postgres' user, allowing peer authentication to succeed.

For more details on PostgreSQL authentication methods, refer to the official documentation:
