document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('year').textContent = new Date().getFullYear();

  const modal = document.getElementById('modal');
  const openButtons = [document.getElementById('open-register'), document.getElementById('open-register-2'), document.getElementById('open-register-3')].filter(Boolean);
  const joinButtons = [document.getElementById('join-series'), document.getElementById('join-series-2')].filter(Boolean);

  function showModal(){ modal.setAttribute('aria-hidden','false'); }
  function hideModal(){ modal.setAttribute('aria-hidden','true'); clearModalMessage(); }

  openButtons.forEach(b => b.addEventListener('click', showModal));
  joinButtons.forEach(b => b.addEventListener('click', ()=>{ showModal(); document.getElementById('modal-title').textContent = 'Join the Full Workshop Series'; }));

  const close = document.getElementById('close-modal'); if(close) close.addEventListener('click', hideModal);

  const form = document.getElementById('register-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      // Placeholder: would send to registration backend here
      setModalMessage(`Thank you, ${name || 'friend'}! Check ${email} for confirmation.`);
      form.reset();
    });
  }

  function setModalMessage(msg){
    const el = document.getElementById('modal-message');
    if(!el) return;
    el.hidden = false; el.textContent = msg;
  }
  function clearModalMessage(){ const el=document.getElementById('modal-message'); if(el){el.hidden=true;el.textContent='';} }

  // Contact form: Netlify handles submission
  // No additional JS needed - Netlify form submission will redirect to /thank-you/
});
