// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserRole} = require('../models'); // Ensure correct model imports
const {validationResult} = require('express-validator');

// Register a new user
exports.register = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {username, email, password, phone_number, role_id} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Create new user with role_id or default to operator role (2)
        const newUser = await User.create({
            username,
            email,
            password_hash,
            phone_number,
            role_id: role_id || 2, // Default to operator role if not specified
            is_active: true
        });

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: error.message});
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        // Find user with role information
        const user = await User.findOne({
            where: {email},
            include: [{
                model: UserRole,
                as: 'userRole' // Ensure this matches the alias in models/index.js
            }]
        });

        // Check if user exists
        if (!user || !user.password_hash) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Create JWT token using the correct field names
        const token = jwt.sign({
            userId: user.user_id,
            roleId: user.role_id, // Ensure this is an integer
            roleName: user.userRole?.role_name // Updated alias
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                roleId: user.role_id,
                roleName: user.userRole?.role_name // Updated alias
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: error.message});
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: {exclude: ['password_hash']}, // Exclude sensitive data
            include: [{
                model: UserRole,
                as: 'userRole', // Ensure this matches the alias in models/index.js
                attributes: ['role_id', 'role_name']
            }]
        });
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({error: 'Failed to fetch profile'});
    }
};
