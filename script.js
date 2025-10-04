// Register the Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Get all the elements we need from the HTML
const setupScreen = document.getElementById('setup-screen');
const counterScreen = document.getElementById('counter-screen');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const presetButtons = document.querySelectorAll('.preset-btn');
const customTargetInput = document.getElementById('custom-target-input');
const useCustomBtn = document.getElementById('use-custom-btn');
const resetBtn = document.getElementById('reset-btn');
const manualResetBtn = document.getElementById('manual-reset-btn');
const tapArea = document.getElementById('tap-area');
const countDisplay = document.getElementById('count-display');
const targetDisplay = document.getElementById('target-display');
const currentDhikrText = document.getElementById('current-dhikr-text');

let currentCount = 0;
let targetCount = 100;
let dhikrText = 'Default';

// --- Functions ---

function startCounter(target, text) {
    targetCount = target;
    dhikrText = text;
    currentCount = 0;
    
    updateDisplay();
    
    localStorage.setItem('dhikr_target', targetCount);
    localStorage.setItem('dhikr_text', dhikrText);
    localStorage.setItem('dhikr_count', currentCount);
    
    setupScreen.classList.remove('active');
    counterScreen.classList.add('active');
}

function updateDisplay() {
    countDisplay.textContent = currentCount;
    targetDisplay.textContent = `/ ${targetCount}`;
    currentDhikrText.textContent = dhikrText;
}

function handleTap() {
    if (currentCount < targetCount) {
        currentCount++;
        updateDisplay();
        localStorage.setItem('dhikr_count', currentCount);
        
        // Vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50 milliseconds
        }
        
        if (currentCount === targetCount) {
            // Vibrate longer when target is reached
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    }
}

function goBackToSetup() {
    counterScreen.classList.remove('active');
    setupScreen.classList.add('active');
    // Clear saved state so we start fresh
    localStorage.removeItem('dhikr_target');
    localStorage.removeItem('dhikr_text');
    localStorage.removeItem('dhikr_count');
}

function resetCurrentCount() {
    currentCount = 0;
    updateDisplay();
    localStorage.setItem('dhikr_count', currentCount);
}

// --- Event Listeners ---

presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = parseInt(button.dataset.target, 10);
        const text = button.dataset.text;
        startCounter(target, text);
    });
});

useCustomBtn.addEventListener('click', () => {
    const customTarget = parseInt(customTargetInput.value, 10);
    if (customTarget > 0) {
        startCounter(customTarget, `Custom (${customTarget})`);
        customTargetInput.value = '';
    } else {
        alert('Please enter a valid number greater than 0.');
    }
});

tapArea.addEventListener('click', handleTap);
resetBtn.addEventListener('click', goBackToSetup);
manualResetBtn.addEventListener('click', resetCurrentCount);

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('dhikr_dark_mode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// --- On Page Load ---

// Check for saved progress
const savedTarget = localStorage.getItem('dhikr_target');
if (savedTarget) {
    targetCount = parseInt(savedTarget, 10);
    dhikrText = localStorage.getItem('dhikr_text');
    currentCount = parseInt(localStorage.getItem('dhikr_count') || 0, 10);
    updateDisplay();
    setupScreen.classList.remove('active');
    counterScreen.classList.add('active');
}

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('dhikr_dark_mode') === 'true';
if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}
