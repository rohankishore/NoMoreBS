import { getSatiricalLine, getSatireSettings, initSatireSettings } from './satire.js';

let timerInterval = null;
let timeRemaining = 10; // TESTING: 10 seconds (change back to 25 * 60 for production)
let isRunning = false;

/**
 * Format seconds to MM:SS
 */
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
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    
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
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
}

/**
 * Reset the timer
 */
function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timeRemaining = 10; // TESTING: 10 seconds (change back to 25 * 60 for production)
    updateDisplay();
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('timerMessage').classList.add('hidden');
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
