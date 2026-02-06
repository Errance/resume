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
   Page Navigation Controller
   (JS-based page transitions with custom animation)
   ======================================== */
(function () {
  var scrollContainer = document.querySelector('.right-panel');
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!scrollContainer || !sections.length) return;

  /* ---------- Config ---------- */
  var ANIMATION_DURATION = 800;
  var COOLDOWN = 900;
  var SWIPE_THRESHOLD = 50;

  var currentSection = 0;
  var isAnimating = false;
  var lastTransitionTime = 0;

  /* ---------- Section activation (fade-in + tags) ---------- */
  var activatedSections = {};

  // Prepare fade-in elements
  var allFadeItems = document.querySelectorAll(
    '.exp-item, .project-card, .strength-card, .skills-group, .edu-item'
  );
  allFadeItems.forEach(function (item) {
    item.classList.add('fade-in');
  });

  // Prepare tags (hidden initially)
  var allTagContainers = document.querySelectorAll(
    '.exp-tags, .project-tags, .skills-tags'
  );
  allTagContainers.forEach(function (container) {
    container.querySelectorAll('.tag').forEach(function (tag) {
      tag.style.opacity = '0';
    });
  });

  function activateSection(index) {
    if (activatedSections[index]) return;
    activatedSections[index] = true;

    var section = sections[index];
    if (!section) return;

    var fadeItems = section.querySelectorAll('.fade-in');
    fadeItems.forEach(function (item, i) {
      item.style.transitionDelay = i * 0.06 + 's';
      setTimeout(function () {
        item.classList.add('visible');
      }, 80);
    });

    var tagContainers = section.querySelectorAll(
      '.exp-tags, .project-tags, .skills-tags'
    );
    tagContainers.forEach(function (container) {
      var tags = container.querySelectorAll('.tag');
      tags.forEach(function (tag, i) {
        tag.classList.add('animate');
        tag.style.animationDelay = i * 0.05 + 's';
      });
    });
  }

  /* ---------- Nav highlight ---------- */
  function updateNavHighlight(index) {
    if (!navLinks.length) return;
    var id = sections[index] ? sections[index].id : '';
    navLinks.forEach(function (link) {
      if (link.getAttribute('data-section') === id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ---------- Easing ---------- */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ---------- Scroll to section ---------- */
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    if (isAnimating) return;

    var now = Date.now();
    if (now - lastTransitionTime < COOLDOWN) return;

    if (index === currentSection) return;

    isAnimating = true;
    lastTransitionTime = now;
    currentSection = index;

    updateNavHighlight(index);
    activateSection(index);

    var start = scrollContainer.scrollTop;
    var target = index * window.innerHeight;
    var distance = target - start;

    if (Math.abs(distance) < 1) {
      isAnimating = false;
      return;
    }

    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / ANIMATION_DURATION, 1);
      var eased = easeInOutCubic(progress);

      scrollContainer.scrollTop = start + distance * eased;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        scrollContainer.scrollTop = target;
        isAnimating = false;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------- Wheel handler ---------- */
  scrollContainer.addEventListener(
    'wheel',
    function (e) {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      var section = sections[currentSection];
      var hasInternalScroll = section.scrollHeight > section.clientHeight + 2;

      if (hasInternalScroll) {
        var atTop = section.scrollTop <= 1;
        var atBottom =
          section.scrollTop + section.clientHeight >= section.scrollHeight - 1;

        if (e.deltaY > 0 && atBottom) {
          e.preventDefault();
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && atTop) {
          e.preventDefault();
          scrollToSection(currentSection - 1);
        }
        // Otherwise let section scroll internally
      } else {
        e.preventDefault();
        if (e.deltaY > 0) {
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0) {
          scrollToSection(currentSection - 1);
        }
      }
    },
    { passive: false }
  );

  /* ---------- Touch handler ---------- */
  var touchStartY = 0;

  scrollContainer.addEventListener(
    'touchstart',
    function (e) {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  scrollContainer.addEventListener(
    'touchend',
    function (e) {
      if (isAnimating) return;

      var deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      var section = sections[currentSection];
      var hasInternalScroll = section.scrollHeight > section.clientHeight + 2;

      if (hasInternalScroll) {
        var atTop = section.scrollTop <= 1;
        var atBottom =
          section.scrollTop + section.clientHeight >= section.scrollHeight - 1;

        if (deltaY > 0 && atBottom) {
          scrollToSection(currentSection + 1);
        } else if (deltaY < 0 && atTop) {
          scrollToSection(currentSection - 1);
        }
      } else {
        if (deltaY > 0) {
          scrollToSection(currentSection + 1);
        } else if (deltaY < 0) {
          scrollToSection(currentSection - 1);
        }
      }
    },
    { passive: true }
  );

  /* ---------- Keyboard handler ---------- */
  document.addEventListener('keydown', function (e) {
    if (isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToSection(currentSection - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSection(sections.length - 1);
    }
  });

  /* ---------- Nav click handler ---------- */
  navLinks.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('data-section');
      for (var j = 0; j < sections.length; j++) {
        if (sections[j].id === targetId) {
          scrollToSection(j);
          break;
        }
      }
    });
  });

  /* ---------- Resize: snap to current section ---------- */
  window.addEventListener('resize', function () {
    scrollContainer.scrollTop = currentSection * window.innerHeight;
  });

  /* ---------- Initialize ---------- */
  scrollContainer.scrollTop = 0;
  updateNavHighlight(0);
  activateSection(0);
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
      card.style.transform =
        'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
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
