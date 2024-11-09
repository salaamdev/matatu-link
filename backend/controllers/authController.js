const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Correct
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({where: {email}});

        if (existingUser) return res.status(400).json({message: 'Email already in use'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, passwordHash: hashedPassword});

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});

        if (!user) return res.status(400).json({message: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({userId: user.id, role: user.roleId}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: error.message});
    }
};
