/* Kabil Academy Global JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Manager (Dark / Light Mode)
  initThemeManager();

  // 2. Mobile Menu Navigation
  initMobileMenu();

  // 3. Fade-in on Scroll Animations
  initScrollAnimations();

  // 4. Testimonials Slider
  initTestimonialSlider();

  // 5. Contact & Booking Forms Handler
  initFormHandlers();

  // 6. Interactive Program Filtering (for programs.html)
  initProgramFiltering();

  // 7. Lightbox Gallery (for gallery.html)
  initLightbox();

  // 8. Custom Particles Background (for hero section)
  initParticlesBg();
});

/* Theme Manager */
function initThemeManager() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const newTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
  });
}

/* Mobile Menu Navigation */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    
    // Change menu icon between burger and close
    const icon = menuBtn.querySelector('i');
    if (icon) {
      if (navLinks.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove('active');
      const icon = menuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/* Scroll Animations */
function initScrollAnimations() {
  const faders = document.querySelectorAll('.fade-in');
  
  if (faders.length === 0) return;

  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
}

/* Testimonials Slider */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let slideInterval;

  // Clear existing dots
  dotsContainer.innerHTML = '';

  // Create indicator dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.testimonial-dot'));

  function goToSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  startAutoplay();
}

/* Form Handlers (Consultation Form, WhatsApp, Contact Form) */
function initFormHandlers() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple validation
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) return;

      // Extract form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // If it's a consultation/WhatsApp form, redirect or simulate WhatsApp
      if (form.classList.contains('whatsapp-form') || form.id === 'consultation-form') {
        sendWhatsAppMessage(data);
      } else {
        // Generic email mock submission
        showToast('Thank you! Your submission was successful. We will contact you soon.');
        form.reset();
      }
    });
  });
}

/* Send message to WhatsApp */
function sendWhatsAppMessage(data) {
  const phone = '918870850063'; // Kabil Academy Official Phone number
  let text = `Hello Kabil Academy, I would like to make an inquiry:\n\n`;
  
  if (data.name) text += `*Name:* ${data.name}\n`;
  if (data.phone) text += `*Phone:* ${data.phone}\n`;
  if (data.email) text += `*Email:* ${data.email}\n`;
  if (data.grade) text += `*Grade/Class:* ${data.grade}\n`;
  if (data.program) text += `*Program:* ${data.program}\n`;
  if (data.message) text += `*Message:* ${data.message}\n`;
  
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank');
}

/* Toast Message Notification */
function showToast(message) {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
      <div class="toast-message">${message}</div>
    `;
    document.body.appendChild(toast);
  } else {
    toast.querySelector('.toast-message').innerText = message;
  }

  // Activate toast
  setTimeout(() => {
    toast.classList.add('active');
  }, 100);

  // Deactivate toast after 4s
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

/* Programs Filtering Interface */
function initProgramFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-detail-card');
  
  if (filterBtns.length === 0 || programCards.length === 0) return;

  // Read URL query parameter for program filter (e.g., ?program=stem)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('program');

  if (filterParam) {
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (matchingBtn) {
      setActiveFilter(filterParam, matchingBtn);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      setActiveFilter(filterValue, btn);
    });
  });

  function setActiveFilter(filter, activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');

    programCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }
}

/* Lightbox Gallery */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Create lightbox modal elements
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'modal lightbox-modal';
    lightbox.innerHTML = `
      <div class="modal-content" style="max-width: 90%; padding: 1.5rem; text-align: center; background: none; border: none; box-shadow: none;">
        <button class="modal-close" style="color: white; font-size: 2.5rem; top: 1rem; right: 1rem;">&times;</button>
        <img class="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 80vh; border-radius: 10px; border: 2px solid var(--border-color); box-shadow: var(--shadow-lg);">
        <h3 class="lightbox-title" style="color: white; margin-top: 1rem; font-family: var(--font-sub-heading);"></h3>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const closeBtn = lightbox.querySelector('.modal-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h4').innerText;
      
      lightboxImg.src = img.src;
      lightboxTitle.innerText = title;
      lightbox.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

/* Interactive Canvas Background Particles */
function initParticlesBg() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set canvas size
  function setCanvasSize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = Math.random() > 0.5 ? '#D4AF37' : '#38BDF8';
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen boundaries
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles array
  const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with thin lines if close
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.save();
          let lineAlpha = (1 - (distance / 120)) * 0.08;
          ctx.strokeStyle = '#38BDF8';
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
}

/* Event Registration Modal Toggles */
function openEventModal(eventName) {
  const modal = document.querySelector('.event-modal');
  if (!modal) return;

  const eventInput = modal.querySelector('select[name="program"]');
  if (eventInput) {
    // Select the matching option
    for (let i = 0; i < eventInput.options.length; i++) {
      if (eventInput.options[i].text.toLowerCase().includes(eventName.toLowerCase())) {
        eventInput.selectedIndex = i;
        break;
      }
    }
  }

  modal.classList.add('active');
}

function closeEventModal() {
  const modal = document.querySelector('.event-modal');
  if (modal) modal.classList.remove('active');
}

// Attach event close globally
document.addEventListener('click', (e) => {
  const modal = document.querySelector('.event-modal');
  if (modal && e.target === modal) {
    modal.classList.remove('active');
  }
});
