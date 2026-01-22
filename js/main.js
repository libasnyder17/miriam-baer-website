document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('year').textContent = new Date().getFullYear();

  // Contact form: Netlify handles submission
  // No additional JS needed - Netlify form submission will redirect to /thank-you/
});
