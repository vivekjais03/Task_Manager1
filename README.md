# 🚀 TaskFlow — Team Task Manager

TaskFlow is a modern full-stack Team Task Management web application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

The application is designed to help teams and organizations efficiently manage projects, assign tasks, monitor progress, and collaborate in real time through a modern SaaS-style dashboard.

This project focuses on implementing real-world full-stack development concepts such as authentication, role-based access control, RESTful APIs, responsive UI design, drag-and-drop task management, and cloud deployment.

---

# 🌐 Live Deployment

## Frontend (Vercel)
https://task-manager1-d6nc.vercel.app

## Backend API (Railway)
https://taskmanager-production-7c88.up.railway.app

---

# 📌 Project Objective

The main objective of this project is to build a collaborative task and project management platform where:

- Admins can create and manage projects
- Team members can work on assigned tasks
- Teams can track project progress visually
- Users can monitor deadlines and productivity
- Organizations can improve workflow efficiency

The project simulates a real-world SaaS productivity platform used in software companies and organizations.

---

# ✨ Features

## 🔐 Authentication & Security

- User Registration and Login
- JWT-Based Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Secure API Access
- Session Persistence

---

## 👥 Role-Based Access Control (RBAC)

Two user roles are supported:

### Admin
- Create/Edit/Delete Projects
- Create and Assign Tasks
- Manage Team Members
- Access Dashboard Analytics
- Monitor Team Progress

### Member
- View Assigned Tasks
- Update Task Status
- Add Task Comments
- Track Personal Productivity

---

## 📁 Project Management

- Create New Projects
- Update Project Information
- Delete Projects
- Invite Team Members
- Track Project Progress
- View Project Details

---

## ✅ Task Management

- Create Tasks
- Assign Tasks to Team Members
- Set Task Priorities
- Add Due Dates
- Task Categories and Labels
- Edit/Delete Tasks
- Update Task Status
- Mark Tasks as Completed

---

## 📊 Analytics Dashboard

Interactive analytics dashboard containing:

- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Team Productivity Charts
- Project Statistics
- Recent Activities
- Progress Tracking

Charts are implemented using Recharts.

---

## 🧩 Drag-and-Drop Kanban Board

Kanban workflow implemented using dnd-kit.

Task stages include:
- Todo
- In Progress
- Review
- Completed

Users can drag and drop tasks between columns dynamically.

---

## 💬 Task Comments & Activity Logs

- Add Comments to Tasks
- Activity Tracking
- Team Collaboration Support
- Task History Management

---

## 🌙 Dark Mode

- Light/Dark Theme Toggle
- Theme Persistence
- Modern UI Design

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop Devices
- Tablets
- Mobile Phones

---

# 🛠 Technology Stack

## Frontend Technologies

- React.js
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- dnd-kit
- Lucide React
- React Hot Toast

---

## Backend Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors

---

## Deployment Platforms

- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

# 📂 Project Structure

```bash
Task_Manager1/

│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/vivekjais03/Task_Manager1.git

cd Task_Manager1
```

---

## 2️⃣ Install Dependencies

### Install Root Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd server

npm install
```

### Install Frontend Dependencies

```bash
cd ../client

npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

JWT_EXPIRE=7d

NODE_ENV=development
```

---

# ▶️ Running the Application

## Start Backend Server

```bash
cd server

npm run dev
```

---

## Start Frontend Application

```bash
cd client

npm start
```

---

# 🌍 Local URLs

| Service | URL |
|----------|------|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |

---

# 📡 API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/auth/register | Register New User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/me | Get Current User |

---

## Project Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/projects | Get All Projects |
| POST | /api/projects | Create New Project |
| PUT | /api/projects/:id | Update Project |
| DELETE | /api/projects/:id | Delete Project |

---

## Task Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/tasks | Get All Tasks |
| POST | /api/tasks | Create New Task |
| PUT | /api/tasks/:id | Update Task |
| DELETE | /api/tasks/:id | Delete Task |
| GET | /api/tasks/dashboard | Dashboard Analytics |

---

# 🔐 Demo Credentials

## Admin Account

```bash
Email: admin@demo.com

Password: demo1234
```

---

## Member Account

```bash
Email: member@demo.com

Password: demo1234
```

---

# 🚀 Deployment Process

## Frontend Deployment

Platform Used:
- Vercel

Purpose:
- Hosting React Frontend Application

---

## Backend Deployment

Platform Used:
- Railway

Purpose:
- Hosting Node.js Backend Server

---

## Database Deployment

Platform Used:
- MongoDB Atlas

Purpose:
- Cloud-Based NoSQL Database

---

# 🎯 Future Enhancements

Possible future improvements:

- Real-time Chat System
- WebSocket Integration
- Email Notifications
- File Upload Support
- AI-Based Task Suggestions
- Calendar Integration
- Activity Timeline
- Advanced Team Analytics
- Multi-language Support

---

# 👨‍💻 Author

## Vivek Jaiswal

B.Tech Computer Science Student  
Full Stack Developer

GitHub:
https://github.com/vivekjais03

---

# ⭐ Conclusion

TaskFlow demonstrates the implementation of a complete real-world MERN stack application with:

- Authentication & Authorization
- Database Integration
- RESTful APIs
- Responsive Frontend
- Modern UI/UX
- Drag-and-Drop Features
- Cloud Deployment

This project showcases practical knowledge of full-stack web development and collaborative task management systems.

---

# ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub.

Thank You 🚀
