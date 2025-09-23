// ===== AUTHENTICATION JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PASSWORD TOGGLE FUNCTIONALITY =====
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // ===== PASSWORD STRENGTH CHECKER =====
    const passwordStrength = document.getElementById('password-strength');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;
        
        return score;
    }

    function updatePasswordStrength(score) {
        const strengthClasses = ['weak', 'medium', 'strong', 'very-strong'];
        const strengthTexts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        
        // Remove all strength classes
        strengthFill.className = 'strength-fill';
        
        if (score > 0) {
            const strengthClass = strengthClasses[Math.min(score - 1, 3)];
            strengthFill.classList.add(strengthClass);
            strengthText.textContent = strengthTexts[score];
        } else {
            strengthText.textContent = 'Password strength';
        }
    }

    // ===== FORM VALIDATION =====
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Real-time validation for signup form
        const formInputs = signupForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });

        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                const password = document.getElementById('password').value;
                validatePasswordMatch(password, this.value);
            });
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validate inputs
        if (!validateEmail(email)) {
            showValidationError('email', 'Please enter a valid email address');
            return;
        }
        
        if (!password) {
            showValidationError('password', 'Please enter your password');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        showLoadingState(submitBtn);

        // Simulate API call
        setTimeout(() => {
            hideLoadingState(submitBtn);
            
            // For demo purposes, redirect to dashboard
            showNotification('Login successful! Welcome back! 🌟', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
            // In a real app, you would make an actual API call here
            // authenticateUser(email, password, remember);
        }, 2000);
    }

    function handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isValid = true;
        
        if (!data.firstName.trim()) {
            showValidationError('firstName', 'First name is required');
            isValid = false;
        }
        
        if (!data.lastName.trim()) {
            showValidationError('lastName', 'Last name is required');
            isValid = false;
        }
        
        if (!validateEmail(data.email)) {
            showValidationError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.institution.trim()) {
            showValidationError('institution', 'Institution is required');
            isValid = false;
        }
        
        if (!data.program) {
            showValidationError('program', 'Please select your program');
            isValid = false;
        }
        
        if (!validatePassword(data.password)) {
            showValidationError('password', 'Password must be at least 8 characters with mixed case, numbers, and symbols');
            isValid = false;
        }
        
        if (data.password !== data.confirmPassword) {
            showValidationError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!document.getElementById('terms').checked) {
            showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        showLoadingState(submitBtn);

        // Simulate API call
        setTimeout(() => {
            hideLoadingState(submitBtn);
            
            // For demo purposes, show success and redirect
            showNotification('Account created successfully! Welcome to Sukham! 🎉', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
            // In a real app, you would make an actual API call here
            // createUserAccount(data);
        }, 2500);
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        clearValidationState(field);
        
        switch (fieldName) {
            case 'email':
                if (value && !validateEmail(value)) {
                    showValidationError(fieldName, 'Please enter a valid email address');
                } else if (value) {
                    showValidationSuccess(fieldName);
                }
                break;
            
            case 'password':
                if (value && !validatePassword(value)) {
                    showValidationError(fieldName, 'Password must be at least 8 characters');
                } else if (value) {
                    showValidationSuccess(fieldName);
                }
                break;
            
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                validatePasswordMatch(password, value);
                break;
            
            default:
                if (field.required && !value) {
                    showValidationError(fieldName, 'This field is required');
                } else if (value) {
                    showValidationSuccess(fieldName);
                }
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8 && 
               /[a-z]/.test(password) && 
               /[A-Z]/.test(password) && 
               /[0-9]/.test(password);
    }

    function validatePasswordMatch(password, confirmPassword) {
        const confirmField = document.getElementById('confirmPassword');
        clearValidationState(confirmField);
        
        if (confirmPassword) {
            if (password === confirmPassword) {
                showValidationSuccess('confirmPassword');
            } else {
                showValidationError('confirmPassword', 'Passwords do not match');
            }
        }
    }

    function showValidationError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.remove('success');
        inputGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = inputGroup.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputGroup.parentNode.appendChild(errorDiv);
    }

    function showValidationSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
        
        // Remove error message
        const existingError = inputGroup.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearValidationState(field) {
        const inputGroup = field.closest('.input-group');
        inputGroup.classList.remove('error', 'success');
        
        const errorMessage = inputGroup.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function showLoadingState(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    function hideLoadingState(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    // ===== SOCIAL LOGIN HANDLERS =====
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Microsoft';
            showNotification(`${provider} login coming soon! 🚀`, 'info');
            
            // In a real app, you would integrate with OAuth providers here
            // initiateOAuthLogin(provider);
        });
    });

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#A8E6CF' : type === 'error' ? '#ff6b6b' : '#A7C7E7'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // ===== DEMO DATA HANDLERS =====
    function createUserAccount(userData) {
        // In a real application, this would make an API call to create the user account
        console.log('Creating user account:', userData);
        
        // Store user data in localStorage for demo
        const userProfile = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            institution: userData.institution,
            program: userData.program,
            studentId: userData.studentId,
            newsletter: userData.newsletter === 'on',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('sukham_user_profile', JSON.stringify(userProfile));
        localStorage.setItem('sukham_auth_token', 'demo_token_' + Date.now());
    }

    function authenticateUser(email, password, remember) {
        // In a real application, this would make an API call to authenticate the user
        console.log('Authenticating user:', { email, remember });
        
        // For demo purposes, create a mock authentication
        const authToken = 'demo_token_' + Date.now();
        
        if (remember) {
            localStorage.setItem('sukham_auth_token', authToken);
        } else {
            sessionStorage.setItem('sukham_auth_token', authToken);
        }
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Improve keyboard navigation
    const formElements = document.querySelectorAll('input, select, button, a');
    formElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Add visual focus indicator
                this.style.outline = '2px solid #A7C7E7';
                this.style.outlineOffset = '2px';
            }
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Add ARIA labels for screen readers
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.setAttribute('aria-label', 'Toggle password visibility');
    });

    // ===== FORM AUTO-SAVE (for signup form) =====
    if (signupForm) {
        const formInputs = signupForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            // Load saved data
            const savedValue = localStorage.getItem(`sukham_form_${input.name}`);
            if (savedValue && input.type !== 'password') {
                input.value = savedValue;
            }
            
            // Save data on input
            input.addEventListener('input', function() {
                if (this.type !== 'password') {
                    localStorage.setItem(`sukham_form_${this.name}`, this.value);
                }
            });
        });
    }

    // ===== INITIALIZE FLOATING ANIMATION =====
    const floatingElements = document.querySelectorAll('.element');
    floatingElements.forEach((element, index) => {
        // Add random delay to make animation more natural
        element.style.animationDelay = `${Math.random() * 2}s`;
        element.style.animationDuration = `${6 + Math.random() * 2}s`;
    });

    console.log('🌿 Sukham Authentication system initialized successfully!');
});

// ===== CSS ANIMATIONS (injected via JavaScript) =====
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .auth-notification .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .auth-notification .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .auth-notification .notification-close:hover {
        opacity: 1;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .element {
            animation: none !important;
        }
    }
`;
document.head.appendChild(authStyle);