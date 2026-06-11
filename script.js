// ===== TAB NAVIGATION =====
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById('tab-' + name);
  if (tab) {
    tab.classList.add('active');
    // offset scroll to account for sticky header on iOS
    const headerH = document.querySelector('header').offsetHeight;
    const top = tab.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  const btn = document.querySelector('[data-tab="' + name + '"]');
  if (btn) btn.classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ===== QUOTE PRICING =====
const BASE = { residential: 25, commercial: 200 };

const FREQ_DISCOUNT = {
  'One-Time':            0,
  'Quarterly':           0.05,
  'Monthly':             0.15,
  'Weekly (Commercial)': 0.28,
};

const FREQ_PER_YEAR = {
  'One-Time':            1,
  'Quarterly':           4,
  'Monthly':             12,
  'Weekly (Commercial)': 52,
};

function volumeDiscount(cans) {
  if (cans >= 10) return 0.15;
  if (cans >= 6)  return 0.10;
  if (cans >= 3)  return 0.05;
  return 0;
}

function fmt(n) {
  const rounded = Math.round(n * 100) / 100;
  return '$' + (rounded % 1 === 0 ? rounded : rounded.toFixed(2));
}

function updateEstimate() {
  const serviceEl = document.querySelector('input[name="serviceType"]:checked');
  const cansEl    = document.getElementById('canCount');
  const freqEl    = document.getElementById('frequency');
  const box       = document.getElementById('priceEstimate');
  const amountEl  = document.getElementById('estimateAmount');
  const detailEl  = document.getElementById('estimateDetail');

  const service = serviceEl ? serviceEl.value : null;
  const cans    = parseInt(cansEl.value) || 0;
  const freq    = freqEl.value;

  if (!service || cans < 1 || !freq) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';

  if (freq === "Custom / Let's Talk") {
    amountEl.textContent = 'Custom Pricing';
    detailEl.textContent = "We'll reach out with a tailored quote for your needs.";
    return;
  }

  const baseRate    = BASE[service];
  const freqDisc    = FREQ_DISCOUNT[freq] ?? 0;
  const volDisc     = volumeDiscount(cans);
  const totalDisc   = Math.min(freqDisc + volDisc, 0.40);
  const pricePerCan = baseRate * (1 - totalDisc);
  const perClean    = pricePerCan * cans;
  const timesPerYear = FREQ_PER_YEAR[freq] || 1;
  const perYear     = perClean * timesPerYear;

  amountEl.textContent = fmt(perClean) + ' per cleaning';

  let detail = fmt(pricePerCan) + '/can × ' + cans + ' can' + (cans > 1 ? 's' : '');
  if (timesPerYear > 1) {
    detail += ' — ~' + fmt(perYear) + '/year (' + freq.toLowerCase() + ')';
  }
  if (totalDisc > 0) {
    detail += ' — ' + Math.round(totalDisc * 100) + '% discount applied';
  }
  detailEl.textContent = detail;
}

['canCount', 'frequency'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', updateEstimate);
});
document.querySelectorAll('input[name="serviceType"]').forEach(function(el) {
  el.addEventListener('change', updateEstimate);
});

// ===== QUOTE SUBMIT =====
function handleQuote(e) {
  e.preventDefault();
  document.getElementById('quoteForm').style.display = 'none';
  document.getElementById('quoteSuccess').style.display = 'block';
}
