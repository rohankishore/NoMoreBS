import { getSatiricalLine, getSatireSettings, initSatireSettings } from './satire.js';

let timerInterval = null;
let timeRemaining = 10; // TESTING: 10 seconds (change back to 25 * 60 for production)
let isRunning = false;
let pauseStartTime = null;
let pauseWarningShown = false;
let initialTimeRemaining = 10;

/**
 * Show satirical message
 */
async function showSatireMessage(message, type = 'info') {
    const messageEl = document.getElementById('timerMessage');
    messageEl.textContent = message;
    messageEl.className = `p-4 rounded-lg text-white text-base md:text-lg font-medium ${
        type === 'error' ? 'bg-red-900/50 border-2 border-red-500' : 'bg-gray-700'
    }`;
    messageEl.classList.remove('hidden');
}
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Update timer display
 */
function updateDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        display.textContent = formatTime(timeRemaining);
    }
}

/**
 * Start the timer
 */
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    pauseStartTime = null;
    pauseWarningShown = false;
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    document.getElementById('timerMessage').classList.add('hidden');
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();
        
        if (timeRemaining <= 0) {
            completeTimer();
        }
    }, 1000);
}

/**
 * Pause the timer
 */
function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    pauseStartTime = Date.now();
    pauseWarningShown = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    
    // Start checking pause duration
    setTimeout(() => checkPauseDuration(), 61000); // Check after 61 seconds
}

/**
 * Reset the timer
 */
async function resetTimer() {
    // Check if quitting early (more than 10% of time remaining)
    const percentRemaining = timeRemaining / initialTimeRemaining;
    
    if (isRunning || (timeRemaining > 0 && percentRemaining > 0.1)) {
        const settings = await getSatireSettings();
        const messages = {
            0: "Timer reset. You can start over anytime.",
            1: "Giving up already? Well, at least you're consistent.",
            2: "Wow. Just... wow. Couldn't even finish this one, huh?",
            3: settings.allowProfanity ?
                "Fucking quitter. Can't even finish a goddamn timer." :
                "Quitting early again? What a surprise. Absolutely shocking."
        };
        
        if (percentRemaining > 0.5) { // More than 50% remaining
            showSatireMessage(messages[settings.level] || messages[1], 'error');
        }
    }
    
    isRunning = false;
    clearInterval(timerInterval);
    timeRemaining = 10; // TESTING: 10 seconds (change back to 25 * 60 for production)
    initialTimeRemaining = 10;
    pauseStartTime = null;
    pauseWarningShown = false;
    updateDisplay();
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
}

/**
 * Handle timer completion
 */
async function completeTimer() {
    pauseTimer();
    timeRemaining = 0;
    updateDisplay();
    
    // Get satire settings and show message
    const settings = await getSatireSettings();
    const message = getSatiricalLine(settings.level, settings.allowProfanity);
    
    const messageEl = document.getElementById('timerMessage');
    messageEl.textContent = message;
    messageEl.classList.remove('hidden');
    
    // Play sound (optional, commented out for now)
    // playNotificationSound();
}

/**
 * Initialize timer functionality
 */
export function initTimer() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (!startBtn) return;
    
    // Initialize satire settings
    initSatireSettings();
    
    // Set initial display
    updateDisplay();
    
    // Attach event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}
