// ═══════════════════════════════════════════════════
//  DevTraffic — contato.js
// ═══════════════════════════════════════════════════

// ⚠️ Cole aqui a URL gerada no Apps Script (Passo 3)
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxIchn1_Jz5HleDdVET3LithSezc7i0BQ7u4a-StrJIHud3pDye_nZlFDA-XZ_54YLY/exec';

// ── NAVBAR SCROLL ──────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () =>
  nav.classList.toggle('scrolled', window.scrollY > 50)
);

// ── REVEAL ─────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ── HAMBURGER ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ── MÁSCARA DE TELEFONE ────────────────────────────
const phoneInput = document.getElementById('fphone');
if (phoneInput) {
  phoneInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    else if (v.length > 0) v = '(' + v;
    e.target.value = v;
  });
}

// ── SUBMIT ─────────────────────────────────────────
async function submitForm() {
  const nome     = document.getElementById('fname').value.trim();
  const empresa  = document.getElementById('fcompany').value.trim();
  const email    = document.getElementById('femail').value.trim();
  const telefone = document.getElementById('fphone').value.trim();
  const servico  = document.getElementById('fservice').value;
  const mensagem = document.getElementById('fmessage').value.trim();

  // Validação básica
  if (!nome || !email) {
    showFeedback('error', '⚠️ Preencha ao menos nome e e-mail.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFeedback('error', '⚠️ E-mail inválido.');
    return;
  }

  // Bloqueia o botão
  const btn = document.querySelector('.btn-submit');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const payload = {
    data:     new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    nome,
    empresa:  empresa  || '—',
    email,
    telefone: telefone || '—',
    servico:  servico  || '—',
    mensagem: mensagem || '—'
  };

  try {
    await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      // Google Apps Script exige mode no-cors para evitar erro de CORS
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Com no-cors não temos acesso à resposta, mas se não jogou erro = enviou
    btn.disabled = false;
    btn.textContent = originalText;

    // Limpa o formulário
    document.getElementById('contactForm')
      .querySelectorAll('input, select, textarea')
      .forEach(el => el.value = '');

    showFeedback('success', '✔ Mensagem enviada! Entraremos em contato em breve.');

  } catch (err) {
    btn.disabled = false;
    btn.textContent = originalText;
    showFeedback('error', '❌ Erro ao enviar. Tente novamente ou entre pelo WhatsApp.');
    console.error('Erro no envio:', err);
  }
}

function showFeedback(type, text) {
  const msg = document.getElementById('successMsg');
  msg.textContent = text;
  msg.style.display = 'block';
  if (type === 'error') {
    msg.style.background  = 'rgba(229,21,46,0.08)';
    msg.style.borderColor = 'rgba(229,21,46,0.4)';
    msg.style.color       = '#ff6060';
  } else {
    msg.style.background  = 'rgba(40,200,80,0.08)';
    msg.style.borderColor = 'rgba(40,200,80,0.3)';
    msg.style.color       = '#28c840';
  }
  setTimeout(() => {
    msg.style.display = 'none';
    msg.removeAttribute('style');
  }, 6000);
}