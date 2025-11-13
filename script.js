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

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Scroll Animations
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Enhanced Skill Bars Animation with Counting
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            const skillInfo = entry.target.closest('.skill-item').querySelector('.skill-info span:last-child');
            
            // Animate counting
            let current = 0;
            const target = parseInt(width);
            const increment = target / 50; // Adjust speed
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                skillInfo.textContent = Math.round(current) + '%';
            }, 30);
            
            // Animate width
            entry.target.style.width = width + '%';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Portfolio Scroll
const portfolioScroll = document.getElementById('portfolioScroll');
if (portfolioScroll) {
    portfolioScroll.addEventListener('wheel', (e) => {
        e.preventDefault();
        portfolioScroll.scrollLeft += e.deltaY;
    });
}

// Enhanced Contact Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Create feedback elements
    const formFeedback = document.createElement('div');
    formFeedback.className = 'form-feedback';
    contactForm.insertBefore(formFeedback, contactForm.firstChild);
    
    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function showSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateForm() {
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            showSuccess(nameInput);
        }
        
        // Email validation
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }
        
        // Message validation
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            showSuccess(messageInput);
        }
        
        return isValid;
    }
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        contactForm.classList.add('loading');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! I will get back to you soon.';
            
            // Reset form
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('success', 'error');
            });
            
        } catch (error) {
            formFeedback.className = 'form-feedback error';
            formFeedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Sorry, there was an error sending your message. Please try again.';
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.classList.remove('loading');
            
            // Hide feedback after 5 seconds
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        }
    });
    
    // Real-time validation
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('blur', validateForm);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateForm();
            }
        });
    });
}

// Mobile Menu Toggle
// Mobile Menu Toggle - Left Side
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const mobileClose = document.querySelector('.mobile-close');
const navOverlay = document.querySelector('.nav-overlay');

if (mobileMenu && navLinks && mobileClose && navOverlay) {
    // Open menu
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close menu with close button
    mobileClose.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close menu with overlay click
    navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Remove loading screen
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingElement = document.querySelector('.page-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }, 500);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


document.querySelector('#contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.querySelector('#name').value,
    email: document.querySelector('#email').value,
    phone: document.querySelector('#phone').value,
    company: document.querySelector('#company').value,
    subject: document.querySelector('#subject').value,
    message: document.querySelector('#message').value
  };

  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      showNotification("Your message has been received. I will get back to you soon.");
      document.querySelector('#contactForm').reset();
    } else {
      showNotification(result.error || "Something went wrong. Please try again.", true);
    }

  } catch (err) {
    showNotification("Network error. Please try again later.", true);
  }
});

function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;

  // Set background color based on type
  notification.style.background = isError
    ? 'linear-gradient(135deg, #ff4d4d, #ff7a00)' // error (red-orange)
    : 'linear-gradient(135deg, #00a86b, #ff7a00)'; // success (green-orange)

  // Show animation
  notification.classList.remove('hide');
  notification.classList.add('show');

  // Hide after 3 seconds with fade-out animation
  setTimeout(() => {
    notification.classList.remove('show');
    notification.classList.add('hide');
  }, 3000);
}
