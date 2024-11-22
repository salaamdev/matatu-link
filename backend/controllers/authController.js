const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserRole} = require('../models'); // Import both models from index.js
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
    try {
        const {username, email, password, phone_number, role_id} = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        if (existingUser) return res.status(400).json({message: 'Email already in use'});

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

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }

        // Find user with role information
        const user = await User.findOne({
            where: {email},
            include: [{
                model: UserRole,
                as: 'role'
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
            roleId: user.role_id,
            roleName: user.role?.role_name
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                roleId: user.role_id,
                roleName: user.role?.role_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: error.message});
    }
};
