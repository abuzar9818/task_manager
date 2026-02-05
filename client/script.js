// API base URL - since frontend is served from same server, we can use relative path
const API_BASE_URL = '/api';

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const profileSection = document.getElementById('profile-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const usernameDisplay = document.getElementById('username-display');
const backToTasksBtn = document.getElementById('back-to-tasks');
const tasksList = document.getElementById('tasks-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close');
const taskForm = document.getElementById('task-form');
const filterBtns = document.querySelectorAll('.filter-btn');
const navUsername = document.getElementById('nav-username');
const userInitial = document.getElementById('user-initial');
const homeLink = document.getElementById('home-link');
const tasksLink = document.getElementById('tasks-link');
const profileLink = document.getElementById('profile-link');
const colorToggle = document.getElementById('color-toggle');
const logoutBtnNav = document.getElementById('logout-btn-nav');
const authColorToggle = document.getElementById('auth-color-toggle');
const navLinks = document.querySelector('.nav-links');

let currentUser = null;
let currentFilter = 'all';
let tasks = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);

loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
addTaskBtn.addEventListener('click', openAddTaskModal);
closeModal.addEventListener('click', closeTaskModal);
taskForm.addEventListener('submit', handleTaskSubmit);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeTaskModal();
    }
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Navigation links
homeLink.style.display = 'none'; // Hide home link completely

tasksLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // If profile section is visible, hide it
    if (!profileSection.classList.contains('hidden')) {
        profileSection.classList.add('hidden');
    }
    
    showTasksPage();
});

profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveNavLink('profile');
    showProfilePage();
});

// Show Profile Page
function showProfilePage() {
    dashboardSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
    
    // Update profile information
    const email = localStorage.getItem('email') || 'Not available';
    const username = email.split('@')[0];
    
    document.getElementById('profile-username').textContent = username;
    document.getElementById('profile-email').textContent = email;
    document.getElementById('profile-avatar').textContent = username.charAt(0).toUpperCase();
    
    // Get member since date from localStorage or use current date if not set
    const memberSince = localStorage.getItem('registrationDate') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    document.getElementById('member-since').textContent = memberSince;
    
    // Update profile stats (placeholder values)
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('completed-tasks').textContent = tasks.filter(t => t.status === 'Completed').length;
    
    // Update navigation
    setActiveNavLink('profile');
}

// Show Tasks Page
function showTasksPage() {
    profileSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    // Update navigation
    setActiveNavLink('tasks');
    
    // Re-render tasks to ensure they're displayed
    renderTasks();
}

// Set active navigation link
function setActiveNavLink(activePage) {
    homeLink.classList.remove('active');
    tasksLink.classList.remove('active');
    profileLink.classList.remove('active');
    
    switch(activePage) {
        case 'home':
            homeLink.classList.add('active');
            break;
        case 'tasks':
            tasksLink.classList.add('active');
            break;
        case 'profile':
            profileLink.classList.add('active');
            break;
    }
}

// Update navigation based on user state
function updateNavigationForAuth() {
    // Hide navigation links during authentication
    navLinks.style.display = 'none';
    logoutBtnNav.style.display = 'none';
    userInitial.style.display = 'none';
    navUsername.style.display = 'none';
}

function updateNavigationForDashboard() {
    // Show navigation links for dashboard
    navLinks.style.display = 'flex';
    logoutBtnNav.style.display = 'flex';
    userInitial.style.display = 'flex';
    navUsername.style.display = 'inline';
    
    // Home link is hidden completely now
}

// Color theme functionality
let currentTheme = localStorage.getItem('theme') || 'grey';

function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

function cycleTheme() {
    const themes = ['grey', 'white', 'black'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
}

// Initialize App
function initApp() {
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Validate token and load dashboard
        validateToken(token);
    } else {
        showAuthSection();
    }
    
    // Add event listeners
    colorToggle.addEventListener('click', cycleTheme);
    authColorToggle.addEventListener('click', cycleTheme);
    logoutBtnNav.addEventListener('click', handleLogout);
    if (backToTasksBtn) {
        backToTasksBtn.addEventListener('click', () => {
            profileSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            setActiveNavLink('tasks');
        });
    }
}

// Validate token and load dashboard
async function validateToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentUser = { token };
            await loadTasks();
            showDashboard();
        } else {
            localStorage.removeItem('token');
            showAuthSection();
        }
    } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        showAuthSection();
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            // Store user email for display purposes
            if (data.user && data.user.email) {
                localStorage.setItem('email', data.user.email);
            }
            currentUser = { token: data.token };
            await loadTasks();
            showDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Handle Registration
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Automatically login after successful registration
            await handleLoginAfterRegister(email, password);
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

// Helper function to login after registration
async function handleLoginAfterRegister(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            // Store user email for display purposes
            if (data.user && data.user.email) {
                localStorage.setItem('email', data.user.email);
            }
            
            // Store registration date if it doesn't exist
            if (!localStorage.getItem('registrationDate')) {
                localStorage.setItem('registrationDate', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
            }
            
            currentUser = { token: data.token };
            await loadTasks();
            showDashboard();
        } else {
            alert(data.message || 'Login after registration failed');
        }
    } catch (error) {
        console.error('Auto-login error:', error);
        alert('Registration successful but login failed. Please login manually.');
        showLoginForm();
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    currentUser = null;
    tasks = [];
    showAuthSection();
    
    // Reset navigation bar
    navUsername.textContent = 'User';
    userInitial.textContent = 'U';
    // Home link remains hidden as it's completely removed from the UI
}

