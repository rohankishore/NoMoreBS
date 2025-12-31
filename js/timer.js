import { getSatiricalLine, getSatireSettings, initSatireSettings } from './satire.js';

let timerInterval = null;
let timeRemaining = 25 * 60;
let isRunning = false;
let pauseStartTime = null;
let pauseWarningShown = false;
let initialTimeRemaining = 25 * 60;
let currentMode = 'pomodoro';

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

function updateDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        display.textContent = formatTime(timeRemaining);
    }
}

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

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    pauseStartTime = Date.now();
    pauseWarningShown = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
}

async function resetTimer() {
    const percentRemaining = timeRemaining / initialTimeRemaining;
    
    if (isRunning || (timeRemaining > 0 && percentRemaining > 0.1)) {
        const settings = await getSatireSettings();
        const messages = {
            0: "Timer reset. You can start over anytime.",
            1: "Giving up already? Well, at least you're consistent in your failure.",
            2: "Wow. Just... wow. Couldn't even finish this one, huh? Pathetic.",
            3: settings.allowProfanity ?
                "Fucking quitter. Can't even finish a goddamn timer. You're a disgrace." :
                "Quitting early again? What a surprise. You're absolutely useless."
        };
        
        if (percentRemaining > 0.5) {
            showSatireMessage(messages[settings.level] || messages[1], 'error');
        }
    }
    
    isRunning = false;
    clearInterval(timerInterval);
    timeRemaining = initialTimeRemaining;
    pauseStartTime = null;
    pauseWarningShown = false;
    updateDisplay();
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
}

function setPomodoro() {
    if (isRunning) return;
    currentMode = 'pomodoro';
    timeRemaining = 25 * 60;
    initialTimeRemaining = 25 * 60;
    updateDisplay();
    updateModeButtons();
    document.getElementById('timerMessage').classList.add('hidden');
}

function setShortBreak() {
    if (isRunning) return;
    currentMode = 'short';
    timeRemaining = 5 * 60;
    initialTimeRemaining = 5 * 60;
    updateDisplay();
    updateModeButtons();
    document.getElementById('timerMessage').classList.add('hidden');
}

function setLongBreak() {
    if (isRunning) return;
    currentMode = 'long';
    timeRemaining = 15 * 60;
    initialTimeRemaining = 15 * 60;
    updateDisplay();
    updateModeButtons();
    document.getElementById('timerMessage').classList.add('hidden');
}

function updateModeButtons() {
    const pomodoroBtn = document.getElementById('pomodoroBtn');
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    const longBreakBtn = document.getElementById('longBreakBtn');
    
    [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach(btn => {
        if (btn) {
            btn.className = 'px-8 py-3 bg-transparent text-white font-medium rounded-full hover:bg-white/10 transition border-2 border-white/40 text-base';
        }
    });
    
    const activeBtn = currentMode === 'pomodoro' ? pomodoroBtn : 
                      currentMode === 'short' ? shortBreakBtn : longBreakBtn;
    if (activeBtn) {
        activeBtn.className = 'px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition shadow-md text-base';
    }
}

async function completeTimer() {
    pauseTimer();
    timeRemaining = 0;
    updateDisplay();
    
    const settings = await getSatireSettings();
    const message = getSatiricalLine(settings.level, settings.allowProfanity);
    
    const messageEl = document.getElementById('timerMessage');
    messageEl.textContent = message;
    messageEl.classList.remove('hidden');
}

export function initTimer() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const pomodoroBtn = document.getElementById('pomodoroBtn');
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    const longBreakBtn = document.getElementById('longBreakBtn');
    
    if (!startBtn) return;
    
    initSatireSettings();
    updateDisplay();
    updateModeButtons();
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    pomodoroBtn?.addEventListener('click', setPomodoro);
    shortBreakBtn?.addEventListener('click', setShortBreak);
    longBreakBtn?.addEventListener('click', setLongBreak);
}
