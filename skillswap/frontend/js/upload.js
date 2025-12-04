// import { getAuthHeaders } from './auth.js';

// const API_BASE = 'http://localhost:5000/api';

// // Open upload modal with dynamic fields
// export const openUploadModal = (type) => {
//     const modal = document.getElementById('uploadModal');
//     const modalTitle = document.getElementById('modalTitle');
//     const uploadFields = document.getElementById('uploadFields');
    
//     modalTitle.textContent = `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
//     // Set fields based on type
//     switch (type) {
//         case 'skill':
//             uploadFields.innerHTML = `
//                 <div class="form-group">
//                     <label>Skill Name</label>
//                     <input type="text" name="name" required>
//                 </div>
//                 <div class="form-group">
//                     <label>Description</label>
//                     <textarea name="description" required></textarea>
//                 </div>
//                 <div class="form-group">
//                     <label>Image URL</label>
//                     <input type="text" name="image">
//                 </div>
//             `;
//             break;
//         case 'course':
//             uploadFields.innerHTML = `
//                 <div class="form-group">
//                     <label>Course Name</label>
//                     <input type="text" name="name" required>
//                 </div>
//                 <div class="form-group">
//                     <label>Description</label>
//                     <textarea name="description" required></textarea>
//                 </div>
//                 <div class="form-group">
//                     <label>Video URL</label>
//                     <input type="text" name="video_url" required>
//                 </div>
//                 <div class="form-group">
//                     <label>Modules (JSON)</label>
//                     <textarea name="modules" placeholder='["Module 1", "Module 2"]'></textarea>
//                 </div>
//             `;
//             break;
//         case 'note':
//             uploadFields.innerHTML = `
//                 <div class="form-group">
//                     <label>Note Name</label>
//                     <input type="text" name="name" required>
//                 </div>
//                 <div class="form-group">
//                     <label>Description</label>
//                     <textarea name="description" required></textarea>
//                 </div>
//                 <div class="form-group">
//                     <label>File URL</label>
//                     <input type="text" name="file_url" required>
//                 </div>
//                 <div class="form-group">
//                     <label>File Type</label>
//                     <select name="file_type">
//                         <option value="pdf">PDF</option>
//                         <option value="ppt">PPT</option>
//                         <option value="doc">Word Document</option>
//                         <option value="zip">ZIP</option>
//                     </select>
//                 </div>
//             `;
//             break;
//     }
    
//     // Update form submit handler
//     const form = document.getElementById('uploadForm');
//     form.onsubmit = (e) => handleUpload(e, type);
    
//     modal.style.display = 'block';
// };

// // Handle form submission
// const handleUpload = async (e, type) => {
//     e.preventDefault();
    
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());
    
//     try {
//         const response = await fetch(`${API_BASE}/${type}s`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(data)
//         });
        
//         if (response.ok) {
//             alert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
//             document.getElementById('uploadModal').style.display = 'none';
//             e.target.reset();
            
//             // Reload the current page content
//             const activePage = document.querySelector('.nav-link.active').getAttribute('data-page');
//             if (window.loadPageContent) {
//                 window.loadPageContent(activePage);
//             }
//         } else {
//             const error = await response.json();
//             alert(`Upload failed: ${error.message}`);
//         }
//     } catch (error) {
//         alert('Upload failed: Network error');
//     }
// };
import { getAuthHeaders, showNotification } from './auth.js';

const API_BASE = 'http://localhost:5000/api';

