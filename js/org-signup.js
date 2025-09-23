// Organization Signup JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupForm();
});

function initializeSignupForm() {
    initializePasswordToggle();
    initializePasswordStrength();
    initializeFormValidation();
    initializeFormSubmission();
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

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthFill && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Remove all strength classes
            strengthFill.className = 'strength-fill';
            
            if (password.length === 0) {
                strengthText.textContent = 'Password strength';
                return;
            }
            
            switch (strength.level) {
                case 1:
                    strengthFill.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                    break;
                case 2:
                    strengthFill.classList.add('fair');
                    strengthText.textContent = 'Fair password';
                    break;
                case 3:
                    strengthFill.classList.add('good');
                    strengthText.textContent = 'Good password';
                    break;
                case 4:
                    strengthFill.classList.add('strong');
                    strengthText.textContent = 'Strong password';
                    break;
                default:
                    strengthText.textContent = 'Password strength';
            }
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate score
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    // Length bonus
    if (password.length >= 12) score += 1;
    
    return {
        score: score,
        level: Math.min(4, Math.max(1, Math.floor(score / 1.5))),
        checks: checks
    };
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('organizationSignupForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Username availability check (debounced)
    const usernameInput = document.getElementById('username');
    let usernameTimeout;
    
    usernameInput.addEventListener('input', function() {
        clearTimeout(usernameTimeout);
        usernameTimeout = setTimeout(() => {
            if (this.value.length >= 3) {
                checkUsernameAvailability(this.value);
            }
        }, 500);
    });
    
    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordConfirmation();
    });
}

function validateField(field) {
    const fieldType = field.type;
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
        case 'orgName':
            if (fieldValue && fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Organization name must be at least 2 characters';
            }
            break;
            
        case 'username':
            if (fieldValue) {
                if (fieldValue.length < 3) {
                    isValid = false;
                    errorMessage = 'Username must be at least 3 characters';
                } else if (!/^[a-zA-Z0-9_.-]+$/.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Username can only contain letters, numbers, dots, dashes, and underscores';
                }
            }
            break;
            
        case 'email':
            if (fieldValue && !isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'password':
            if (fieldValue) {
                const strength = calculatePasswordStrength(fieldValue);
                if (strength.score < 3) {
                    isValid = false;
                    errorMessage = 'Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers';
                }
            }
            break;
            
        case 'confirmPassword':
            const passwordValue = document.getElementById('password').value;
            if (fieldValue && fieldValue !== passwordValue) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
            break;
    }
    
    showError(field, isValid ? '' : errorMessage);
    return isValid;
}

function validatePasswordConfirmation() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showError(document.getElementById('confirmPassword'), 'Passwords do not match');
        return false;
    } else {
        clearError(document.getElementById('confirmPassword'));
        return true;
    }
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkUsernameAvailability(username) {
    // Simulate API call to check username availability
    // In a real application, this would be an actual API call
    
    const unavailableUsernames = ['admin', 'test', 'sukham', 'wellness', 'health'];
    const isAvailable = !unavailableUsernames.includes(username.toLowerCase());
    
    const usernameField = document.getElementById('username');
    const errorElement = document.getElementById('usernameError');
    
    setTimeout(() => {
        if (!isAvailable) {
            showError(usernameField, 'This username is already taken');
        } else if (username === usernameField.value) {
            clearError(usernameField);
            // Show success indicator
            usernameField.style.borderColor = 'var(--success-green)';
        }
    }, 300); // Simulate network delay
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('organizationSignupForm');
    const submitBtn = document.getElementById('signupBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const form = document.getElementById('organizationSignupForm');
    const requiredFields = form.querySelectorAll('input[required]');
    const agreeTerms = document.getElementById('agreeTerms');
    let isValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check terms agreement
    if (!agreeTerms.checked) {
        showError(agreeTerms, 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        clearError(agreeTerms);
    }
    
    // Validate password confirmation
    if (!validatePasswordConfirmation()) {
        isValid = false;
    }
    
    return isValid;
}

function submitForm() {
    const submitBtn = document.getElementById('signupBtn');
    const form = document.getElementById('organizationSignupForm');
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In a real application, you would send the data to your backend
        console.log('Form data:', Object.fromEntries(formData));
        
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        form.reset();
        
    }, 2000); // Simulate network delay
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const continueBtn = document.getElementById('continueBtn');
    
    modal.classList.add('show');
    
    // Handle continue button
    continueBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'org-login.html';
        }, 300);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Utility functions
function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? 'var(--success-green)' : 'var(--primary-blue)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize enhanced animations
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    // Submit form with Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('organizationSignupForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});