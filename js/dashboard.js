// ===== DASHBOARD JAVASCRIPT FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all dashboard components
    initializeNavigation();
    initializeChat();
    initializeProgressCharts();
    initializeSchedule();
    initializeBreathingExercise();
    initializeJournal();
    
    // Load user data
    loadUserData();
});

// ===== NAVIGATION TAB MANAGEMENT =====
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all tabs and content
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const targetTab = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Set default active tab (Chat)
    const defaultTab = document.querySelector('.nav-tab[data-tab="chat"]');
    const defaultContent = document.getElementById('chat-tab');
    if (defaultTab && defaultContent) {
        defaultTab.classList.add('active');
        defaultContent.classList.add('active');
    }
}

// ===== CHAT FUNCTIONALITY =====
function initializeChat() {
    const chatInput = document.getElementById('main-chat-input');
    const sendBtn = document.querySelector('.chat-send-btn');
    const messagesContainer = document.querySelector('.chat-messages');
    const suggestionsContainer = document.querySelector('.chat-suggestions');

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response with realistic delay
        const responseDelay = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage(response, 'ai');
        }, responseDelay);
    }

    // Add message to chat
    function addMessage(text, sender) {
        // Remove typing indicator if it exists
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-brain"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        content.appendChild(messageText);
        content.appendChild(timestamp);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        // Add animation delay for smooth appearance
        messageDiv.style.animationDelay = '0.1s';
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add typing effect for AI messages
        if (sender === 'ai') {
            typeMessage(messageText, text);
        }
    }

    // Typing effect for AI messages
    function typeMessage(element, text) {
        element.textContent = '';
        let index = 0;
        
        function typeChar() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 30); // Typing speed
            }
        }
        
        typeChar();
    }

    // Show typing indicator
    function showTypingIndicator() {
        // Remove existing typing indicator
        const existingIndicator = document.querySelector('.typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-ai';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-brain"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <span style="margin-right: 0.5rem; font-size: 0.9rem; color: var(--medium-gray);">Sukham AI is thinking</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        content.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Generate AI response
    function generateAIResponse(userMessage) {
        const responses = {
            'stress': "I understand you're feeling stressed. Let's try a quick breathing exercise together. Would you like me to guide you through one?",
            'anxious': "Anxiety can be overwhelming. Remember, you're safe right now. Try focusing on 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, and 1 you can taste.",
            'sad': "I'm sorry you're feeling sad. It's okay to feel this way - emotions are valid. Would you like to talk about what's bothering you or try a mood-lifting activity?",
            'exam': "Exam stress is very common. Break your study into smaller chunks, take regular breaks, and remember to breathe. You've got this! 💪",
            'sleep': "Good sleep is crucial for mental health. Try creating a bedtime routine, avoiding screens before bed, and keeping your room cool and dark.",
            'help': "I'm here to support you! You can ask me about stress management, breathing exercises, mood tracking, or just chat about how you're feeling.",
            'thanks': "You're very welcome! Remember, taking care of your mental health is a sign of strength, not weakness. I'm proud of you for reaching out. 🌟",
            'meditation': "Meditation is a wonderful practice! Let's start with a simple 5-minute mindfulness session. Close your eyes and focus on your breathing.",
            'journal': "Journaling can be very therapeutic. Try writing about three things you're grateful for today, or explore your feelings without judgment.",
            'breathing': "Let's practice the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, and exhale for 8. This helps activate your parasympathetic nervous system."
        };

        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return "Thank you for sharing that with me. How are you feeling right now? I'm here to listen and support you. You can ask me about breathing exercises, coping strategies, or just tell me what's on your mind.";
    }

    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Suggestion buttons
    if (suggestionsContainer) {
        suggestionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const suggestionText = e.target.textContent;
                chatInput.value = suggestionText;
                sendMessage();
            }
        });
    }

    // Add welcome message
    setTimeout(() => {
        addMessage("Hello! I'm Sukham AI, your personal mental health companion. How can I support you today?", 'ai');
    }, 500);
}

