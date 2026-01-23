// Recordings Password Gate
// =====================

const RECORDINGS_PASSWORD = 'recordings2026'; // Edit this to change the password
const STORAGE_KEY = 'recordings_unlocked';

const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('password-error');

// Handle password form submission
function handlePasswordSubmit(e) {
  e.preventDefault();
  const enteredPassword = passwordInput.value.trim();
  
  if (enteredPassword === RECORDINGS_PASSWORD) {
    passwordError.hidden = true;
    localStorage.setItem(STORAGE_KEY, 'true');
    // Redirect to recordings view page
    window.location.href = 'recordings-view.html';
  } else {
    passwordError.textContent = 'Incorrect password. Please try again.';
    passwordError.hidden = false;
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Event listeners
if (passwordForm) {
  passwordForm.addEventListener('submit', handlePasswordSubmit);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const isUnlocked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (isUnlocked) {
    // If already unlocked, redirect to view page
    window.location.href = 'recordings-view.html';
  }
});

