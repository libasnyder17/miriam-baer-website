// identity-init.js
// Robust Netlify Identity init + invite token handler
(function() {
  'use strict';

  const TOKEN_KEYS = ['invite_token', 'recovery_token', 'confirmation_token'];

  function parseHashTokens() {
    try {
      const hash = window.location.hash || '';
      // remove leading # or #/
      const cleaned = hash.replace(/^#\/?/, '');
      // If hash starts with ? then it's query-like
      const qs = cleaned.charAt(0) === '?' ? cleaned.slice(1) : cleaned;
      return new URLSearchParams(qs);
    } catch (e) {
      return new URLSearchParams();
    }
  }

  function parseSearchTokens() {
    try {
      return new URLSearchParams(window.location.search || '');
    } catch (e) {
      return new URLSearchParams();
    }
  }

  function findToken() {
    const search = parseSearchTokens();
    for (const k of TOKEN_KEYS) {
      if (search.has(k)) return { key: k, value: search.get(k) };
    }

    const hash = parseHashTokens();
    for (const k of TOKEN_KEYS) {
      if (hash.has(k)) return { key: k, value: hash.get(k) };
    }

    return null;
  }

  function safeInitIdentity() {
    try {
      if (window.netlifyIdentity && typeof window.netlifyIdentity.init === 'function') {
        window.netlifyIdentity.init();
      }
    } catch (e) {
      console.warn('netlifyIdentity.init() failed', e);
    }
  }

  function ensureIdentityReady(timeout = 3000) {
    return new Promise((resolve, reject) => {
      if (window.netlifyIdentity && typeof window.netlifyIdentity.open === 'function') return resolve(window.netlifyIdentity);
      const start = Date.now();
      const iv = setInterval(() => {
        if (window.netlifyIdentity && typeof window.netlifyIdentity.open === 'function') {
          clearInterval(iv);
          return resolve(window.netlifyIdentity);
        }
        if (Date.now() - start > timeout) {
          clearInterval(iv);
          return reject(new Error('netlifyIdentity not available'));
        }
      }, 100);
    });
  }

  function attachLoginRedirect() {
    try {
      if (!window.netlifyIdentity) return;
      window.netlifyIdentity.on('login', function() {
        try { window.netlifyIdentity.close(); } catch (e) {}
        window.location.href = '/admin/';
      });
    } catch (e) {
      console.warn('attachLoginRedirect error', e);
    }
  }

  function openModalIfToken() {
    const token = findToken();
    if (!token) return;

    ensureIdentityReady().then((ni) => {
      try {
        // Ensure init called and login handler attached
        safeInitIdentity();
        attachLoginRedirect();
        // Slight delay so the widget is ready and any Netlify redirects settle
        setTimeout(() => {
          try { ni.open(); } catch (e) { console.warn('netlifyIdentity.open() failed', e); }
        }, 300);
      } catch (e) {
        console.warn('openModalIfToken error', e);
      }
    }).catch((err) => {
      console.warn('Netlify Identity not ready to open modal', err);
    });
  }

  // Run on load
  try {
    // Attach login redirect always so normal logins also redirect
    attachLoginRedirect();
    // Call init if possible
    safeInitIdentity();
    // If an invite/recovery/confirmation token is present, open the modal
    openModalIfToken();
  } catch (e) {
    console.warn('identity-init.js error', e);
  }

})();
// Netlify Identity Initialization
// ================================

(function() {
  // Check if netlifyIdentity is available
  if (typeof netlifyIdentity === 'undefined') {
    console.warn('Netlify Identity widget not loaded');
    return;
  }

  // Initialize Netlify Identity
  netlifyIdentity.init();

  // Helper function to get token from URL
  function getTokenFromUrl() {
    // Check hash parameters (e.g., #invite_token=...)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenTypes = ['invite_token', 'recovery_token', 'confirmation_token'];
    
    for (const tokenType of tokenTypes) {
      const token = hashParams.get(tokenType);
      if (token) return { type: tokenType, value: token };
    }

    // Check search parameters (e.g., ?invite_token=...)
    const searchParams = new URLSearchParams(window.location.search);
    for (const tokenType of tokenTypes) {
      const token = searchParams.get(tokenType);
      if (token) return { type: tokenType, value: token };
    }

    return null;
  }

  // Set up redirect on successful login
  function setupLoginRedirect() {
    netlifyIdentity.on('login', function(user) {
      console.log('User logged in:', user);
      // Redirect to admin after successful login
      window.location.href = '/admin/';
    });
  }

  // Check for tokens and open modal if present
  function handleInviteToken() {
    const token = getTokenFromUrl();
    
    if (token) {
      console.log('Found token:', token.type);
      // Open the identity modal after a short delay to ensure it's loaded
      setTimeout(function() {
        netlifyIdentity.open();
      }, 300);
    }
  }

  // Run initialization
  setupLoginRedirect();
  handleInviteToken();
})();
