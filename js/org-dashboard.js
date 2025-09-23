// Organization Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    initializeSidebar();
    initializeProfileDropdown();
    initializeNotifications();
    initializeQuickActions();
    loadOrganizationData();
}

// Sidebar functionality
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Mobile sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Menu item click handlers
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
            
            // Handle navigation
            const href = this.querySelector('a').getAttribute('href');
            handleNavigation(href);
        });
    });
}

// Profile dropdown functionality
function initializeProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            profileDropdown.classList.remove('show');
        });
        
        // Handle dropdown item clicks
        const dropdownItems = profileDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                if (href === '#logout') {
                    handleLogout();
                } else {
                    handleDropdownAction(href);
                }
                
                profileDropdown.classList.remove('show');
            });
        });
    }
}

// Notification functionality
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Toggle notification panel (implement as needed)
            showNotifications();
        });
    }
}

// Quick actions functionality
function initializeQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            handleQuickAction(actionText);
        });
    });
}

// Load organization data
function loadOrganizationData() {
    // Simulate loading organization data
    const orgData = {
        name: 'Wellness Corp',
        memberCount: 248,
        eventsHosted: 15,
        weeklyActivities: 89,
        counselingSessions: 156
    };
    
    // Update welcome message
    const welcomeOrgName = document.getElementById('welcomeOrgName');
    const orgName = document.getElementById('orgName');
    
    if (welcomeOrgName && orgName) {
        welcomeOrgName.textContent = orgData.name;
        orgName.textContent = orgData.name;
    }
    
    // Animate stat numbers
    animateStats();
}

// Animate statistics numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-content h3');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        animateNumber(stat, 0, finalValue, 2000);
    });
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Navigation handler
function handleNavigation(href) {
    const section = href.substring(1); // Remove the '#' 
    
    switch(section) {
        case 'dashboard':
            console.log('Navigating to Dashboard');
            // Show dashboard content (already visible)
            break;
        case 'members':
            console.log('Navigating to Members');
            showNotImplementedMessage('Members Management');
            break;
        case 'analytics':
            console.log('Navigating to Analytics');
            showNotImplementedMessage('Analytics Dashboard');
            break;
        case 'events':
            console.log('Navigating to Events');
            showNotImplementedMessage('Events Management');
            break;
        case 'resources':
            console.log('Navigating to Resources');
            showNotImplementedMessage('Resources Library');
            break;
        case 'contact':
            console.log('Navigating to Contact');
            showNotImplementedMessage('Contact Support');
            break;
        default:
            console.log('Unknown navigation:', section);
    }
}

// Quick action handler
function handleQuickAction(actionText) {
    switch(actionText) {
        case 'Schedule Wellness Session':
            showScheduleModal();
            break;
        case 'Add New Member':
            showAddMemberModal();
            break;
        case 'Upload Resources':
            showUploadModal();
            break;
        case 'View Analytics':
            handleNavigation('#analytics');
            break;
        case 'Send Newsletter':
            showNewsletterModal();
            break;
        case 'Manage Settings':
            handleNavigation('#settings');
            break;
        default:
            showNotImplementedMessage(actionText);
    }
}

// Modal functions (placeholders)
function showScheduleModal() {
    showModal('Schedule Wellness Session', 'This feature will allow you to schedule wellness sessions for your organization members.');
}

function showAddMemberModal() {
    showModal('Add New Member', 'This feature will allow you to add new members to your organization.');
}

function showUploadModal() {
    showModal('Upload Resources', 'This feature will allow you to upload wellness resources for your members.');
}

function showNewsletterModal() {
    showModal('Send Newsletter', 'This feature will allow you to send newsletters to your organization members.');
}

function showNotifications() {
    showModal('Notifications', 'You have 3 new notifications:\n\n• New wellness workshop scheduled\n• Platform update available\n• Monthly report ready');
}

// Generic modal function
function showModal(title, message) {
    alert(`${title}\n\n${message}`);
    // In a real application, you would show a proper modal dialog
}

function showNotImplementedMessage(feature) {
    showModal(`${feature} - Coming Soon`, `The ${feature} feature is currently under development and will be available soon.`);
}

// Dropdown action handler
function handleDropdownAction(action) {
    const actionName = action.substring(1); // Remove the '#'
    
    switch(actionName) {
        case 'profile':
            showNotImplementedMessage('Profile Settings');
            break;
        case 'settings':
            showNotImplementedMessage('Organization Settings');
            break;
        default:
            console.log('Unknown dropdown action:', actionName);
    }
}

// Logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored session data
        localStorage.removeItem('org-session');
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'org-login.html';
    }
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
}

// Responsive handlers
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// Add smooth scrolling for anchor links
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

// Simulate real-time updates (optional)
setInterval(() => {
    updateNotificationCount();
}, 30000); // Update every 30 seconds

function updateNotificationCount() {
    const notificationCount = document.querySelector('.notification-count');
    if (notificationCount) {
        // Simulate random notification updates
        const currentCount = parseInt(notificationCount.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        notificationCount.textContent = newCount;
        
        // Hide notification badge if count is 0
        if (newCount === 0) {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'block';
        }
    }
}

// Initialize tooltips (if needed)
function initializeTooltips() {
    // Add tooltip functionality here if needed
    // This would typically use a library like Tippy.js or custom implementation
}