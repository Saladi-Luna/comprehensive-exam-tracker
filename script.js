// Global variables
let courses = [];
let activities = [];
let currentTopics = [];
let charts = {};
const COURSE_DATA_VERSION = '2.0'; // Version to force data refresh

// Pomodoro Timer Variables
let pomodoroTimer = null;
let pomodoroTime = 25 * 60; // 25 minutes in seconds
let pomodoroState = 'stopped'; // stopped, running, paused
let pomodoroMode = 'focus'; // focus, shortBreak, longBreak
let pomodoroCount = 0;
let currentCycleCount = 1;
let dailyStats = JSON.parse(localStorage.getItem('dailyPomodoroStats')) || {
    date: new Date().toDateString(),
    completed: 0,
    focusTime: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAndUpdateData();
    initializeApp();
    updateDashboard();
    renderCourses();
    updateAnalytics();
});

function checkAndUpdateData() {
    const storedVersion = localStorage.getItem('courseDataVersion');
    
    // If no version or old version, clear old data and load new
    if (!storedVersion || storedVersion !== COURSE_DATA_VERSION) {
        localStorage.removeItem('courses');
        localStorage.removeItem('activities');
        localStorage.setItem('courseDataVersion', COURSE_DATA_VERSION);
        courses = [];
        activities = [];
    } else {
        // Load existing data
        courses = JSON.parse(localStorage.getItem('courses')) || [];
        activities = JSON.parse(localStorage.getItem('activities')) || [];
    }
    
    // If no courses exist, load the comprehensive exam data
    if (courses.length === 0) {
        loadComprehensiveExamData();
    }
}

function initializeApp() {
    // Set up form submission
    document.getElementById('addCourseForm').addEventListener('submit', addCourse);
    
    // Set up enter key for adding topics
    document.getElementById('newTopicInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTopic();
        }
    });
    
    // Initialize Pomodoro Timer
    initializePomodoroTimer();
}

