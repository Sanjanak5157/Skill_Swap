// import { logout, getAuthHeaders, checkAuth } from './auth.js';
// import { openUploadModal } from './upload.js';

// const API_BASE = 'http://localhost:5000/api';

// // Initialize the application
// document.addEventListener('DOMContentLoaded', () => {
//     // Check authentication
//     if (!checkAuth()) {
//         window.location.href = 'login.html';
//         return;
//     }

//     initializeNavigation();
//     loadSkills();
//     initializeEventListeners();
// });

// // Navigation functionality
// function initializeNavigation() {
//     const navLinks = document.querySelectorAll('.nav-link');
//     const pages = document.querySelectorAll('.page');

//     navLinks.forEach(link => {
//         link.addEventListener('click', () => {
//             const targetPage = link.getAttribute('data-page');
            
//             // Update active nav link
//             navLinks.forEach(nl => nl.classList.remove('active'));
//             link.classList.add('active');
            
//             // Show target page
//             pages.forEach(page => {
//                 page.classList.remove('active');
//                 if (page.id === `${targetPage}-page`) {
//                     page.classList.add('active');
//                     loadPageContent(targetPage);
//                 }
//             });
//         });
//     });

//     // Profile button
//     document.getElementById('profileBtn').addEventListener('click', () => {
//         window.location.href = 'profile.html';
//     });

//     // Logout button
//     document.getElementById('logoutBtn').addEventListener('click', logout);
// }

// // Load page content based on current page
// async function loadPageContent(page) {
//     switch (page) {
//         case 'skills':
//             await loadSkills();
//             break;
//         case 'courses':
//             await loadCourses();
//             break;
//         case 'notes':
//             await loadNotes();
//             break;
//         case 'projects':
//             await loadProjects();
//             break;
//         case 'colleges':
//             await loadColleges();
//             break;
//         case 'datasets':
//             await loadDatasets();
//             break;
//     }
// }

// // Load skills for skills page
// async function loadSkills() {
//     try {
//         const response = await fetch(`${API_BASE}/skills`);
//         const skills = await response.json();
        
//         const skillsGrid = document.getElementById('usersGrid');
//         skillsGrid.innerHTML = skills.map(skill => `
//             <div class="user-card" onclick="viewUserProfile(${skill.user_id})">
//                 <h3>${skill.user_name}</h3>
//                 <p class="college">${skill.college || 'No college specified'}</p>
//                 <div class="skill-item">
//                     <strong>${skill.name}</strong>
//                     <p>${skill.description}</p>
//                 </div>
//                 <button class="btn-primary" onclick="event.stopPropagation(); requestVideoCall(${skill.id})">
//                     Request Video Call
//                 </button>
//             </div>
//         `).join('');
//     } catch (error) {
//         console.error('Error loading skills:', error);
//     }
// }

// // Load courses
// async function loadCourses() {
//     try {
//         const response = await fetch(`${API_BASE}/courses`);
//         const courses = await response.json();
        
//         const coursesGrid = document.getElementById('coursesGrid');
//         coursesGrid.innerHTML = courses.map(course => `
//             <div class="content-card">
//                 <h3>${course.name}</h3>
//                 <p>${course.description}</p>
//                 <p class="author">By: ${course.user_name}</p>
//                 <button class="btn-primary" onclick="viewCourse(${course.id})">
//                     View Course
//                 </button>
//                 <button class="btn-secondary" onclick="downloadCourse(${course.id})">
//                     Download
//                 </button>
//             </div>
//         `).join('');
//     } catch (error) {
//         console.error('Error loading courses:', error);
//     }
// }

// // Initialize event listeners
// function initializeEventListeners() {
//     // Search functionality for skills
//     const skillSearch = document.getElementById('skillSearch');
//     if (skillSearch) {
//         skillSearch.addEventListener('input', debounce(async (e) => {
//             const query = e.target.value;
//             if (query.length > 2) {
//                 await searchSkills(query);
//             } else if (query.length === 0) {
//                 await loadSkills();
//             }
//         }, 300));
//     }

//     // Modal close functionality
//     const modal = document.getElementById('uploadModal');
//     const closeBtn = modal.querySelector('.close');
//     closeBtn.addEventListener('click', () => {
//         modal.style.display = 'none';
//     });

//     window.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             modal.style.display = 'none';
//         }
//     });
// }

// // Debounce function for search
// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

// // Search skills
// async function searchSkills(query) {
//     try {
//         const response = await fetch(`${API_BASE}/skills/search?q=${encodeURIComponent(query)}`);
//         const skills = await response.json();
        
