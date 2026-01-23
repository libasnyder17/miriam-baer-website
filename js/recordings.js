// Recordings Password Gate
// =====================

const RECORDINGS_PASSWORD = 'recordings2026'; // Edit this to change the password
const STORAGE_KEY = 'recordings_unlocked';

const passwordGate = document.getElementById('password-gate');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('password-error');
const recordingsContent = document.getElementById('recordings-content');
const lockButton = document.getElementById('lock-button');

// Check if user is already unlocked
function checkUnlocked() {
  const isUnlocked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (isUnlocked) {
    unlockRecordings();
  }
}

// Handle password form submission
function handlePasswordSubmit(e) {
  e.preventDefault();
  const enteredPassword = passwordInput.value.trim();
  
  if (enteredPassword === RECORDINGS_PASSWORD) {
    passwordError.hidden = true;
    localStorage.setItem(STORAGE_KEY, 'true');
    unlockRecordings();
  } else {
    passwordError.textContent = 'Incorrect password. Please try again.';
    passwordError.hidden = false;
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Unlock and show recordings content
function unlockRecordings() {
  passwordGate.hidden = true;
  recordingsContent.hidden = false;
}

// Lock and hide recordings content
function lockRecordings() {
  passwordGate.hidden = false;
  recordingsContent.hidden = true;
  passwordInput.value = '';
  passwordError.hidden = true;
  localStorage.removeItem(STORAGE_KEY);
  passwordInput.focus();
}

// Event listeners
if (passwordForm) {
  passwordForm.addEventListener('submit', handlePasswordSubmit);
}

if (lockButton) {
  lockButton.addEventListener('click', lockRecordings);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkUnlocked);
