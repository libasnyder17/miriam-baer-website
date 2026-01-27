// Recordings View Page
// ====================

const STORAGE_KEY = 'recordings_unlocked';

const lockButton = document.getElementById('lock-button');
const recordingsGrid = document.getElementById('recordings-grid');
const recordingsError = document.getElementById('recordings-error');

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
    return false;
  }
  return true;
}

// Render recordings from JSON data
function renderRecordings(data) {
  if (!recordingsGrid) return;

  const titleEl = document.getElementById('workshop-title');
  if (data.workshop_title && titleEl) titleEl.textContent = data.workshop_title;

  const sessions = Array.isArray(data.sessions) ? data.sessions : [];
  if (sessions.length === 0) {
    recordingsGrid.innerHTML = '<p class="note">No sessions are available yet.</p>';
    return;
  }

  recordingsGrid.innerHTML = '';
  sessions.forEach((s, idx) => {
    const link = (s.link || '').trim();
    
    // If there's a link, make the entire card clickable
    let article;
    if (link) {
      article = document.createElement('a');
      article.href = link;
      article.target = '_blank';
      article.rel = 'noopener noreferrer';
      article.className = 'recording-card recording-card-link';
      article.style.textDecoration = 'none';
      article.style.color = 'inherit';
      article.style.cursor = 'pointer';
    } else {
      article = document.createElement('article');
      article.className = 'recording-card';
    }

    const h3 = document.createElement('h3');
    h3.textContent = s.session_title || '';
    article.appendChild(h3);

    if (s.description) {
      const sd = document.createElement('p');
      sd.className = 'session-description';
      sd.textContent = s.description;
      article.appendChild(sd);
    }

    const date = document.createElement('p');
    date.className = 'session-date';
    date.textContent = s.date || '';
    article.appendChild(date);

    if (!link) {
      const p = document.createElement('p');
      p.className = 'note';
      p.textContent = 'Recording coming soon';
      article.appendChild(p);
    }

    recordingsGrid.appendChild(article);
  });
}

// Load recordings JSON
async function loadRecordings() {
  if (!recordingsGrid) return;
  try {
    const res = await fetch('/content/recordings.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch recordings');
    const data = await res.json();
    renderRecordings(data);
  } catch (err) {
    console.error('Error loading recordings:', err);
    if (recordingsError) recordingsError.style.display = 'block';
    if (recordingsGrid) recordingsGrid.innerHTML = '';
  }
}

// Event listeners
if (lockButton) {
  lockButton.addEventListener('click', lockRecordings);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  if (checkAccess()) {
    loadRecordings();
  }
});
