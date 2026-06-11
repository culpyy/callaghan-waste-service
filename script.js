function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById('tab-' + name);
  if (tab) {
    tab.classList.add('active');
    tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const btn = document.querySelector('[data-tab="' + name + '"]');
  if (btn) btn.classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

function handleQuote(e) {
  e.preventDefault();
  document.getElementById('quoteForm').style.display = 'none';
  document.getElementById('quoteSuccess').style.display = 'block';
}
