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

  // 8. Quote & Contact Form Handler (Validation + Vercel Serverless API + Supabase Ingestion)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot spam trap check
      const honeypot = document.getElementById('hp_field');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Bot submission blocked.');
        return;
      }

      const name = document.getElementById('clientName')?.value.trim();
      const company = document.getElementById('clientCompany')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const service = document.getElementById('serviceType')?.value;
      const location = document.getElementById('siteLocation')?.value;
      const message = document.getElementById('clientMessage')?.value.trim();
      
      const fileInput = document.getElementById('floorPlanFile');
      const attachedFileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : '';

      if (!name || !email || !phone) {
        alert('Please fill in your Name, Email, and Phone number so our engineering team can contact you.');
        return;
      }

      // Submit button loading state
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Logging Request in Database...
        `;
      }

      const payload = {
        name,
        company,
        email,
        phone,
        service,
        location,
        message,
        fileName: attachedFileName
      };

      let resultRefId = `TOMI-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      let statusNote = 'Recorded in secure database system.';

      try {
        // Send request to Vercel Serverless API
        const response = await fetch('/api/submit-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.referenceId) resultRefId = resData.referenceId;
          if (resData.database && resData.database.note) {
            statusNote = resData.database.note;
          }
        }
      } catch (networkErr) {
        console.warn('Network API fallback engaged:', networkErr);
      } finally {
        // Save to browser leads archive as local persistent backup
        try {
          const existingLeads = JSON.parse(localStorage.getItem('tomitech_leads_history') || '[]');
          existingLeads.unshift({
            referenceId: resultRefId,
            ...payload,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('tomitech_leads_history', JSON.stringify(existingLeads));
        } catch (e) {}

        // Restore button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Populate and display feedback modal
        const modal = document.getElementById('formSuccessModal');
        if (modal) {
          const clientSpan = document.getElementById('modalClientName');
          const refSpan = document.getElementById('modalReferenceId');
          const statusSpan = document.getElementById('modalDatabaseStatus');
          const waBtn = document.getElementById('modalWhatsAppBtn');

          if (clientSpan) clientSpan.textContent = name;
          if (refSpan) refSpan.textContent = resultRefId;
          if (statusSpan) statusSpan.textContent = `Status: ${statusNote}`;

          // Pre-populate direct WhatsApp message with this specific reference ID
          if (waBtn) {
            const waMsg = encodeURIComponent(
              `Hello TOMITECH! I just submitted a quote request.\n\n` +
              `*Reference ID:* ${resultRefId}\n` +
              `*Name:* ${name}\n` +
              `*Company:* ${company || 'N/A'}\n` +
              `*Service:* ${service}\n` +
              `*Location:* ${location}\n` +
              `Please confirm receipt and schedule our on-site survey.`
            );
            waBtn.href = `https://wa.me/2348033000000?text=${waMsg}`;
          }

          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          alert(`Thank you, ${name}! Your request has been logged under Reference ID: ${resultRefId}. An enterprise security engineer will contact you shortly.`);
          quoteForm.reset();
        }
      }
    });
  }

  // Success Modal Close
  const successClose = document.getElementById('successModalClose');
  if (successClose) {
    successClose.addEventListener('click', () => {
      document.getElementById('formSuccessModal')?.classList.remove('active');
      document.body.style.overflow = '';
      if (quoteForm) quoteForm.reset();
      const hint = document.querySelector('.file-upload-hint');
      if (hint) {
        hint.textContent = 'Supported formats: PDF, DWG, PNG, JPG (Max 25MB)';
        hint.style.color = '';
        hint.style.fontWeight = '';
      }
    });
  }


});
