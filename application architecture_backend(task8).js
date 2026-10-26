const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Backend Server',
        status: 'Server is Running',
        port: PORT
    });
});

// API Health Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'API is healthy',
        timestamp: new Date()
    });
});

// About Route
app.get('/api/about', (req, res) => {
    res.status(200).json({
        application: 'Backend Application',
        framework: 'Express.js',
        runtime: 'Node.js',
        version: '1.0.0'
    });
});

// User Data
let users = [
    { id: 1, name: 'Arun', role: 'Admin' },
    { id: 2, name: 'Priya', role: 'User' }
];

// Get All Users
app.get('/api/users', (req, res) => {
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// Get User by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Create New User
app.post('/api/users', (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({
            success: false,
            message: 'Name and role are required'
        });
    }

    const newUser = {
        id: users.length
            ? Math.max(...users.map(u => u.id)) + 1
            : 1,
        name,
        role
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// Update User
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const { name, role } = req.body;

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
    });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const deletedUser = users.splice(index, 1);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser[0]
    });
});

// Search Users
app.get('/api/search', (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a name to search'
        });
    }

    const result = users.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase())
    );

    res.status(200).json({
        success: true,
        count: result.length,
        data: result
    });
});

// Custom Middleware
app.use((req, res, next) => {
    console.log('Request received at:', new Date().toISOString());
    next();
});

// Handle Unknown Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedURL: req.originalUrl
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('------------------------------');
    console.log('Backend Server Started');
    console.log(`Server URL: http://localhost:${PORT}`);
    console.log(`Home: http://localhost:${PORT}/`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Users: http://localhost:${PORT}/api/users`);
    console.log('Server Status: Running');
    console.log('------------------------------');
});