function loadComprehensiveExamData() {
    const sampleCourses = [
        {
            id: 'course1',
            name: 'Deep Learning for Computer Vision',
            description: 'Comprehensive course covering deep learning techniques for computer vision applications',
            topics: [
                { id: 'topic1', name: 'Introduction to Computer Vision and Deep Learning', completed: false },
                { id: 'topic2', name: 'Semantic Gaps - Conventional vs Deep Vision', completed: false },
                { id: 'topic3', name: 'Image Classification Pipeline', completed: false },
                { id: 'topic4', name: 'Training, Validation, Testing', completed: false },
                { id: 'topic5', name: 'Nearest Neighbour Classification', completed: false },
                { id: 'topic6', name: 'Linear Classification', completed: false },
                { id: 'topic7', name: 'Loss Functions - Softmax vs SVM Loss', completed: false },
                { id: 'topic8', name: 'Gradient Descent and Optimization', completed: false },
                { id: 'topic9', name: 'Optimization Algorithms (Adagrad, RMS, Adam)', completed: false },
                { id: 'topic10', name: 'Neural Networks Basics - Activation Functions', completed: false },
                { id: 'topic11', name: 'Neural Network Architecture', completed: false },
                { id: 'topic12', name: 'Deep Neural Networks', completed: false },
                { id: 'topic13', name: 'Backpropagation', completed: false },
                { id: 'topic14', name: 'Computational Graphs', completed: false },
                { id: 'topic15', name: 'Scalar and Vector Backpropagation', completed: false },
                { id: 'topic16', name: 'CNNs - Convolution Layer', completed: false },
                { id: 'topic17', name: 'Filters and Max Pooling', completed: false },
                { id: 'topic18', name: 'Fully Connected Layer', completed: false },
                { id: 'topic19', name: 'Spatial Localization and Object Detection', completed: false },
                { id: 'topic20', name: 'Region Proposals and R-CNN', completed: false },
                { id: 'topic21', name: 'Fast R-CNN and Faster R-CNN', completed: false },
                { id: 'topic22', name: 'Semantic Segmentation - IoU and Dice Score', completed: false },
                { id: 'topic23', name: 'YOLO Philosophy and Working (v1 to v3)', completed: false },
                { id: 'topic24', name: 'YOLO Loss Function and Non-maximum Suppression', completed: false },
                { id: 'topic25', name: 'RNNs - Sequence Modelling', completed: false },
                { id: 'topic26', name: 'Vanilla RNN and Issues', completed: false },
                { id: 'topic27', name: 'LSTM Components and GRU', completed: false },
                { id: 'topic28', name: 'Self-supervised Learning Methods', completed: false },
                { id: 'topic29', name: 'Denoising Autoencoders and Context Encoder', completed: false },
                { id: 'topic30', name: 'Transfer Learning with CNNs', completed: false },
                { id: 'topic31', name: 'Data Augmentation and Preprocessing', completed: false },
                { id: 'topic32', name: 'Weight Initialization and Batch Normalization', completed: false },
                { id: 'topic33', name: 'Hyperparameter Optimization', completed: false },
                { id: 'topic34', name: 'Transformers - Attention and Embedding', completed: false },
                { id: 'topic35', name: 'Multi-head Attention and Self-attention', completed: false },
                { id: 'topic36', name: 'Vision Transformers (ViT)', completed: false },
                { id: 'topic37', name: 'Patch Embedding and CLS Token', completed: false }
            ],
            createdAt: new Date('2024-01-01'),
            lastUpdated: new Date()
        },
        {
            id: 'course2',
            name: 'Advanced Image Processing',
            description: 'Advanced techniques in image processing including deep learning approaches',
            topics: [
                { id: 'topic38', name: 'Image Features - SIFT and SURF', completed: false },
                { id: 'topic39', name: 'Generalized Hough Transform', completed: false },
                { id: 'topic40', name: 'Texture Features', completed: false },
                { id: 'topic41', name: 'Evaluation of Image Features', completed: false },
                { id: 'topic42', name: 'Deep Learning - Convolution Layers', completed: false },
                { id: 'topic43', name: 'Fully Connected Layers and Backpropagation', completed: false },
                { id: 'topic44', name: 'Non-linear Activation Functions', completed: false },
                { id: 'topic45', name: 'Batch Normalization', completed: false },
                { id: 'topic46', name: 'Network Architectures', completed: false },
                { id: 'topic47', name: 'CLIP - Contrastive Language-Image Pretraining', completed: false },
                { id: 'topic48', name: 'Graph-based Segmentation Techniques', completed: false },
                { id: 'topic49', name: 'Active Shape Models', completed: false },
                { id: 'topic50', name: 'Active Appearance Models', completed: false },
                { id: 'topic51', name: 'Deep Learning-based Segmentation', completed: false },
                { id: 'topic52', name: 'Object Detection - RCNN Variants', completed: false },
                { id: 'topic53', name: 'Fast-RCNN and Faster RCNN', completed: false },
                { id: 'topic54', name: 'Single Shot Detector (SSD)', completed: false },
                { id: 'topic55', name: 'Instance Segmentation - Mask-RCNN', completed: false },
                { id: 'topic56', name: 'Image Quality Assessment - NR and RR', completed: false },
                { id: 'topic57', name: 'MSE/PSNR and Mean Opinion Score', completed: false },
                { id: 'topic58', name: 'SSIM - Structural Similarity Metrics', completed: false },
                { id: 'topic59', name: 'Multi-scale SSIM', completed: false },
                { id: 'topic60', name: 'Perceptual Loss through Deep CNNs', completed: false },
                { id: 'topic61', name: 'Vision Transformers', completed: false },
                { id: 'topic62', name: 'Generative Models', completed: false },
                { id: 'topic63', name: 'Image Compression', completed: false },
                { id: 'topic64', name: 'Image Restoration', completed: false }
            ],
            createdAt: new Date('2024-01-15'),
            lastUpdated: new Date()
        },
        {
            id: 'course3',
            name: 'Design of Biomedical Devices and Systems',
            description: 'Comprehensive course on biomedical device design, ethics, and regulatory aspects',
            topics: [
                { id: 'topic65', name: 'Need for Bioethics', completed: false },
                { id: 'topic66', name: 'Law vs Bioethics', completed: false },
                { id: 'topic67', name: 'Ethical Implications and Moral Principles', completed: false },
                { id: 'topic68', name: 'Empathic Design Framework', completed: false },
                { id: 'topic69', name: 'Tools for Empathic Design', completed: false },
                { id: 'topic70', name: 'Clinical Immersion', completed: false },
                { id: 'topic71', name: 'Medical Device Definition', completed: false },
                { id: 'topic72', name: 'Classification based on Duration of Use', completed: false },
                { id: 'topic73', name: 'Classification based on Invasiveness', completed: false },
                { id: 'topic74', name: 'Classification based on Reusability', completed: false },
                { id: 'topic75', name: 'Classification of Implantable Devices', completed: false },
                { id: 'topic76', name: 'Classification of Active Devices', completed: false },
                { id: 'topic77', name: 'Indian Medical Device Classifications', completed: false },
                { id: 'topic78', name: '510(k) Regulatory Pathway', completed: false },
                { id: 'topic79', name: 'Premarket Approval (PMA)', completed: false },
                { id: 'topic80', name: 'Other Regulatory Pathways', completed: false },
                { id: 'topic81', name: 'Design Documents and Records', completed: false },
                { id: 'topic82', name: 'Design History File (DHF)', completed: false },
                { id: 'topic83', name: 'Device Master Record (DMR)', completed: false },
                { id: 'topic84', name: 'Device History Record (DHR)', completed: false },
                { id: 'topic85', name: 'Technical Documentation File (TDF)', completed: false },
                { id: 'topic86', name: 'Medical Device Design Process', completed: false },
                { id: 'topic87', name: 'Controlled Documents and Specifications', completed: false },
                { id: 'topic88', name: 'Introduction to EMG', completed: false },
                { id: 'topic89', name: 'Introduction to EOG', completed: false },
                { id: 'topic90', name: 'Introduction to ECG', completed: false },
                { id: 'topic91', name: 'Introduction to EEG', completed: false },
                { id: 'topic92', name: 'Basics of Imaging Systems', completed: false },
                { id: 'topic93', name: 'X-ray Imaging', completed: false },
                { id: 'topic94', name: 'CT Imaging', completed: false },
                { id: 'topic95', name: 'MRI Imaging', completed: false },
                { id: 'topic96', name: 'Ultrasound Imaging', completed: false },
                { id: 'topic97', name: 'Thermography', completed: false },
                { id: 'topic98', name: 'Surgical Tools', completed: false },
                { id: 'topic99', name: 'Minimally Invasive Surgical (MIS) Devices', completed: false },
                { id: 'topic100', name: 'Medical Implants', completed: false },
                { id: 'topic101', name: 'Prosthetics', completed: false },
                { id: 'topic102', name: 'Biocompatibility', completed: false },
                { id: 'topic103', name: 'Biomaterial Testing', completed: false },
                { id: 'topic104', name: 'Non-clinical Testing', completed: false },
                { id: 'topic105', name: 'Pre-clinical Testing', completed: false },
                { id: 'topic106', name: 'Clinical Testing', completed: false },
                { id: 'topic107', name: 'Post-market Studies', completed: false },
                { id: 'topic108', name: 'Blinded Trials', completed: false },
                { id: 'topic109', name: 'Institutional Review Board (IRB) Approval', completed: false },
                { id: 'topic110', name: 'Investigational Device Exemption (IDE)', completed: false },
                { id: 'topic111', name: 'Funding Sources for Medical Device Testing', completed: false },
                { id: 'topic112', name: 'In-vitro Diagnostics', completed: false },
                { id: 'topic113', name: 'Digital Healthcare', completed: false }
            ],
            createdAt: new Date('2024-02-01'),
            lastUpdated: new Date()
        }
    ];
    
    courses = sampleCourses;
    saveCourses();
    
    // Add some sample activities
    activities = [
        {
            id: 'activity1',
            type: 'course_created',
            courseId: 'course1',
            courseName: 'Deep Learning for Computer Vision',
            topicName: 'Course Created',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'activity2',
            type: 'course_created',
            courseId: 'course2',
            courseName: 'Advanced Image Processing',
            topicName: 'Course Created',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'activity3',
            type: 'course_created',
            courseId: 'course3',
            courseName: 'Design of Biomedical Devices and Systems',
            topicName: 'Course Created',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
    ];
    saveActivities();
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update content based on tab
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'courses') {
        renderCourses();
    } else if (tabName === 'analytics') {
        updateAnalytics();
    } else if (tabName === 'pomodoro') {
        updatePomodoroStatus();
        updatePomodoroStats();
    }
}