// Load Tasks
async function loadTasks() {
    if (!currentUser?.token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            tasks = await response.json();
            renderTasks();
        } else {
            console.error('Failed to load tasks');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Render Tasks based on filter
function renderTasks() {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks yet. Add your first task!</p>
            </div>
        `;
        return;
    }

    const filteredTasks = currentFilter === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === currentFilter);

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No ${currentFilter.toLowerCase()} tasks found.</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Create Task Element
function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.status.toLowerCase().replace(' ', '-')}`;
    
    // Format deadline date
    const deadlineDate = new Date(task.deadline);
    const formattedDate = deadlineDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Create action buttons based on status
    let actionButtons = '';
    if (task.status === 'Completed') {
        // For completed tasks, only show delete button
        actionButtons = `
            <button class="action-btn delete-btn" onclick="deleteTask('${task._id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
    } else {
        // For pending/in-progress tasks, show edit and status progression buttons
        let statusButton = '';
        if (task.status === 'Pending') {
            statusButton = `<button class="action-btn edit-btn" onclick="progressTask('${task._id}', 'In Progress')">
                <i class="fas fa-arrow-right"></i> Start
            </button>`;
        } else if (task.status === 'In Progress') {
            statusButton = `<button class="action-btn edit-btn" onclick="progressTask('${task._id}', 'Completed')">
                <i class="fas fa-check"></i> Complete
            </button>`;
        }
        
        actionButtons = `
            <button class="action-btn edit-btn" onclick="openEditTaskModal('${task._id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            ${statusButton}
            <button class="action-btn delete-btn" onclick="deleteTask('${task._id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
    }

    // Conditionally show due date only if task is not completed
    const dueDateElement = task.status === 'Completed' ? '' : 
        `<span class="task-deadline-badge">Due: ${formattedDate}</span>`;

    taskCard.innerHTML = `
        <div class="task-header">
            <h3>${task.title}</h3>
            <div class="task-status-due-container">
                <span class="task-status-badge status-${task.status.toLowerCase().replace(' ', '-')}\">${task.status}</span>
                ${dueDateElement}
            </div>
        </div>
        <p>${task.description || 'No description provided.'}</p>
        <div class="task-actions">
            ${actionButtons}
        </div>
    `;

    return taskCard;
}

// Open Add Task Modal
function openAddTaskModal() {
    document.getElementById('modal-title').textContent = 'Add New Task';
    taskForm.reset();
    document.getElementById('task-id').value = '';
    taskModal.style.display = 'block';
}

// Open Edit Task Modal
function openEditTaskModal(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-deadline').value = task.deadline.split('T')[0];
    document.getElementById('task-id').value = task._id;
    taskModal.style.display = 'block';
}

// Close Task Modal
function closeTaskModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
}

// Handle Task Submit (Add/Edit)
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const status = document.getElementById('task-status').value;
    const deadline = document.getElementById('task-deadline').value;

    const taskData = {
        title,
        description,
        status,
        deadline
    };

    try {
        let response;
        if (taskId) {
            // Update existing task
            response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(taskData)
            });
        } else {
            // Create new task
            response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(taskData)
            });
        }

        if (response.ok) {
            closeTaskModal();
            await loadTasks(); // Reload tasks
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Operation failed');
        }
    } catch (error) {
        console.error('Task operation error:', error);
        alert('An error occurred while saving the task');
    }
}

// Progress Task to next status
async function progressTask(taskId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            await loadTasks(); // Reload tasks
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Update failed');
        }
    } catch (error) {
        console.error('Task progress error:', error);
        alert('An error occurred while updating the task');
    }
}

// Delete Task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            await loadTasks(); // Reload tasks
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Delete failed');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the task');
    }
}

// Show Authentication Section
function showAuthSection() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    showLoginForm();
    updateNavigationForAuth();
}

// Show Dashboard Section
function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    // Get username from email (or implement user profile endpoint)
    const email = localStorage.getItem('email') || 'User';
    const username = email.split('@')[0];
    usernameDisplay.textContent = username;
    navUsername.textContent = username;
    
    // Set user initial for avatar
    if (username && username.length > 0) {
        userInitial.textContent = username.charAt(0).toUpperCase();
    }
    
    // Update navigation for dashboard
    updateNavigationForDashboard();
    
    // Set active nav link to tasks
    setActiveNavLink('tasks');
}

// Show Login Form
function showLoginForm() {
    loginContainer.classList.add('active');
    registerContainer.classList.remove('active');
    
    // Clear forms
    loginForm.reset();
    registerForm.reset();
}

// Show Register Form
function showRegisterForm() {
    registerContainer.classList.add('active');
    loginContainer.classList.remove('active');
    
    // Clear forms
    loginForm.reset();
    registerForm.reset();
}

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});