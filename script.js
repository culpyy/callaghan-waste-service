// ===== SERVICE TYPE TOGGLE =====
document.querySelectorAll('.toggle-option').forEach(function(label) {
  label.addEventListener('click', function() {
    var radio = label.querySelector('input[type="radio"]');
    if (!radio) return;
    radio.checked = true;
    document.querySelectorAll('.toggle-option').forEach(function(l) { l.classList.remove('selected'); });
    label.classList.add('selected');
    updateEstimate();
  });
});

// ===== TAB NAVIGATION =====
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById('tab-' + name);
  if (tab) {
    tab.classList.add('active');
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

// ===== CARD PREFILL =====
function prefillQuote(service, freq) {
  showTab('quote');

  // set service type radio + toggle visual
  var radio = document.querySelector('input[name="serviceType"][value="' + service + '"]');
  if (radio) {
    radio.checked = true;
    document.querySelectorAll('.toggle-option').forEach(function(l) { l.classList.remove('selected'); });
    var parentLabel = radio.closest('.toggle-option');
    if (parentLabel) parentLabel.classList.add('selected');
  }

  // set frequency select
  var freqEl = document.getElementById('frequency');
  if (freqEl && freq) {
    freqEl.value = freq;
    freqEl.dispatchEvent(new Event('input'));
  }
}

// ===== QUOTE PRICING =====
const BASE = { residential: 25, commercial: 200 };

const FREQ_DISCOUNT = {
  'One-Time':  0,
  'Quarterly': 0.05,
  'Monthly':   0.15,
  'Weekly':    0.28,
};

const FREQ_PER_YEAR = {
  'One-Time':  1,
  'Quarterly': 4,
  'Monthly':   12,
  'Weekly':    52,
};

function volumeDiscount(cans) {
  if (cans >= 10) return 0.15;
  if (cans >= 6)  return 0.10;
  if (cans >= 3)  return 0.05;
  return 0;
}

function fmt(n) {
  var rounded = Math.round(n * 100) / 100;
  return '$' + (rounded % 1 === 0 ? rounded : rounded.toFixed(2));
}

function updateEstimate() {
  var serviceEl = document.querySelector('input[name="serviceType"]:checked');
  var cansEl    = document.getElementById('canCount');
  var freqEl    = document.getElementById('frequency');
  var box       = document.getElementById('priceEstimate');
  var amountEl  = document.getElementById('estimateAmount');
  var detailEl  = document.getElementById('estimateDetail');

  var service = serviceEl ? serviceEl.value : null;
  var cans    = parseInt(cansEl.value) || 0;
  var freq    = freqEl.value;

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

  var baseRate     = BASE[service];
  var freqDisc     = FREQ_DISCOUNT[freq] !== undefined ? FREQ_DISCOUNT[freq] : 0;
  var volDisc      = volumeDiscount(cans);
  var totalDisc    = Math.min(freqDisc + volDisc, 0.40);
  var pricePerCan  = baseRate * (1 - totalDisc);
  var perClean     = pricePerCan * cans;
  var timesPerYear = FREQ_PER_YEAR[freq] || 1;
  var perYear      = perClean * timesPerYear;

  amountEl.textContent = fmt(perClean) + ' per cleaning';

  var detail = fmt(pricePerCan) + '/can × ' + cans + ' can' + (cans > 1 ? 's' : '');
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

// ===== QUOTE SUBMIT =====
function handleQuote(e) {
  e.preventDefault();
  document.getElementById('quoteForm').style.display = 'none';
  document.getElementById('quoteSuccess').style.display = 'block';
}