//         const skillsGrid = document.getElementById('usersGrid');
//         skillsGrid.innerHTML = skills.map(skill => `
//             <div class="user-card" onclick="viewUserProfile(${skill.user_id})">
//                 <h3>${skill.user_name}</h3>
//                 <p class="college">${skill.college || 'No college specified'}</p>
//                 <div class="skill-item">
//                     <strong>${skill.name}</strong>
//                     <p>${skill.description}</p>
//                 </div>
//                 <button class="btn-primary" onclick="event.stopPropagation(); requestVideoCall(${skill.id})">
//                     Request Video Call
//                 </button>
//             </div>
//         `).join('');
//     } catch (error) {
//         console.error('Error searching skills:', error);
//     }
// }

// // Make functions available globally
// window.openUploadModal = openUploadModal;
// window.viewUserProfile = (userId) => {
//     // Implement user profile view
//     console.log('View user profile:', userId);
// };

// window.requestVideoCall = (skillId) => {
//     // Implement video call request
//     console.log('Request video call for skill:', skillId);
//     alert('Video call request sent!');
// };

// window.viewCourse = (courseId) => {
//     // Implement course view
//     console.log('View course:', courseId);
// };

// window.downloadCourse = (courseId) => {
//     // Implement course download
//     console.log('Download course:', courseId);
// };

// // Placeholder functions for other pages
// async function loadNotes() {
//     console.log('Loading notes...');
// }

// async function loadProjects() {
//     console.log('Loading projects...');
// }

// async function loadColleges() {
//     console.log('Loading colleges...');
// }

// async function loadDatasets() {
//     console.log('Loading datasets...');
// }
import { logout, getAuthHeaders, checkAuth, getCurrentUser, showNotification } from './auth.js';

const API_BASE = 'http://localhost:5000/api';

// Global state
let currentPage = 'skills';
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = getCurrentUser();
    await initializeApp();
});

// Initialize the main application
async function initializeApp() {
    initializeNavigation();
    await loadSkills();
    initializeEventListeners();
    updateUserInfo();
}

// Update user information in the UI
function updateUserInfo() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn && currentUser) {
        profileBtn.textContent = currentUser.name.charAt(0).toUpperCase();
        profileBtn.title = `Profile: ${currentUser.name}`;
    }
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetPage = link.getAttribute('data-page');
            switchPage(targetPage);
        });
    });

    // Profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Switch between pages
