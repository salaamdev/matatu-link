import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('matatu_link.db');

export const initDatabase = () => {
    db.transaction(tx => {
        // Users Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
        );

        // Routes Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Routes (
        route_id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_name TEXT,
        start_point TEXT,
        end_point TEXT,
        distance REAL,
        estimated_time INTEGER,
        is_active INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
        );

        // Stops Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Stops (
        stop_id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER,
        stop_name TEXT,
        latitude REAL,
        longitude REAL,
        order INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (route_id) REFERENCES Routes(route_id)
      );`
        );

        // Matatus Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Matatus (
        matatu_id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER,
        plate_number TEXT UNIQUE,
        current_latitude REAL,
        current_longitude REAL,
        status TEXT,
        last_updated DATETIME,
        FOREIGN KEY (route_id) REFERENCES Routes(route_id)
      );`
        );

        // UserFavorites Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS UserFavorites (
        favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        route_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (route_id) REFERENCES Routes(route_id)
      );`
        );

        // Contributions Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Contributions (
        contribution_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        data TEXT,
        votes INTEGER DEFAULT 0,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      );`
        );

        // Notifications Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Notifications (
        notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        message TEXT,
        is_read INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      );`
        );

        // Reports Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Reports (
        report_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        subject TEXT,
        message TEXT,
        image TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      );`
        );

        // SafetyTips Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS SafetyTips (
        tip_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
        );

        // Settings Table
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Settings (
        setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        notification_enabled INTEGER,
        location_tracking INTEGER,
        theme TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      );`
        );
    });
};

export default db;
