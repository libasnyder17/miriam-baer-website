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
    const article = document.createElement('article');
    article.className = 'recording-card';

    const h3 = document.createElement('h3');
    h3.textContent = `Session ${idx + 1}`;
    article.appendChild(h3);

    const st = document.createElement('p');
    st.className = 'session-title';
    st.textContent = s.session_title || '';
    article.appendChild(st);

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

    const link = (s.link || '').trim();
    if (link) {
      const a = document.createElement('a');
      a.className = 'btn primary watch-btn';
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Watch Recording';
      article.appendChild(a);
    } else {
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
