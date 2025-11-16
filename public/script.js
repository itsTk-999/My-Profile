// script.js (full updated)
// --- theme, animations, etc (kept your code intact) ---

// Enhanced Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

if (themeToggle && themeIcon) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Scroll Animations
const sections = document.querySelectorAll('section');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, observerOptions);
sections.forEach(section => observer.observe(section));

// Back to Top Button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
}

// Skills animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      const skillInfo = entry.target.closest('.skill-item')?.querySelector('.skill-info span:last-child');
      let current = 0;
      const target = parseInt(width || '0', 10);
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        if (skillInfo) skillInfo.textContent = Math.round(current) + '%';
      }, 30);
      entry.target.style.width = width + '%';
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(bar => skillObserver.observe(bar));

// Portfolio scroll
const portfolioScroll = document.getElementById('portfolioScroll');
if (portfolioScroll) {
  portfolioScroll.addEventListener('wheel', (e) => {
    e.preventDefault();
    portfolioScroll.scrollLeft += e.deltaY;
  });
}

// --- Contact form validation + submit ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const companyInput = document.getElementById('company');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  // Helper functions
  function showError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    let hint = input.parentNode.querySelector('.error-message');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'error-message';
      input.parentNode.appendChild(hint);
    }
    hint.textContent = message;
    hint.classList.add('show');
  }

  function showSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    const errEl = input.parentNode.querySelector('.error-message');
    if (errEl) errEl.classList.remove('show');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateForm() {
    let isValid = true;
    if (!nameInput.value.trim()) { showError(nameInput, 'Name is required'); isValid = false; } else showSuccess(nameInput);
    if (!emailInput.value.trim()) { showError(emailInput, 'Email is required'); isValid = false; }
    else if (!validateEmail(emailInput.value.trim())) { showError(emailInput, 'Please enter a valid email'); isValid = false; }
    else showSuccess(emailInput);
    if (!subjectInput.value.trim()) { showError(subjectInput, 'Subject is required'); isValid = false; } else showSuccess(subjectInput);
    if (!messageInput.value.trim()) { showError(messageInput, 'Message is required'); isValid = false; }
    else if (messageInput.value.trim().length < 10) { showError(messageInput, 'Message must be at least 10 characters'); isValid = false; }
    else showSuccess(messageInput);
    return isValid;
  }

  // Form submit
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    contactForm.classList.add('loading');

    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      company: companyInput.value,
      subject: subjectInput.value,
      message: messageInput.value
    };

    try {
     const functionUrl = '/.netlify/functions/send-email';

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Your message has been received. I will get back to you soon.");
        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput, phoneInput, companyInput].forEach(input => input.classList.remove('error','success'));
      } else {
        showNotification(result.error || "Something went wrong. Please try again.", true);
      }

    } catch (err) {
      showNotification("Network error. Please try again later.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.classList.remove('loading');
    }
  });

  // Real-time validation
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('blur', validateForm);
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) validateForm();
    });
  });

} // end if contactForm

// Show notification helper
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  if (!notification) {
    alert(message);
    return;
  }
  notification.textContent = message;
  notification.style.background = isError
    ? 'linear-gradient(135deg, #ff4d4d, #ff7a00)'
    : 'linear-gradient(135deg, #00a86b, #ff7a00)';
  notification.classList.remove('hide');
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
    notification.classList.add('hide');
  }, 3000);
}

// Mobile menu & scroll, load screen, anchor links (kept unchanged)
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const mobileClose = document.querySelector('.mobile-close');
const navOverlay = document.querySelector('.nav-overlay');

if (mobileMenu && navLinks && mobileClose && navOverlay) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  mobileClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Load screen removal
window.addEventListener('load', function() {
  setTimeout(function() {
    const loadingElement = document.querySelector('.page-loading');
    if (loadingElement) loadingElement.style.display = 'none';
  }, 500);
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
