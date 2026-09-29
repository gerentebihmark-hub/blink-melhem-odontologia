/**
 * Melhem Odontologia - Blink Engine
 * Carrossel com touch swipe, validação de horários em tempo real, modais LGPD e analytics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initLiveHours();
  initModals();
  initAnalyticsTracking();
});

/* ==========================================================================
   1. CARROSSEL DE ESPECIALIDADES COM TOUCH SWIPE E INDICADORES (DOTS)
   ========================================================================== */
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isTouching = false;
  let startX = 0;
  let startY = 0;

  function updateSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    currentIndex = index;
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.dotIndex, 10);
      updateSlide(idx);
    });
  });

  // Touch Swipe Handling for Mobile Devices
  track.addEventListener('touchstart', (e) => {
    isTouching = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // Check if horizontal swipe is dominant over vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      isTouching = false;
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isTouching = false;
  });
}

/* ==========================================================================
   2. VERIFICAÇÃO DE HORÁRIO DE ATENDIMENTO EM TEMPO REAL
   ========================================================================== */
function initLiveHours() {
  const statusEl = document.getElementById('live-hours-status');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1-5 = Seg a Sex, 6 = Sábado
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const timeVal = hour + minutes / 60;

  let isOpen = false;
  let statusText = "Fechado agora, Abre às 09:00";

  if (day >= 1 && day <= 5) {
    // Segunda a Sexta: 09h às 17h
    if (timeVal >= 9 && timeVal < 17) {
      isOpen = true;
      statusText = "Aberto agora, Atendimento até 17:00";
    } else if (timeVal < 9) {
      statusText = "Fechado agora, Abre hoje às 09:00";
    } else {
      statusText = "Fechado agora, Abre amanhã às 09:00";
    }
  } else if (day === 6) {
    // Sábado: Horário reduzido
    if (timeVal >= 9 && timeVal < 12) {
      isOpen = true;
      statusText = "Aberto agora, Atendimento em horário reduzido";
    } else if (timeVal < 9) {
      statusText = "Fechado agora, Atendimento aos sábados com horário reduzido";
    } else {
      statusText = "Fechado agora, Abre segunda às 09:00";
    }
  } else {
    // Domingo
    statusText = "Fechado aos domingos, Abre segunda às 09:00";
  }

  const dot = statusEl.querySelector('.live-dot');
  const text = statusEl.querySelector('.live-status-text');

  if (text) text.textContent = statusText;
  if (dot) {
    if (isOpen) {
      dot.classList.add('is-live');
      dot.style.background = '#22C55E';
      dot.style.boxShadow = '';
    } else {
      dot.classList.remove('is-live');
      dot.style.background = '#94A3B8';
      dot.style.boxShadow = 'none';
    }
  }
}

/* ==========================================================================
   3. MODAIS DE POLÍTICA DE PRIVACIDADE E TERMOS DE USO (LGPD)
   ========================================================================== */
function initModals() {
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');

  const btnPrivacy = document.getElementById('btn-privacy');
  const btnTerms = document.getElementById('btn-terms');

  const closePrivacy = document.getElementById('close-privacy');
  const closeTerms = document.getElementById('close-terms');
  const agreePrivacy = document.getElementById('btn-agree-privacy');
  const agreeTerms = document.getElementById('btn-agree-terms');

  if (btnPrivacy && privacyModal) {
    btnPrivacy.addEventListener('click', () => privacyModal.showModal());
  }
  if (btnTerms && termsModal) {
    btnTerms.addEventListener('click', () => termsModal.showModal());
  }

  if (closePrivacy && privacyModal) closePrivacy.addEventListener('click', () => privacyModal.close());
  if (agreePrivacy && privacyModal) agreePrivacy.addEventListener('click', () => privacyModal.close());
  if (closeTerms && termsModal) closeTerms.addEventListener('click', () => termsModal.close());
  if (agreeTerms && termsModal) agreeTerms.addEventListener('click', () => termsModal.close());

  // Fecha clicando no backdrop
  [privacyModal, termsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) modal.close();
      });
    }
  });
}

/* ==========================================================================
   4. RASTREAMENTO DE ANALYTICS & CLIQUES
   ========================================================================== */
function initAnalyticsTracking() {
  const buttons = document.querySelectorAll('.btn-card, .btn-treatment-action');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('id') || btn.getAttribute('aria-label') || btn.textContent.trim();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'blink_click', {
          event_category: 'Blink_Melhem_Odontologia',
          event_label: label
        });
      }
    });
  });
}