// ===== PROGRESS CHARTS INITIALIZATION =====
function initializeProgressCharts() {
    // Progress Chart for wellness tracking
    const progressCtx = document.getElementById('progressChart');
    const timeFilter = document.querySelector('.time-filter');
    
    if (progressCtx && timeFilter) {
        let progressChart;
        
        // Chart data for different time periods
        const chartData = {
            7: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [6.8, 7.2, 6.5, 7.8, 8.1, 7.5, 8.0],
                title: '7-Day Wellness Progress'
            },
            30: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [6.2, 6.8, 7.5, 7.9],
                title: '30-Day Wellness Progress'
            },
            90: {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                data: [6.5, 7.2, 8.0],
                title: '3-Month Wellness Progress'
            }
        };
        
        function updateChart(period) {
            const data = chartData[period];
            const chartTitle = document.querySelector('.progress-card h3');
            
            if (chartTitle) {
                chartTitle.innerHTML = `<i class="fas fa-chart-line"></i> ${data.title}`;
            }
            
            if (progressChart) {
                progressChart.destroy();
            }
            
            progressChart = new Chart(progressCtx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Wellness Progress',
                        data: data.data,
                        borderColor: '#A7C7E7',
                        backgroundColor: 'rgba(167, 199, 231, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#A8E6CF',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '/10';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
        
        // Initialize with default period (30 days)
        updateChart(30);
        
        // Add event listener for time filter changes
        timeFilter.addEventListener('change', function() {
            const selectedPeriod = parseInt(this.value);
            updateChart(selectedPeriod);
        });
    }

    // Weekly Mood Chart
    const moodCtx = document.getElementById('moodChart');
    if (moodCtx) {
        new Chart(moodCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Mood Rating',
                    data: [7, 6, 8, 7, 9, 8, 7],
                    borderColor: '#A7C7E7',
                    backgroundColor: 'rgba(167, 199, 231, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#A8E6CF',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '/10';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    // Activity Progress Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Meditation', 'Exercise', 'Journaling', 'Sleep'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        '#A7C7E7',
                        '#A8E6CF',
                        '#CDB4DB',
                        '#FFB6C1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Poppins'
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===== SCHEDULE FUNCTIONALITY =====
function initializeSchedule() {
    // Initialize calendar widget
    initializeCalendar();
    
    // Task management in schedule
    initializeTaskManagement();
}

function initializeCalendar() {
    let currentDate = new Date();
    
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const currentMonthSpan = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!calendarGrid) return;
    
    // Event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        if (currentMonthSpan) {
            currentMonthSpan.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Add previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayElement = createCalendarDay(daysInPrevMonth - i, true, false);
            calendarGrid.appendChild(dayElement);
        }
        
        // Add current month's days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = year === today.getFullYear() && 
                           month === today.getMonth() && 
                           day === today.getDate();
            const hasEvents = Math.random() > 0.7; // Random events for demo
            const dayElement = createCalendarDay(day, false, isToday, hasEvents);
            calendarGrid.appendChild(dayElement);
        }
        
        // Add next month's leading days
        const totalCells = calendarGrid.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells && day <= 14; day++) {
            const dayElement = createCalendarDay(day, true, false);
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function createCalendarDay(dayNumber, isOtherMonth, isToday, hasEvents = false) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        if (isToday) {
            dayElement.classList.add('today');
        }
        if (hasEvents) {
            dayElement.classList.add('has-events');
        }
        
        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.className = 'calendar-day-number';
        dayNumberSpan.textContent = dayNumber;
        dayElement.appendChild(dayNumberSpan);
        
        if (hasEvents && !isOtherMonth) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            
            // Add random number of event dots (1-3)
            const numEvents = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numEvents; i++) {
                const eventDot = document.createElement('div');
                eventDot.className = 'calendar-event-dot';
                eventsContainer.appendChild(eventDot);
            }
            
            dayElement.appendChild(eventsContainer);
        }
        
        // Add click event
        dayElement.addEventListener('click', () => {
            if (!isOtherMonth) {
                // Remove previous selection
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selection to clicked day
                dayElement.classList.add('selected');
                
                // Show notification with selected date
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const selectedDate = `${monthNames[currentDate.getMonth()]} ${dayNumber}, ${currentDate.getFullYear()}`;
                showNotification(`Selected date: ${selectedDate}`, 'info');
            }
        });
        
        return dayElement;
    }
    
    // Initial render
    renderCalendar();
}

function initializeTaskManagement() {
    // Task completion handling
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.classList.add('completed');
                showNotification('Task completed! Great job! 🎉', 'success');
                updateStats();
            } else {
                taskItem.classList.remove('completed');
            }
            
            saveTaskProgress();
        });
    });
}

