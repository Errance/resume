/* ========================================
   Language Toggle
   ======================================== */
(function () {
  const html = document.documentElement;
  const langBtns = document.querySelectorAll('[data-lang-btn]');
  const langToggle = document.querySelector('.lang-toggle');

  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    langBtns.forEach(function (btn) {
      if (btn.getAttribute('data-lang-btn') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    try {
      localStorage.setItem('site-lang', lang);
    } catch (e) {
      // ignore
    }
  }

  // Restore saved language
  try {
    var saved = localStorage.getItem('site-lang');
    if (saved === 'zh' || saved === 'en') {
      setLang(saved);
    }
  } catch (e) {
    // ignore
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-lang') || 'en';
      setLang(current === 'en' ? 'zh' : 'en');
    });
  }
})();

/* ========================================
   Navigation: Active section highlight
   ======================================== */
(function () {
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Smooth scroll on nav click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('data-section');
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ========================================
   Scroll Fade-in Animation
   ======================================== */
(function () {
  var items = document.querySelectorAll(
    '.exp-item, .project-card, .strength-card, .skills-group, .edu-item'
  );

  if (!items.length) return;

  items.forEach(function (item) {
    item.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();

/* ========================================
   Mouse Glow Effect (desktop only)
   ======================================== */
(function () {
  var glow = document.querySelector('.mouse-glow');
  if (!glow) return;

  // Only enable on non-touch, wider screens
  var mq = window.matchMedia('(min-width: 769px) and (hover: hover)');

  function handleMouseMove(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if (!glow.classList.contains('visible')) {
      glow.classList.add('visible');
    }
  }

  function handleMouseLeave() {
    glow.classList.remove('visible');
  }

  function toggle() {
    if (mq.matches) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      glow.classList.remove('visible');
    }
  }

  mq.addEventListener('change', toggle);
  toggle();
})();
