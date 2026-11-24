/**
 * ==========================================================================
 * NADA ESSAM — LUXURY PORTFOLIO JAVASCRIPT ANIMATION ENGINE
 * Professional, High-Performance GPU-Accelerated Animation Suite
 * Fully Mobile-Optimized + Presentations & Certificate Gallery Lightbox
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Device & Motion detection
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  const isMobile = window.innerWidth < 768 || isTouchDevice;

  /* ==========================================================================
     1. LUXURY BACKGROUND AMBIENT CANVAS (Golden Dust Particles)
     ========================================================================== */
  const initCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false
    };

    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.isHovered = true;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        mouse.isHovered = false;
      });
    }

    const PARTICLE_COUNT = isMobile ? 18 : Math.min(Math.floor(window.innerWidth / 24), 50);
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 1.8 + 0.8;
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.alpha = this.baseAlpha;
        this.vy = -(Math.random() * 0.35 + 0.12);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;

        this.pulseAngle += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.12;

        if (!isTouchDevice && mouse.isHovered) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 0.7;
            this.y -= (dy / dist) * force * 0.7;
          }
        }

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 122, ${Math.max(0, this.alpha)})`;
        if (!isMobile) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let isRunning = true;
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });

    const render = () => {
      if (isRunning && !prefersReducedMotion) {
        if (!isTouchDevice) {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }

        ctx.clearRect(0, 0, width, height);

        if (!isMobile) {
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 100) {
                const lineAlpha = (1 - dist / 100) * 0.1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
        }

        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(render);
    };

    render();
  };

  /* ==========================================================================
     2. LUXURY CUSTOM CURSOR (Desktop Only)
     ========================================================================== */
  const initCustomCursor = () => {
    if (isTouchDevice || window.innerWidth < 900) return;

    const dot = document.querySelector('.custom-cursor-dot');
    const outline = document.querySelector('.custom-cursor-outline');
    if (!dot || !outline) return;

    let mouseX = -100, mouseY = -100;
    let outlineX = -100, outlineY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        dot.style.opacity = '1';
        outline.style.opacity = '1';
        isVisible = true;
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      outline.style.opacity = '0';
      isVisible = false;
    });

    const renderCursor = () => {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;

      outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const interactiveElements = document.querySelectorAll('a, button, .btn, .glass, .chip, .chips span, .cert-card, .presentation-card, .photo, .badge, .logo, .cert-filter-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => outline.classList.add('hover'));
      el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
  };

  /* ==========================================================================
     3. SCROLL PROGRESS BAR & MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const initNavbar = () => {
    const nav = document.querySelector('nav');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const navLinks = document.querySelectorAll('nav ul a[href^="#"]');
    const sections = document.querySelectorAll('section, header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('nav ul');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (nav) {
        if (scrollTop > 30) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }

      let currentSection = '';
      sections.forEach((sec) => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    if (mobileToggle && navMenu) {
      const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
        mobileToggle.classList.toggle('active', isOpen);
        navMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      };

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggleMenu(false);
        });
      });

      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          toggleMenu(false);
        }
      });
    }
  };

  /* ==========================================================================
     4. SCROLL REVEAL ENGINE (IntersectionObserver)
     ========================================================================== */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('title-wrap')) {
            entry.target.classList.add('in-view');
          }
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: isMobile ? 0.08 : 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  };

  /* ==========================================================================
     5. 3D TILT & DYNAMIC SPOTLIGHT (Desktop Only)
     ========================================================================== */
  const init3DTiltAndSpotlight = () => {
    if (isTouchDevice || window.innerWidth < 900) return;

    const glassCards = document.querySelectorAll('.glass');
    const photo = document.querySelector('.photo');

    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });

    if (photo) {
      photo.addEventListener('mousemove', (e) => {
        const rect = photo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        photo.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  };

  /* ==========================================================================
     6. ANIMATED NUMBER COUNTERS (Stats & GPA)
     ========================================================================== */
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = target * ease;

        if (isDecimal) {
          el.textContent = current.toFixed(2) + (el.getAttribute('data-suffix') || '');
        } else {
          el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + (el.getAttribute('data-suffix') || '');
        }
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  };

  /* ==========================================================================
     7. EXPERIENCE TIMELINE PROGRESS LINE
     ========================================================================== */
  const initTimelineProgress = () => {
    const tlContainer = document.querySelector('.tl-container');
    const progressBar = document.querySelector('.tl-progress-bar');
    if (!tlContainer || !progressBar) return;

    const updateTimeline = () => {
      const rect = tlContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.7;
      const totalHeight = rect.height;
      const currentScroll = start - rect.top;

      let progress = (currentScroll / totalHeight) * 100;
      progress = Math.max(0, Math.min(100, progress));

      progressBar.style.height = `${progress}%`;
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  };

  /* ==========================================================================
     8. VOICE OVER SHOWCASE & SYNTHETIC WAVEFORM ENGINE
     ========================================================================== */
  const initVoiceVisualizer = () => {
    const playBtn = document.querySelector('.vo-play-btn');
    const playerContainer = document.querySelector('.vo-player');
    const timeDisplay = document.querySelector('.vo-time');
    const waveform = document.querySelector('.vo-waveform');
    const trackBtns = document.querySelectorAll('.vo-track-btn');

    if (!waveform) return;

    const BAR_COUNT = window.innerWidth < 500 ? 18 : (window.innerWidth < 768 ? 24 : 32);
    waveform.innerHTML = '';
    const bars = [];

    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      const initH = Math.sin((i / BAR_COUNT) * Math.PI) * 14 + Math.random() * 5 + 4;
      bar.style.height = `${initH}px`;
      waveform.appendChild(bar);
      bars.push(bar);
    }

    let isPlaying = false;
    let audioCtx = null;
    let oscillator = null;
    let gainNode = null;
    let playTimer = null;
    let seconds = 0;

    trackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        trackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (isPlaying) {
          seconds = 0;
          timeDisplay.textContent = '0:00';
        }
      });
    });

    const updateWaveformAnimation = () => {
      if (!isPlaying) return;
      bars.forEach((bar, idx) => {
        const t = performance.now() * 0.005;
        const wave = Math.sin(t + idx * 0.35) * Math.cos(t * 0.5 + idx * 0.2);
        const height = Math.abs(wave) * 26 + 6;
        bar.style.height = `${height}px`;
      });
      requestAnimationFrame(updateWaveformAnimation);
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;

        if (isPlaying) {
          playerContainer.classList.add('playing');
          playBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
            </svg>`;

          try {
            if (!audioCtx) {
              const AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (AudioContextClass) audioCtx = new AudioContextClass();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
            if (audioCtx) {
              oscillator = audioCtx.createOscillator();
              gainNode = audioCtx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(369.99, audioCtx.currentTime);

              gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 0.4);

              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.start();
            }
          } catch (e) {
            // Audio policy fallback
          }

          playTimer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (seconds >= 18) {
              playBtn.click();
            }
          }, 1000);

          updateWaveformAnimation();
        } else {
          playerContainer.classList.remove('playing');
          playBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>`;

          if (gainNode && audioCtx) {
            try {
              gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
              setTimeout(() => {
                if (oscillator) {
                  oscillator.stop();
                  oscillator.disconnect();
                }
              }, 300);
            } catch (e) {}
          }

          clearInterval(playTimer);

          bars.forEach((bar, i) => {
            const h = Math.sin((i / BAR_COUNT) * Math.PI) * 14 + Math.random() * 5 + 4;
            bar.style.height = `${h}px`;
          });
        }
      });
    }
  };

  /* ==========================================================================
     9. FEATURED PRESENTATIONS VIEWER SWITCHER (CANVA SHOWCASE)
     ========================================================================== */
  const initPresentationViewer = () => {
    const cards = document.querySelectorAll('.presentation-card');
    const iframe = document.getElementById('canva-presentation-frame');
    const titleEl = document.getElementById('active-pres-title');
    const linkEl = document.getElementById('active-pres-link');
    const viewer = document.querySelector('.presentation-viewer');

    if (!cards.length || !iframe) return;

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking the direct Canva link, allow default navigation
        if (e.target.closest('.pcard-canva-link')) return;

        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const title = card.getAttribute('data-title');
        const embedUrl = card.getAttribute('data-embed');
        const canvaLink = card.getAttribute('data-link');

        if (titleEl) titleEl.textContent = title;
        if (linkEl) linkEl.href = canvaLink;

        // Smooth visual transition for iframe
        iframe.style.opacity = '0.35';
        iframe.style.transition = 'opacity 0.25s ease';

        setTimeout(() => {
          iframe.src = embedUrl;
          iframe.onload = () => {
            iframe.style.opacity = '1';
          };
          setTimeout(() => { iframe.style.opacity = '1'; }, 450);
        }, 120);

        // On mobile, scroll viewer into view if needed
        if (window.innerWidth < 820 && viewer) {
          const rect = viewer.getBoundingClientRect();
          if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
            viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  };

  /* ==========================================================================
     10. CERTIFICATE GALLERY & INTERACTIVE LIGHTBOX MODAL
     ========================================================================== */
  const initCertificateGallery = () => {
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const lightbox = document.getElementById('cert-lightbox');
    if (!certCards.length || !lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxIssuer = lightbox.querySelector('.lightbox-issuer');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-nav.prev');
    const lightboxNext = lightbox.querySelector('.lightbox-nav.next');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

    const certificates = [];
    certCards.forEach((card, index) => {
      const img = card.querySelector('.cert-img');
      const title = card.querySelector('.cert-title');
      const issuer = card.querySelector('.cert-issuer');
      const category = card.getAttribute('data-category') || 'all';

      certificates.push({
        element: card,
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        title: title ? title.textContent : '',
        issuer: issuer ? issuer.textContent : '',
        category: category,
        index: index
      });
    });

    let visibleCerts = [...certificates];
    let currentIndex = 0;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        visibleCerts = [];
        certCards.forEach((card, idx) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('hidden');
            visibleCerts.push(certificates[idx]);
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    const openLightbox = (cardIndex) => {
      const foundIdx = visibleCerts.findIndex(c => c.index === cardIndex);
      currentIndex = foundIdx !== -1 ? foundIdx : 0;
      updateLightboxContent();

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const updateLightboxContent = () => {
      if (!visibleCerts.length) return;
      const cert = visibleCerts[currentIndex];

      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        lightboxImg.src = cert.src;
        lightboxImg.alt = cert.alt;
        lightboxTitle.textContent = cert.title;
        lightboxIssuer.textContent = cert.issuer;
        lightboxCounter.textContent = `${currentIndex + 1} of ${visibleCerts.length}`;

        lightboxImg.onload = () => {
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'scale(1)';
        };
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 120);
    };

    const nextCert = () => {
      currentIndex = (currentIndex + 1) % visibleCerts.length;
      updateLightboxContent();
    };

    const prevCert = () => {
      currentIndex = (currentIndex - 1 + visibleCerts.length) % visibleCerts.length;
      updateLightboxContent();
    };

    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextCert);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevCert);

    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextCert();
      if (e.key === 'ArrowLeft') prevCert();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          nextCert();
        } else {
          prevCert();
        }
      }
    };
  };

  /* ==========================================================================
     11. MAGNETIC BUTTONS (Desktop Only)
     ========================================================================== */
  const initMagneticButtons = () => {
    if (isTouchDevice || window.innerWidth < 900) return;

    const magneticBtns = document.querySelectorAll('.btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  };

  /* ==========================================================================
     12. BACK TO TOP BUTTON
     ========================================================================== */
  const initBackToTop = () => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  /* ==========================================================================
     13. MEDIA & VIDEO REELS SHOWCASE (CINEMA THEATER)
     ========================================================================== */
  const initMediaReels = () => {
    const theater = document.querySelector('.cinema-theater');
    const screenWrap = document.getElementById('cinemaScreenWrap');
    const video = document.getElementById('mainCinemaVideo');
    if (!theater || !screenWrap || !video) return;

    const bigPlayBtn = document.getElementById('cinemaBigPlayBtn');
    const playPauseBtn = document.getElementById('cinemaPlayPauseBtn');
    const playIcon = playPauseBtn ? playPauseBtn.querySelector('.play-icon') : null;
    const pauseIcon = playPauseBtn ? playPauseBtn.querySelector('.pause-icon') : null;
    const muteBtn = document.getElementById('cinemaMuteBtn');
    const volHighIcon = muteBtn ? muteBtn.querySelector('.vol-high-icon') : null;
    const volMuteIcon = muteBtn ? muteBtn.querySelector('.vol-mute-icon') : null;
    const currentTimeEl = document.getElementById('cinemaCurrentTime');
    const totalTimeEl = document.getElementById('cinemaTotalTime');
    const progressBar = document.getElementById('cinemaProgressBar');
    const progressFilled = document.getElementById('cinemaProgressFilled');
    const progressHandle = document.getElementById('cinemaProgressHandle');
    const statusTag = document.getElementById('cinemaStatusTag');
    const fullscreenBtn = document.getElementById('cinemaFullscreenBtn');
    const overlayCategory = document.getElementById('cinemaOverlayCategory');
    const trackIndicator = document.getElementById('cinemaTrackIndicator');
    const cinemaTitle = document.getElementById('cinemaTitle');
    const cinemaDesc = document.getElementById('cinemaDesc');
    const cinemaFbDirectLink = document.getElementById('cinemaFbDirectLink');
    const btnPlayYlyCinema = document.getElementById('btnPlayYlyCinema');
    const mediaCards = document.querySelectorAll('.media-card');
    const localFileInput = document.getElementById('cinemaLocalFileInput');

    const formatTime = (seconds) => {
      if (isNaN(seconds) || seconds < 0) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updatePlayState = (isPlaying) => {
      if (isPlaying) {
        screenWrap.classList.add('is-playing');
        theater.classList.add('is-playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (statusTag) statusTag.textContent = 'Playing';
      } else {
        screenWrap.classList.remove('is-playing');
        theater.classList.remove('is-playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (statusTag) statusTag.textContent = 'Paused';
      }
    };

    const togglePlay = () => {
      if (video.paused || video.ended) {
        video.play().then(() => {
          updatePlayState(true);
        }).catch(() => {
          screenWrap.classList.add('has-error');
        });
      } else {
        video.pause();
        updatePlayState(false);
      }
    };

    if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    video.addEventListener('play', () => updatePlayState(true));
    video.addEventListener('pause', () => updatePlayState(false));
    video.addEventListener('ended', () => {
      updatePlayState(false);
      if (progressFilled) progressFilled.style.width = '100%';
    });

    video.addEventListener('loadedmetadata', () => {
      screenWrap.classList.remove('has-error');
      if (totalTimeEl) totalTimeEl.textContent = formatTime(video.duration);
    });

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (progressFilled) progressFilled.style.width = `${pct}%`;
      if (progressHandle) progressHandle.style.left = `${pct}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
      if (totalTimeEl && totalTimeEl.textContent === '00:00') {
        totalTimeEl.textContent = formatTime(video.duration);
      }
    });

    if (progressBar) {
      let isSeeking = false;
      const seek = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (video.duration) {
          video.currentTime = pos * video.duration;
        }
        if (progressFilled) progressFilled.style.width = `${pos * 100}%`;
        if (progressHandle) progressHandle.style.left = `${pos * 100}%`;
      };

      progressBar.addEventListener('mousedown', (e) => {
        isSeeking = true;
        seek(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isSeeking) seek(e);
      });

      window.addEventListener('mouseup', () => {
        isSeeking = false;
      });

      progressBar.addEventListener('touchstart', (e) => {
        if (e.touches.length) {
          const rect = progressBar.getBoundingClientRect();
          const pos = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
          if (video.duration) video.currentTime = pos * video.duration;
        }
      }, { passive: true });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
          if (volHighIcon) volHighIcon.style.display = 'none';
          if (volMuteIcon) volMuteIcon.style.display = 'block';
        } else {
          if (volHighIcon) volHighIcon.style.display = 'block';
          if (volMuteIcon) volMuteIcon.style.display = 'none';
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (screenWrap.requestFullscreen) {
            screenWrap.requestFullscreen();
          } else if (screenWrap.webkitRequestFullscreen) {
            screenWrap.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    let hideTimer = null;
    const resetHideTimer = () => {
      screenWrap.classList.remove('controls-hidden');
      clearTimeout(hideTimer);
      if (!video.paused && !video.ended) {
        hideTimer = setTimeout(() => {
          screenWrap.classList.add('controls-hidden');
        }, 3000);
      }
    };

    screenWrap.addEventListener('mousemove', resetHideTimer);
    screenWrap.addEventListener('touchstart', resetHideTimer, { passive: true });
    video.addEventListener('play', resetHideTimer);

    // Category Filter Handler
    const mediaFilterBtns = document.querySelectorAll('.media-filter-btn');
    mediaFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mediaFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        mediaCards.forEach(card => {
          const cat = card.getAttribute('data-filter-cat');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    // Facebook Spotlight Play in Cinema Button
    if (btnPlayYlyCinema) {
      btnPlayYlyCinema.addEventListener('click', () => {
        const firstCard = mediaCards[0];
        if (firstCard) {
          firstCard.click();
        }
        theater.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    mediaCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        mediaCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const src = card.getAttribute('data-src');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const category = card.getAttribute('data-category');
        const fbUrl = card.getAttribute('data-fb-url');

        if (trackIndicator) {
          trackIndicator.textContent = `Reel ${(idx + 1).toString().padStart(2, '0')} of ${mediaCards.length.toString().padStart(2, '0')}`;
        }
        if (overlayCategory) overlayCategory.textContent = category;
        if (cinemaTitle) cinemaTitle.textContent = title;
        if (cinemaDesc) cinemaDesc.textContent = desc;

        if (cinemaFbDirectLink) {
          if (fbUrl) {
            cinemaFbDirectLink.href = fbUrl;
            cinemaFbDirectLink.style.display = 'inline-flex';
          } else {
            cinemaFbDirectLink.style.display = 'none';
          }
        }

        video.style.transition = 'opacity 0.25s ease';
        video.style.opacity = '0';

        setTimeout(() => {
          video.src = src;
          video.load();
          video.play().then(() => {
            screenWrap.classList.remove('has-error');
            updatePlayState(true);
          }).catch(() => {
            updatePlayState(false);
          });
          video.style.opacity = '1';
        }, 200);

        // Smooth scroll towards the theater on smaller screens
        if (window.innerWidth < 992) {
          theater.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    video.addEventListener('error', () => {
      screenWrap.classList.add('has-error');
      updatePlayState(false);
    });

    if (localFileInput) {
      localFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;
        screenWrap.classList.remove('has-error');
        if (cinemaTitle) cinemaTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
        if (cinemaDesc) cinemaDesc.textContent = `Local preview file (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
        video.load();
        video.play().then(() => {
          updatePlayState(true);
        }).catch(() => {});
      });
    }
  };

  /* ==========================================================================
     12. CURRICULUM VITAE (CV) VIEWER & INTERACTIVE MODAL
     ========================================================================== */
  const initCvViewer = () => {
    const cvModal = document.getElementById('cv-modal');
    if (!cvModal) return;

    const modalImg = document.getElementById('cvModalImg');
    const modalBadge = document.getElementById('cvModalBadge');
    const modalClose = cvModal.querySelector('.cv-modal-close');
    const modalBackdrop = cvModal.querySelector('.cv-modal-backdrop');
    const prevBtn = document.getElementById('cvPrevBtn');
    const nextBtn = document.getElementById('cvNextBtn');
    const switchBtns = cvModal.querySelectorAll('.cv-switch-btn');
    const printBtn = document.getElementById('btnCvPrint');

    const cvPages = [
      'cv/nada_essam_cv_page_1.png',
      'cv/nada_essam_cv_page_2.png'
    ];

    let currentPage = 1;

    const showCvPage = (pageNum) => {
      if (pageNum < 1) pageNum = 1;
      if (pageNum > cvPages.length) pageNum = cvPages.length;
      currentPage = pageNum;

      if (modalImg) {
        modalImg.style.transition = 'opacity 0.15s ease';
        modalImg.style.opacity = '0';
        setTimeout(() => {
          modalImg.src = cvPages[currentPage - 1];
          modalImg.style.opacity = '1';
        }, 150);
      }

      if (modalBadge) {
        modalBadge.textContent = `Page ${currentPage} of ${cvPages.length}`;
      }

      switchBtns.forEach(btn => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        btn.classList.toggle('active', p === currentPage);
      });

      if (prevBtn) prevBtn.style.opacity = currentPage === 1 ? '0.4' : '1';
      if (nextBtn) nextBtn.style.opacity = currentPage === cvPages.length ? '0.4' : '1';
    };

    const openCvModal = (initialPage = 1) => {
      showCvPage(initialPage);
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeCvModal = () => {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Click triggers on CV cards and zoom buttons
    document.querySelectorAll('.cv-page-preview-box, .cv-page-zoom-btn').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const pageNum = parseInt(trigger.getAttribute('data-page'), 10) || 1;
        openCvModal(pageNum);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeCvModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCvModal);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentPage > 1) showCvPage(currentPage - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentPage < cvPages.length) showCvPage(currentPage + 1);
      });
    }

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pageNum = parseInt(btn.getAttribute('data-page'), 10);
        showCvPage(pageNum);
      });
    });

    // Keyboard support (Escape, Arrow Left, Arrow Right)
    window.addEventListener('keydown', (e) => {
      if (!cvModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeCvModal();
      if (e.key === 'ArrowLeft' && currentPage > 1) showCvPage(currentPage - 1);
      if (e.key === 'ArrowRight' && currentPage < cvPages.length) showCvPage(currentPage + 1);
    });

    // Print button handler
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const printWindow = window.open('cv/Nada_Essam_CV.pdf', '_blank');
        if (printWindow) {
          printWindow.focus();
        }
      });
    }

    // Interactive Recruiter Breakdown Tabs
    const tabBtns = document.querySelectorAll('.cv-tab-btn');
    const tabPanels = document.querySelectorAll('.cv-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabPanels.forEach(panel => {
          if (panel.id === `tab-${targetTab}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  };

  /* ==========================================================================
     INITIALIZE ALL MODULES
     ========================================================================== */
  initCanvas();
  initCustomCursor();
  initNavbar();
  initScrollReveal();
  init3DTiltAndSpotlight();
  initCounters();
  initTimelineProgress();
  initVoiceVisualizer();
  initPresentationViewer();
  initCertificateGallery();
  initMediaReels();
  initCvViewer();
  initMagneticButtons();
  initBackToTop();
});
