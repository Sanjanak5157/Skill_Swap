// const API_BASE = 'http://localhost:5000/api';

// // Check if user is logged in
// export const checkAuth = () => {
//     return localStorage.getItem('token');
// };

// // Login function
// export const login = async (email, password) => {
//     try {
//         const response = await fetch(`${API_BASE}/auth/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('user', JSON.stringify(data.user));
//             return { success: true, data };
//         } else {
//             return { success: false, error: data.message };
//         }
//     } catch (error) {
//         return { success: false, error: 'Network error' };
//     }
// };

// // Register function
// export const register = async (userData) => {
//     try {
//         const response = await fetch(`${API_BASE}/auth/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             return { success: true, data };
//         } else {
//             return { success: false, error: data.message };
//         }
//     } catch (error) {
//         return { success: false, error: 'Network error' };
//     }
// };

// // Logout function
// export const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '../index.html';
// };

// // Get auth headers for API calls
// export const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     return {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     };
// };
const API_BASE = 'http://localhost:5000/api';

// Utility functions
export const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                animation: slideInRight 0.3s ease;
            }
            .notification-info { background: #667eea; }
            .notification-success { background: #48bb78; }
            .notification-error { background: #f56565; }
            .notification-warning { background: #ed8936; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
};

// Check if user is logged in
export const checkAuth = () => {
    return localStorage.getItem('token');
};

// Get current user data
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            showNotification('Login successful!', 'success');
            return { success: true, data: data.data };
        } else {
            showNotification(data.message || 'Login failed', 'error');
            return { success: false, error: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please try again.', 'error');
        return { success: false, error: 'Network error' };
    }
};

// Register function
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showNotification('Registration successful! Please login.', 'success');
            return { success: true, data: data.data };
        } else {
            showNotification(data.message || 'Registration failed', 'error');
            return { success: false, error: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Network error. Please try again.', 'error');
        return { success: false, error: 'Network error' };
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully', 'info');
    window.location.href = '../index.html';
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Verify token and get user profile
export const verifyAuth = async () => {
    const token = checkAuth();
    if (!token) {
        return { success: false, error: 'No token found' };
    }

    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return { success: true, user: data.data.user };
        } else {
            // Token is invalid, logout user
            logout();
            return { success: false, error: data.message };
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        return { success: false, error: 'Network error' };
    }
};

// Update user profile
export const updateProfile = async (profileData) => {
    try {
        const response = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Update local storage with new user data
            localStorage.setItem('user', JSON.stringify(data.data.user));
            showNotification('Profile updated successfully!', 'success');
            return { success: true, data: data.data };
        } else {
            showNotification(data.message || 'Update failed', 'error');
            return { success: false, error: data.message };
        }
    } catch (error) {
        console.error('Update profile error:', error);
        showNotification('Network error. Please try again.', 'error');
        return { success: false, error: 'Network error' };
    }
};