// Dashboard Functions
function updateDashboard() {
    const totalCourses = courses.length;
    const totalTopics = courses.reduce((sum, course) => sum + course.topics.length, 0);
    const completedTopics = courses.reduce((sum, course) => 
        sum + course.topics.filter(topic => topic.completed).length, 0);
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    // Update stats
    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('totalTopics').textContent = totalTopics;
    document.getElementById('completedTopics').textContent = completedTopics;
    document.getElementById('overallProgress').textContent = overallProgress + '%';
    
    // Update charts
    updateDashboardCharts();
    updateRecentActivities();
}

function updateDashboardCharts() {
    // Progress Pie Chart
    const ctx1 = document.getElementById('progressChart').getContext('2d');
    const totalTopics = courses.reduce((sum, course) => sum + course.topics.length, 0);
    const completedTopics = courses.reduce((sum, course) => 
        sum + course.topics.filter(topic => topic.completed).length, 0);
    
    if (charts.progressChart) {
        charts.progressChart.destroy();
    }
    
    charts.progressChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [completedTopics, totalTopics - completedTopics],
                backgroundColor: ['#28a745', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            layout: {
                padding: 10
            }
        }
    });
    
    // Course Progress Chart
    const ctx2 = document.getElementById('courseChart').getContext('2d');
    const courseNames = courses.map(course => course.name.length > 20 ? 
        course.name.substring(0, 20) + '...' : course.name);
    const courseProgress = courses.map(course => {
        const completed = course.topics.filter(topic => topic.completed).length;
        return course.topics.length > 0 ? Math.round((completed / course.topics.length) * 100) : 0;
    });
    
    if (charts.courseChart) {
        charts.courseChart.destroy();
    }
    
    charts.courseChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: courseNames,
            datasets: [{
                label: 'Progress %',
                data: courseProgress,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.2,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: 10
            }
        }
    });
}

