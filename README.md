# Task Management Application

A full-stack task management application built with Node.js, Express, MongoDB, and vanilla JavaScript. This application allows users to register, authenticate, and manage their tasks with features like creating, updating, deleting, and filtering tasks.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (All, Pending, In Progress, Completed)
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between different color themes
- **Real-time Updates**: Dynamic task management without page refresh
- **Progress Tracking**: Visual indicators for task status and deadlines

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (either locally installed or cloud-based like MongoDB Atlas)
- npm (Node Package Manager)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TaskManage
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Go back to the root directory:
   ```bash
   cd ..
   ```

## 🔧 Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT
MONGODB_URI
JWT_SECRET
```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Serve the frontend (in a separate terminal):
   ```bash
   cd client
   npx serve
   ```
   
   Or use any static server of your choice.

3. Access the application at `http://localhost:3000` (or the port served by your static server)

### Production Deployment

The application is configured to work with deployment platforms like Render. The API endpoint is already configured to connect to the deployed backend.

## 📖 Usage

### User Registration
1. Visit the application homepage
2. Click on "Register here" in the login form
3. Fill in your username, email, and password
4. Submit the form to create an account

### User Login
1. Enter your registered email and password
2. Click "Login" to access your dashboard

### Managing Tasks
1. After logging in, you'll see your dashboard
2. Click "Add Task" to create a new task
3. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Status (Pending, In Progress, Completed)
   - Deadline (required)
4. Save the task to add it to your list

### Editing and Deleting Tasks
- Click "Edit" to modify an existing task
- Click "Start" to move a task from Pending to In Progress
- Click "Complete" to mark a task as completed
- Click "Delete" to remove a task permanently

### Filtering Tasks
Use the filter buttons to display tasks based on their status:
- All Tasks
- Pending
- In Progress
- Completed

### Profile Management
Access your profile page to view account information:
- Member since date
- Total tasks count
- Completed tasks count

## 📱 Responsive Design

The application features a fully responsive design that works on:

- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Adapted layouts for medium-sized screens
- **Mobile**: Touch-friendly interface with hamburger menu navigation
- **Small Mobile**: Optimized for devices with limited screen space

## 🎨 Theme Options

The application includes three color themes:
- Grey theme (default)
- White theme
- Black theme

Click the palette icon in the navigation bar to cycle through themes.

## 🗂️ Project Structure

```
TaskManage/
├── client/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styling and responsive design
│   └── script.js           # Client-side JavaScript
├── server/
│   ├── app.js              # Main Express application
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/
│   │   ├── User.js         # User model
│   │   └── Task.js         # Task model
│   └── routes/
│       ├── authRoutes.js   # Authentication routes
│       └── taskRoutes.js   # Task-related routes
├── .env                    # Environment variables (not included in repo)
├── .gitignore              # Files to ignore in Git
└── README.md               # This file
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Input validation
- Protected routes requiring authentication
- Secure session management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 🐛 Known Issues

- None at the moment. Please report any issues you encounter.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Abuzar Ahmad

## 📞 Support

If you have any questions or need help with the application, feel free to contact me.

---

⭐ If you find this project helpful, please give it a star!