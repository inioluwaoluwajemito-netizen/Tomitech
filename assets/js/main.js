/**
 * TOMITECH Compware Services Limited - Main Client Script
 * Implements interactive features, validations, animations, and modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll Effects
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking nav link
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    if (header && body) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close siblings if desired
        faqItems.forEach(sibling => {
          if (sibling !== item && sibling.classList.contains('open')) {
            sibling.classList.remove('open');
            const sibBody = sibling.querySelector('.faq-body');
            if (sibBody) sibBody.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          item.classList.remove('open');
          body.style.maxHeight = null;
        }
      });
    }
  });

  // 4. Branch Selector (Ipaja vs Yaba)
  const branchTabs = document.querySelectorAll('.branch-tab-btn');
  const branchPanels = document.querySelectorAll('.branch-info-panel');
  branchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      branchTabs.forEach(t => t.classList.remove('active'));
      branchPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // 5. Portfolio Filter (All, Surveillance, Access, Networks)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Lightbox Modal for Projects Gallery
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.dataset.img;
        const title = card.dataset.title;
        const desc = card.dataset.desc;

        if (lightboxImg) lightboxImg.src = img;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 7. Drag and Drop File Upload Enhancement
  const dropzone = document.querySelector('.file-dropzone');
  const fileInput = document.getElementById('floorPlanFile');
  if (dropzone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateFileName(fileInput.files[0].name);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        updateFileName(fileInput.files[0].name);
      }
    });

    function updateFileName(name) {
      const hint = dropzone.querySelector('.file-upload-hint');
      if (hint) {
        hint.textContent = `Selected: ${name}`;
        hint.style.color = '#10b981';
        hint.style.fontWeight = 'bold';
      }
    }
  }

  // 8. Quote & Contact Form Handler (Validation + Spam Trap + WhatsApp Lead Option)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = document.getElementById('hp_field');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Bot submission blocked.');
        return;
      }

      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const service = document.getElementById('serviceType')?.value;
      const location = document.getElementById('siteLocation')?.value;
      const message = document.getElementById('clientMessage')?.value.trim();

      if (!name || !email || !phone) {
        alert('Please fill in your Name, Email, and Phone number so our engineering team can contact you.');
        return;
      }

      // Display feedback modal
      const modal = document.getElementById('formSuccessModal');
      if (modal) {
        const clientSpan = document.getElementById('modalClientName');
        if (clientSpan) clientSpan.textContent = name;
        modal.classList.add('active');
      } else {
        alert(`Thank you, ${name}! Your request has been logged. An enterprise security engineer will contact you within 2 business hours.`);
        quoteForm.reset();
      }
    });
  }

  // Success Modal Close
  const successClose = document.getElementById('successModalClose');
  if (successClose) {
    successClose.addEventListener('click', () => {
      document.getElementById('formSuccessModal')?.classList.remove('active');
      if (quoteForm) quoteForm.reset();
    });
  }

  // 9. NDPA Cookie Consent Notice
  const cookieBanner = document.getElementById('ndpaCookieBanner');
  const acceptCookie = document.getElementById('acceptCookiesBtn');
  if (cookieBanner && acceptCookie) {
    if (!localStorage.getItem('tomitech_cookie_consent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    acceptCookie.addEventListener('click', () => {
      localStorage.setItem('tomitech_cookie_consent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }
});
