/* ========================================
   Language Toggle
   ======================================== */
(function () {
  var html = document.documentElement;
  var langBtns = document.querySelectorAll('[data-lang-btn]');
  var langToggle = document.querySelector('.lang-toggle');

  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    langBtns.forEach(function (btn) {
      if (btn.getAttribute('data-lang-btn') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    startTypewriter();
    try {
      localStorage.setItem('site-lang', lang);
    } catch (e) {}
  }

  try {
    var saved = localStorage.getItem('site-lang');
    if (saved === 'zh' || saved === 'en') {
      setLang(saved);
    }
  } catch (e) {}

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-lang') || 'en';
      setLang(current === 'en' ? 'zh' : 'en');
    });
  }
})();

/* ========================================
   Typewriter Effect for Tagline
   ======================================== */
var typewriterTimer = null;

function startTypewriter() {
  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }

  var lang = document.documentElement.getAttribute('data-lang') || 'en';
  var spans = document.querySelectorAll('.tagline .typewriter');

  spans.forEach(function (span) {
    var isVisible =
      (lang === 'en' && span.classList.contains('en')) ||
      (lang === 'zh' && span.classList.contains('zh'));

    if (isVisible) {
      var fullText = span.getAttribute('data-text') || '';
      span.textContent = '';
      var i = 0;

      function typeChar() {
        if (i < fullText.length) {
          span.textContent = fullText.substring(0, i + 1);
          i++;
          typewriterTimer = setTimeout(typeChar, 35);
        }
      }

      typeChar();
    } else {
      var text = span.getAttribute('data-text') || '';
      span.textContent = text;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTypewriter);
} else {
  startTypewriter();
}

/* ========================================
   Navigation: Active section highlight
   (uses .right-panel as scroll root)
   ======================================== */
(function () {
  var scrollContainer = document.querySelector('.right-panel');
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!scrollContainer || !sections.length || !navLinks.length) return;

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
      root: scrollContainer,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Nav click: scroll within the right panel
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
  var scrollContainer = document.querySelector('.right-panel');
  var items = document.querySelectorAll(
    '.exp-item, .project-card, .strength-card, .skills-group, .edu-item'
  );

  if (!items.length) return;

  items.forEach(function (item, index) {
    item.classList.add('fade-in');
    item.style.transitionDelay = (index % 6) * 0.06 + 's';
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
      root: scrollContainer,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();

/* ========================================
   Tag Cascade Animation
   ======================================== */
(function () {
  var scrollContainer = document.querySelector('.right-panel');
  var tagContainers = document.querySelectorAll(
    '.exp-tags, .project-tags, .skills-tags'
  );

  if (!tagContainers.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var tags = entry.target.querySelectorAll('.tag');
          tags.forEach(function (tag, i) {
            tag.classList.add('animate');
            tag.style.animationDelay = i * 0.05 + 's';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: scrollContainer,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.2,
    }
  );

  tagContainers.forEach(function (container) {
    container.querySelectorAll('.tag').forEach(function (tag) {
      tag.style.opacity = '0';
    });
    observer.observe(container);
  });
})();

/* ========================================
   Strength Card 3D Tilt Effect
   ======================================== */
(function () {
  var cards = document.querySelectorAll('.strength-card');

  if (!cards.length) return;

  var mq = window.matchMedia('(min-width: 769px) and (hover: hover)');
  if (!mq.matches) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -3;
      var rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform =
        'perspective(600px) rotateX(' +
        rotateX +
        'deg) rotateY(' +
        rotateY +
        'deg) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();

/* ========================================
   Collapse / Expand for Experience & Projects
   ======================================== */
(function () {
  var collapsibles = document.querySelectorAll('[data-collapsible]');

  collapsibles.forEach(function (item) {
    var title = item.querySelector('.exp-title, .project-title');
    if (!title) return;

    title.addEventListener('click', function () {
      if (window.getSelection().toString()) return;

      if (item.hasAttribute('data-expanded')) {
        item.removeAttribute('data-expanded');
      } else {
        item.setAttribute('data-expanded', '');
      }
    });
  });
})();

/* ========================================
   Mouse Glow Effect (desktop only)
   ======================================== */
(function () {
  var glow = document.querySelector('.mouse-glow');
  if (!glow) return;

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
