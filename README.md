# Task Management Application

A full-stack task management application with user authentication and task CRUD operations.

## Features

- User registration and authentication
- Task creation, reading, updating, and deletion
- Task filtering by status
- Responsive modern UI
- Secure JWT-based authentication
- Input validation and error handling

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS with modern design principles

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)

## Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:3000`

## Frontend

Open `client/index.html` in your browser to access the user interface.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks
- `GET /api/tasks` - Get all user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Security Features

- JWT token-based authentication
- Protected routes requiring valid tokens
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configuration

## Folder Structure

```
TaskManage/
├── client/
│   ├── index.html      # Main frontend page
│   ├── style.css       # Styling for the application
│   └── script.js       # Frontend JavaScript logic
├── server/
│   ├── app.js              # Main server file
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/
│   │   ├── Task.js         # Task model
│   │   └── User.js         # User model
│   └── routes/
│       ├── authRoutes.js   # Authentication routes
│       └── taskRoutes.js   # Task-related routes
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```