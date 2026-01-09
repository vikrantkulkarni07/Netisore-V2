/* --- CONFIGURATION --- */
const API_CONFIG = {
    geminiKey: null,
    baseUrl: window.location.origin
};

/* --- DOM ELEMENTS --- */
const toggleThemeBtn = document.getElementById('toggleTheme');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const authModal = document.getElementById('authModal');
const ucModal = document.getElementById('ucModal');
const loginBtn = document.getElementById('loginBtn');
const authForm = document.getElementById('authForm');
const userProfileArea = document.getElementById('userProfileArea');

/* --- STATE MANAGEMENT --- */
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let userName = localStorage.getItem('userName') || 'User';

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    checkTheme();
    updateUI();
});

/* --- THEME LOGIC --- */
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    toggleThemeBtn.innerHTML = isDark ? '☀️' : '🌙';
}

/* --- MOBILE MENU --- */
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

/* --- MODAL LOGIC --- */
function openAuthModal(type = 'login') {
    authModal.classList.add('active');
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmit');
    
    if (type === 'login') {
        title.innerText = 'Welcome Back';
        submitBtn.innerText = 'Login';
    } else {
        title.innerText = 'Create Account';
        submitBtn.innerText = 'Sign Up';
    }
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    // Also close dropdown if open
    const dropdown = document.querySelector('.profile-dropdown');
    if(dropdown) dropdown.classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModals();
    });
});

/* --- AUTHENTICATION LOGIC --- */
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const nameInput = email.split('@')[0]; // Extract name from email for demo
    
    // Simulate API Call
    const submitBtn = document.getElementById('authSubmit');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Processing...';
    
    setTimeout(() => {
        isLoggedIn = true;
        userName = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', userName);
        
        submitBtn.innerText = originalText;
        closeModals();
        updateUI();
        showToast(`Welcome back, ${userName}!`);
    }, 800);
});

/* --- UI UPDATER (FIXED PROFILE LOGIC) --- */
function updateUI() {
    if (isLoggedIn) {
        if(loginBtn) loginBtn.style.display = 'none';
        
        // Render Profile with Dropdown Trigger
        userProfileArea.innerHTML = `
            <div class="profile-container">
                <div class="profile-trigger" onclick="toggleProfileDropdown(event)">
                    <img src="https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff" style="width:35px; border-radius:50%;">
                    <span style="font-weight:600;">${userName}</span>
                    <small>▼</small>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-item" onclick="showToast('Profile settings coming soon!')">
                        <span>👤 My Profile</span>
                    </div>
                    <div class="dropdown-item" onclick="showToast('Subscription active')">
                        <span>💎 Premium</span>
                    </div>
                    <div class="dropdown-item" onclick="logout()">
                        <span>🚪 Logout</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        if(loginBtn) loginBtn.style.display = 'block';
        userProfileArea.innerHTML = '';
    }
}

/* --- NEW DROPDOWN FUNCTIONS --- */
function toggleProfileDropdown(e) {
    e.stopPropagation(); // Prevent bubbling
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking anywhere else on the page
document.addEventListener('click', () => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
    }
});

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    updateUI();
    showToast('Logged out successfully');
}

/* --- UNDER CONSTRUCTION HANDLER --- */
function showComingSoon() {
    ucModal.classList.add('active');
}

/* --- TOAST NOTIFICATION --- */
function showToast(msg) {
    // Remove existing toast if any
    const existing = document.querySelector('.toast-notification');
    if(existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--accent)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    toast.style.zIndex = '3000';
    toast.style.animation = 'fadeInUp 0.3s forwards';
    toast.innerText = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation style for toast
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(styleSheet);