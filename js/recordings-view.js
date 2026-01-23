// Recordings View Page
// ====================

const STORAGE_KEY = 'recordings_unlocked';

const lockButton = document.getElementById('lock-button');

// Lock and return to gate
function lockRecordings() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'recordings.html';
}

// Check if user should have access
function checkAccess() {
  const isUnlocked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (!isUnlocked) {
    // Not authorized - redirect back to gate
    window.location.href = 'recordings.html';
  }
}

// Event listeners
if (lockButton) {
  lockButton.addEventListener('click', lockRecordings);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkAccess);
