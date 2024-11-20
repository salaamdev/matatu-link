const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const matatuRoutes = require('./routes/matatuRoutes');
const routeRoutes = require('./routes/routeRoutes');
const stopRoutes = require('./routes/stopRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matatus', matatuRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);

// Socket.io setup
io.on('connection', (socket) => {
    console.log(`Client connected: ${ socket.id }`);
    socket.on('locationUpdate', (data) => {
        // Handle matatu location updates
        io.emit('locationUpdated', data);
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${ socket.id }`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'An internal server error occurred'});
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
    })
    .catch(err => console.log('Database connection error:', err));