function updateRecentActivities() {
    const container = document.getElementById('recentActivities');
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="no-activities">No activities yet. Start tracking your courses!</p>';
        return;
    }
    
    const recentActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>Topic Completed: ${activity.topicName}</h4>
                <p>${activity.courseName}</p>
            </div>
            <div class="activity-time">
                ${formatTimeAgo(activity.timestamp)}
            </div>
        </div>
    `).join('');
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Course Management
function renderCourses() {
    const container = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No courses yet</h3>
                <p>Add your first course to start tracking your progress!</p>
                <button class="add-btn" onclick="showAddCourseModal()">Add Course</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = courses.map(course => {
        const completedTopics = course.topics.filter(topic => topic.completed).length;
        const totalTopics = course.topics.length;
        const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        
        return `
            <div class="course-card" onclick="showCourseDetails('${course.id}')">
                <div class="course-header">
                    <h3 class="course-title">${course.name}</h3>
                    <button class="course-menu" onclick="event.stopPropagation(); showCourseMenu('${course.id}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                <p class="course-description">${course.description || 'No description available'}</p>
                <div class="progress-section">
                    <div class="progress-header">
                        <span class="progress-text">Progress</span>
                        <span class="progress-percentage">${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="topics-count">
                        <span>${completedTopics} of ${totalTopics} topics completed</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showCourseDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const completedTopics = course.topics.filter(topic => topic.completed).length;
    const totalTopics = course.topics.length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const content = `
        <div class="course-details-header">
            <h2 class="course-details-title">${course.name}</h2>
            <div class="course-details-meta">
                <span><i class="fas fa-book"></i> ${totalTopics} Topics</span>
                <span><i class="fas fa-check"></i> ${completedTopics} Completed</span>
                <span><i class="fas fa-percentage"></i> ${progress}% Progress</span>
            </div>
        </div>
        <div class="progress-section">
            <div class="progress-header">
                <span class="progress-text">Overall Progress</span>
                <span class="progress-percentage">${progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        </div>
        <h3 style="margin: 25px 0 15px 0;">Topics</h3>
        <div class="topics-grid">
            ${course.topics.map(topic => `
                <div class="topic-item-detail ${topic.completed ? 'completed' : ''}">
                    <input type="checkbox" 
                           class="topic-checkbox" 
                           ${topic.completed ? 'checked' : ''} 
                           onchange="toggleTopic('${course.id}', '${topic.id}')">
                    <span class="topic-label">${topic.name}</span>
                </div>
            `).join('')}
        </div>
        <div class="form-buttons" style="margin-top: 25px;">
            <button type="button" onclick="deleteCourse('${course.id}')">
                <i class="fas fa-trash"></i> Delete Course
            </button>
            <button type="button" onclick="closeModal('courseDetailsModal')">Close</button>
        </div>
    `;
    
    document.getElementById('courseDetailsContent').innerHTML = content;
    document.getElementById('courseDetailsModal').style.display = 'block';
}

