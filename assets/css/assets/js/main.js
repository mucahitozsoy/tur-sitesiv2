// Blur destek kontrolü: HTML tag'ine sınıf ekleyelim
(function () {
  try {
    const t = document.createElement('div');
    t.style.backdropFilter = 'blur(1px)';
    if (t.style.backdropFilter) document.documentElement.classList.add('supports-blur');
  } catch (e) {}
})();

// Elemanlar
const header = document.querySelector('header');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');

// Mobil menü toggle
if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Mobil menüde linke tıklayınca kapat
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Header arka plan yoğunluğu (küçük efekt)
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 100
    ? 'rgba(255,255,255,0.98)'
    : 'rgba(255,255,255,0.95)';
});

// Anchor smooth scroll + header offset
function scrollWithOffset(target) {
  const y = target.getBoundingClientRect().top + window.pageYOffset;
  const offset = header.offsetHeight + 10;
  window.scrollTo({ top: y - offset, behavior: 'smooth' });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollWithOffset(el);
  });
});

// FAQ: erişilebilir akordeon
document.querySelectorAll('.faq-item').forEach((item, idx) => {
  const btn = item.querySelector('.faq-question');
  const panel = item.querySelector('.faq-answer');
  const panelId = `faq-panel-${idx}`;

  btn.setAttribute('aria-controls', panelId);
  btn.setAttribute('aria-expanded', 'false');
  panel.id = panelId;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-hidden', 'true');
  panel.style.maxHeight = '0px';

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    // diğerlerini kapat
    document.querySelectorAll('.faq-item').forEach(it => {
      const b = it.querySelector('.faq-question');
      const p = it.querySelector('.faq-answer');
      if (it !== item) {
        b.setAttribute('aria-expanded', 'false');
        p.setAttribute('aria-hidden', 'true');
        p.style.maxHeight = '0px';
        it.classList.remove('active');
      }
    });

    // aktif olanı aç/kapat
    btn.setAttribute('aria-expanded', String(!expanded));
    panel.setAttribute('aria-hidden', String(expanded));
    panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    item.classList.toggle('active');
  });
});

// Form (demo): WP'de CF7 kullanacaksan bu kısmı kaldır
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!fd.get('name') || !fd.get('email')) {
      alert('Lütfen ad soyad ve e-posta alanlarını doldurun.');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Gönderiliyor…';
    btn.disabled = true;
    setTimeout(() => {
      alert('Mesajınız alındı. En kısa sürede döneceğiz.');
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });
}
