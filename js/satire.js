export function getSatiricalLine(level, allowProfanity) {
    const messages = {
        0: [
            "Good job! You completed a focused work session.",
            "Well done. Time for a short break.",
            "Nice work. You stayed focused for 25 minutes.",
            "Excellent. You've earned a break.",
            "Great job staying on task."
        ],
        1: [
            "Oh, you actually finished? Color me impressed.",
            "25 minutes of work. Truly groundbreaking.",
            "Wow, a whole Pomodoro. What's next, a medal?",
            "Look at you, sitting still for 25 minutes.",
            "Congratulations on doing the bare minimum."
        ],
        2: [
            "Shocking news: You did work instead of scrolling TikTok.",
            "Breaking: Local procrastinator completes one (1) task.",
            "Alert the media! Someone actually focused for once.",
            "Incredible. You resisted opening 47 new tabs.",
            "Wow. One whole Pomodoro. Your ancestors would be SO proud.",
            "Ladies and gentlemen, they didn't check their phone. Historic."
        ],
        
        3: allowProfanity ? [
            "Holy shit, you actually did it. Hell might freeze over, you lazy fuck.",
            "Un-fucking-believable. You stayed focused. What's your secret? Adderall?",
            "Well fuck me sideways, you completed a task like a semi-functional adult.",
            "No fucking way. Did you seriously just work for 25 minutes without crying?",
            "Damn! Look who decided to stop being a useless drain on society. About fucking time.",
            "Jesus Christ, you did it. Maybe you're not a complete waste of oxygen after all.",
            "Look at you, pretending to have a future. It's almost cute, you pathetic shit.",
            "Wow, 25 minutes. Your parents might actually stop being ashamed of you for five seconds.",
            "Congratulations. You've achieved what a trained monkey could do in half the time.",
            "Is this a joke? You actually finished? I had money on you giving up in three minutes."
        ] : [
            "Absolutely shocking. You worked instead of being a total disappointment.",
            "Unbelievable. You resisted every distraction. Who are you and what did you do with the loser?",
            "This is wild. You actually acted like a functional human for once. Don't get used to it.",
            "Stop the presses! Someone completed a task without needing a participation trophy.",
            "Damn! Look who decided to be productive for once. The bar was on the floor and you cleared it.",
            "Are you feeling okay? You just... worked. Voluntarily. It's terrifying.",
            "Incredible. You actually did something useful. I'm sure it won't last.",
            "Wow. You finished a task. Do you want a gold star and a nap, you big baby?",
            "Look at you go. One whole task. You're basically a CEO now, aren't you?",
            "I'm genuinely surprised you didn't find a way to screw this up. Bravo."
        ]
    };
    
    const levelMessages = messages[level] || messages[1];
    return levelMessages[Math.floor(Math.random() * levelMessages.length)];
}

export async function getSatireSettings() {
    const cached = localStorage.getItem('satireSettings');
    if (cached) {
        return JSON.parse(cached);
    }
    
    return {
        level: 1,
        allowProfanity: false
    };
}

export async function saveSatireSettings(level, allowProfanity) {
    const settings = { level, allowProfanity };
    localStorage.setItem('satireSettings', JSON.stringify(settings));
}

export async function initSatireSettings() {
    const satireLevel = document.getElementById('satireLevel');
    const satireLevelDisplay = document.getElementById('satireLevelDisplay');
    const allowProfanity = document.getElementById('allowProfanity');
    const profanityWarning = document.getElementById('profanityWarning');
    
    const satireLevelMobile = document.getElementById('satireLevelMobile');
    const satireLevelDisplayMobile = document.getElementById('satireLevelDisplayMobile');
    const allowProfanityMobile = document.getElementById('allowProfanityMobile');
    const profanityWarningMobile = document.getElementById('profanityWarningMobile');
    
    if (!satireLevel && !satireLevelMobile) return;
    
    const settings = await getSatireSettings();
    
    if (satireLevel) {
        satireLevel.value = settings.level;
        satireLevelDisplay.textContent = settings.level;
        allowProfanity.checked = settings.allowProfanity;
        if (settings.allowProfanity) profanityWarning.classList.remove('hidden');
    }
    
    if (satireLevelMobile) {
        satireLevelMobile.value = settings.level;
        satireLevelDisplayMobile.textContent = settings.level;
        allowProfanityMobile.checked = settings.allowProfanity;
        if (settings.allowProfanity) profanityWarningMobile.classList.remove('hidden');
    }
    
    satireLevel?.addEventListener('input', (e) => {
        const level = e.target.value;
        satireLevelDisplay.textContent = level;
        if (satireLevelDisplayMobile) satireLevelDisplayMobile.textContent = level;
        if (satireLevelMobile) satireLevelMobile.value = level;
        saveSatireSettings(parseInt(level), allowProfanity?.checked || false);
    });
    
    satireLevelMobile?.addEventListener('input', (e) => {
        const level = e.target.value;
        satireLevelDisplayMobile.textContent = level;
        if (satireLevelDisplay) satireLevelDisplay.textContent = level;
        if (satireLevel) satireLevel.value = level;
        saveSatireSettings(parseInt(level), allowProfanityMobile?.checked || false);
    });
    
    allowProfanity?.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (allowProfanityMobile) allowProfanityMobile.checked = checked;
        saveSatireSettings(parseInt(satireLevel?.value || 1), checked);
        
        if (checked) {
            profanityWarning?.classList.remove('hidden');
            profanityWarningMobile?.classList.remove('hidden');
        } else {
            profanityWarning?.classList.add('hidden');
            profanityWarningMobile?.classList.add('hidden');
        }
    });
    
    allowProfanityMobile?.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (allowProfanity) allowProfanity.checked = checked;
        saveSatireSettings(parseInt(satireLevelMobile?.value || 1), checked);
        
        if (checked) {
            profanityWarning?.classList.remove('hidden');
            profanityWarningMobile?.classList.remove('hidden');
        } else {
            profanityWarning?.classList.add('hidden');
            profanityWarningMobile?.classList.add('hidden');
        }
    });
}

/**
 * Sync settings between desktop and mobile (call this on init)
 */
export function syncSettings() {
    initSatireSettings();
}
