const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
    console.log('Database connected...');
    return sequelize.sync();
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
}).catch(err => console.log('Database connection error:', err));
