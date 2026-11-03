
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'student_management_secret';

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Temporary Data Storage
let users = [];
let students = [];
let courses = [];

let userId = 1;
let studentId = 1;
let courseId = 1;

// Authentication Middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token required'
        });
    }

    try {
        req.user = jwt.verify(token.split(' ')[1], SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

// HOME API
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Student and Course Management API is running'
    });
});

// HEALTH API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'API is healthy'
    });
});

// REGISTER API
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 6 characters'
            });
        }

        const existingUser = users.find(
            user => user.email === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: userId++,
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// LOGIN API
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = users.find(
            user => user.email === email.toLowerCase()
        );

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// CREATE STUDENT API
app.post('/api/students', authenticate, (req, res) => {
    const { name, email, age, department } = req.body;

    if (!name || !email || age === undefined || !department) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, age and department are required'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid student email'
        });
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
        return res.status(400).json({
            success: false,
            message: 'Age must be a valid positive integer'
        });
    }

    if (students.some(s => s.email === email.toLowerCase())) {
        return res.status(409).json({
            success: false,
            message: 'Student email already exists'
        });
    }

    const student = {
        id: studentId++,
        name,
        email: email.toLowerCase(),
        age,
        department
    };

    students.push(student);

    res.status(201).json({
        success: true,
        message: 'Student added successfully',
        data: student
    });
});

// GET ALL STUDENTS API
app.get('/api/students', authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});

// GET STUDENT BY ID API
app.get('/api/students/:id', authenticate, (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    res.status(200).json({
        success: true,
        data: student
    });
});

// UPDATE STUDENT API
app.put('/api/students/:id', authenticate, (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    const { name, email, age, department } = req.body;

    if (!name || !email || age === undefined || !department) {
        return res.status(400).json({
            success: false,
            message: 'All student fields are required'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid student email'
        });
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
        return res.status(400).json({
            success: false,
            message: 'Invalid age'
        });
    }

    if (students.some(s =>
        s.id !== student.id &&
        s.email === email.toLowerCase()
    )) {
        return res.status(409).json({
            success: false,
            message: 'Email already belongs to another student'
        });
    }

    Object.assign(student, {
        name,
        email: email.toLowerCase(),
        age,
        department
    });

    res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student
    });
});

// PARTIAL UPDATE STUDENT API
app.patch('/api/students/:id', authenticate, (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    const allowed = ['name', 'email', 'age', 'department'];
    const keys = Object.keys(req.body);

    if (keys.length === 0 || keys.some(k => !allowed.includes(k))) {
        return res.status(400).json({
            success: false,
            message: 'Provide valid student fields to update'
        });
    }

    const updated = { ...student, ...req.body };

    if (typeof updated.name !== 'string' || !updated.name.trim() ||
        typeof updated.department !== 'string' || !updated.department.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Name and department must be non-empty strings'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updated.email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email'
        });
    }

    if (!Number.isInteger(updated.age) ||
        updated.age < 1 || updated.age > 120) {
        return res.status(400).json({
            success: false,
            message: 'Invalid age'
        });
    }

    updated.email = updated.email.toLowerCase();

    if (students.some(s =>
        s.id !== student.id && s.email === updated.email
    )) {
        return res.status(409).json({
            success: false,
            message: 'Email already belongs to another student'
        });
    }

    Object.assign(student, updated);

    res.status(200).json({
        success: true,
        message: 'Student partially updated',
        data: student
    });
});

// DELETE STUDENT API
app.delete('/api/students/:id', authenticate, (req, res) => {
    const index = students.findIndex(
        s => s.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    const deleted = students.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: deleted
    });
});

// CREATE COURSE API
app.post('/api/courses', authenticate, (req, res) => {
    const { title, description, duration, instructor } = req.body;

    if (!title || !description ||
        duration === undefined || !instructor) {
        return res.status(400).json({
            success: false,
            message: 'Title, description, duration and instructor are required'
        });
    }

    if (typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim() ||
        typeof instructor !== 'string' || !instructor.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Course fields must be non-empty strings'
        });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Duration must be a positive integer'
        });
    }

    const course = {
        id: courseId++,
        title: title.trim(),
        description: description.trim(),
        duration,
        instructor: instructor.trim()
    };

    courses.push(course);

    res.status(201).json({
        success: true,
        message: 'Course added successfully',
        data: course
    });
});

// GET ALL COURSES API
app.get('/api/courses', authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// GET COURSE BY ID API
app.get('/api/courses/:id', authenticate, (req, res) => {
    const course = courses.find(
        c => c.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// UPDATE COURSE API
app.put('/api/courses/:id', authenticate, (req, res) => {
    const course = courses.find(
        c => c.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    const { title, description, duration, instructor } = req.body;

    if (!title || !description ||
        duration === undefined || !instructor) {
        return res.status(400).json({
            success: false,
            message: 'All course fields are required'
        });
    }

    if (typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim() ||
        typeof instructor !== 'string' || !instructor.trim() ||
        !Number.isInteger(duration) || duration <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course data'
        });
    }

    Object.assign(course, {
        title: title.trim(),
        description: description.trim(),
        duration,
        instructor: instructor.trim()
    });

    res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course
    });
});

// PARTIAL UPDATE COURSE API
app.patch('/api/courses/:id', authenticate, (req, res) => {
    const course = courses.find(
        c => c.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    const allowed = ['title', 'description', 'duration', 'instructor'];
    const keys = Object.keys(req.body);

    if (keys.length === 0 || keys.some(k => !allowed.includes(k))) {
        return res.status(400).json({
            success: false,
            message: 'Provide valid course fields to update'
        });
    }

    const updated = { ...course, ...req.body };

    if (typeof updated.title !== 'string' || !updated.title.trim() ||
        typeof updated.description !== 'string' ||
        !updated.description.trim() ||
        typeof updated.instructor !== 'string' ||
        !updated.instructor.trim() ||
        !Number.isInteger(updated.duration) ||
        updated.duration <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course data'
        });
    }

    Object.assign(course, updated);

    res.status(200).json({
        success: true,
        message: 'Course partially updated',
        data: course
    });
});

// DELETE COURSE API
app.delete('/api/courses/:id', authenticate, (req, res) => {
    const index = courses.findIndex(
        c => c.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    const deleted = courses.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
        data: deleted
    });
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log('================================');
    console.log('Student & Course Management API');
    console.log(`Server: http://localhost:${PORT}`);
    console.log('================================');
});
