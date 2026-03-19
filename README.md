# 📱 Smart Task Manager

## 📌 Project Overview
Smart Task Manager is a full-stack mobile application that allows users to manage daily tasks efficiently. It includes authentication, task tracking, and progress monitoring.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Persistent Login (AsyncStorage)

### 📋 Task Management
- Add Task
- Update Task Status
- Delete Task
- View Tasks

### 📊 Task Status
- Pending
- In Progress
- Completed

### 🔍 Search & Filter
- Search tasks by title
- Filter tasks by status

### 📈 Progress Tracking
- Shows percentage of completed tasks

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- AsyncStorage

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## 📂 Project Structure
smart-task-manager
├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middleware
│ ├── server.js
│ └── package.json
│
└── mobile-app
├── app
├── assets
├── constants
├── package.json
└── app.json


---

### ⚙️ Installation & Setup

## 🔧 Backend Setup

```bash
cd backend
npm install
node server.js```


###📱 Mobile App Setup
cd mobile-app
npm install
npm start


---

### 🔑 Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=5000

---

## 📱 How to Use

Register a new account

Login with credentials

Add tasks

Update task status (Pending → In Progress → Completed)

Search or filter tasks

Track progress

---

## 🧪 Validation Features

- Email format validation

- Password minimum length validation

- Empty input checks

---


##👨‍💻 Author

- Pranoj Chhetri