function toggleTopic(courseId, topicId) {
    const course = courses.find(c => c.id === courseId);
    const topic = course.topics.find(t => t.id === topicId);
    
    topic.completed = !topic.completed;
    course.lastUpdated = new Date();
    
    if (topic.completed) {
        // Add activity
        const activity = {
            id: 'activity_' + Date.now(),
            type: 'topic_completed',
            courseId: course.id,
            courseName: course.name,
            topicName: topic.name,
            timestamp: new Date()
        };
        activities.unshift(activity);
        saveActivities();
    }
    
    saveCourses();
    updateDashboard();
    renderCourses();
    showCourseDetails(courseId); // Refresh the modal
}

// Modal Management
function showAddCourseModal() {
    currentTopics = [];
    document.getElementById('addCourseForm').reset();
    document.getElementById('topicsList').innerHTML = '';
    document.getElementById('addCourseModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addTopic() {
    const input = document.getElementById('newTopicInput');
    const topicName = input.value.trim();
    
    if (!topicName) return;
    
    const topic = {
        id: 'topic_' + Date.now(),
        name: topicName,
        completed: false
    };
    
    currentTopics.push(topic);
    input.value = '';
    
    renderTopicsList();
}

function renderTopicsList() {
    const container = document.getElementById('topicsList');
    
    if (currentTopics.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; margin: 20px 0;">No topics added yet</p>';
        return;
    }
    
    container.innerHTML = currentTopics.map((topic, index) => `
        <div class="topic-item">
            <span class="topic-name">${topic.name}</span>
            <button type="button" class="remove-topic" onclick="removeTopic(${index})">Remove</button>
        </div>
    `).join('');
}

function removeTopic(index) {
    currentTopics.splice(index, 1);
    renderTopicsList();
}

function addCourse(e) {
    e.preventDefault();
    
    const courseName = document.getElementById('courseName').value.trim();
    const courseDescription = document.getElementById('courseDescription').value.trim();
    
    if (!courseName) {
        alert('Please enter a subject name');
        return;
    }
    
    if (currentTopics.length === 0) {
        alert('Please add at least one topic');
        return;
    }
    
    const course = {
        id: 'course_' + Date.now(),
        name: courseName,
        description: courseDescription,
        topics: [...currentTopics],
        createdAt: new Date(),
        lastUpdated: new Date()
    };
    
    courses.push(course);
    saveCourses();
    
    closeModal('addCourseModal');
    updateDashboard();
    renderCourses();
    
    // Show success message
    alert(`Subject "${courseName}" added successfully!`);
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
        courses = courses.filter(course => course.id !== courseId);
        
        // Remove related activities
        activities = activities.filter(activity => activity.courseId !== courseId);
        
        saveCourses();
        saveActivities();
        closeModal('courseDetailsModal');
        updateDashboard();
        renderCourses();
    }
}

// Analytics Functions
function updateAnalytics() {
    updateStudyStreak();
    updateTopicsThisWeek();
    updateAverageProgress();
    updateEstimatedTime();
    updateTimelineChart();
}

function updateStudyStreak() {
    // Simple streak calculation based on activities
    let streak = 0;
    const today = new Date();
    const activitiesByDate = {};
    
    activities.forEach(activity => {
        const date = new Date(activity.timestamp).toDateString();
        activitiesByDate[date] = true;
    });
    
    // Count consecutive days from today backwards
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateString = checkDate.toDateString();
        
        if (activitiesByDate[dateString]) {
            streak++;
        } else if (i > 0) { // Allow for today having no activity
            break;
        }
    }
    
    document.getElementById('studyStreak').textContent = streak;
}

function updateTopicsThisWeek() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const topicsThisWeek = activities.filter(activity => 
        new Date(activity.timestamp) > oneWeekAgo
    ).length;
    
    document.getElementById('topicsThisWeek').textContent = topicsThisWeek;
}

function updateAverageProgress() {
    if (courses.length === 0) {
        document.getElementById('averageProgress').textContent = '0%';
        return;
    }
    
    const totalProgress = courses.reduce((sum, course) => {
        const completed = course.topics.filter(topic => topic.completed).length;
        return sum + (course.topics.length > 0 ? (completed / course.topics.length) * 100 : 0);
    }, 0);
    
    const averageProgress = Math.round(totalProgress / courses.length);
    document.getElementById('averageProgress').textContent = averageProgress + '%';
}