// ===== BREATHING EXERCISE =====
function initializeBreathingExercise() {
    const breathingBtns = document.querySelectorAll('.breathing-btn');
    
    breathingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openBreathingModal();
        });
    });
}

function openBreathingModal() {
    // Create breathing modal if it doesn't exist
    let modal = document.getElementById('breathing-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'breathing-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>Breathing Exercise</h3>
                <p>Follow the circle and breathe deeply</p>
                <div class="breathing-circle">
                    <div class="breathing-inner"></div>
                </div>
                <div class="breathing-instructions">
                    <p id="breathing-text">Click Start to begin</p>
                </div>
                <div class="breathing-controls">
                    <button id="start-breathing" class="btn btn-primary">Start</button>
                    <button id="stop-breathing" class="btn btn-secondary" style="display: none;">Stop</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.querySelector('#start-breathing').addEventListener('click', startBreathingExercise);
        modal.querySelector('#stop-breathing').addEventListener('click', stopBreathingExercise);
    }
    
    modal.classList.add('active');
}

function startBreathingExercise() {
    const circle = document.querySelector('.breathing-circle');
    const text = document.getElementById('breathing-text');
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');
    
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    circle.classList.add('breathing');
    
    const breathingCycle = () => {
        text.textContent = 'Breathe in...';
        setTimeout(() => {
            text.textContent = 'Hold...';
            setTimeout(() => {
                text.textContent = 'Breathe out...';
            }, 3000);
        }, 4000);
    };
    
    breathingCycle();
    window.breathingInterval = setInterval(breathingCycle, 12000);
}

function stopBreathingExercise() {
    const circle = document.querySelector('.breathing-circle');
    const text = document.getElementById('breathing-text');
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');
    
    if (window.breathingInterval) {
        clearInterval(window.breathingInterval);
    }
    
    circle.classList.remove('breathing');
    text.textContent = 'Great job! Click Start to try again.';
    
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    
    showNotification('Breathing exercise completed! 🌟', 'success');
}

// ===== JOURNAL FUNCTIONALITY =====
function initializeJournal() {
    const journalBtns = document.querySelectorAll('.journal-btn');
    
    journalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openJournalModal();
        });
    });
}

function openJournalModal() {
    // Create journal modal if it doesn't exist
    let modal = document.getElementById('journal-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'journal-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>Daily Journal</h3>
                <p>Write about your thoughts and feelings</p>
                <textarea id="journal-text" placeholder="How are you feeling today? What's on your mind?" rows="10"></textarea>
                <div class="journal-controls">
                    <button id="save-journal" class="btn btn-primary">Save Entry</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.querySelector('#save-journal').addEventListener('click', saveJournalEntry);
    }
    
    modal.classList.add('active');
}

function saveJournalEntry() {
    const text = document.getElementById('journal-text').value;
    if (text.trim()) {
        // Save to localStorage (in a real app, this would sync to server)
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.push({
            date: new Date().toISOString(),
            text: text
        });
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        showNotification('Journal entry saved! 📝', 'success');
        document.getElementById('journal-modal').classList.remove('active');
        document.getElementById('journal-text').value = '';
    }
}

// ===== UTILITY FUNCTIONS =====
function updateStats() {
    // Update completion stats in progress tab
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const progressNumber = document.querySelector('.stat-number');
    if (progressNumber) {
        progressNumber.textContent = completionRate + '%';
    }
}

function saveTaskProgress() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        tasks.push({
            text: task.querySelector('label').textContent,
            completed: task.querySelector('input').checked
        });
    });
    localStorage.setItem('taskProgress', JSON.stringify(tasks));
}

function loadUserData() {
    // Load saved task progress
    const savedTasks = JSON.parse(localStorage.getItem('taskProgress') || '[]');
    savedTasks.forEach((savedTask, index) => {
        const taskItems = document.querySelectorAll('.task-item');
        if (taskItems[index]) {
            const checkbox = taskItems[index].querySelector('input');
            checkbox.checked = savedTask.completed;
            if (savedTask.completed) {
                taskItems[index].classList.add('completed');
            }
        }
    });
    
    updateStats();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#A8E6CF' : type === 'error' ? '#FFB6C1' : '#A7C7E7'};
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        stopBreathingExercise();
    }
});