// Open upload modal with dynamic fields
export const openUploadModal = (type) => {
    const modal = document.getElementById('uploadModal');
    const modalTitle = document.getElementById('modalTitle');
    const uploadFields = document.getElementById('uploadFields');
    const uploadForm = document.getElementById('uploadForm');
    
    if (!modal || !modalTitle || !uploadFields || !uploadForm) {
        console.error('Upload modal elements not found');
        return;
    }
    
    modalTitle.textContent = `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Set fields based on type
    let fieldsHTML = '';
    switch (type) {
        case 'skill':
            fieldsHTML = `
                <div class="form-group">
                    <label for="skillName">Skill Name *</label>
                    <input type="text" id="skillName" name="name" required placeholder="e.g., JavaScript Programming">
                </div>
                <div class="form-group">
                    <label for="skillDescription">Description</label>
                    <textarea id="skillDescription" name="description" placeholder="Describe your skill, what you can teach..."></textarea>
                </div>
                <div class="form-group">
                    <label for="proficiencyLevel">Proficiency Level</label>
                    <select id="proficiencyLevel" name="proficiency_level">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate" selected>Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="skillCategory">Category</label>
                    <input type="text" id="skillCategory" name="category" placeholder="e.g., Programming, Design, Language">
                </div>
                <div class="form-group">
                    <label for="skillImage">Image URL</label>
                    <input type="text" id="skillImage" name="image_url" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_public" checked> Make this skill public
                    </label>
                </div>
            `;
            break;
            
        case 'course':
            fieldsHTML = `
                <div class="form-group">
                    <label for="courseTitle">Course Title *</label>
                    <input type="text" id="courseTitle" name="title" required placeholder="e.g., Web Development Fundamentals">
                </div>
                <div class="form-group">
                    <label for="courseDescription">Description *</label>
                    <textarea id="courseDescription" name="description" required placeholder="Describe the course content..."></textarea>
                </div>
                <div class="form-group">
                    <label for="courseCategory">Category</label>
                    <input type="text" id="courseCategory" name="category" placeholder="e.g., Programming, Design, Business">
                </div>
                <div class="form-group">
                    <label for="courseVideo">Video URL *</label>
                    <input type="text" id="courseVideo" name="video_url" required placeholder="https://youtube.com/embed/...">
                </div>
                <div class="form-group">
                    <label for="courseThumbnail">Thumbnail URL</label>
                    <input type="text" id="courseThumbnail" name="thumbnail_url" placeholder="https://example.com/thumbnail.jpg">
                </div>
                <div class="form-group">
                    <label for="courseDuration">Duration (minutes)</label>
                    <input type="number" id="courseDuration" name="duration_minutes" placeholder="60">
                </div>
                <div class="form-group">
                    <label for="courseDifficulty">Difficulty Level</label>
                    <select id="courseDifficulty" name="difficulty_level">
                        <option value="beginner" selected>Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="coursePrice">Price ($)</label>
                    <input type="number" id="coursePrice" name="price" step="0.01" min="0" value="0">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_public" checked> Make this course public
                    </label>
                </div>
            `;
            break;
            
        case 'note':
            fieldsHTML = `
                <div class="form-group">
                    <label for="noteTitle">Note Title *</label>
                    <input type="text" id="noteTitle" name="title" required placeholder="e.g., Calculus Notes Chapter 1">
                </div>
                <div class="form-group">
                    <label for="noteDescription">Description</label>
                    <textarea id="noteDescription" name="description" placeholder="Brief description of the notes..."></textarea>
                </div>
                <div class="form-group">
                    <label for="noteCategory">Category</label>
                    <input type="text" id="noteCategory" name="category" placeholder="e.g., Mathematics, Physics, Computer Science">
                </div>
                <div class="form-group">
                    <label for="noteFile">File URL *</label>
                    <input type="text" id="noteFile" name="file_url" required placeholder="https://drive.google.com/file/...">
                </div>
                <div class="form-group">
                    <label for="noteFileType">File Type</label>
                    <select id="noteFileType" name="file_type">
                        <option value="pdf">PDF</option>
                        <option value="doc">Word Document</option>
                        <option value="ppt">PowerPoint</option>
                        <option value="txt">Text File</option>
                        <option value="zip">ZIP Archive</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="noteFileSize">File Size (bytes)</label>
                    <input type="number" id="noteFileSize" name="file_size" placeholder="1048576">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_public" checked> Make this note public
                    </label>
                </div>
            `;
            break;
            
        case 'project':
            fieldsHTML = `
                <div class="form-group">
                    <label for="projectTitle">Project Title *</label>
                    <input type="text" id="projectTitle" name="title" required placeholder="e.g., E-commerce Website">
                </div>
                <div class="form-group">
                    <label for="projectDescription">Description *</label>
                    <textarea id="projectDescription" name="description" required placeholder="Describe your project..."></textarea>
                </div>
                <div class="form-group">
                    <label for="projectCategory">Category</label>
                    <input type="text" id="projectCategory" name="category" placeholder="e.g., Web Development, Mobile App, Data Science">
                </div>
                <div class="form-group">
                    <label for="projectTech">Technologies (comma separated)</label>
                    <input type="text" id="projectTech" name="technologies" placeholder="JavaScript, React, Node.js, MongoDB">
                </div>
                <div class="form-group">
                    <label for="projectGithub">GitHub URL</label>
                    <input type="text" id="projectGithub" name="github_url" placeholder="https://github.com/username/repo">
                </div>
                <div class="form-group">
                    <label for="projectDemo">Demo URL</label>
                    <input type="text" id="projectDemo" name="demo_url" placeholder="https://your-project.vercel.app">
                </div>
                <div class="form-group">
                    <label for="projectFile">File URL</label>
                    <input type="text" id="projectFile" name="file_url" placeholder="https://drive.google.com/file/...">
                </div>
                <div class="form-group">
                    <label for="projectThumbnail">Thumbnail URL</label>
                    <input type="text" id="projectThumbnail" name="thumbnail_url" placeholder="https://example.com/thumbnail.jpg">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_public" checked> Make this project public
                    </label>
                </div>
            `;
            break;
            
        case 'dataset':
            fieldsHTML = `
                <div class="form-group">
                    <label for="datasetTitle">Dataset Title *</label>
                    <input type="text" id="datasetTitle" name="title" required placeholder="e.g., Customer Purchase Data">
                </div>
                <div class="form-group">
                    <label for="datasetDescription">Description</label>
                    <textarea id="datasetDescription" name="description" placeholder="Describe the dataset contents and structure..."></textarea>
                </div>
                <div class="form-group">
                    <label for="datasetCategory">Category</label>
                    <input type="text" id="datasetCategory" name="category" placeholder="e.g., Business, Healthcare, Education">
                </div>
                <div class="form-group">
                    <label for="datasetFile">File URL *</label>
                    <input type="text" id="datasetFile" name="file_url" required placeholder="https://drive.google.com/file/...">
                </div>
                <div class="form-group">
                    <label for="datasetFormat">File Format</label>
                    <select id="datasetFormat" name="file_format">
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                        <option value="excel">Excel</option>
                        <option value="sql">SQL</option>
                        <option value="zip">ZIP</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="datasetFileSize">File Size (bytes)</label>
                    <input type="number" id="datasetFileSize" name="file_size" placeholder="1048576">
                </div>
                <div class="form-group">
                    <label for="datasetTags">Tags (comma separated)</label>
                    <input type="text" id="datasetTags" name="tags" placeholder="machine learning, analytics, big data">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_public" checked> Make this dataset public
                    </label>
                </div>
            `;
            break;
            
        default:
            fieldsHTML = '<p>Upload form not available for this type.</p>';
            break;
    }
    
    uploadFields.innerHTML = fieldsHTML;
    
    // Update form submit handler
    uploadForm.onsubmit = (e) => handleUpload(e, type);
    uploadForm.reset();
    
    modal.style.display = 'block';
};

// Handle form submission
const handleUpload = async (e, type) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert checkbox value to boolean
    if (data.is_public) {
        data.is_public = data.is_public === 'on';
    } else {
        data.is_public = false;
    }
    
    // Convert number fields
    if (data.file_size) data.file_size = parseInt(data.file_size);
    if (data.duration_minutes) data.duration_minutes = parseInt(data.duration_minutes);
    if (data.price) data.price = parseFloat(data.price);
    
    try {
        const response = await fetch(`${API_BASE}/${type}s`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`, 'success');
            document.getElementById('uploadModal').style.display = 'none';
            e.target.reset();
            
            // Reload the current page content
            if (window.currentPage) {
                await window.loadPageContent(window.currentPage);
            }
        } else {
            showNotification(result.message || `Failed to upload ${type}`, 'error');
        }
    } catch (error) {
        console.error(`Upload ${type} error:`, error);
        showNotification(`Network error while uploading ${type}`, 'error');
    }
};