function updateEstimatedTime() {
    const totalTopics = courses.reduce((sum, course) => sum + course.topics.length, 0);
    const completedTopics = courses.reduce((sum, course) => 
        sum + course.topics.filter(topic => topic.completed).length, 0);
    const remainingTopics = totalTopics - completedTopics;
    
    if (remainingTopics === 0) {
        document.getElementById('estimatedTime').textContent = 'Exam Ready! 🎉';
        return;
    }
    
    // Fixed exam deadline: 20 days
    const EXAM_DAYS = 20;
    const topicsPerDay = Math.ceil(remainingTopics / EXAM_DAYS);
    
    // Show different messages based on workload
    if (topicsPerDay <= 3) {
        document.getElementById('estimatedTime').textContent = `${topicsPerDay} topics/day`;
    } else if (topicsPerDay <= 6) {
        document.getElementById('estimatedTime').textContent = `${topicsPerDay} topics/day`;
    } else {
        document.getElementById('estimatedTime').textContent = `${topicsPerDay} topics/day`;
    }
}

function updateTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // Group activities by date for the last 30 days
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        last30Days.push({
            date: date,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: 0
        });
    }
    
    activities.forEach(activity => {
        const activityDate = new Date(activity.timestamp).toDateString();
        const dayData = last30Days.find(day => day.date.toDateString() === activityDate);
        if (dayData) {
            dayData.count++;
        }
    });
    
    if (charts.timelineChart) {
        charts.timelineChart.destroy();
    }
    
    charts.timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last30Days.map(day => day.label),
            datasets: [{
                label: 'Topics Completed',
                data: last30Days.map(day => day.count),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    stepSize: 1,
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: 10
            }
        }
    });
}

// Data Persistence
function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl+N opens add course modal
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showAddCourseModal();
    }
});

// Handle window resize for chart responsiveness
window.addEventListener('resize', function() {
    setTimeout(function() {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }, 100);
});

// Pomodoro Timer Functions
function initializePomodoroTimer() {
    // Check if it's a new day and reset daily stats
    const today = new Date().toDateString();
    if (dailyStats.date !== today) {
        dailyStats = {
            date: today,
            completed: 0,
            focusTime: 0
        };
        saveDailyStats();
    }
    
    // Set up event listeners
    document.getElementById('startPauseBtn').addEventListener('click', togglePomodoro);
    document.getElementById('resetBtn').addEventListener('click', resetPomodoro);
    
    // Settings change listeners
    document.getElementById('focusTime').addEventListener('change', updateTimerSettings);
    document.getElementById('shortBreak').addEventListener('change', updateTimerSettings);
    document.getElementById('longBreak').addEventListener('change', updateTimerSettings);
    
    // Initialize display
    updatePomodoroDisplay();
    updatePomodoroStats();
}

function togglePomodoro() {
    if (pomodoroState === 'stopped' || pomodoroState === 'paused') {
        startPomodoro();
    } else {
        pausePomodoro();
    }
}

function startPomodoro() {
    pomodoroState = 'running';
    document.body.classList.add('timer-running');
    document.body.classList.remove('timer-paused', 'timer-break');
    
    const btn = document.getElementById('startPauseBtn');
    btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    pomodoroTimer = setInterval(() => {
        pomodoroTime--;
        updatePomodoroDisplay();
        
        // Play tick sound every second if enabled
        if (document.getElementById('soundEnabled').checked) {
            playTickSound();
        }
        
        if (pomodoroTime <= 0) {
            completePomodoro();
        }
    }, 1000);
}

function pausePomodoro() {
    pomodoroState = 'paused';
    document.body.classList.add('timer-paused');
    document.body.classList.remove('timer-running');
    
    const btn = document.getElementById('startPauseBtn');
    btn.innerHTML = '<i class="fas fa-play"></i> Resume';
    
    clearInterval(pomodoroTimer);
}

function resetPomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroState = 'stopped';
    
    document.body.classList.remove('timer-running', 'timer-paused', 'timer-break');
    
    const btn = document.getElementById('startPauseBtn');
    btn.innerHTML = '<i class="fas fa-play"></i> Start';
    
    // Reset to focus mode
    pomodoroMode = 'focus';
    pomodoroTime = parseInt(document.getElementById('focusTime').value) * 60;
    
    updatePomodoroDisplay();
    updatePomodoroStatus();
}

function completePomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroState = 'stopped';
    
    // Play notification sound
    if (document.getElementById('soundEnabled').checked) {
        playNotificationSound();
    }
    
    // Show browser notification
    showNotification();
    
    if (pomodoroMode === 'focus') {
        // Complete focus session
        pomodoroCount++;
        dailyStats.completed++;
        dailyStats.focusTime += parseInt(document.getElementById('focusTime').value);
        
        // Determine next mode
        if (pomodoroCount % 4 === 0) {
            pomodoroMode = 'longBreak';
            pomodoroTime = parseInt(document.getElementById('longBreak').value) * 60;
            currentCycleCount = 1;
        } else {
            pomodoroMode = 'shortBreak';
            pomodoroTime = parseInt(document.getElementById('shortBreak').value) * 60;
            currentCycleCount++;
        }
        
        document.body.classList.add('timer-break');
    } else {
        // Complete break session
        pomodoroMode = 'focus';
        pomodoroTime = parseInt(document.getElementById('focusTime').value) * 60;
        document.body.classList.remove('timer-break');
    }
    
    document.body.classList.remove('timer-running', 'timer-paused');
    
    const btn = document.getElementById('startPauseBtn');
    btn.innerHTML = '<i class="fas fa-play"></i> Start';
    
    saveDailyStats();
    updatePomodoroDisplay();
    updatePomodoroStatus();
    updatePomodoroStats();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerDisplay').textContent = display;
    
    // Update page title when running
    if (pomodoroState === 'running') {
        document.title = `${display} - ${pomodoroMode === 'focus' ? 'Focus' : 'Break'} | Exam Tracker`;
    } else {
        document.title = 'Comprehensive Exam Progress Tracker';
    }
}

function updatePomodoroStatus() {
    const statusElement = document.getElementById('pomodoroStatus');
    const descElement = document.getElementById('pomodoroDescription');
    
    switch (pomodoroMode) {
        case 'focus':
            statusElement.textContent = 'Focus Time';
            descElement.textContent = 'Time to concentrate on your studies';
            break;
        case 'shortBreak':
            statusElement.textContent = 'Short Break';
            descElement.textContent = 'Take a quick 5-minute rest';
            break;
        case 'longBreak':
            statusElement.textContent = 'Long Break';
            descElement.textContent = 'Enjoy a longer 15-minute break';
            break;
        default:
            statusElement.textContent = 'Ready to Focus';
            descElement.textContent = 'Start a 25-minute focus session';
    }
}

function updatePomodoroStats() {
    document.getElementById('completedPomodoros').textContent = dailyStats.completed;
    document.getElementById('totalFocusTime').textContent = Math.floor(dailyStats.focusTime / 60) + 'h ' + (dailyStats.focusTime % 60) + 'm';
    document.getElementById('currentCycle').textContent = currentCycleCount + '/4';
}

function updateTimerSettings() {
    if (pomodoroState === 'stopped') {
        if (pomodoroMode === 'focus') {
            pomodoroTime = parseInt(document.getElementById('focusTime').value) * 60;
        }
        updatePomodoroDisplay();
    }
}

function playTickSound() {
    // Create a traditional mechanical clock tick sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create white noise for the mechanical "tick"
    const bufferSize = 4096;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate short burst of white noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1000);
    }
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Filter to create sharp click
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    
    // Sharp attack, quick decay like a real clock
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    source.start(audioContext.currentTime);
    source.stop(audioContext.currentTime + 0.05);
}

function playNotificationSound() {
    // Create and play a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function showNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            const title = pomodoroMode === 'focus' ? 'Focus session complete!' : 'Break time over!';
            const body = pomodoroMode === 'focus' ? 'Time for a well-deserved break.' : 'Ready for another focus session?';
            
            new Notification(title, {
                body: body,
                icon: '/favicon.ico'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification();
                }
            });
        }
    }
}

function saveDailyStats() {
    localStorage.setItem('dailyPomodoroStats', JSON.stringify(dailyStats));
}

