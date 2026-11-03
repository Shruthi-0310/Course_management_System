const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/CollegeDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// USER COLLECTION
const User = mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "admin", "teacher"],
        default: "student"
    }
}, { timestamps: true }));

// STUDENT COLLECTION
const Student = mongoose.model("Student", new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    department: { type: String, required: true },
    year: { type: Number, min: 1, max: 5, required: true }
}));

// COURSE COLLECTION
const Course = mongoose.model("Course", new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true, min: 1 }
}));

// ENROLLMENT COLLECTION
const Enrollment = mongoose.model("Enrollment", new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Active", "Completed", "Cancelled"],
        default: "Active"
    }
}));

// Prevent duplicate enrollments
Enrollment.schema.index(
    { studentId: 1, courseId: 1 },
    { unique: true }
);

// NOTIFICATION COLLECTION
const Notification = mongoose.model("Notification", new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
}));

// CREATE SAMPLE DATA
app.post("/create", async (req, res) => {
    try {
        const user = await User.create({
            name: "Shruthi",
            email: "shruthi@gmail.com",
            password: "123456",
            role: "student"
        });

        const student = await Student.create({
            userId: user._id,
            department: "Computer Science",
            year: 3
        });

        const course = await Course.create({
            title: "Artificial Intelligence",
            description: "Introduction to AI",
            duration: 30
        });

        const enrollment = await Enrollment.create({
            studentId: student._id,
            courseId: course._id
        });

        await Notification.create({
            userId: user._id,
            message: "Successfully enrolled in AI Course"
        });

        res.json({
            message: "Database Records Created Successfully",
            user,
            student,
            course,
            enrollment
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DISPLAY ALL COLLECTIONS
app.get("/data", async (req, res) => {
    const users = await User.find();
    const students = await Student.find().populate("userId");
    const courses = await Course.find();
    const enrollments = await Enrollment.find()
        .populate("studentId")
        .populate("courseId");
    const notifications = await Notification.find().populate("userId");

    res.json({
        users,
        students,
        courses,
        enrollments,
        notifications
    });
});

// START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});