async function switchPage(page) {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // Update active nav link
    navLinks.forEach(nl => nl.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Show target page
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');

    currentPage = page;
    await loadPageContent(page);
}

// Load page content based on current page
async function loadPageContent(page) {
    showLoading(true);
    
    try {
        switch (page) {
            case 'skills':
                await loadSkills();
                break;
            case 'courses':
                await loadCourses();
                break;
            case 'notes':
                await loadNotes();
                break;
            case 'projects':
                await loadProjects();
                break;
            case 'colleges':
                await loadColleges();
                break;
            case 'datasets':
                await loadDatasets();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${page}:`, error);
        showNotification(`Error loading ${page}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Show/hide loading state
function showLoading(show) {
    const mainContent = document.querySelector('.main-content');
    if (show) {
        mainContent.classList.add('loading');
    } else {
        mainContent.classList.remove('loading');
    }
}

// Load skills for skills page
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE}/skills`);
        const data = await response.json();

        if (response.ok && data.success) {
            const skillsGrid = document.getElementById('usersGrid');
            if (skillsGrid) {
                skillsGrid.innerHTML = data.data.skills.map(skill => `
                    <div class="user-card" onclick="viewUserProfile(${skill.user_id})">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            ${skill.avatar_url ? 
                                `<img src="${skill.avatar_url}" alt="${skill.user_name}" style="width: 50px; height: 50px; border-radius: 50%;">` :
                                `<div style="width: 50px; height: 50px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${skill.user_name.charAt(0)}</div>`
                            }
                            <div>
                                <h3>${skill.user_name}</h3>
                                <p class="college">${skill.college || 'No college specified'}</p>
                            </div>
                        </div>
                        <div class="skill-item">
                            <strong>${skill.name}</strong>
                            <p>${skill.description || 'No description provided'}</p>
                            <small style="color: var(--primary-color);">Level: ${skill.proficiency_level}</small>
                        </div>
                        <button class="btn-primary" onclick="event.stopPropagation(); requestVideoCall(${skill.id})" style="width: 100%; margin-top: 1rem;">
                            Request Video Call
                        </button>
                    </div>
                `).join('') || '<p class="text-center">No skills found. Be the first to share a skill!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        const skillsGrid = document.getElementById('usersGrid');
        if (skillsGrid) {
            skillsGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading skills. Please try again.</p>';
        }
    }
}

// Load courses
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`);
        const data = await response.json();

        if (response.ok && data.success) {
            const coursesGrid = document.getElementById('coursesGrid');
            if (coursesGrid) {
                coursesGrid.innerHTML = data.data.courses.map(course => `
                    <div class="content-card">
                        <h3>${course.title}</h3>
                        <p>${course.description || 'No description provided'}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                            <span class="author">By: ${course.instructor_name}</span>
                            <span style="background: var(--gray-200); padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; color: var(--text-light);">
                                ${course.difficulty_level}
                            </span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="viewCourse(${course.id})" style="flex: 1;">
                                View Course
                            </button>
                            <button class="btn-secondary" onclick="downloadCourse(${course.id})">
                                📥
                            </button>
                        </div>
                    </div>
                `).join('') || '<p class="text-center">No courses found. Upload the first course!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        const coursesGrid = document.getElementById('coursesGrid');
        if (coursesGrid) {
            coursesGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading courses. Please try again.</p>';
        }
    }
}

// Load notes
async function loadNotes() {
    try {
        const response = await fetch(`${API_BASE}/notes`);
        const data = await response.json();

        if (response.ok && data.success) {
            const notesGrid = document.getElementById('notesGrid');
            if (notesGrid) {
                notesGrid.innerHTML = data.data.notes.map(note => `
                    <div class="content-card">
                        <h3>${note.title}</h3>
                        <p>${note.description || 'No description provided'}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                            <span class="author">By: ${note.author_name}</span>
                            <span style="background: var(--gray-200); padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; color: var(--text-light);">
                                ${note.file_type?.toUpperCase() || 'FILE'}
                            </span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="viewNote(${note.id})" style="flex: 1;">
                                View Note
                            </button>
                            <button class="btn-secondary" onclick="downloadNote(${note.id})">
                                📥
                            </button>
                        </div>
                    </div>
                `).join('') || '<p class="text-center">No notes found. Upload the first note!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        const notesGrid = document.getElementById('notesGrid');
        if (notesGrid) {
            notesGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading notes. Please try again.</p>';
        }
    }
}

// Load projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();

        if (response.ok && data.success) {
            const projectsGrid = document.getElementById('projectsGrid');
            if (projectsGrid) {
                projectsGrid.innerHTML = data.data.projects.map(project => `
                    <div class="content-card">
                        <h3>${project.title}</h3>
                        <p>${project.description || 'No description provided'}</p>
                        <div style="margin: 1rem 0;">
                            <span class="author">By: ${project.author_name}</span>
                            ${project.technologies ? `
                                <div style="margin-top: 0.5rem;">
                                    <small style="color: var(--text-light);">Tech: ${JSON.parse(project.technologies).join(', ')}</small>
                                </div>
                            ` : ''}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="viewProject(${project.id})" style="flex: 1;">
                                View Project
                            </button>
                            <button class="btn-secondary" onclick="downloadProject(${project.id})">
                                📥
                            </button>
                        </div>
                    </div>
                `).join('') || '<p class="text-center">No projects found. Upload the first project!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading projects. Please try again.</p>';
        }
    }
}

// Load colleges
async function loadColleges() {
    try {
        const response = await fetch(`${API_BASE}/colleges`);
        const data = await response.json();

        if (response.ok && data.success) {
            const collegesGrid = document.getElementById('collegesGrid');
            if (collegesGrid) {
                collegesGrid.innerHTML = data.data.colleges.map(college => `
                    <div class="content-card" onclick="viewCollege('${college.name}')">
                        <h3>${college.name}</h3>
                        <p>${college.description || 'No description provided'}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                            <span style="color: var(--text-light);">${college.location || 'Location not specified'}</span>
                            <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem;">
                                ${college.student_count || 0} students
                            </span>
                        </div>
                        <button class="btn-primary" onclick="event.stopPropagation(); viewCollegeStudents('${college.name}')" style="width: 100%;">
                            View Students
                        </button>
                    </div>
                `).join('') || '<p class="text-center">No colleges found. Add the first college!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading colleges:', error);
        const collegesGrid = document.getElementById('collegesGrid');
        if (collegesGrid) {
            collegesGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading colleges. Please try again.</p>';
        }
    }
}

// Load datasets
async function loadDatasets() {
    try {
        const response = await fetch(`${API_BASE}/datasets`);
        const data = await response.json();

        if (response.ok && data.success) {
            const datasetsGrid = document.getElementById('datasetsGrid');
            if (datasetsGrid) {
                datasetsGrid.innerHTML = data.data.datasets.map(dataset => `
                    <div class="content-card">
                        <h3>${dataset.title}</h3>
                        <p>${dataset.description || 'No description provided'}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                            <span class="author">By: ${dataset.author_name}</span>
                            <span style="background: var(--gray-200); padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; color: var(--text-light);">
                                ${dataset.file_format?.toUpperCase() || 'FILE'}
                            </span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="viewDataset(${dataset.id})" style="flex: 1;">
                                View Dataset
                            </button>
                            <button class="btn-secondary" onclick="downloadDataset(${dataset.id})">
                                📥
                            </button>
                        </div>
                    </div>
                `).join('') || '<p class="text-center">No datasets found. Upload the first dataset!</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading datasets:', error);
        const datasetsGrid = document.getElementById('datasetsGrid');
        if (datasetsGrid) {
            datasetsGrid.innerHTML = '<p class="text-center" style="color: var(--error-color);">Error loading datasets. Please try again.</p>';
        }
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality for skills
    const skillSearch = document.getElementById('skillSearch');
    if (skillSearch) {
        skillSearch.addEventListener('input', debounce(async (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                await searchSkills(query);
            } else if (query.length === 0) {
                await loadSkills();
            }
        }, 300));
    }

    // Modal close functionality
    const modal = document.getElementById('uploadModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search skills
async function searchSkills(query) {
    try {
        const response = await fetch(`${API_BASE}/skills/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok && data.success) {
            const skillsGrid = document.getElementById('usersGrid');
            if (skillsGrid) {
                skillsGrid.innerHTML = data.data.skills.map(skill => `
                    <div class="user-card" onclick="viewUserProfile(${skill.user_id})">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            ${skill.avatar_url ? 
                                `<img src="${skill.avatar_url}" alt="${skill.user_name}" style="width: 50px; height: 50px; border-radius: 50%;">` :
                                `<div style="width: 50px; height: 50px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${skill.user_name.charAt(0)}</div>`
                            }
                            <div>
                                <h3>${skill.user_name}</h3>
                                <p class="college">${skill.college || 'No college specified'}</p>
                            </div>
                        </div>
                        <div class="skill-item">
                            <strong>${skill.name}</strong>
                            <p>${skill.description || 'No description provided'}</p>
                            <small style="color: var(--primary-color);">Level: ${skill.proficiency_level}</small>
                        </div>
                        <button class="btn-primary" onclick="event.stopPropagation(); requestVideoCall(${skill.id})" style="width: 100%; margin-top: 1rem;">
                            Request Video Call
                        </button>
                    </div>
                `).join('') || '<p class="text-center">No skills found matching your search.</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error searching skills:', error);
        showNotification('Error searching skills', 'error');
    }
}

// Make functions available globally
window.openUploadModal = openUploadModal;
window.viewUserProfile = (userId) => {
    // Implement user profile view
    console.log('View user profile:', userId);
    showNotification('User profile feature coming soon!', 'info');
};

window.requestVideoCall = (skillId) => {
    // Implement video call request
    console.log('Request video call for skill:', skillId);
    showNotification('Video call request sent! The user will be notified.', 'success');
};

window.viewCourse = (courseId) => {
    console.log('View course:', courseId);
    showNotification('Course viewer coming soon!', 'info');
};

window.downloadCourse = (courseId) => {
    console.log('Download course:', courseId);
    showNotification('Course download started!', 'success');
};

window.viewNote = (noteId) => {
    console.log('View note:', noteId);
    showNotification('Note viewer coming soon!', 'info');
};

window.downloadNote = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE}/notes/${noteId}/download`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showNotification('Note download recorded!', 'success');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error recording note download:', error);
        showNotification('Error downloading note', 'error');
    }
};

window.viewProject = (projectId) => {
    console.log('View project:', projectId);
    showNotification('Project viewer coming soon!', 'info');
};

window.downloadProject = (projectId) => {
    console.log('Download project:', projectId);
    showNotification('Project download started!', 'success');
};

window.viewCollege = (collegeName) => {
    console.log('View college:', collegeName);
    showNotification('College details coming soon!', 'info');
};

window.viewCollegeStudents = (collegeName) => {
    console.log('View college students:', collegeName);
    showNotification('Loading students list...', 'info');
};

window.viewDataset = (datasetId) => {
    console.log('View dataset:', datasetId);
    showNotification('Dataset viewer coming soon!', 'info');
};

window.downloadDataset = async (datasetId) => {
    try {
        const response = await fetch(`${API_BASE}/datasets/${datasetId}/download`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showNotification('Dataset download recorded!', 'success');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error recording dataset download:', error);
        showNotification('Error downloading dataset', 'error');
    }
};