// Backup and Restore Functions
function generateBackupCode() {
    try {
        // Collect all data to backup
        const backupData = {
            courses: courses,
            activities: activities,
            dailyStats: dailyStats,
            version: COURSE_DATA_VERSION,
            timestamp: new Date().toISOString()
        };
        
        // Convert to JSON
        const jsonString = JSON.stringify(backupData);
        
        // Use a safer encoding method that works across all browsers
        let base64Data;
        try {
            // Try modern approach first
            base64Data = btoa(unescape(encodeURIComponent(jsonString)));
        } catch (e) {
            // Fallback for older browsers or special characters
            base64Data = btoa(jsonString.replace(/[\u00A0-\u2666]/g, function(c) {
                return '&#' + c.charCodeAt(0) + ';';
            }));
        }
        
        // Create a formatted code (groups of 4 characters)
        const code = base64Data.match(/.{1,4}/g).join('-').toUpperCase();
        
        // Show the code in modal
        document.getElementById('backupCodeText').value = code;
        document.getElementById('backupCodeModal').style.display = 'block';
        
        console.log('Backup code generated successfully');
        
    } catch (error) {
        console.error('Error generating backup code:', error);
        alert('Error generating backup code. Please try again or contact support.');
    }
}

function showRestoreModal() {
    document.getElementById('restoreCodeInput').value = '';
    document.getElementById('restoreCodeModal').style.display = 'block';
}

function copyBackupCode() {
    const codeInput = document.getElementById('backupCodeText');
    
    // Try modern clipboard API first (works in newer browsers)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeInput.value).then(() => {
            showCopySuccess();
        }).catch(() => {
            // Fallback to older method
            fallbackCopy(codeInput);
        });
    } else {
        // Use fallback method for older browsers or non-HTTPS
        fallbackCopy(codeInput);
    }
}

function fallbackCopy(codeInput) {
    try {
        codeInput.select();
        codeInput.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showManualCopy();
        }
    } catch (err) {
        console.log('Copy failed:', err);
        showManualCopy();
    }
}

function showCopySuccess() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    copyBtn.style.background = '#28a745';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '#667eea';
    }, 2000);
}

function showManualCopy() {
    alert('Please manually copy the backup code from the text box above.');
    // Select the text to make it easier to copy manually
    document.getElementById('backupCodeText').select();
}

function restoreFromCode() {
    const codeInput = document.getElementById('restoreCodeInput');
    const code = codeInput.value.trim();
    
    if (!code) {
        alert('Please enter a backup code');
        return;
    }
    
    try {
        // Remove dashes and convert back to base64
        const base64Data = code.replace(/-/g, '');
        
        // Use safer decoding method
        let jsonString;
        try {
            // Try modern approach first
            jsonString = decodeURIComponent(escape(atob(base64Data)));
        } catch (e) {
            // Fallback for simpler encoding
            jsonString = atob(base64Data);
        }
        
        const backupData = JSON.parse(jsonString);
        
        // Validate backup data
        if (!backupData.courses || !Array.isArray(backupData.courses)) {
            throw new Error('Invalid backup code: courses data missing or invalid');
        }
        
        if (!backupData.activities || !Array.isArray(backupData.activities)) {
            throw new Error('Invalid backup code: activities data missing or invalid');
        }
        
        // Calculate stats for confirmation
        const totalTopics = backupData.courses.reduce((sum, course) => sum + (course.topics ? course.topics.length : 0), 0);
        const completedTopics = backupData.courses.reduce((sum, course) => sum + (course.topics ? course.topics.filter(t => t.completed).length : 0), 0);
        
        // Confirm before restoring
        const confirmation = confirm(
            `This will replace your current progress with data from ${new Date(backupData.timestamp).toLocaleDateString()}.\n\n` +
            `Backup contains:\n` +
            `• ${backupData.courses.length} courses\n` +
            `• ${completedTopics} of ${totalTopics} topics completed\n` +
            `• ${backupData.activities.length} recent activities\n\n` +
            `Continue with restore?`
        );
        
        if (!confirmation) return;
        
        // Restore data
        courses = backupData.courses;
        activities = backupData.activities;
        dailyStats = backupData.dailyStats || { date: new Date().toDateString(), completed: 0, focusTime: 0 };
        
        // Save restored data
        saveCourses();
        saveActivities();
        saveDailyStats();
        
        // Update displays
        updateDashboard();
        renderCourses();
        updateAnalytics();
        updatePomodoroStats();
        
        // Close modal and show success
        closeModal('restoreCodeModal');
        alert('Progress restored successfully! 🎉');
        
    } catch (err) {
        console.error('Restore error:', err);
        alert(`Invalid backup code: ${err.message}\n\nPlease check the code and try again.`);
    }
}

// Add click handlers for backup/restore modals
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside or on close button
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
        if (event.target.classList.contains('close')) {
            const modal = event.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        }
    });
});