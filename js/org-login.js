// Organization Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
});

function initializeLoginForm() {
    initializePasswordToggle();
    initializeFormValidation();
    initializeFormSubmission();
    initializeForgotPassword();
    initializeKeyboardShortcuts();
}

// Password visibility toggle
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('organizationLoginForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

function validateField(field) {
    const fieldValue = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific validations
    switch (fieldName) {
        case 'username':
            if (fieldValue && fieldValue.length < 3) {
                isValid = false;
                errorMessage = 'Username must be at least 3 characters';
            }
            break;
            
        case 'password':
            if (fieldValue && fieldValue.length < 6) {
                isValid = false;
                errorMessage = 'Password must be at least 6 characters';
            }
            break;
    }
    
    showError(field, isValid ? '' : errorMessage);
    return isValid;
}

function showError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    
    if (errorElement) {
        errorElement.textContent = message;
        if (message) {
            errorElement.classList.add('show');
            field.style.borderColor = 'var(--danger-red)';
        } else {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
        }
    }
}

function clearError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
        field.style.borderColor = '';
    }
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('organizationLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            performLogin();
        }
    });
}

function validateForm() {
    const form = document.getElementById('organizationLoginForm');
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function performLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const form = document.getElementById('organizationLoginForm');
    const formData = new FormData(form);
    
    const username = formData.get('username');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate authentication
    setTimeout(() => {
        // Accept any username and password combination
        if (username.trim() && password.trim()) {
            // Successful login
            handleSuccessfulLogin(username, rememberMe);
        } else {
            // Failed login (empty fields)
            handleFailedLogin();
        }
        
        // Reset loading state
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
    }, 1500); // Simulate network delay
}

function handleSuccessfulLogin(username, rememberMe) {
    // Store session data
    const sessionData = {
        username: username,
        loginTime: new Date().toISOString(),
        organizationName: username.charAt(0).toUpperCase() + username.slice(1) + ' Organization'
    };
    
    if (rememberMe) {
        localStorage.setItem('org-session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('org-session', JSON.stringify(sessionData));
    }
    
    // Show success message
    showToast('Login successful! Redirecting to dashboard...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'org-dashboard.html';
    }, 1000);
}

function handleFailedLogin() {
    // Show error for incorrect credentials
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    showError(usernameField, 'Invalid username or password');
    showError(passwordField, 'Please check your credentials');
    
    // Shake animation for the form
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
    
    showToast('Login failed. Please check your credentials.', 'error');
}

// Forgot password functionality
function initializeForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const modal = document.getElementById('forgotPasswordModal');
    const closeModal = document.getElementById('closeModal');
    const cancelReset = document.getElementById('cancelReset');
    const sendResetLink = document.getElementById('sendResetLink');
    
    // Open modal
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
    });
    
    // Close modal functions
    function closeResetModal() {
        modal.classList.remove('show');
        document.getElementById('resetEmail').value = '';
    }
    
    closeModal.addEventListener('click', closeResetModal);
    cancelReset.addEventListener('click', closeResetModal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeResetModal();
        }
    });
    
    // Send reset link
    sendResetLink.addEventListener('click', function() {
        const resetEmail = document.getElementById('resetEmail').value.trim();
        
        if (!resetEmail) {
            showToast('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(resetEmail)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate sending reset link
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            showToast('Password reset link sent to your email!', 'success');
            closeResetModal();
            
            // Reset button
            this.disabled = false;
            this.innerHTML = 'Send Reset Link';
        }, 2000);
    });
}



// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Close modal with Escape
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                modal.classList.remove('show');
            }
        }
        
        // Submit form with Ctrl+Enter
        if (e.ctrlKey && e.key === 'Enter') {
            const form = document.getElementById('organizationLoginForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Toast icon based on type
    let icon = 'fas fa-info-circle';
    let bgColor = 'var(--primary-blue)';
    
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            bgColor = 'var(--success-green)';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            bgColor = 'var(--danger-red)';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            bgColor = 'var(--warning-orange)';
            break;
    }
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: bgColor,
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Add shake animation CSS dynamically
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Auto-focus username field
const usernameField = document.getElementById('username');
if (usernameField) {
    usernameField.focus();
}

// Check for existing session on page load
function checkExistingSession() {
    const sessionData = localStorage.getItem('org-session') || sessionStorage.getItem('org-session');
    
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const timeDiff = now - loginTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            // If session is less than 24 hours old, redirect to dashboard
            if (hoursDiff < 24) {
                showToast('Existing session found. Redirecting to dashboard...', 'info');
                setTimeout(() => {
                    window.location.href = 'org-dashboard.html';
                }, 1000);
                return;
            } else {
                // Clear expired session
                localStorage.removeItem('org-session');
                sessionStorage.removeItem('org-session');
            }
        } catch (error) {
            // Clear invalid session data
            localStorage.removeItem('org-session');
            sessionStorage.removeItem('org-session');
        }
    }
}

// Check for existing session
checkExistingSession();