document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY NAVBAR ON SCROLL
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburger.querySelector('i').className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* ==========================================================================
     3. LIGHT/DARK THEME TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');

  function enableLightMode() {
    document.body.classList.add('light-mode');
    if (themeToggle) {
      const darkIcon = themeToggle.querySelector('.theme-icon-dark');
      const lightIcon = themeToggle.querySelector('.theme-icon-light');
      if (darkIcon) darkIcon.style.display = 'none';
      if (lightIcon) lightIcon.style.display = 'block';
    }
    localStorage.setItem('shaikhsir-theme', 'light');
  }

  function enableDarkMode() {
    document.body.classList.remove('light-mode');
    if (themeToggle) {
      const darkIcon = themeToggle.querySelector('.theme-icon-dark');
      const lightIcon = themeToggle.querySelector('.theme-icon-light');
      if (darkIcon) darkIcon.style.display = 'block';
      if (lightIcon) lightIcon.style.display = 'none';
    }
    localStorage.setItem('shaikhsir-theme', 'dark');
  }

  // Load user preference
  const savedTheme = localStorage.getItem('shaikhsir-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    enableLightMode();
  } else {
    enableDarkMode();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      if (isLight) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    });
  }

  /* ==========================================================================
     4. HERO HEADLINE ROTATING TYPEWRITER EFFECT
     ========================================================================== */
  const words = ["Coding", "DevOps", "AI Skills", "Web Development"];
  const typedTextSpan = document.getElementById('typed-text');

  let wordIndex = 0;
  let charIndex = words[wordIndex].length; // Start with the first word typed out
  let isDeleting = false;
  let typingTimeout = null;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Deleting letters
      typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Adding letters
      typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 120;

    // If word is completely typed
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next word
      wordIndex = (wordIndex + 1) % words.length;
      // Short pause before starting next typing sequence
      delay = 500;
    }

    typingTimeout = setTimeout(typeEffect, delay);
  }

  // Start the typewriter loop
  if (typedTextSpan) {
    typingTimeout = setTimeout(typeEffect, 1500);
  }

  /* ==========================================================================
     5. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check toast-icon"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove toast after 3s
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  }

  /* ==========================================================================
     5B. ADMIN AUTHENTICATION & GLOBAL COURSE UNLOCK CONTROLLER
     ========================================================================== */
  const ADMIN_AUTH_KEY = 'shaikh_auth_user';
  const VALID_ADMIN_IDS = ['admin', 'admin@shaikhsir.com', 'shaikh', 'shaikh@shaikhsir.com'];
  const VALID_ADMIN_PASSWORDS = ['admin123', 'admin', 'shaikh123'];

  // Global helper functions
  window.isAdminLoggedIn = function () {
    try {
      const data = JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY));
      return !!(data && (data.role === 'admin' || data.isAdmin));
    } catch (e) {
      return false;
    }
  };

  window.getLoggedInAdmin = function () {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY));
    } catch (e) {
      return null;
    }
  };

  window.logoutAdmin = function () {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    showToast("🔒 Logged out. Locked courses protected.");
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  window.getLessonHrefForCurrentPage = function () {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('terraform')) return 'lesson-terraform.html';
    if (path.includes('networking')) return 'lesson-networking.html';
    if (path.includes('kubernetes')) return 'lesson-kubernetes.html';
    if (path.includes('linux')) return 'lesson-linux.html';
    if (path.includes('docker')) return 'lesson-docker.html';
    if (path.includes('git')) return 'lesson-git.html';
    if (path.includes('helm')) return 'lesson-helm.html';
    if (path.includes('argocd')) return 'lesson-argocd.html';
    if (path.includes('aws')) return 'lesson-aws.html';
    if (path.includes('devops-fundamentals')) return 'lesson-devops-fundamentals.html';
    
    // Look for any lesson link on the page
    const existing = document.querySelector('a[href^="lesson-"]');
    if (existing) return existing.getAttribute('href');
    return 'lesson-devops-fundamentals.html';
  };

  // Ensure Auth Modal Backdrop exists in DOM
  function initAuthModalDOM() {
    if (document.getElementById('auth-modal-backdrop')) return;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'auth-modal-backdrop';
    modalBackdrop.className = 'auth-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div class="auth-modal-header">
          <div class="auth-brand">
            <div class="auth-brand-icon font-mono">&gt;_</div>
            <div class="auth-brand-text">Shaikh Sir Access Portal</div>
            <span class="auth-badge-tag font-mono">SECURE</span>
          </div>
          <button class="btn-close-auth-modal" id="btn-close-auth-modal" aria-label="Close Modal">&times;</button>
        </div>
        <div class="auth-modal-body">
          <h2 class="auth-modal-title" id="auth-modal-title">Sign In to Shaikh Sir</h2>
          <p class="auth-modal-subtitle">Sign in as Admin to access all locked courses, interactive cloud labs, and hands-on tracks.</p>

          <div class="auth-error-box" id="auth-error-box">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span id="auth-error-text">Invalid ID or Password</span>
          </div>

          <form class="auth-form" id="auth-login-form">
            <div class="auth-field">
              <label class="auth-label" for="auth-input-id">
                <span>User ID / Username / Email</span>
                <span class="font-mono text-accent" style="font-size:10px;">REQUIRED</span>
              </label>
              <div class="auth-input-wrapper">
                <i class="fa-solid fa-user auth-input-icon"></i>
                <input type="text" id="auth-input-id" class="auth-input font-mono" placeholder="e.g. admin" required autocomplete="username" />
              </div>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="auth-input-pass">
                <span>Password</span>
                <span class="font-mono text-accent" style="font-size:10px;">REQUIRED</span>
              </label>
              <div class="auth-input-wrapper">
                <i class="fa-solid fa-lock auth-input-icon"></i>
                <input type="password" id="auth-input-pass" class="auth-input font-mono" placeholder="Enter password" required autocomplete="current-password" />
                <button type="button" class="btn-toggle-password" id="btn-toggle-password" aria-label="Toggle password visibility">
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-auth-submit" id="btn-auth-submit">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Sign In &amp; Unlock All Courses</span>
            </button>
          </form>

          <div class="auth-credentials-hint-card">
            <div class="auth-hint-header">
              <span><i class="fa-solid fa-key"></i> DEFAULT ADMIN CREDENTIALS</span>
              <span class="font-mono">FULL ACCESS</span>
            </div>
            <div class="auth-hint-rows font-mono">
              <div class="auth-hint-item">
                <span class="auth-hint-key">Admin ID:</span>
                <code class="auth-hint-val">admin</code>
              </div>
              <div class="auth-hint-item">
                <span class="auth-hint-key">Password:</span>
                <code class="auth-hint-val">admin123</code>
              </div>
            </div>
            <button type="button" class="btn-auth-autofill" id="btn-auth-autofill">
              <i class="fa-solid fa-bolt"></i>
              <span>Auto-fill Admin Credentials &amp; Sign In</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    // Event listeners inside modal
    const btnClose = modalBackdrop.querySelector('#btn-close-auth-modal');
    if (btnClose) {
      btnClose.addEventListener('click', closeAuthModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeAuthModal();
    });

    const btnTogglePass = modalBackdrop.querySelector('#btn-toggle-password');
    const inputPass = modalBackdrop.querySelector('#auth-input-pass');
    if (btnTogglePass && inputPass) {
      btnTogglePass.addEventListener('click', () => {
        const isPass = inputPass.getAttribute('type') === 'password';
        inputPass.setAttribute('type', isPass ? 'text' : 'password');
        btnTogglePass.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    const btnAutofill = modalBackdrop.querySelector('#btn-auth-autofill');
    const inputId = modalBackdrop.querySelector('#auth-input-id');
    if (btnAutofill && inputId && inputPass) {
      btnAutofill.addEventListener('click', () => {
        inputId.value = 'admin';
        inputPass.value = 'admin123';
        handleAuthSubmit();
      });
    }

    const form = modalBackdrop.querySelector('#auth-login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAuthSubmit();
      });
    }
  }

  // Ensure Floating Admin Status Widget exists in DOM
  function initAdminFloatingStatusDOM() {
    if (document.getElementById('admin-floating-status')) return;
    const floating = document.createElement('div');
    floating.id = 'admin-floating-status';
    floating.className = 'admin-floating-status';
    floating.innerHTML = `
      <div class="admin-floating-pulse"></div>
      <div class="admin-floating-text font-mono">
        <i class="fa-solid fa-shield-halved text-accent"></i>
        <span>ADMIN: ALL COURSES UNLOCKED</span>
        <span class="admin-floating-badge">FULL ACCESS</span>
      </div>
      <button class="btn-admin-logout" id="btn-floating-logout" title="Log Out Admin">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    `;
    document.body.appendChild(floating);

    const btnLogout = floating.querySelector('#btn-floating-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', window.logoutAdmin);
    }
  }

  function openAuthModal() {
    initAuthModalDOM();
    const modal = document.getElementById('auth-modal-backdrop');
    const errorBox = document.getElementById('auth-error-box');
    if (errorBox) errorBox.style.display = 'none';
    if (modal) {
      modal.style.display = 'flex';
      const inputId = document.getElementById('auth-input-id');
      if (inputId) setTimeout(() => inputId.focus(), 50);
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById('auth-modal-backdrop');
    if (modal) modal.style.display = 'none';
  }

  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
  });

  function handleAuthSubmit() {
    const inputId = document.getElementById('auth-input-id');
    const inputPass = document.getElementById('auth-input-pass');
    const errorBox = document.getElementById('auth-error-box');
    const errorText = document.getElementById('auth-error-text');

    const idVal = inputId ? inputId.value.trim().toLowerCase() : '';
    const passVal = inputPass ? inputPass.value.trim() : '';

    if (!idVal || !passVal) {
      if (errorBox && errorText) {
        errorText.textContent = "Please enter both User ID and Password.";
        errorBox.style.display = 'flex';
      }
      return;
    }

    const isIdOk = VALID_ADMIN_IDS.includes(idVal);
    const isPassOk = VALID_ADMIN_PASSWORDS.includes(passVal);

    if (isIdOk && isPassOk) {
      const user = {
        username: idVal.includes('@') ? idVal.split('@')[0] : idVal,
        email: idVal.includes('@') ? idVal : `${idVal}@shaikhsir.com`,
        role: 'admin',
        isAdmin: true,
        name: 'Shaikh Admin',
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
      closeAuthModal();
      showToast("🎉 Admin access verified! All locked courses and labs unlocked.");
      applyAdminPrivileges();
    } else {
      if (errorBox && errorText) {
        errorText.textContent = "Invalid credentials. Use Admin ID: admin and Password: admin123";
        errorBox.style.display = 'flex';
      }
    }
  }

  // Master Unlocking Engine
  function applyAdminPrivileges() {
    if (!window.isAdminLoggedIn()) return;

    // 1. Update all navbar sign-in buttons to Admin Profile Pill
    const signinButtons = document.querySelectorAll('.btn-signin, .btn-signin-mobile');
    signinButtons.forEach(btn => {
      const pill = document.createElement('div');
      pill.className = 'admin-user-pill';
      pill.innerHTML = `
        <i class="fa-solid fa-shield-halved admin-shield-icon"></i>
        <span class="admin-name-tag font-mono">admin</span>
        <button class="btn-admin-logout" title="Sign Out Admin" aria-label="Sign Out">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      `;
      const logoutBtn = pill.querySelector('.btn-admin-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.logoutAdmin();
        });
      }
      btn.replaceWith(pill);
    });

    // 2. Display Floating Admin Status Widget
    initAdminFloatingStatusDOM();
    const floating = document.getElementById('admin-floating-status');
    if (floating) floating.style.display = 'flex';

    // 3. Unlock all course & skill cards
    const targetLesson = window.getLessonHrefForCurrentPage();
    const lockedCards = document.querySelectorAll('.topic-step-card.locked-step, .topic-step-card.pro-locked-card, .topic-step-card[data-status="locked"]');
    
    lockedCards.forEach(card => {
      card.classList.remove('locked-step');
      card.classList.remove('pro-locked-card');
      card.classList.add('admin-unlocked-card');
      card.setAttribute('data-status', 'unlocked');

      // Clear any inline openProModal onclick
      const currentClick = card.getAttribute('onclick') || '';
      if (currentClick.includes('openProModal')) {
        card.removeAttribute('onclick');
      }

      // Update Lock Icon to Unlocked Badge
      const lockIcon = card.querySelector('.step-lock-icon');
      if (lockIcon) {
        lockIcon.innerHTML = '<span class="step-unlocked-badge font-mono"><i class="fa-solid fa-lock-open"></i> UNLOCKED</span>';
        lockIcon.setAttribute('title', 'Unlocked by Admin');
      }

      // Click handler to open lesson or lab
      card.style.cursor = 'pointer';
      card.onclick = function (e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const topicId = card.getAttribute('data-topic-id');
        if (window.location.pathname.toLowerCase().includes('linux') && window.startLinuxLab && topicId) {
          window.startLinuxLab(topicId);
        } else if (targetLesson) {
          window.location.href = targetLesson;
        }
      };

      // Ensure Action Button exists
      let actionBox = card.querySelector('.step-action, .step-card-action');
      if (!actionBox) {
        actionBox = document.createElement('div');
        actionBox.className = 'step-action';
        card.appendChild(actionBox);
      }
      if (!actionBox.querySelector('a, button')) {
        const topicId = card.getAttribute('data-topic-id');
        const actionBtn = document.createElement('a');
        actionBtn.className = 'btn-step-action btn-continue-lab font-mono';
        actionBtn.href = targetLesson;
        actionBtn.innerHTML = '<span>Start Lesson &amp; Lab</span> <i class="fa-solid fa-arrow-right"></i>';
        if (window.location.pathname.toLowerCase().includes('linux') && topicId) {
          actionBtn.href = 'javascript:void(0)';
          actionBtn.onclick = () => window.startLinuxLab(topicId);
        }
        actionBox.appendChild(actionBtn);
      }
    });

    // 4. Unlock Roadmap nodes
    document.querySelectorAll('.checkpoint-node').forEach(node => {
      const stats = node.querySelector('.node-stats');
      if (stats && stats.textContent.includes('Locked')) {
        stats.innerHTML = stats.innerHTML.replace('Locked', '<span class="text-accent font-bold"><i class="fa-solid fa-lock-open"></i> Unlocked (Admin)</span>');
        node.classList.add('admin-unlocked-node');
        if (node.tagName !== 'A') {
          node.style.cursor = 'pointer';
          node.addEventListener('click', () => {
            showToast("⚡ Admin Access: Navigating to skill checkpoint...");
            window.location.href = 'index.html#skills';
          });
        }
      }
    });

    // 5. Unlock Homepage hero IDE mockup items
    document.querySelectorAll('.lesson-item').forEach(item => {
      const lockIcon = item.querySelector('.fa-lock');
      if (lockIcon) {
        lockIcon.className = 'fa-solid fa-circle-check text-accent lesson-icon';
        item.setAttribute('title', 'Admin Access: Unlocked');
      }
    });

    // 6. Close proModalBackdrop if it was open
    const proBackdrop = document.getElementById('pro-modal-backdrop');
    if (proBackdrop) proBackdrop.style.display = 'none';
  }

  window.applyAdminPrivileges = applyAdminPrivileges;

  // Bind all Sign In triggers across the page
  function bindSignInTriggers() {
    const signinButtons = document.querySelectorAll('.btn-signin, .btn-signin-mobile, [data-action="open-signin"]');
    signinButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal();
      });
    });
  }

  bindSignInTriggers();

  // If already logged in on page load, apply admin mode immediately
  if (window.isAdminLoggedIn()) {
    applyAdminPrivileges();
  }

  /* ==========================================================================
     6. CODE SNIPPET COPY TO CLIPBOARD
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeWrapper = button.closest('.code-block-wrapper');
      const codeElement = codeWrapper.querySelector('code');

      if (codeElement) {
        const textToCopy = codeElement.textContent;

        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Update button icon temporarily
            const icon = button.querySelector('i');
            icon.className = 'fa-solid fa-check text-green';
            showToast("Copied to clipboard!");

            setTimeout(() => {
              icon.className = 'fa-regular fa-copy';
            }, 2000);
          })
          .catch(err => {
            console.error("Failed to copy code: ", err);
          });
      }
    });
  });

  /* ==========================================================================
     7. IDE MOCKUP PAGINATION & PROGRESS TRIGGERS
     ========================================================================== */
  const lessonItems = document.querySelectorAll('.lesson-item');
  const pagDots = document.querySelectorAll('.pag-dot');
  const slides = document.querySelectorAll('.lesson-slide');
  const progressCircle = document.getElementById('progress-circle');
  const ideTitleBar = document.getElementById('ide-title-bar');

  // Progressive stats for each mockup slide
  const slideData = [
    { progress: 8, title: "1. Introduction to Variables", bar: "Shaikh Sir — Live Lesson: Python Intro" },
    { progress: 42, title: "2. Dynamic Typing in Python", bar: "Shaikh Sir — Live Lesson: Types & Bounds" },
    { progress: 78, title: "3. Writing Your First Function", bar: "Shaikh Sir — Live Lesson: Callables" }
  ];

  function switchSlide(index) {
    // Update active class for slides
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    // Update active class for sidebar lessons
    lessonItems.forEach(item => item.classList.remove('active'));
    if (lessonItems[index]) {
      lessonItems[index].classList.add('active');
    }

    // Update active pagination dots
    pagDots.forEach(dot => dot.classList.remove('active'));
    if (pagDots[index]) {
      pagDots[index].classList.add('active');
    }

    // Update progress ring dynamically
    const data = slideData[index];
    if (progressCircle && data) {
      const text = progressCircle.querySelector('.progress-text');
      text.textContent = `${data.progress}%`;

      // Update radial conic-gradient (simulate border filling up)
      const accentGreen = getComputedStyle(document.body).getPropertyValue('--accent-green').trim() || '#22e584';
      const borderColor = getComputedStyle(document.body).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.08)';
      progressCircle.style.background = `conic-gradient(${accentGreen} 0% ${data.progress}%, ${borderColor} ${data.progress}% 100%)`;
    }

    // Update title bar
    if (ideTitleBar && data) {
      ideTitleBar.textContent = data.bar;
    }
  }

  // Bind clicks to sidebar items
  lessonItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      switchSlide(index);
    });
  });

  // Bind clicks to pagination dots
  pagDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      switchSlide(index);
    });
  });

  // Start Lab button logic inside IDE mockup terminal
  const btnStartIdeLab = document.getElementById('btn-start-ide-lab');
  const ideTerminal = document.getElementById('ide-terminal');
  const ideTerminalOutput = document.getElementById('ide-terminal-output');

  if (btnStartIdeLab && ideTerminal && ideTerminalOutput) {
    btnStartIdeLab.addEventListener('click', () => {
      const placeholder = ideTerminal.querySelector('.terminal-placeholder');
      placeholder.style.display = 'none';
      ideTerminalOutput.style.display = 'flex';

      // Trigger simple success audio or styling triggers
      showToast("Interactive sandbox shell loaded!");
    });
  }

  /* ==========================================================================
     8. STARFIELD PARTICLE BACKGROUND GENERATOR
     ========================================================================== */
  const starfield = document.getElementById('starfield');
  if (starfield) {
    const starCount = 60;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';

      // Random size
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.backgroundColor = '#ffffff';
      star.style.borderRadius = '50%';

      // Random position
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      // Random opacity
      const opacity = Math.random() * 0.4 + 0.15;
      star.style.opacity = opacity;

      // Add subtle keyframe animations
      star.style.animation = `starPulse ${Math.random() * 4 + 3}s ease-in-out infinite alternate`;
      fragment.appendChild(star);
    }

    starfield.appendChild(fragment);

    // Inject temporary starPulse animation into stylesheet if not present
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes starPulse {
        0% { opacity: 0.15; transform: scale(0.8); }
        100% { opacity: 0.6; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ==========================================================================
     9. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-element');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // Trigger specific animations if the element contains certain targets
        if (entry.target.querySelector('#animated-terminal')) {
          triggerZeroSetupTerminal();
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     10. ZERO SETUP TERMINAL LINE REVEAL ANIMATION
     ========================================================================== */
  let terminalTriggered = false;

  function triggerZeroSetupTerminal() {
    if (terminalTriggered) return;
    terminalTriggered = true;

    const animLines = document.querySelectorAll('#animated-terminal .anim-line');

    animLines.forEach(line => {
      const delay = parseInt(line.getAttribute('data-delay')) || 0;
      setTimeout(() => {
        line.classList.add('show');
      }, delay);
    });
  }

  /* ==========================================================================
     11. ROADMAP TRACK/STEPS VIEW TOGGLE
     ========================================================================== */
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const trackView = document.getElementById('track-view-container');
  const stepsView = document.getElementById('steps-view-container');

  if (toggleBtns.length > 0 && trackView && stepsView) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetView = btn.getAttribute('data-view');
        if (targetView === 'track') {
          trackView.classList.add('active');
          stepsView.classList.remove('active');
        } else if (targetView === 'steps') {
          stepsView.classList.add('active');
          trackView.classList.remove('active');
        }
      });
    });
  }

  /* ==========================================================================
     12. SKILLS CATEGORY FILTERING
     ========================================================================== */
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  if (skillFilterBtns.length > 0 && skillCards.length > 0) {
    // Calculate and populate exact category counts dynamically
    skillFilterBtns.forEach(btn => {
      const filterValue = btn.getAttribute('data-filter');
      let count = 0;
      skillCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          count++;
        }
      });
      const countSpan = btn.querySelector('.skill-filter-count');
      if (countSpan) {
        countSpan.textContent = count;
      }
    });

    skillFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        skillFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const categories = (card.getAttribute('data-category') || '').split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     13. SKILL TOPICS LIST / GRID VIEW TOGGLE
     ========================================================================== */
  const viewToggleList = document.getElementById('view-toggle-list') || document.getElementById('view-list-btn') || document.querySelector('[data-view="list"]');
  const viewToggleGrid = document.getElementById('view-toggle-grid') || document.getElementById('view-grid-btn') || document.querySelector('[data-view="grid"]');
  const topicsContainer = document.getElementById('topics-container');

  if (topicsContainer) {
    const applyViewMode = (mode, showNotification = false) => {
      if (mode === 'grid') {
        topicsContainer.classList.remove('topics-list-view');
        topicsContainer.classList.add('topics-grid-view');
        if (viewToggleGrid) viewToggleGrid.classList.add('active');
        if (viewToggleList) viewToggleList.classList.remove('active');
        if (showNotification) showToast("Switched to Grid view");
      } else {
        topicsContainer.classList.remove('topics-grid-view');
        topicsContainer.classList.add('topics-list-view');
        if (viewToggleList) viewToggleList.classList.add('active');
        if (viewToggleGrid) viewToggleGrid.classList.remove('active');
        if (showNotification) showToast("Switched to List view");
      }
    };

    if (viewToggleList) {
      viewToggleList.addEventListener('click', (e) => {
        e.preventDefault();
        applyViewMode('list', true);
      });
    }

    if (viewToggleGrid) {
      viewToggleGrid.addEventListener('click', (e) => {
        e.preventDefault();
        applyViewMode('grid', true);
      });
    }
  }

  /* ==========================================================================
     14. LINUX SKILL TOPIC CARD CLICKS & SANDBOX MODAL
     ========================================================================== */
  const topicStepCards = document.querySelectorAll('.topic-step-card');
  const labModalBackdrop = document.getElementById('lab-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalCloseIcon = document.getElementById('btn-modal-close-icon');
  const modalLabTitle = document.getElementById('modal-lab-title');
  const labTaskTitle = document.getElementById('lab-task-title');
  const labCommandInput = document.getElementById('lab-command-input');
  const btnRunCmd = document.getElementById('btn-run-cmd');
  const labTerminalScreen = document.getElementById('lab-terminal-screen');
  const checkTask1 = document.getElementById('check-task-1');
  const checkTask2 = document.getElementById('check-task-2');

  const linuxTopicsData = {
    1: { title: "01 - Introduction to Linux", desc: "Welcome to your sandboxed Linux shell. Explore basic commands like whoami, uname -a, and pwd." },
    2: { title: "02 - Paths and navigation", desc: "Learn absolute vs relative paths, traversing directories with cd, and listing directories with ls -la." },
    3: { title: "03 - Listing files", desc: "Master ls options, flags, hidden dotfiles, and understanding directory entry permissions." }
  };

  window.startLinuxLab = function (id) {
    if (labModalBackdrop) {
      const topic = linuxTopicsData[id] || { title: `Topic ${id}`, desc: "Hands-on cloud VM terminal session." };
      if (modalLabTitle) modalLabTitle.textContent = `🐧 Linux Sandbox — ${topic.title}`;
      if (labTaskTitle) labTaskTitle.textContent = `Lab: ${topic.title}`;
      labModalBackdrop.style.display = 'flex';
      showToast(`Starting lab: ${topic.title}...`);
      if (labCommandInput) labCommandInput.focus();
    }
  };

  // Locked step card clicks prompt upgrade toast
  topicStepCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked a button directly
      if (e.target.closest('button')) return;

      const status = card.getAttribute('data-status');
      const topicId = card.getAttribute('data-topic-id');

      if (status === 'locked') {
        if (window.isAdminLoggedIn && window.isAdminLoggedIn()) {
          window.startLinuxLab(topicId);
        } else {
          showToast("🔒 Topic locked. Pro or AI membership required to access this lab.");
        }
      } else if (status === 'active' || status === 'free' || status === 'unlocked') {
        window.startLinuxLab(topicId);
      }
    });
  });

  // Modal close events
  function closeLabModal() {
    if (labModalBackdrop) {
      labModalBackdrop.style.display = 'none';
    }
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeLabModal);
  if (btnModalCloseIcon) btnModalCloseIcon.addEventListener('click', closeLabModal);
  if (labModalBackdrop) {
    labModalBackdrop.addEventListener('click', (e) => {
      if (e.target === labModalBackdrop) closeLabModal();
    });
  }

  // Interactive command runner in Sandbox terminal
  function executeTerminalCommand() {
    if (!labCommandInput || !labTerminalScreen) return;
    const cmd = labCommandInput.value.trim();
    if (!cmd) return;

    // Add user command line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line font-bold text-accent';
    userLine.textContent = `student@shaikhsir:~$ ${cmd}`;
    labTerminalScreen.appendChild(userLine);

    // Command responses
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    const lowerCmd = cmd.toLowerCase();
    const checkTask3 = document.getElementById('check-task-3');

    if (lowerCmd === 'whoami') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'student';
      if (checkTask1) checkTask1.checked = true;
      showToast("Task completed: Ran whoami!");
    } else if (lowerCmd === 'pwd') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = '/home/student/workspace';
      if (checkTask2) checkTask2.checked = true;
      showToast("Task completed: Ran pwd!");
    } else if (lowerCmd === 'docker --version' || lowerCmd === 'docker -v' || lowerCmd === 'docker version') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'Docker version 26.1.3, build b72afb3 (API 1.45)';
      if (checkTask1) checkTask1.checked = true;
      showToast("✓ Task 1: Verified Docker Engine version!");
    } else if (lowerCmd.startsWith('docker run')) {
      responseLine.className = 'terminal-line text-green';
      if (lowerCmd.includes('nginx')) {
        responseLine.textContent = 'Unable to find image \'nginx:latest\' locally\nlatest: Pulling from library/nginx\na2abf6c4d29d: Pull complete\na9edb18cadd1: Pull complete\nDigest: sha256:6db391d1c0cfb30588ba0bf2eeee9994da956f3b2bb6102a82159d866a306154\nStatus: Downloaded newer image for nginx:latest\na8f3b291c94b7e8d021c6019b88301fa3910c2830a84d9f182';
        if (checkTask2) checkTask2.checked = true;
        showToast("✓ Task 2: Nginx container launched in background!");
      } else if (lowerCmd.includes('hello-world')) {
        responseLine.textContent = 'Hello from Docker!\nThis message shows that your installation appears to be working correctly.';
      } else {
        responseLine.textContent = 'd39a1c8402b1f8021c94b7e8d021c6019b88301fa3910c2830a84d9f';
      }
    } else if (lowerCmd === 'docker ps' || lowerCmd === 'docker ps -a' || lowerCmd === 'docker container ls') {
      responseLine.className = 'terminal-line font-mono';
      responseLine.textContent = 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                NAMES\na8f3b291c94b   nginx:latest   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:80->80/tcp   web-server';
      if (checkTask3) checkTask3.checked = true;
      showToast("✓ Task 3: Inspected active containers with docker ps!");
    } else if (lowerCmd === 'docker images' || lowerCmd === 'docker image ls') {
      responseLine.textContent = 'REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\nnginx        latest    a6bd71f485c2   3 days ago     187MB\nubuntu       24.04     35a88802559e   2 weeks ago    77.8MB\nnode         20-alpine 8b824248d28e   1 month ago    174MB';
    } else if (lowerCmd.startsWith('docker stop')) {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'a8f3b291c94b (container stopped gracefully)';
    } else if (lowerCmd.startsWith('docker build')) {
      responseLine.textContent = '[+] Building 2.4s (6/6) FINISHED\n => [internal] load build definition from Dockerfile\n => [1/3] FROM node:20-alpine\n => [2/3] WORKDIR /app\n => [3/3] COPY . .\n => naming to docker.io/library/myapp:latest\nSuccessfully built 4b29c91d84f0';
    } else if (lowerCmd.startsWith('docker-compose') || lowerCmd.startsWith('docker compose')) {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = '[+] Running 2/2\n ✔ Network workspace_default  Created\n ✔ Container redis-db         Started\n ✔ Container web-app          Started';
    } else if (lowerCmd === 'kubectl version' || lowerCmd === 'kubectl version --short' || lowerCmd === 'kubectl version --client') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'Client Version: v1.30.2\nKustomize Version: v5.0.4-0.20230601165947-6ce0bd390ce3\nServer Version: v1.30.2';
    } else if (lowerCmd === 'kubectl get nodes' || lowerCmd === 'kubectl get node' || lowerCmd === 'kubectl get nodes -o wide') {
      responseLine.className = 'terminal-line font-mono text-green';
      responseLine.textContent = 'NAME           STATUS   ROLES           AGE   VERSION\nk8s-master-1   Ready    control-plane   12d   v1.30.2\nk8s-worker-1   Ready    <none>          12d   v1.30.2\nk8s-worker-2   Ready    <none>          12d   v1.30.2';
      if (checkTask1) checkTask1.checked = true;
      showToast("✓ Task 1: Inspected cluster nodes!");
    } else if (lowerCmd.startsWith('kubectl create deployment') || lowerCmd.startsWith('kubectl apply')) {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'deployment.apps/web created';
      if (checkTask2) checkTask2.checked = true;
      showToast("✓ Task 2: Created Nginx web deployment!");
    } else if (lowerCmd === 'kubectl get pods' || lowerCmd === 'kubectl get pod' || lowerCmd === 'kubectl get pods -a' || lowerCmd === 'kubectl get po') {
      responseLine.className = 'terminal-line font-mono';
      responseLine.textContent = 'NAME                   READY   STATUS    RESTARTS   AGE\nweb-7548b6c498-8xqw2   1/1     Running   0          45s\nweb-7548b6c498-v9k2p   1/1     Running   0          45s\nweb-7548b6c498-zlm5t   1/1     Running   0          45s';
      if (checkTask3) checkTask3.checked = true;
      showToast("✓ Task 3: Inspected active cluster pods!");
    } else if (lowerCmd === 'kubectl get svc' || lowerCmd === 'kubectl get services') {
      responseLine.className = 'terminal-line font-mono';
      responseLine.textContent = 'NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE\nkubernetes   ClusterIP   10.96.0.1    <none>        443/TCP        12d\nweb-svc      NodePort    10.96.48.22  <none>        80:30080/TCP   2m';
    } else if (lowerCmd.startsWith('kubectl describe')) {
      responseLine.textContent = 'Name:             web-7548b6c498-8xqw2\nNamespace:        default\nNode:             k8s-worker-1/192.168.1.102\nStatus:           Running\nIP:               10.244.1.15\nControlled By:    ReplicaSet/web-7548b6c498\nContainers:\n  nginx:\n    Image:          nginx:1.25\n    State:          Running\nConditions:\n  Type              Status\n  Ready             True';
    } else if (lowerCmd === 'terraform version' || lowerCmd === 'terraform -v' || lowerCmd === 'terraform --version') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'Terraform v1.8.5\non linux_amd64\n+ provider registry.terraform.io/hashicorp/aws v5.50.0';
      if (checkTask1) checkTask1.checked = true;
      showToast("✓ Task 1: Checked Terraform Engine version!");
    } else if (lowerCmd === 'terraform init' || lowerCmd === 'terraform init -upgrade') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'Initializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching "~> 5.0"...\n- Installing hashicorp/aws v5.50.0...\n- Installed hashicorp/aws v5.50.0 (signed by HashiCorp)\n\nTerraform has been successfully initialized!';
      if (checkTask2) checkTask2.checked = true;
      showToast("✓ Task 2: Terraform provider initialized!");
    } else if (lowerCmd === 'terraform plan') {
      responseLine.className = 'terminal-line font-mono';
      responseLine.textContent = 'Terraform used the selected providers to generate the following execution plan:\n\n  # aws_s3_bucket.app_storage will be created\n  + resource "aws_s3_bucket" "app_storage" {\n      + arn                         = (known after apply)\n      + bucket                      = "shaikhsir-production-assets"\n      + id                          = (known after apply)\n      + region                      = "us-east-1"\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.';
    } else if (lowerCmd.startsWith('terraform apply')) {
      responseLine.className = 'terminal-line text-green font-mono';
      responseLine.textContent = 'aws_s3_bucket.app_storage: Creating...\naws_s3_bucket.app_storage: Creation complete after 1s [id=shaikhsir-production-assets]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\n\nOutputs:\nbucket_arn = "arn:aws:s3:::shaikhsir-production-assets"';
      if (checkTask3) checkTask3.checked = true;
      showToast("✓ Task 3: Applied Terraform plan to LocalStack!");
    } else if (lowerCmd === 'terraform state list') {
      responseLine.className = 'terminal-line font-mono';
      responseLine.textContent = 'aws_s3_bucket.app_storage\naws_vpc.main\naws_subnet.public_a';
    } else if (lowerCmd === 'terraform validate') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'Success! The configuration is valid.';
    } else if (lowerCmd === 'terraform fmt') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'main.tf\nvariables.tf\noutputs.tf';
    } else if (lowerCmd === 'git status') {
      responseLine.className = 'terminal-line text-green';
      responseLine.textContent = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   pipeline.yml\n\tmodified:   src/server.js';
      if (checkTask1) checkTask1.checked = true;
      showToast("✓ Task 1: Inspected Git branch status!");
    } else if (lowerCmd === 'npm test' || lowerCmd === 'npm run test' || lowerCmd === 'yarn test') {
      responseLine.className = 'terminal-line text-green font-mono';
      responseLine.textContent = 'PASS src/api.test.js (1.4s)\n  ✓ GET /health (12ms)\n  ✓ POST /auth/login (48ms)\n  ✓ GET /metrics (8ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        1.82s\nRan all test suites.';
      if (checkTask2) checkTask2.checked = true;
      showToast("✓ Task 2: Automated test suite passed!");
    } else if (lowerCmd.startsWith('pipeline trigger') || lowerCmd.startsWith('pipeline run') || lowerCmd.startsWith('pipeline start')) {
      responseLine.className = 'terminal-line text-green font-mono';
      responseLine.textContent = '[CI Pipeline #412]\n  ✓ Stage 1: Checkout Git Repository (0.4s)\n  ✓ Stage 2: Lint & Static Code Analysis (1.1s)\n  ✓ Stage 3: Run Unit Tests (1.8s)\n  ✓ Stage 4: Build Container Image (4.2s)\n  ✓ Stage 5: Deploy to Staging Environment (3.0s)\nPipeline Status: SUCCESS (All 5 stages completed)';
      if (checkTask3) checkTask3.checked = true;
      showToast("✓ Task 3: CI/CD Pipeline build completed!");
    } else if (lowerCmd.startsWith('curl') && lowerCmd.includes('health')) {
      responseLine.className = 'terminal-line text-green font-mono';
      responseLine.textContent = 'HTTP/1.1 200 OK\nContent-Type: application/json\nDate: Sat, 29 Aug 2026 00:30:00 GMT\nConnection: keep-alive\n\n{"status":"healthy","uptime":"14h 22m","version":"2.4.0"}';
    } else if (lowerCmd === 'ls' || lowerCmd === 'ls -la' || lowerCmd === 'ls -l') {
      responseLine.textContent = 'drwxr-xr-x 4 student student 4096 Aug 25 21:00 .\ndrwxr-xr-x 3 root    root    4096 Aug 25 20:00 ..\n-rw-r--r-- 1 student student  220 Aug 25 21:00 .bashrc\n-rw-r--r-- 1 student student  807 Aug 25 21:00 README.md\n-rw-r--r-- 1 student student  340 Aug 25 21:00 Dockerfile\n-rw-r--r-- 1 student student  412 Aug 25 21:00 docker-compose.yml';
    } else if (lowerCmd === 'uname -a') {
      responseLine.textContent = 'Linux shaikhsir-cloud-sandbox 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (lowerCmd === 'clear') {
      labTerminalScreen.innerHTML = '<div class="terminal-line text-accent font-bold">student@docker-sandbox:~$ <span class="term-cursor">_</span></div>';
      labCommandInput.value = '';
      return;
    } else if (lowerCmd === 'help') {
      responseLine.textContent = 'Available lab commands: docker --version, docker run -d -p 80:80 nginx, docker ps, docker images, docker build -t myapp ., docker stop <id>, docker compose up, whoami, pwd, ls, clear, help';
    } else if (lowerCmd === 'cat readme.md' || lowerCmd === 'cat dockerfile') {
      responseLine.textContent = 'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]';
    } else {
      responseLine.className = 'terminal-line text-red';
      responseLine.textContent = `bash: ${cmd}: command not found. Try 'help' for available commands.`;
    }

    labTerminalScreen.appendChild(responseLine);
    labCommandInput.value = '';
    labTerminalScreen.scrollTop = labTerminalScreen.scrollHeight;
  }

  if (btnRunCmd) {
    btnRunCmd.addEventListener('click', executeTerminalCommand);
  }

  if (labCommandInput) {
    labCommandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeTerminalCommand();
      }
    });
  }

  /* ==========================================================================
     15. FULL 3-COLUMN INTERACTIVE LESSON WORKSPACE CONTROLLER (lesson-linux.html)
     ========================================================================== */
  const lessonStepperItems = document.querySelectorAll('.sidebar-stepper-list .stepper-item');
  const lessonStepCounter = document.getElementById('lesson-step-counter');
  const lessonHeading = document.getElementById('lesson-heading');
  const lessonTypePill = document.getElementById('lesson-type-pill');
  const lessonBodyContent = document.getElementById('lesson-body-content');
  const lessonQuizContainer = document.getElementById('lesson-quiz-container');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsList = document.getElementById('quiz-options-list');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const btnLessonPrev = document.getElementById('btn-lesson-prev');
  const btnLessonNext = document.getElementById('btn-lesson-next');

  // Voice player elements
  const btnVoicePlay = document.getElementById('btn-voice-play');
  const voiceIcon = document.getElementById('voice-icon');
  const voiceStatusText = document.getElementById('voice-status-text');
  const voiceTimer = document.getElementById('voice-timer');

  // Progress elements
  const lessonProgressArc = document.getElementById('lesson-progress-arc');
  const lessonProgressPercent = document.getElementById('lesson-progress-percent');
  const statDoneCount = document.getElementById('stat-done-count');
  const statQuizzesCount = document.getElementById('stat-quizzes-count');
  const statTasksCount = document.getElementById('stat-tasks-count');

  // Terminal & Editor elements
  const tabTerminalBtn = document.getElementById('tab-terminal-btn');
  const tabEditorBtn = document.getElementById('tab-editor-btn');
  const terminalStandbyView = document.getElementById('terminal-standby-view');
  const terminalActiveView = document.getElementById('terminal-active-view');
  const editorActiveView = document.getElementById('editor-active-view');
  const btnStartLiveLab = document.getElementById('btn-start-live-lab');
  const terminalViewport = document.getElementById('terminal-viewport');
  const terminalCliInput = document.getElementById('terminal-cli-input');
  const btnCliSubmit = document.getElementById('btn-cli-submit');

  if (lessonStepperItems.length > 0 && lessonHeading) {

    // 9 Lessons Data
    const lessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What is Linux',
        duration: '1:25',
        seconds: 85,
        voiceText: "Linux is an operating system, the same category as Windows and macOS, but built with a different philosophy. It is free, open source, and designed for servers first. In cloud environments like AWS, Azure, and Google Cloud, Linux is the default standard for Docker, Kubernetes, and backend infrastructure.",
        bodyHtml: `
          <p>
            Linux is an operating system, same category as Windows and macOS but built with a different philosophy.
            It's free, open source, and designed for servers first. Launch a VM on AWS, Azure, or Google Cloud and
            Linux is the default. Docker, Kubernetes, most CI runners, most production databases, all Linux.
          </p>
          <p>
            That's why every DevOps job description says <strong>"comfortable in Linux."</strong> You don't need to be a kernel
            developer. You need to sit at a Linux machine, look around, read a config, restart a service, and get out.
            That's the skill.
          </p>
          <p>
            The good news: the commands you'll use day to day number in the dozens, not thousands. You'll meet
            most of them in this skill, one at a time.
          </p>
          <h3 class="lesson-subheading text-green">Distributions</h3>
          <p>
            Linux isn't one thing, it's a family. Ubuntu, Debian, CentOS, Red Hat, Amazon Linux, Alpine, all called
            <strong>distributions</strong>. They mostly behave the same. This course uses Ubuntu, which is what most cloud VMs
            default to.
          </p>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Your first commands',
        duration: '1:10',
        seconds: 70,
        voiceText: "In this lesson, we introduce essential discovery commands. Running whoami identifies the currently active user account, while uname -a prints operating system kernel details.",
        bodyHtml: `
          <p>
            When you first connect to a Linux server over SSH or terminal, you want to inspect your identity and the system status.
          </p>
          <p>
            Here are your three immediate go-to inspection commands:
          </p>
          <div class="code-block-wrapper" style="margin: 16px 0;">
            <div class="code-lang-label font-mono">BASH</div>
            <pre><code>whoami     # Prints your current active username
uname -a   # Shows the kernel version and system architecture
hostname   # Displays the system host identifier</code></pre>
          </div>
          <p>
            Try executing these commands inside the live terminal on the right!
          </p>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'pwd, ls, and cat',
        duration: '1:45',
        seconds: 105,
        voiceText: "Filesystem navigation is the cornerstone of Linux administration. The pwd command displays your present working directory. ls lists directory contents, and cat outputs text files directly to standard output.",
        bodyHtml: `
          <p>
            Everything in Linux is structured as a tree originating from root <code>/</code>.
          </p>
          <p>
            <strong>pwd (Print Working Directory):</strong> Displays the absolute path of where your terminal shell currently is located.
          </p>
          <p>
            <strong>ls (List):</strong> Lists files and directories. Use <code>ls -la</code> to show detailed permissions, file sizes, and hidden dotfiles.
          </p>
          <p>
            <strong>cat (Concatenate):</strong> Dumps the entire contents of a file directly to your terminal.
          </p>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'mkdir and cd',
        duration: '1:15',
        seconds: 75,
        voiceText: "Creating and switching directories is done using mkdir and cd. You can create nested folders using mkdir -p and traverse back up using cd double dot.",
        bodyHtml: `
          <p>
            Let's organize application directories and move around the Linux directory tree.
          </p>
          <p>
            <code>mkdir projects</code> creates a new folder named 'projects'.
          </p>
          <p>
            <code>cd projects</code> navigates into that folder. To return to the parent directory, run <code>cd ..</code>.
          </p>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Redirecting output with >',
        duration: '1:30',
        seconds: 90,
        voiceText: "Standard output redirection allows writing command results directly to files. A single angle bracket overwrites the file, while a double angle bracket appends new lines.",
        bodyHtml: `
          <p>
            Linux commands output text streams. You can redirect output into files:
          </p>
          <p>
            <code>echo "Hello World" > message.txt</code> writes text to <code>message.txt</code> (overwrites existing content).
          </p>
          <p>
            <code>echo "Another line" >> message.txt</code> appends text to the end of the file.
          </p>
        `
      },
      6: {
        stepNum: 6,
        type: 'Task',
        title: 'Build your first Linux directory',
        duration: '2:00',
        seconds: 120,
        voiceText: "Hands-on task. In the terminal on the right, create a directory called workspace, navigate inside, and create a file called info.txt with your name.",
        bodyHtml: `
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #38bdf8; margin-bottom: 8px;">🛠️ Terminal Task Instructions</h4>
            <p style="margin-bottom: 10px;">Practice live on the terminal to complete this module step:</p>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>mkdir workspace</code> to create a directory.</li>
              <li>Navigate into it with <code>cd workspace</code>.</li>
              <li>Create a file with <code>echo "Linux DevOps" > info.txt</code>.</li>
              <li>Verify with <code>ls</code> and <code>cat info.txt</code>.</li>
            </ol>
          </div>
          <p class="text-secondary font-mono" style="font-size: 12px;">The environment will automatically validate your progress when commands execute.</p>
        `
      },
      7: {
        stepNum: 7,
        type: 'Quiz',
        title: 'Linux fundamentals quiz',
        duration: '1:00',
        seconds: 60,
        voiceText: "Time for a knowledge check! Answer the multiple choice question below to verify your understanding of Linux fundamentals.",
        bodyHtml: ``,
        quiz: {
          q: "Which command shows the full path of the current directory you are in?",
          options: [
            { text: "dir", correct: false, note: "dir is primarily a Windows/DOS command, though supported on some Linux shells." },
            { text: "pwd", correct: true, note: "Correct! pwd stands for 'Print Working Directory'." },
            { text: "cd", correct: false, note: "cd changes directories rather than printing the current path." },
            { text: "path", correct: false, note: "path is not a standard built-in path inspection command." }
          ]
        }
      },
      8: {
        stepNum: 8,
        type: 'Task',
        title: 'File permissions & inspection',
        duration: '2:15',
        seconds: 135,
        voiceText: "Inspect file permissions using the ls -la command, and examine the contents of deploy.sh using the cat command.",
        bodyHtml: `
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #38bdf8; margin-bottom: 8px;">🛠️ Permissions Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>ls -la</code> in your terminal.</li>
              <li>Notice the permission bits: <code>rwxr-xr-x</code>.</li>
              <li>Inspect <code>deploy.sh</code> with <code>cat deploy.sh</code>.</li>
            </ol>
          </div>
        `
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'Module 1 Knowledge Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Final quiz for Module 1. Test your knowledge on output redirection and distributions.",
        bodyHtml: ``,
        quiz: {
          q: "What does the operator '>>' do in a bash terminal?",
          options: [
            { text: "Overwrites the target file completely", correct: false, note: "A single '>' overwrites; double '>>' appends." },
            { text: "Appends stdout to the end of a file", correct: true, note: "Correct! '>>' safely appends data without deleting prior content." },
            { text: "Compares two files line by line", correct: false, note: "File comparison is performed using the 'diff' command." },
            { text: "Deletes the target file", correct: false, note: "File deletion is performed with 'rm'." }
          ]
        }
      }
    };

    let currentStep = 1;
    let completedSteps = new Set([1]); // Step 1 is marked done initially
    let quizzesDone = 0;
    let tasksDone = 0;
    let isPlayingVoice = false;
    let voiceCountdownInterval = null;
    let currentVoiceSeconds = 85;

    // Load progress from localStorage
    function loadSavedProgress() {
      const saved = localStorage.getItem('shaikhsir-linux-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed) completedSteps = new Set(parsed.completed);
          if (parsed.quizzesDone) quizzesDone = parsed.quizzesDone;
          if (parsed.tasksDone) tasksDone = parsed.tasksDone;
        } catch (e) {
          console.error(e);
        }
      }
    }

    function saveProgress() {
      localStorage.setItem('shaikhsir-linux-progress', JSON.stringify({
        completed: Array.from(completedSteps),
        quizzesDone,
        tasksDone
      }));
    }

    loadSavedProgress();

    function updateProgressMetrics() {
      const total = 9;
      const doneCount = completedSteps.size;
      const percentage = Math.round((doneCount / total) * 100);

      if (lessonProgressPercent) {
        lessonProgressPercent.textContent = `${percentage}%`;
      }

      if (lessonProgressArc) {
        // Circumference for r=42 is 2 * PI * 42 ≈ 263.89
        const circumference = 264;
        const offset = circumference - (percentage / 100) * circumference;
        lessonProgressArc.style.strokeDashoffset = offset;
      }

      if (statDoneCount) statDoneCount.textContent = `${doneCount}`;
      if (statQuizzesCount) statQuizzesCount.textContent = `${quizzesDone}/2`;
      if (statTasksCount) statTasksCount.textContent = `${tasksDone}/2`;

      // Update stepper item classes
      lessonStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-step'));
        if (completedSteps.has(stepNum)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }

        if (stepNum === currentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      saveProgress();
    }

    function renderLesson(stepIndex) {
      currentStep = stepIndex;
      const lesson = lessonsData[currentStep] || lessonsData[1];

      // Update Top bar & heading
      if (lessonStepCounter) lessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 9`;
      if (lessonHeading) lessonHeading.textContent = lesson.title;
      if (lessonTypePill) {
        lessonTypePill.textContent = lesson.type;
        lessonTypePill.className = `lesson-type-pill font-mono ${lesson.type.toLowerCase()}-pill`;
      }

      // Reset Voice audio player for this lesson
      stopVoiceAudio();
      currentVoiceSeconds = lesson.seconds;
      if (voiceTimer) voiceTimer.textContent = lesson.duration;
      if (voiceStatusText) voiceStatusText.textContent = "Explain this lesson";

      // Render Theory or Quiz
      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (lessonBodyContent) lessonBodyContent.style.display = 'none';
        if (lessonQuizContainer) {
          lessonQuizContainer.style.display = 'block';
          quizQuestionText.textContent = lesson.quiz.q;
          quizOptionsList.innerHTML = '';
          quizFeedbackBox.className = 'quiz-feedback-box font-mono';
          quizFeedbackBox.style.display = 'none';

          lesson.quiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn font-mono';
            btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green);">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
              // Grade answer
              const allBtns = quizOptionsList.querySelectorAll('.quiz-option-btn');
              allBtns.forEach(b => b.disabled = true);

              if (opt.correct) {
                btn.classList.add('correct');
                quizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                quizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                quizFeedbackBox.style.border = '1px solid var(--accent-green)';
                quizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;

                completedSteps.add(currentStep);
                quizzesDone = Math.min(2, quizzesDone + 1);
                updateProgressMetrics();
                showToast("Quiz passed! Progress updated.");
              } else {
                btn.classList.add('incorrect');
                quizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                quizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                quizFeedbackBox.style.border = '1px solid #ef4444';
                quizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
              }
            });
            quizOptionsList.appendChild(btn);
          });
        }
      } else {
        if (lessonQuizContainer) lessonQuizContainer.style.display = 'none';
        if (lessonBodyContent) {
          lessonBodyContent.style.display = 'block';
          lessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      // Update Prev / Next buttons
      if (btnLessonPrev) btnLessonPrev.disabled = (currentStep === 1);
      if (btnLessonNext) {
        btnLessonNext.textContent = (currentStep === 9) ? "Complete Skill ✓" : "Next →";
      }

      updateProgressMetrics();

      // Scroll theory container to top
      const scrollable = document.getElementById('lesson-theory-container');
      if (scrollable) scrollable.scrollTop = 0;
    }

    // Stepper Item Clicks
    lessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-step'));
        renderLesson(stepNum);
      });
    });

    // Prev / Next Button clicks
    if (btnLessonPrev) {
      btnLessonPrev.addEventListener('click', () => {
        if (currentStep > 1) {
          renderLesson(currentStep - 1);
        }
      });
    }

    if (btnLessonNext) {
      btnLessonNext.addEventListener('click', () => {
        // Mark current step completed
        completedSteps.add(currentStep);
        if (currentStep < 9) {
          renderLesson(currentStep + 1);
        } else {
          updateProgressMetrics();
          showToast("🎉 Congratulations! You have completed all lessons in this module!");
        }
      });
    }

    /* ==========================================================================
       VOICE AUDIO EXPLAINER PLAYER (Web Speech Synthesis + Visualizer)
       ========================================================================== */
    function formatTime(totalSecs) {
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startVoiceAudio() {
      const lesson = lessonsData[currentStep] || lessonsData[1];
      isPlayingVoice = true;
      btnVoicePlay.classList.add('playing');
      voiceIcon.className = 'fa-solid fa-pause voice-play-icon';
      voiceStatusText.textContent = "Playing explanation";

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lesson.voiceText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          stopVoiceAudio();
        };

        window.speechSynthesis.speak(utterance);
      }

      // Countdown interval
      clearInterval(voiceCountdownInterval);
      voiceCountdownInterval = setInterval(() => {
        if (currentVoiceSeconds > 0) {
          currentVoiceSeconds--;
          voiceTimer.textContent = formatTime(currentVoiceSeconds);
        } else {
          stopVoiceAudio();
        }
      }, 1000);
    }

    function stopVoiceAudio() {
      isPlayingVoice = false;
      clearInterval(voiceCountdownInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (btnVoicePlay) btnVoicePlay.classList.remove('playing');
      if (voiceIcon) voiceIcon.className = 'fa-solid fa-play voice-play-icon';
      if (voiceStatusText) voiceStatusText.textContent = "Explain this lesson";
    }

    if (btnVoicePlay) {
      btnVoicePlay.addEventListener('click', () => {
        if (isPlayingVoice) {
          stopVoiceAudio();
        } else {
          startVoiceAudio();
        }
      });
    }

    /* ==========================================================================
       TERMINAL & EDITOR TAB CONTROLS
       ========================================================================== */
    if (tabTerminalBtn && tabEditorBtn) {
      tabTerminalBtn.addEventListener('click', () => {
        tabTerminalBtn.classList.add('active');
        tabEditorBtn.classList.remove('active');
        if (editorActiveView) editorActiveView.style.display = 'none';
        if (terminalActiveView && terminalActiveView.getAttribute('data-started') === 'true') {
          terminalActiveView.style.display = 'flex';
        } else {
          if (terminalStandbyView) terminalStandbyView.style.display = 'flex';
        }
      });

      tabEditorBtn.addEventListener('click', () => {
        tabEditorBtn.classList.add('active');
        tabTerminalBtn.classList.remove('active');
        if (terminalStandbyView) terminalStandbyView.style.display = 'none';
        if (terminalActiveView) terminalActiveView.style.display = 'none';
        if (editorActiveView) editorActiveView.style.display = 'flex';
      });
    }

    // Start Live Lab button
    if (btnStartLiveLab) {
      btnStartLiveLab.addEventListener('click', () => {
        if (terminalStandbyView) terminalStandbyView.style.display = 'none';
        if (terminalActiveView) {
          terminalActiveView.style.display = 'flex';
          terminalActiveView.setAttribute('data-started', 'true');
        }
        if (terminalCliInput) terminalCliInput.focus();
        showToast("✓ Cloud sandbox initialized at /home/student");
      });
    }

    // Interactive Terminal CLI command executor
    let currentDir = "/home/student";
    let userFiles = ["README.md", ".bashrc", "deploy.sh"];

    function executeCliWorkspaceCommand() {
      if (!terminalCliInput || !terminalViewport) return;
      const rawCmd = terminalCliInput.value.trim();
      if (!rawCmd) return;

      // Echo command
      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `student@shaikhsir:${currentDir === '/home/student' ? '~' : currentDir}$ ${rawCmd}`;
      terminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();
      const parts = rawCmd.split(' ');

      if (lower === 'whoami') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'student';
      } else if (lower === 'pwd') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = currentDir;
      } else if (lower === 'hostname') {
        outLine.textContent = 'shaikhsir-cloud-sandbox';
      } else if (lower === 'uname' || lower === 'uname -a') {
        outLine.textContent = 'Linux shaikhsir-cloud-sandbox 6.8.0-40-generic #40-Ubuntu SMP x86_64 GNU/Linux';
      } else if (lower === 'ls' || lower === 'ls -la' || lower === 'ls -l') {
        outLine.textContent = userFiles.join('   ');
      } else if (parts[0] === 'mkdir' && parts[1]) {
        const newFolder = parts[1];
        if (!userFiles.includes(newFolder)) {
          userFiles.push(newFolder + '/');
        }
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = `Directory created: ${newFolder}`;

        if (currentStep === 6 && newFolder.toLowerCase() === 'workspace') {
          tasksDone = Math.min(2, tasksDone + 1);
          completedSteps.add(6);
          updateProgressMetrics();
          showToast("✓ Task Step 6 Verified!");
        }
      } else if (parts[0] === 'cd') {
        const target = parts[1] || '~';
        if (target === '..' || target === '../') {
          currentDir = '/home';
        } else if (target === '~' || target === '/home/student') {
          currentDir = '/home/student';
        } else {
          currentDir = `${currentDir}/${target}`;
        }
        outLine.textContent = '';
      } else if (parts[0] === 'cat' && parts[1]) {
        const file = parts[1];
        if (file.includes('deploy.sh')) {
          outLine.textContent = '#!/bin/bash\n# Production deployment script\necho "Deploying cluster..."\nexit 0';
        } else if (file.includes('info.txt')) {
          outLine.className = 'term-boot-line text-green';
          outLine.textContent = 'Linux DevOps Specialist - Certified';
        } else {
          outLine.textContent = '# Welcome to Shaikh Sir Linux sandbox workspace';
        }

        if (currentStep === 8) {
          tasksDone = Math.min(2, tasksDone + 1);
          completedSteps.add(8);
          updateProgressMetrics();
          showToast("✓ Task Step 8 Verified!");
        }
      } else if (rawCmd.includes('>') || rawCmd.includes('>>')) {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = '[Stream written to file successfully]';
        userFiles.push('info.txt');
      } else if (lower === 'clear') {
        terminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type commands below:</div>';
        terminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: whoami, uname -a, hostname, pwd, ls, ls -la, mkdir <dir>, cd <dir>, cat <file>, echo <text> > <file>, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${parts[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        terminalViewport.appendChild(outLine);
      }

      terminalCliInput.value = '';
      terminalViewport.scrollTop = terminalViewport.scrollHeight;
    }

    if (btnCliSubmit) {
      btnCliSubmit.addEventListener('click', executeCliWorkspaceCommand);
    }

    if (terminalCliInput) {
      terminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeCliWorkspaceCommand();
        }
      });
    }

    // Initial render
    renderLesson(1);
  }

  /* ==========================================================================
     16. PRO UPGRADE MODAL CONTROLS
     ========================================================================== */
  const proModalBackdrop = document.getElementById('pro-modal-backdrop');
  const btnCloseProModal = document.getElementById('btn-close-pro-modal');
  const proModalItemTitle = document.getElementById('pro-modal-item-title');
  const btnUnlockProConfirm = document.getElementById('btn-unlock-pro-confirm');

  window.openProModal = function (title) {
    if (window.isAdminLoggedIn && window.isAdminLoggedIn()) {
      showToast(`🔓 Admin: Accessing "${title || 'Topic'}"...`);
      const target = window.getLessonHrefForCurrentPage ? window.getLessonHrefForCurrentPage() : null;
      if (target) {
        setTimeout(() => { window.location.href = target; }, 350);
      }
      return;
    }
    if (proModalBackdrop) {
      if (proModalItemTitle && title) {
        proModalItemTitle.textContent = `Unlock ${title}`;
      }
      proModalBackdrop.style.display = 'flex';
    } else {
      showToast(`🔒 ${title || 'Topic'} is locked. Pro or AI tier required.`);
    }
  };

  if (btnCloseProModal) {
    btnCloseProModal.addEventListener('click', () => {
      if (proModalBackdrop) proModalBackdrop.style.display = 'none';
    });
  }

  if (proModalBackdrop) {
    proModalBackdrop.addEventListener('click', (e) => {
      if (e.target === proModalBackdrop) {
        proModalBackdrop.style.display = 'none';
      }
    });
  }

  if (btnUnlockProConfirm) {
    btnUnlockProConfirm.addEventListener('click', () => {
      showToast("🚀 Upgrading your session to Pro Tier...");
      setTimeout(() => {
        if (proModalBackdrop) proModalBackdrop.style.display = 'none';
        showToast("🎉 Pro access activated! All 21 topics unlocked.");
      }, 1000);
    });
  }
  // Legacy Section 17 disabled in favor of Section 27 4-column controller
  if (false) {

    const dockerLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What is Docker',
        duration: '1:25',
        seconds: 85,
        voiceText: "Welcome to Docker fundamentals. Docker packages applications with all dependencies into lightweight containers to ensure standard execution anywhere.",
        bodyHtml: `
          <p>
            <strong>Docker</strong> is an open-source containerization platform that packages your application code, runtime libraries, dependencies, and system tools into standardized units called <strong>containers</strong>.
          </p>
          <h3 class="lesson-subheading font-mono">Why Containers Matter</h3>
          <p>
            Containers guarantee that software behaves identically regardless of whether it runs on a macOS developer laptop, an Ubuntu staging server, or an AWS cloud Kubernetes cluster.
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">DOCKER CLI</div>
            <pre><code># Check Docker Engine status in your terminal
docker --version
docker info</code></pre>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Containers vs Virtual Machines',
        duration: '1:40',
        seconds: 100,
        voiceText: "Unlike Virtual Machines which require a full guest operating system and hypervisor, containers share the host Linux kernel, booting in milliseconds with negligible overhead.",
        bodyHtml: `
          <p>
            Traditional <strong>Virtual Machines (VMs)</strong> include the application, required libraries, and an entire guest operating system (several gigabytes), managed by a Hypervisor.
          </p>
          <p>
            <strong>Docker Containers</strong> share the host operating system kernel and isolate user processes via Linux <code>namespaces</code> (process isolation) and <code>cgroups</code> (CPU/memory resource limits).
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">BASH</div>
            <pre><code># Containers start in milliseconds and share host kernel
docker run hello-world</code></pre>
          </div>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'The Docker Engine Architecture',
        duration: '1:30',
        seconds: 90,
        voiceText: "The Docker Engine follows a client-server architecture. The Docker CLI talks via REST API to the background daemon dockerd, which manages images, containers, and networks.",
        bodyHtml: `
          <p>
            Docker operates on a client-server model:
          </p>
          <ul style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li><strong>Docker Client (CLI):</strong> The command-line tool (<code>docker</code>) users interact with.</li>
            <li><strong>Docker Daemon (dockerd):</strong> The background service listening for API requests to manage images, networks, and containers.</li>
            <li><strong>Docker Registries:</strong> Remote repositories like Docker Hub where container images are shared.</li>
          </ul>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'Running hello-world & nginx',
        duration: '1:45',
        seconds: 105,
        voiceText: "To start an application in Docker, use the docker run command. Adding the dash d flag runs it detached in the background, and dash p maps host ports to the container.",
        bodyHtml: `
          <p>
            Run an Nginx web server container in detached mode mapped to port 80:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">DOCKER RUN</div>
            <pre><code>docker run -d -p 80:80 --name my-web nginx:latest</code></pre>
          </div>
          <p>
            Docker will automatically pull the <code>nginx:latest</code> image from Docker Hub if not present locally, instantiate a container, and bind port 80.
          </p>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Listing & Inspecting Containers',
        duration: '1:35',
        seconds: 95,
        voiceText: "Use docker ps to view running containers, docker logs to inspect stdout and stderr streams, and docker stop to halt a container gracefully.",
        bodyHtml: `
          <p>
            Essential operational container inspection commands:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">COMMANDS</div>
            <pre><code># List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container output logs
docker logs my-web</code></pre>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Task',
        title: 'Deploy Nginx Web Server',
        duration: '2:00',
        seconds: 120,
        voiceText: "Hands-on task. Start your terminal sandbox, launch an Nginx web server mapped to port 80, and verify it with docker ps.",
        bodyHtml: `
          <div style="background: rgba(34, 229, 132, 0.08); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="margin-bottom: 8px;">🛠️ Container Deployment Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Click <strong>Start Container Engine</strong> in the right panel.</li>
              <li>Run <code>docker run -d -p 80:80 nginx</code> to deploy a background web server.</li>
              <li>Run <code>docker ps</code> to verify its active status.</li>
            </ol>
          </div>
          <p class="text-secondary font-mono" style="font-size: 12px;">The sandbox terminal will auto-grade and mark this task complete.</p>
        `
      },
      7: {
        stepNum: 7,
        type: 'Quiz',
        title: 'Docker Concepts Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Knowledge check. Answer the question below regarding container isolation and virtual machine architecture.",
        bodyHtml: ``,
        quiz: {
          q: "What is the primary architectural difference between Docker containers and Virtual Machines?",
          options: [
            { text: "Containers share the host OS kernel, while VMs run full guest OS instances", correct: true, note: "Correct! Containers leverage kernel namespaces and cgroups, making them fast and lightweight." },
            { text: "VMs are faster to boot than containers", correct: false, note: "VMs take minutes to boot full OS kernels, while containers boot in milliseconds." },
            { text: "Containers require dedicated hypervisors like VMware or Hyper-V", correct: false, note: "Hypervisors are used for hardware virtualization in VMs, not standard container engines." },
            { text: "Containers cannot expose network ports to the host machine", correct: false, note: "Containers expose network ports seamlessly with the -p flag." }
          ]
        }
      },
      8: {
        stepNum: 8,
        type: 'Task',
        title: 'Inspect & Stop Containers',
        duration: '2:15',
        seconds: 135,
        voiceText: "Hands-on task. Inspect images with docker images, and stop your running container using docker stop.",
        bodyHtml: `
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #38bdf8; margin-bottom: 8px;">🛠️ Container Lifecycle Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>docker images</code> to see downloaded repository tags.</li>
              <li>Run <code>docker stop a8f3b291c94b</code> (or <code>docker stop nginx</code>) to gracefully shut down the container.</li>
              <li>Verify container list with <code>docker ps</code>.</li>
            </ol>
          </div>
        `
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'Docker Engine Knowledge Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Final quiz for Docker Module 1. Test your knowledge of Dockerfiles and image definitions.",
        bodyHtml: ``,
        quiz: {
          q: "Which Dockerfile instruction defines the parent/base image for your container build?",
          options: [
            { text: "BASE", correct: false, note: "BASE is not a valid Dockerfile instruction." },
            { text: "FROM", correct: true, note: "Correct! Every valid Dockerfile begins with a FROM instruction (e.g. FROM node:20-alpine)." },
            { text: "IMPORT", correct: false, note: "IMPORT is used in programming languages, not Dockerfiles." },
            { text: "RUN", correct: false, note: "RUN executes build commands inside the container layer." }
          ]
        }
      }
    };

    let dockerCurrentStep = 1;
    let dockerCompletedSteps = new Set([1]);
    let dockerQuizzesDone = 0;
    let dockerTasksDone = 0;
    let dockerIsPlayingVoice = false;
    let dockerVoiceCountdownInterval = null;
    let dockerCurrentVoiceSeconds = 85;

    // Load saved Docker progress from localStorage
    function loadDockerSavedProgress() {
      const saved = localStorage.getItem('shaikhsir-docker-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed) dockerCompletedSteps = new Set(parsed.completed);
          if (parsed.quizzesDone) dockerQuizzesDone = parsed.quizzesDone;
          if (parsed.tasksDone) dockerTasksDone = parsed.tasksDone;
        } catch (e) {
          console.error(e);
        }
      }
    }

    function saveDockerProgress() {
      localStorage.setItem('shaikhsir-docker-progress', JSON.stringify({
        completed: Array.from(dockerCompletedSteps),
        quizzesDone: dockerQuizzesDone,
        tasksDone: dockerTasksDone
      }));
    }

    loadDockerSavedProgress();

    function updateDockerProgressMetrics() {
      const total = 9;
      const doneCount = dockerCompletedSteps.size;
      const percentage = Math.round((doneCount / total) * 100);

      if (dockerLessonProgressPercent) {
        dockerLessonProgressPercent.textContent = `${percentage}%`;
      }

      if (dockerLessonProgressArc) {
        const circumference = 264;
        const offset = circumference - (percentage / 100) * circumference;
        dockerLessonProgressArc.style.strokeDashoffset = offset;
      }

      if (dockerStatDoneCount) dockerStatDoneCount.textContent = `${doneCount}`;
      if (dockerStatQuizzesCount) dockerStatQuizzesCount.textContent = `${dockerQuizzesDone}/2`;
      if (dockerStatTasksCount) dockerStatTasksCount.textContent = `${dockerTasksDone}/2`;

      dockerLessonStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-docker-step'));
        if (dockerCompletedSteps.has(stepNum)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }

        if (stepNum === dockerCurrentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      saveDockerProgress();
    }

    function renderDockerLesson(stepIndex) {
      dockerCurrentStep = stepIndex;
      const lesson = dockerLessonsData[dockerCurrentStep] || dockerLessonsData[1];

      if (dockerLessonStepCounter) dockerLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 9`;
      if (dockerLessonHeading) dockerLessonHeading.textContent = lesson.title;
      if (dockerLessonTypePill) {
        dockerLessonTypePill.textContent = lesson.type;
        dockerLessonTypePill.className = `lesson-type-pill font-mono ${lesson.type.toLowerCase()}-pill`;
      }

      stopDockerVoiceAudio();
      dockerCurrentVoiceSeconds = lesson.seconds;
      if (dockerVoiceTimer) dockerVoiceTimer.textContent = lesson.duration;
      if (dockerVoiceStatusText) dockerVoiceStatusText.textContent = "Explain this lesson";

      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (dockerLessonBodyContent) dockerLessonBodyContent.style.display = 'none';
        if (dockerLessonQuizContainer) {
          dockerLessonQuizContainer.style.display = 'block';
          dockerQuizQuestionText.textContent = lesson.quiz.q;
          dockerQuizOptionsList.innerHTML = '';
          dockerQuizFeedbackBox.className = 'quiz-feedback-box font-mono';
          dockerQuizFeedbackBox.style.display = 'none';

          lesson.quiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn font-mono';
            btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green);">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
              const allBtns = dockerQuizOptionsList.querySelectorAll('.quiz-option-btn');
              allBtns.forEach(b => b.disabled = true);

              if (opt.correct) {
                btn.classList.add('correct');
                dockerQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                dockerQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                dockerQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                dockerQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;

                dockerCompletedSteps.add(dockerCurrentStep);
                dockerQuizzesDone = Math.min(2, dockerQuizzesDone + 1);
                updateDockerProgressMetrics();
                showToast("Docker quiz passed! Progress updated.");
              } else {
                btn.classList.add('incorrect');
                dockerQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                dockerQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                dockerQuizFeedbackBox.style.border = '1px solid #ef4444';
                dockerQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
              }
            });
            dockerQuizOptionsList.appendChild(btn);
          });
        }
      } else {
        if (dockerLessonQuizContainer) dockerLessonQuizContainer.style.display = 'none';
        if (dockerLessonBodyContent) {
          dockerLessonBodyContent.style.display = 'block';
          dockerLessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      if (dockerBtnLessonPrev) dockerBtnLessonPrev.disabled = (dockerCurrentStep === 1);
      if (dockerBtnLessonNext) {
        dockerBtnLessonNext.textContent = (dockerCurrentStep === 9) ? "Complete Skill ✓" : "Next →";
      }

      updateDockerProgressMetrics();

      const scrollable = document.getElementById('docker-lesson-theory-container');
      if (scrollable) scrollable.scrollTop = 0;
    }

    function formatTime(totalSecs) {
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startDockerVoiceAudio() {
      const lesson = dockerLessonsData[dockerCurrentStep] || dockerLessonsData[1];
      dockerIsPlayingVoice = true;
      if (dockerBtnVoicePlay) dockerBtnVoicePlay.classList.add('playing');
      if (dockerVoiceIcon) dockerVoiceIcon.className = 'fa-solid fa-pause voice-play-icon';
      if (dockerVoiceStatusText) dockerVoiceStatusText.textContent = "Playing explanation";

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lesson.voiceText);
        utterance.rate = 1.0;
        utterance.onend = () => stopDockerVoiceAudio();
        window.speechSynthesis.speak(utterance);
      }

      clearInterval(dockerVoiceCountdownInterval);
      dockerVoiceCountdownInterval = setInterval(() => {
        if (dockerCurrentVoiceSeconds > 0) {
          dockerCurrentVoiceSeconds--;
          if (dockerVoiceTimer) dockerVoiceTimer.textContent = formatTime(dockerCurrentVoiceSeconds);
        } else {
          stopDockerVoiceAudio();
        }
      }, 1000);
    }

    function stopDockerVoiceAudio() {
      dockerIsPlayingVoice = false;
      clearInterval(dockerVoiceCountdownInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (dockerBtnVoicePlay) dockerBtnVoicePlay.classList.remove('playing');
      if (dockerVoiceIcon) dockerVoiceIcon.className = 'fa-solid fa-play voice-play-icon';
      if (dockerVoiceStatusText) dockerVoiceStatusText.textContent = "Explain this lesson";
    }

    if (dockerBtnVoicePlay) {
      dockerBtnVoicePlay.addEventListener('click', () => {
        if (dockerIsPlayingVoice) {
          stopDockerVoiceAudio();
        } else {
          startDockerVoiceAudio();
        }
      });
    }

    dockerLessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-docker-step'));
        renderDockerLesson(stepNum);
      });
    });

    if (dockerBtnLessonPrev) {
      dockerBtnLessonPrev.addEventListener('click', () => {
        if (dockerCurrentStep > 1) renderDockerLesson(dockerCurrentStep - 1);
      });
    }

    if (dockerBtnLessonNext) {
      dockerBtnLessonNext.addEventListener('click', () => {
        dockerCompletedSteps.add(dockerCurrentStep);
        if (dockerCurrentStep < 9) {
          renderDockerLesson(dockerCurrentStep + 1);
        } else {
          updateDockerProgressMetrics();
          showToast("🎉 Congratulations! You have completed Docker Module 1!");
        }
      });
    }

    // Tabs toggle
    if (dockerTabTerminalBtn && dockerTabEditorBtn) {
      dockerTabTerminalBtn.addEventListener('click', () => {
        dockerTabTerminalBtn.classList.add('active');
        dockerTabEditorBtn.classList.remove('active');
        if (dockerEditorActiveView) dockerEditorActiveView.style.display = 'none';
        if (dockerTerminalActiveView && dockerTerminalActiveView.getAttribute('data-started') === 'true') {
          dockerTerminalActiveView.style.display = 'flex';
        } else {
          if (dockerTerminalStandbyView) dockerTerminalStandbyView.style.display = 'flex';
        }
      });

      dockerTabEditorBtn.addEventListener('click', () => {
        dockerTabEditorBtn.classList.add('active');
        dockerTabTerminalBtn.classList.remove('active');
        if (dockerTerminalStandbyView) dockerTerminalStandbyView.style.display = 'none';
        if (dockerTerminalActiveView) dockerTerminalActiveView.style.display = 'none';
        if (dockerEditorActiveView) dockerEditorActiveView.style.display = 'flex';
      });
    }

    if (dockerBtnStartLiveLab) {
      dockerBtnStartLiveLab.addEventListener('click', () => {
        if (dockerTerminalStandbyView) dockerTerminalStandbyView.style.display = 'none';
        if (dockerTerminalActiveView) {
          dockerTerminalActiveView.style.display = 'flex';
          dockerTerminalActiveView.setAttribute('data-started', 'true');
        }
        if (dockerTerminalCliInput) dockerTerminalCliInput.focus();
        showToast("✓ Docker Engine v26.1.3 sandbox ready.");
      });
    }

    let dockerRunningContainers = [];

    function executeDockerWorkspaceCommand() {
      if (!dockerTerminalCliInput || !dockerTerminalViewport) return;
      const rawCmd = dockerTerminalCliInput.value.trim();
      if (!rawCmd) return;

      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `student@docker-sandbox:~$ ${rawCmd}`;
      dockerTerminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();

      if (lower === 'docker --version' || lower === 'docker -v') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'Docker version 26.1.3, build b72afb3';
      } else if (lower.startsWith('docker run')) {
        outLine.className = 'term-boot-line text-green';
        const cid = 'a8f3b291c94b';
        dockerRunningContainers.push({ id: cid, image: 'nginx:latest', port: '0.0.0.0:80->80/tcp', name: 'myweb' });
        outLine.textContent = `Unable to find image 'nginx:latest' locally\nlatest: Pulling from library/nginx\nDigest: sha256:6db391d1c0cfb30588ba0bf2eeee9994da956f3b2bb6102a82159d866a306154\nStatus: Downloaded newer image for nginx:latest\n${cid}`;

        if (dockerCurrentStep === 6) {
          dockerTasksDone = Math.min(2, dockerTasksDone + 1);
          dockerCompletedSteps.add(6);
          updateDockerProgressMetrics();
          showToast("✓ Step 6 Task Verified: Nginx container running!");
        }
      } else if (lower === 'docker ps' || lower === 'docker ps -a') {
        if (dockerRunningContainers.length > 0) {
          outLine.textContent = 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                NAMES\n' +
            dockerRunningContainers.map(c => `${c.id}   ${c.image}   "/docker-entrypoint.…"   1 minute ago    Up 1 minute    ${c.port}   ${c.name}`).join('\n');
        } else {
          outLine.textContent = 'CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES\n(No active containers running. Use `docker run` to start one)';
        }
      } else if (lower === 'docker images') {
        outLine.textContent = 'REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\nnginx        latest    a6bd71f485c2   3 days ago     187MB\nubuntu       24.04     35a88802559e   2 weeks ago    77.8MB\nnode         20-alpine 8b824248d28e   1 month ago    174MB';
      } else if (lower.startsWith('docker stop')) {
        dockerRunningContainers = [];
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'a8f3b291c94b (Container stopped)';

        if (dockerCurrentStep === 8) {
          dockerTasksDone = Math.min(2, dockerTasksDone + 1);
          dockerCompletedSteps.add(8);
          updateDockerProgressMetrics();
          showToast("✓ Step 8 Task Verified: Container stopped!");
        }
      } else if (lower === 'clear') {
        dockerTerminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type docker commands below:</div>';
        dockerTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: docker --version, docker run -d -p 80:80 nginx, docker ps, docker images, docker stop <id>, ls, pwd, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${rawCmd.split(' ')[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        dockerTerminalViewport.appendChild(outLine);
      }

      dockerTerminalCliInput.value = '';
      dockerTerminalViewport.scrollTop = dockerTerminalViewport.scrollHeight;
    }

    if (dockerBtnCliSubmit) {
      dockerBtnCliSubmit.addEventListener('click', executeDockerWorkspaceCommand);
    }

    if (dockerTerminalCliInput) {
      dockerTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeDockerWorkspaceCommand();
      });
    }

    if (dockerLessonThemeToggle) {
      dockerLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderDockerLesson(1);
  }

  /* ==========================================================================
     18. KUBERNETES 3-COLUMN INTERACTIVE LESSON WORKSPACE CONTROLLER (lesson-kubernetes.html)
     ========================================================================== */
  const k8sLessonStepperItems = document.querySelectorAll('#k8s-sidebar-stepper-list .stepper-item');
  const k8sLessonStepCounter = document.getElementById('k8s-lesson-step-counter');
  const k8sLessonHeading = document.getElementById('k8s-lesson-heading');
  const k8sLessonTypePill = document.getElementById('k8s-lesson-type-pill');
  const k8sLessonBodyContent = document.getElementById('k8s-lesson-body-content');
  const k8sLessonQuizContainer = document.getElementById('k8s-lesson-quiz-container');
  const k8sQuizQuestionText = document.getElementById('k8s-quiz-question-text');
  const k8sQuizOptionsList = document.getElementById('k8s-quiz-options-list');
  const k8sQuizFeedbackBox = document.getElementById('k8s-quiz-feedback-box');
  const k8sBtnLessonPrev = document.getElementById('k8s-btn-lesson-prev');
  const k8sBtnLessonNext = document.getElementById('k8s-btn-lesson-next');

  const k8sBtnVoicePlay = document.getElementById('k8s-btn-voice-play');
  const k8sVoiceIcon = document.getElementById('k8s-voice-icon');
  const k8sVoiceStatusText = document.getElementById('k8s-voice-status-text');
  const k8sVoiceTimer = document.getElementById('k8s-voice-timer');

  const k8sLessonProgressPercent = document.getElementById('k8s-lesson-progress-percent');
  const k8sLessonProgressArc = document.getElementById('k8s-lesson-progress-arc');
  const k8sStatDoneCount = document.getElementById('k8s-stat-done-count');
  const k8sStatQuizzesCount = document.getElementById('k8s-stat-quizzes-count');
  const k8sStatTasksCount = document.getElementById('k8s-stat-tasks-count');

  const k8sTabTerminalBtn = document.getElementById('k8s-tab-terminal-btn');
  const k8sTabEditorBtn = document.getElementById('k8s-tab-editor-btn');
  const k8sTerminalStandbyView = document.getElementById('k8s-terminal-standby-view');
  const k8sTerminalActiveView = document.getElementById('k8s-terminal-active-view');
  const k8sEditorActiveView = document.getElementById('k8s-editor-active-view');
  const k8sBtnStartLiveLab = document.getElementById('k8s-btn-start-live-lab');
  const k8sTerminalViewport = document.getElementById('k8s-terminal-viewport');
  const k8sTerminalCliInput = document.getElementById('k8s-terminal-cli-input');
  const k8sBtnCliSubmit = document.getElementById('k8s-btn-cli-submit');
  const k8sLessonThemeToggle = document.getElementById('btn-k8s-lesson-theme-toggle');

  if (k8sLessonStepperItems.length > 0) {

    const k8sLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What is Kubernetes',
        duration: '1:30',
        seconds: 90,
        voiceText: "Welcome to Kubernetes. Kubernetes automates container deployment, scaling, healing, and network routing across clusters of machines.",
        bodyHtml: `
          <p>
            <strong>Kubernetes (k8s)</strong> is an open-source container orchestration engine that coordinates a cluster of nodes to run applications at production scale with high availability.
          </p>
          <h3 class="lesson-subheading font-mono">Core Value Propositions</h3>
          <p>
            Kubernetes handles self-healing containers, automatic bin-packing, service discovery, load balancing, secret management, and storage orchestration.
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">KUBECTL</div>
            <pre><code># Check cluster version and nodes
kubectl version --short
kubectl get nodes</code></pre>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Control Plane & Worker Nodes',
        duration: '1:45',
        seconds: 105,
        voiceText: "A Kubernetes cluster consists of the Control Plane which manages cluster state, and Worker Nodes that run container workloads with kubelet and containerd.",
        bodyHtml: `
          <p>
            A Kubernetes cluster splits into two primary tiers:
          </p>
          <ul style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li><strong>Control Plane:</strong> <code>kube-apiserver</code> (REST frontend), <code>etcd</code> (key-value cluster database), <code>kube-scheduler</code> (assigns pods to nodes), and <code>kube-controller-manager</code>.</li>
            <li><strong>Worker Nodes:</strong> <code>kubelet</code> (agent communicating with API server), <code>kube-proxy</code> (network rules), and container runtime (<code>containerd</code>).</li>
          </ul>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'Declarative Model & API Server',
        duration: '1:35',
        seconds: 95,
        voiceText: "Kubernetes uses a declarative model where you specify the desired state in YAML, and controllers continuously reconcile differences.",
        bodyHtml: `
          <p>
            Instead of running imperative scripts, Kubernetes users declare <em>desired state</em> in YAML manifests (e.g. "I want 3 replicas of Nginx"). The controller loop continuously works to match current cluster state to desired state.
          </p>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'Understanding Pods',
        duration: '1:40',
        seconds: 100,
        voiceText: "A Pod is the smallest deployable computing unit in Kubernetes. A pod encapsulates one or more containers sharing storage and network IP addresses.",
        bodyHtml: `
          <p>
            Containers are never deployed alone in Kubernetes — they live inside <strong>Pods</strong>. All containers inside a pod share:
          </p>
          <ul style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li>A single cluster IP address</li>
            <li>Shared storage volumes</li>
            <li>Localhost inter-process communication</li>
          </ul>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Navigating with kubectl',
        duration: '1:30',
        seconds: 90,
        voiceText: "kubectl is the command line utility used to communicate with the Kubernetes API server to inspect, deploy, and debug cluster resources.",
        bodyHtml: `
          <p>
            Standard everyday <code>kubectl</code> operations:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">COMMANDS</div>
            <pre><code># List cluster nodes
kubectl get nodes

# List all pods in default namespace
kubectl get pods -o wide

# Describe a specific pod
kubectl describe pod &lt;pod-name&gt;</code></pre>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Task',
        title: 'Inspect Cluster Nodes & Pods',
        duration: '2:00',
        seconds: 120,
        voiceText: "Hands-on task. Start your Kubernetes terminal session on the right, run kubectl get nodes, and inspect pods with kubectl get pods.",
        bodyHtml: `
          <div style="background: rgba(34, 229, 132, 0.08); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="margin-bottom: 8px;">🛠️ Cluster Inspection Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Click <strong>Start Kubernetes Session</strong> on the right panel.</li>
              <li>Run <code>kubectl get nodes</code> to verify all 3 cluster nodes are Ready.</li>
              <li>Run <code>kubectl get pods</code> to check active cluster workloads.</li>
            </ol>
          </div>
          <p class="text-secondary font-mono" style="font-size: 12px;">The sandbox terminal will auto-grade and mark this task complete.</p>
        `
      },
      7: {
        stepNum: 7,
        type: 'Quiz',
        title: 'Kubernetes Architecture Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Knowledge check. Answer the question below regarding control plane components and cluster architecture.",
        bodyHtml: ``,
        quiz: {
          q: "Which Kubernetes control plane component exposes the REST API and serves as the front door for all kubectl requests?",
          options: [
            { text: "kube-apiserver", correct: true, note: "Correct! kube-apiserver validates and configures data for the api objects which include pods, services, replicationcontrollers, and others." },
            { text: "etcd", correct: false, note: "etcd is the key-value store, not the REST API frontend." },
            { text: "kubelet", correct: false, note: "kubelet is the node-level agent on worker nodes." },
            { text: "kube-proxy", correct: false, note: "kube-proxy handles network routing rules on nodes." }
          ]
        }
      },
      8: {
        stepNum: 8,
        type: 'Task',
        title: 'Deploy Nginx on Cluster',
        duration: '2:15',
        seconds: 135,
        voiceText: "Hands-on task. Create an Nginx deployment on your Kubernetes cluster using kubectl create deployment web --image=nginx, and verify pods with kubectl get pods.",
        bodyHtml: `
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #38bdf8; margin-bottom: 8px;">🛠️ Workload Deployment Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>kubectl create deployment web --image=nginx</code> in the terminal.</li>
              <li>Inspect created pods with <code>kubectl get pods</code>.</li>
              <li>Examine cluster services with <code>kubectl get svc</code>.</li>
            </ol>
          </div>
        `
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'Kubernetes Objects Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Final quiz for Kubernetes Module 1. Test your understanding of pods and compute primitives.",
        bodyHtml: ``,
        quiz: {
          q: "What is the smallest deployable computing unit in Kubernetes?",
          options: [
            { text: "Container", correct: false, note: "While containers run your code, Kubernetes wraps them inside Pods." },
            { text: "Pod", correct: true, note: "Correct! A Pod encapsulates one or more containers, shared storage, and an IP address." },
            { text: "Node", correct: false, note: "A Node is a physical or virtual machine in the cluster." },
            { text: "Deployment", correct: false, note: "A Deployment is a controller that manages sets of Pods." }
          ]
        }
      }
    };

    let k8sCurrentStep = 1;
    let k8sCompletedSteps = new Set([1]);
    let k8sQuizzesDone = 0;
    let k8sTasksDone = 0;
    let k8sIsPlayingVoice = false;
    let k8sVoiceCountdownInterval = null;
    let k8sCurrentVoiceSeconds = 90;

    function loadK8sSavedProgress() {
      const saved = localStorage.getItem('shaikhsir-k8s-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed) k8sCompletedSteps = new Set(parsed.completed);
          if (parsed.quizzesDone) k8sQuizzesDone = parsed.quizzesDone;
          if (parsed.tasksDone) k8sTasksDone = parsed.tasksDone;
        } catch (e) {
          console.error(e);
        }
      }
    }

    function saveK8sProgress() {
      localStorage.setItem('shaikhsir-k8s-progress', JSON.stringify({
        completed: Array.from(k8sCompletedSteps),
        quizzesDone: k8sQuizzesDone,
        tasksDone: k8sTasksDone
      }));
    }

    loadK8sSavedProgress();

    function updateK8sProgressMetrics() {
      const total = 9;
      const doneCount = k8sCompletedSteps.size;
      const percentage = Math.round((doneCount / total) * 100);

      if (k8sLessonProgressPercent) {
        k8sLessonProgressPercent.textContent = `${percentage}%`;
      }

      if (k8sLessonProgressArc) {
        const circumference = 264;
        const offset = circumference - (percentage / 100) * circumference;
        k8sLessonProgressArc.style.strokeDashoffset = offset;
      }

      if (k8sStatDoneCount) k8sStatDoneCount.textContent = `${doneCount}`;
      if (k8sStatQuizzesCount) k8sStatQuizzesCount.textContent = `${k8sQuizzesDone}/2`;
      if (k8sStatTasksCount) k8sStatTasksCount.textContent = `${k8sTasksDone}/2`;

      k8sLessonStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-k8s-step'));
        if (k8sCompletedSteps.has(stepNum)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }

        if (stepNum === k8sCurrentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      saveK8sProgress();
    }

    function renderK8sLesson(stepIndex) {
      k8sCurrentStep = stepIndex;
      const lesson = k8sLessonsData[k8sCurrentStep] || k8sLessonsData[1];

      if (k8sLessonStepCounter) k8sLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 9`;
      if (k8sLessonHeading) k8sLessonHeading.textContent = lesson.title;
      if (k8sLessonTypePill) {
        k8sLessonTypePill.textContent = lesson.type;
        k8sLessonTypePill.className = `lesson-type-pill font-mono ${lesson.type.toLowerCase()}-pill`;
      }

      stopK8sVoiceAudio();
      k8sCurrentVoiceSeconds = lesson.seconds;
      if (k8sVoiceTimer) k8sVoiceTimer.textContent = lesson.duration;
      if (k8sVoiceStatusText) k8sVoiceStatusText.textContent = "Explain this lesson";

      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (k8sLessonBodyContent) k8sLessonBodyContent.style.display = 'none';
        if (k8sLessonQuizContainer) {
          k8sLessonQuizContainer.style.display = 'block';
          k8sQuizQuestionText.textContent = lesson.quiz.q;
          k8sQuizOptionsList.innerHTML = '';
          k8sQuizFeedbackBox.className = 'quiz-feedback-box font-mono';
          k8sQuizFeedbackBox.style.display = 'none';

          lesson.quiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn font-mono';
            btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green);">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
              const allBtns = k8sQuizOptionsList.querySelectorAll('.quiz-option-btn');
              allBtns.forEach(b => b.disabled = true);

              if (opt.correct) {
                btn.classList.add('correct');
                k8sQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                k8sQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                k8sQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                k8sQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;

                k8sCompletedSteps.add(k8sCurrentStep);
                k8sQuizzesDone = Math.min(2, k8sQuizzesDone + 1);
                updateK8sProgressMetrics();
                showToast("Kubernetes quiz passed! Progress updated.");
              } else {
                btn.classList.add('incorrect');
                k8sQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                k8sQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                k8sQuizFeedbackBox.style.border = '1px solid #ef4444';
                k8sQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
              }
            });
            k8sQuizOptionsList.appendChild(btn);
          });
        }
      } else {
        if (k8sLessonQuizContainer) k8sLessonQuizContainer.style.display = 'none';
        if (k8sLessonBodyContent) {
          k8sLessonBodyContent.style.display = 'block';
          k8sLessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      if (k8sBtnLessonPrev) k8sBtnLessonPrev.disabled = (k8sCurrentStep === 1);
      if (k8sBtnLessonNext) {
        k8sBtnLessonNext.textContent = (k8sCurrentStep === 9) ? "Complete Skill ✓" : "Next →";
      }

      updateK8sProgressMetrics();

      const scrollable = document.getElementById('k8s-lesson-theory-container');
      if (scrollable) scrollable.scrollTop = 0;
    }

    function formatTime(totalSecs) {
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startK8sVoiceAudio() {
      const lesson = k8sLessonsData[k8sCurrentStep] || k8sLessonsData[1];
      k8sIsPlayingVoice = true;
      if (k8sBtnVoicePlay) k8sBtnVoicePlay.classList.add('playing');
      if (k8sVoiceIcon) k8sVoiceIcon.className = 'fa-solid fa-pause voice-play-icon';
      if (k8sVoiceStatusText) k8sVoiceStatusText.textContent = "Playing explanation";

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lesson.voiceText);
        utterance.rate = 1.0;
        utterance.onend = () => stopK8sVoiceAudio();
        window.speechSynthesis.speak(utterance);
      }

      clearInterval(k8sVoiceCountdownInterval);
      k8sVoiceCountdownInterval = setInterval(() => {
        if (k8sCurrentVoiceSeconds > 0) {
          k8sCurrentVoiceSeconds--;
          if (k8sVoiceTimer) k8sVoiceTimer.textContent = formatTime(k8sCurrentVoiceSeconds);
        } else {
          stopK8sVoiceAudio();
        }
      }, 1000);
    }

    function stopK8sVoiceAudio() {
      k8sIsPlayingVoice = false;
      clearInterval(k8sVoiceCountdownInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (k8sBtnVoicePlay) k8sBtnVoicePlay.classList.remove('playing');
      if (k8sVoiceIcon) k8sVoiceIcon.className = 'fa-solid fa-play voice-play-icon';
      if (k8sVoiceStatusText) k8sVoiceStatusText.textContent = "Explain this lesson";
    }

    if (k8sBtnVoicePlay) {
      k8sBtnVoicePlay.addEventListener('click', () => {
        if (k8sIsPlayingVoice) {
          stopK8sVoiceAudio();
        } else {
          startK8sVoiceAudio();
        }
      });
    }

    k8sLessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-k8s-step'));
        renderK8sLesson(stepNum);
      });
    });

    if (k8sBtnLessonPrev) {
      k8sBtnLessonPrev.addEventListener('click', () => {
        if (k8sCurrentStep > 1) renderK8sLesson(k8sCurrentStep - 1);
      });
    }

    if (k8sBtnLessonNext) {
      k8sBtnLessonNext.addEventListener('click', () => {
        k8sCompletedSteps.add(k8sCurrentStep);
        if (k8sCurrentStep < 9) {
          renderK8sLesson(k8sCurrentStep + 1);
        } else {
          updateK8sProgressMetrics();
          showToast("🎉 Congratulations! You have completed Kubernetes Module 1!");
        }
      });
    }

    // Tabs toggle
    if (k8sTabTerminalBtn && k8sTabEditorBtn) {
      k8sTabTerminalBtn.addEventListener('click', () => {
        k8sTabTerminalBtn.classList.add('active');
        k8sTabEditorBtn.classList.remove('active');
        if (k8sEditorActiveView) k8sEditorActiveView.style.display = 'none';
        if (k8sTerminalActiveView && k8sTerminalActiveView.getAttribute('data-started') === 'true') {
          k8sTerminalActiveView.style.display = 'flex';
        } else {
          if (k8sTerminalStandbyView) k8sTerminalStandbyView.style.display = 'flex';
        }
      });

      k8sTabEditorBtn.addEventListener('click', () => {
        k8sTabEditorBtn.classList.add('active');
        k8sTabTerminalBtn.classList.remove('active');
        if (k8sTerminalStandbyView) k8sTerminalStandbyView.style.display = 'none';
        if (k8sTerminalActiveView) k8sTerminalActiveView.style.display = 'none';
        if (k8sEditorActiveView) k8sEditorActiveView.style.display = 'flex';
      });
    }

    if (k8sBtnStartLiveLab) {
      k8sBtnStartLiveLab.addEventListener('click', () => {
        if (k8sTerminalStandbyView) k8sTerminalStandbyView.style.display = 'none';
        if (k8sTerminalActiveView) {
          k8sTerminalActiveView.style.display = 'flex';
          k8sTerminalActiveView.setAttribute('data-started', 'true');
        }
        if (k8sTerminalCliInput) k8sTerminalCliInput.focus();
        showToast("✓ Kubernetes Cluster v1.30 control plane ready.");
      });
    }

    let k8sDeployments = [];

    function executeK8sWorkspaceCommand() {
      if (!k8sTerminalCliInput || !k8sTerminalViewport) return;
      const rawCmd = k8sTerminalCliInput.value.trim();
      if (!rawCmd) return;

      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `student@k8s-master:~$ ${rawCmd}`;
      k8sTerminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();

      if (lower === 'kubectl version' || lower === 'kubectl version --short' || lower === 'kubectl version --client') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'Client Version: v1.30.2\nServer Version: v1.30.2';
      } else if (lower === 'kubectl get nodes' || lower === 'kubectl get node' || lower === 'kubectl get nodes -o wide') {
        outLine.className = 'term-boot-line font-mono text-green';
        outLine.textContent = 'NAME           STATUS   ROLES           AGE   VERSION\nk8s-master-1   Ready    control-plane   12d   v1.30.2\nk8s-worker-1   Ready    <none>          12d   v1.30.2\nk8s-worker-2   Ready    <none>          12d   v1.30.2';

        if (k8sCurrentStep === 6) {
          k8sTasksDone = Math.min(2, k8sTasksDone + 1);
          k8sCompletedSteps.add(6);
          updateK8sProgressMetrics();
          showToast("✓ Step 6 Task Verified: Cluster nodes inspected!");
        }
      } else if (lower.startsWith('kubectl create deployment') || lower.startsWith('kubectl apply')) {
        outLine.className = 'term-boot-line text-green';
        k8sDeployments.push('web');
        outLine.textContent = 'deployment.apps/web created';

        if (k8sCurrentStep === 8) {
          k8sTasksDone = Math.min(2, k8sTasksDone + 1);
          k8sCompletedSteps.add(8);
          updateK8sProgressMetrics();
          showToast("✓ Step 8 Task Verified: Deployment created!");
        }
      } else if (lower === 'kubectl get pods' || lower === 'kubectl get pod' || lower === 'kubectl get po') {
        outLine.className = 'term-boot-line font-mono';
        if (k8sDeployments.includes('web')) {
          outLine.textContent = 'NAME                   READY   STATUS    RESTARTS   AGE\nweb-7548b6c498-8xqw2   1/1     Running   0          45s\nweb-7548b6c498-v9k2p   1/1     Running   0          45s\nweb-7548b6c498-zlm5t   1/1     Running   0          45s';
        } else {
          outLine.textContent = 'NAME                     READY   STATUS    RESTARTS   AGE\ncoredns-7db6d8ff4d-2x9zp 1/1     Running   0          12d\ncoredns-7db6d8ff4d-wpm4q 1/1     Running   0          12d';
        }
      } else if (lower === 'kubectl get svc' || lower === 'kubectl get services') {
        outLine.className = 'term-boot-line font-mono';
        outLine.textContent = 'NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE\nkubernetes   ClusterIP   10.96.0.1    <none>        443/TCP        12d\nweb-svc      NodePort    10.96.48.22  <none>        80:30080/TCP   2m';
      } else if (lower.startsWith('kubectl describe')) {
        outLine.textContent = 'Name:             web-7548b6c498-8xqw2\nNamespace:        default\nNode:             k8s-worker-1/192.168.1.102\nStatus:           Running\nIP:               10.244.1.15\nControlled By:    ReplicaSet/web-7548b6c498\nContainers:\n  nginx:\n    Image:          nginx:1.25\n    State:          Running';
      } else if (lower === 'clear') {
        k8sTerminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type kubectl commands below:</div>';
        k8sTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: kubectl get nodes, kubectl get pods, kubectl create deployment web --image=nginx, kubectl get svc, kubectl describe pod, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${rawCmd.split(' ')[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        k8sTerminalViewport.appendChild(outLine);
      }

      k8sTerminalCliInput.value = '';
      k8sTerminalViewport.scrollTop = k8sTerminalViewport.scrollHeight;
    }

    if (k8sBtnCliSubmit) {
      k8sBtnCliSubmit.addEventListener('click', executeK8sWorkspaceCommand);
    }

    if (k8sTerminalCliInput) {
      k8sTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeK8sWorkspaceCommand();
      });
    }

    if (k8sLessonThemeToggle) {
      k8sLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderK8sLesson(1);
  }

  /* ==========================================================================
     19. TERRAFORM 3-COLUMN INTERACTIVE LESSON WORKSPACE CONTROLLER (lesson-terraform.html)
     ========================================================================== */
  const tfLessonStepperItems = document.querySelectorAll('#tf-sidebar-stepper-list .stepper-item');
  const tfLessonStepCounter = document.getElementById('tf-lesson-step-counter');
  const tfLessonHeading = document.getElementById('tf-lesson-heading');
  const tfLessonTypePill = document.getElementById('tf-lesson-type-pill');
  const tfLessonBodyContent = document.getElementById('tf-lesson-body-content');
  const tfLessonQuizContainer = document.getElementById('tf-lesson-quiz-container');
  const tfQuizQuestionText = document.getElementById('tf-quiz-question-text');
  const tfQuizOptionsList = document.getElementById('tf-quiz-options-list');
  const tfQuizFeedbackBox = document.getElementById('tf-quiz-feedback-box');
  const tfBtnLessonPrev = document.getElementById('tf-btn-lesson-prev');
  const tfBtnLessonNext = document.getElementById('tf-btn-lesson-next');

  const tfBtnVoicePlay = document.getElementById('tf-btn-voice-play');
  const tfVoiceIcon = document.getElementById('tf-voice-icon');
  const tfVoiceStatusText = document.getElementById('tf-voice-status-text');
  const tfVoiceTimer = document.getElementById('tf-voice-timer');

  const tfLessonProgressPercent = document.getElementById('tf-lesson-progress-percent');
  const tfLessonProgressArc = document.getElementById('tf-lesson-progress-arc');
  const tfStatDoneCount = document.getElementById('tf-stat-done-count');
  const tfStatQuizzesCount = document.getElementById('tf-stat-quizzes-count');
  const tfStatTasksCount = document.getElementById('tf-stat-tasks-count');

  const tfTabTerminalBtn = document.getElementById('tf-tab-terminal-btn');
  const tfTabEditorBtn = document.getElementById('tf-tab-editor-btn');
  const tfTerminalStandbyView = document.getElementById('tf-terminal-standby-view');
  const tfTerminalActiveView = document.getElementById('tf-terminal-active-view');
  const tfEditorActiveView = document.getElementById('tf-editor-active-view');
  const tfBtnStartLiveLab = document.getElementById('tf-btn-start-live-lab');
  const tfTerminalViewport = document.getElementById('tf-terminal-viewport');
  const tfTerminalCliInput = document.getElementById('tf-terminal-cli-input');
  const tfBtnCliSubmit = document.getElementById('tf-btn-cli-submit');
  const tfLessonThemeToggle = document.getElementById('btn-tf-lesson-theme-toggle');

  if (tfLessonStepperItems.length > 0) {

    const tfLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What is Infrastructure as Code',
        duration: '1:25',
        seconds: 85,
        voiceText: "Welcome to Terraform. Terraform allows you to define cloud infrastructure declaratively in code, making architecture reproducible, version controlled, and safe.",
        bodyHtml: `
          <p>
            <strong>Terraform</strong> by HashiCorp is an open-source Infrastructure as Code (IaC) tool. It codifies cloud APIs into declarative configuration files, enabling multi-cloud automation.
          </p>
          <h3 class="lesson-subheading font-mono">Declarative vs Imperative</h3>
          <p>
            With imperative tools (like bash scripts or AWS CLI), you tell the machine <em>how</em> to execute every step. With Terraform, you declare the <em>desired target state</em>, and Terraform figures out the delta automatically.
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">CLI</div>
            <pre><code># Check local terraform version
terraform version
terraform -help</code></pre>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'The Core Terraform Workflow',
        duration: '1:30',
        seconds: 90,
        voiceText: "The standard Terraform workflow follows four simple phases: Write configuration, Init providers, Plan execution graph, and Apply changes.",
        bodyHtml: `
          <p>
            Every Terraform engineer practices the <strong>Core Workflow</strong>:
          </p>
          <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li><code>terraform init</code>: Initializes plugins and remote state backend.</li>
            <li><code>terraform validate</code>: Checks syntax and attribute correctness.</li>
            <li><code>terraform plan</code>: Previews exact cloud additions, modifications, and deletions.</li>
            <li><code>terraform apply</code>: Executes the plan against cloud APIs.</li>
          </ol>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'Configuring AWS Providers',
        duration: '1:35',
        seconds: 95,
        voiceText: "Providers are plugins that translate Terraform resource declarations into cloud API calls. In AWS, you configure region and credential scopes.",
        bodyHtml: `
          <p>
            Providers act as translation bridges between HCL definitions and vendor APIs:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">HCL</div>
            <pre><code>terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}</code></pre>
          </div>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'Declaring Your First Resource',
        duration: '1:40',
        seconds: 100,
        voiceText: "Resources are the core building blocks in Terraform. A resource block specifies the resource type, local label, and configuration arguments.",
        bodyHtml: `
          <p>
            Syntax structure of a Terraform resource block:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">HCL</div>
            <pre><code>resource "aws_s3_bucket" "app_storage" {
  bucket = "shaikhsir-production-assets"

  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}</code></pre>
          </div>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Understanding State & Plans',
        duration: '1:30',
        seconds: 90,
        voiceText: "Terraform state acts as the single source of truth mapping your code to real cloud resources, enabling diff calculations and metadata tracking.",
        bodyHtml: `
          <p>
            Terraform records information about what real infrastructure it has created in <code>terraform.tfstate</code>. This state file is used by <code>terraform plan</code> to calculate exact differences between code and reality.
          </p>
        `
      },
      6: {
        stepNum: 6,
        type: 'Task',
        title: 'Initialize & Plan Infrastructure',
        duration: '2:00',
        seconds: 120,
        voiceText: "Hands-on task. Start your Terraform engine on the right panel, run terraform init to download AWS providers, and run terraform plan to inspect changes.",
        bodyHtml: `
          <div style="background: rgba(34, 229, 132, 0.08); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="margin-bottom: 8px;">🛠️ Terraform Init & Plan Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Click <strong>Start Terraform Engine</strong> on the right panel.</li>
              <li>Run <code>terraform init</code> to install AWS provider plugins.</li>
              <li>Run <code>terraform plan</code> to preview infrastructure generation.</li>
            </ol>
          </div>
          <p class="text-secondary font-mono" style="font-size: 12px;">The sandbox terminal will auto-grade and mark this task complete.</p>
        `
      },
      7: {
        stepNum: 7,
        type: 'Quiz',
        title: 'Terraform Workflow Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Knowledge check. Answer the question below regarding provider initialization.",
        bodyHtml: ``,
        quiz: {
          q: "Which command prepares your working directory by downloading required provider plugins and configuring the backend?",
          options: [
            { text: "terraform init", correct: true, note: "Correct! terraform init initializes working directories and downloads provider plugins." },
            { text: "terraform plan", correct: false, note: "terraform plan generates execution plans, but requires init first." },
            { text: "terraform validate", correct: false, note: "terraform validate only checks syntax." },
            { text: "terraform refresh", correct: false, note: "terraform refresh updates local state against real cloud resources." }
          ]
        }
      },
      8: {
        stepNum: 8,
        type: 'Task',
        title: 'Provision AWS S3 Storage',
        duration: '2:15',
        seconds: 135,
        voiceText: "Hands-on task. Execute terraform apply -auto-approve to provision your AWS S3 bucket on LocalStack, then verify with terraform state list.",
        bodyHtml: `
          <div style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #c084fc; margin-bottom: 8px;">🛠️ Provisioning Cloud Storage Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>terraform apply -auto-approve</code> in the terminal.</li>
              <li>Inspect state resources with <code>terraform state list</code>.</li>
            </ol>
          </div>
        `
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'State File Architecture Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Final quiz for Terraform Module 1. Test your understanding of state management and cloud backends.",
        bodyHtml: ``,
        quiz: {
          q: "What is the primary role of the terraform.tfstate file?",
          options: [
            { text: "It maps declared code resources to real-world cloud infrastructure IDs", correct: true, note: "Correct! State stores mappings, resource attributes, and dependency metadata." },
            { text: "It stores AWS root password credentials", correct: false, note: "Never store credentials in state files." },
            { text: "It compiles HCL to binary executables", correct: false, note: "Terraform is interpreted, not compiled into binaries." },
            { text: "It replaces Git version control", correct: false, note: "State manages resource mapping, not source code versioning." }
          ]
        }
      }
    };

    let tfCurrentStep = 1;
    let tfCompletedSteps = new Set([1]);
    let tfQuizzesDone = 0;
    let tfTasksDone = 0;
    let tfIsPlayingVoice = false;
    let tfVoiceCountdownInterval = null;
    let tfCurrentVoiceSeconds = 85;

    function loadTfSavedProgress() {
      const saved = localStorage.getItem('shaikhsir-tf-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed) tfCompletedSteps = new Set(parsed.completed);
          if (parsed.quizzesDone) tfQuizzesDone = parsed.quizzesDone;
          if (parsed.tasksDone) tfTasksDone = parsed.tasksDone;
        } catch (e) {
          console.error(e);
        }
      }
    }

    function saveTfProgress() {
      localStorage.setItem('shaikhsir-tf-progress', JSON.stringify({
        completed: Array.from(tfCompletedSteps),
        quizzesDone: tfQuizzesDone,
        tasksDone: tfTasksDone
      }));
    }

    loadTfSavedProgress();

    function updateTfProgressMetrics() {
      const total = 9;
      const doneCount = tfCompletedSteps.size;
      const percentage = Math.round((doneCount / total) * 100);

      if (tfLessonProgressPercent) {
        tfLessonProgressPercent.textContent = `${percentage}%`;
      }

      if (tfLessonProgressArc) {
        const circumference = 264;
        const offset = circumference - (percentage / 100) * circumference;
        tfLessonProgressArc.style.strokeDashoffset = offset;
      }

      if (tfStatDoneCount) tfStatDoneCount.textContent = `${doneCount}`;
      if (tfStatQuizzesCount) tfStatQuizzesCount.textContent = `${tfQuizzesDone}/2`;
      if (tfStatTasksCount) tfStatTasksCount.textContent = `${tfTasksDone}/2`;

      tfLessonStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-tf-step'));
        if (tfCompletedSteps.has(stepNum)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }

        if (stepNum === tfCurrentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      saveTfProgress();
    }

    function renderTfLesson(stepIndex) {
      tfCurrentStep = stepIndex;
      const lesson = tfLessonsData[tfCurrentStep] || tfLessonsData[1];

      if (tfLessonStepCounter) tfLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 9`;
      if (tfLessonHeading) tfLessonHeading.textContent = lesson.title;
      if (tfLessonTypePill) {
        tfLessonTypePill.textContent = lesson.type;
        tfLessonTypePill.className = `lesson-type-pill font-mono ${lesson.type.toLowerCase()}-pill`;
      }

      stopTfVoiceAudio();
      tfCurrentVoiceSeconds = lesson.seconds;
      if (tfVoiceTimer) tfVoiceTimer.textContent = lesson.duration;
      if (tfVoiceStatusText) tfVoiceStatusText.textContent = "Explain this lesson";

      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (tfLessonBodyContent) tfLessonBodyContent.style.display = 'none';
        if (tfLessonQuizContainer) {
          tfLessonQuizContainer.style.display = 'block';
          tfQuizQuestionText.textContent = lesson.quiz.q;
          tfQuizOptionsList.innerHTML = '';
          tfQuizFeedbackBox.className = 'quiz-feedback-box font-mono';
          tfQuizFeedbackBox.style.display = 'none';

          lesson.quiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn font-mono';
            btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green);">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
              const allBtns = tfQuizOptionsList.querySelectorAll('.quiz-option-btn');
              allBtns.forEach(b => b.disabled = true);

              if (opt.correct) {
                btn.classList.add('correct');
                tfQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                tfQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                tfQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                tfQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;

                tfCompletedSteps.add(tfCurrentStep);
                tfQuizzesDone = Math.min(2, tfQuizzesDone + 1);
                updateTfProgressMetrics();
                showToast("Terraform quiz passed! Progress updated.");
              } else {
                btn.classList.add('incorrect');
                tfQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                tfQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                tfQuizFeedbackBox.style.border = '1px solid #ef4444';
                tfQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
              }
            });
            tfQuizOptionsList.appendChild(btn);
          });
        }
      } else {
        if (tfLessonQuizContainer) tfLessonQuizContainer.style.display = 'none';
        if (tfLessonBodyContent) {
          tfLessonBodyContent.style.display = 'block';
          tfLessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      if (tfBtnLessonPrev) tfBtnLessonPrev.disabled = (tfCurrentStep === 1);
      if (tfBtnLessonNext) {
        tfBtnLessonNext.textContent = (tfCurrentStep === 9) ? "Complete Skill ✓" : "Next →";
      }

      updateTfProgressMetrics();

      const scrollable = document.getElementById('tf-lesson-theory-container');
      if (scrollable) scrollable.scrollTop = 0;
    }

    function formatTime(totalSecs) {
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startTfVoiceAudio() {
      const lesson = tfLessonsData[tfCurrentStep] || tfLessonsData[1];
      tfIsPlayingVoice = true;
      if (tfBtnVoicePlay) tfBtnVoicePlay.classList.add('playing');
      if (tfVoiceIcon) tfVoiceIcon.className = 'fa-solid fa-pause voice-play-icon';
      if (tfVoiceStatusText) tfVoiceStatusText.textContent = "Playing explanation";

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lesson.voiceText);
        utterance.rate = 1.0;
        utterance.onend = () => stopTfVoiceAudio();
        window.speechSynthesis.speak(utterance);
      }

      clearInterval(tfVoiceCountdownInterval);
      tfVoiceCountdownInterval = setInterval(() => {
        if (tfCurrentVoiceSeconds > 0) {
          tfCurrentVoiceSeconds--;
          if (tfVoiceTimer) tfVoiceTimer.textContent = formatTime(tfCurrentVoiceSeconds);
        } else {
          stopTfVoiceAudio();
        }
      }, 1000);
    }

    function stopTfVoiceAudio() {
      tfIsPlayingVoice = false;
      clearInterval(tfVoiceCountdownInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (tfBtnVoicePlay) tfBtnVoicePlay.classList.remove('playing');
      if (tfVoiceIcon) tfVoiceIcon.className = 'fa-solid fa-play voice-play-icon';
      if (tfVoiceStatusText) tfVoiceStatusText.textContent = "Explain this lesson";
    }

    if (tfBtnVoicePlay) {
      tfBtnVoicePlay.addEventListener('click', () => {
        if (tfIsPlayingVoice) {
          stopTfVoiceAudio();
        } else {
          startTfVoiceAudio();
        }
      });
    }

    tfLessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-tf-step'));
        renderTfLesson(stepNum);
      });
    });

    if (tfBtnLessonPrev) {
      tfBtnLessonPrev.addEventListener('click', () => {
        if (tfCurrentStep > 1) renderTfLesson(tfCurrentStep - 1);
      });
    }

    if (tfBtnLessonNext) {
      tfBtnLessonNext.addEventListener('click', () => {
        tfCompletedSteps.add(tfCurrentStep);
        if (tfCurrentStep < 9) {
          renderTfLesson(tfCurrentStep + 1);
        } else {
          updateTfProgressMetrics();
          showToast("🎉 Congratulations! You have completed Terraform Module 1!");
        }
      });
    }

    // Tabs toggle
    if (tfTabTerminalBtn && tfTabEditorBtn) {
      tfTabTerminalBtn.addEventListener('click', () => {
        tfTabTerminalBtn.classList.add('active');
        tfTabEditorBtn.classList.remove('active');
        if (tfEditorActiveView) tfEditorActiveView.style.display = 'none';
        if (tfTerminalActiveView && tfTerminalActiveView.getAttribute('data-started') === 'true') {
          tfTerminalActiveView.style.display = 'flex';
        } else {
          if (tfTerminalStandbyView) tfTerminalStandbyView.style.display = 'flex';
        }
      });

      tfTabEditorBtn.addEventListener('click', () => {
        tfTabEditorBtn.classList.add('active');
        tfTabTerminalBtn.classList.remove('active');
        if (tfTerminalStandbyView) tfTerminalStandbyView.style.display = 'none';
        if (tfTerminalActiveView) tfTerminalActiveView.style.display = 'none';
        if (tfEditorActiveView) tfEditorActiveView.style.display = 'flex';
      });
    }

    if (tfBtnStartLiveLab) {
      tfBtnStartLiveLab.addEventListener('click', () => {
        if (tfTerminalStandbyView) tfTerminalStandbyView.style.display = 'none';
        if (tfTerminalActiveView) {
          tfTerminalActiveView.style.display = 'flex';
          tfTerminalActiveView.setAttribute('data-started', 'true');
        }
        if (tfTerminalCliInput) tfTerminalCliInput.focus();
        showToast("✓ Terraform LocalStack engine initialized.");
      });
    }

    let tfResourcesApplied = false;

    function executeTfWorkspaceCommand() {
      if (!tfTerminalCliInput || !tfTerminalViewport) return;
      const rawCmd = tfTerminalCliInput.value.trim();
      if (!rawCmd) return;

      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `student@tf-workspace:~$ ${rawCmd}`;
      tfTerminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();

      if (lower === 'terraform version' || lower === 'terraform -v' || lower === 'terraform --version') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'Terraform v1.8.5\non linux_amd64\n+ provider registry.terraform.io/hashicorp/aws v5.50.0';
      } else if (lower === 'terraform init' || lower === 'terraform init -upgrade') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'Initializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching "~> 5.0"...\n- Installing hashicorp/aws v5.50.0...\n- Installed hashicorp/aws v5.50.0 (signed by HashiCorp)\n\nTerraform has been successfully initialized!';

        if (tfCurrentStep === 6) {
          tfTasksDone = Math.min(2, tfTasksDone + 1);
          tfCompletedSteps.add(6);
          updateTfProgressMetrics();
          showToast("✓ Step 6 Task Verified: Terraform initialized!");
        }
      } else if (lower === 'terraform plan') {
        outLine.className = 'term-boot-line font-mono';
        outLine.textContent = 'Terraform used the selected providers to generate the following execution plan:\n\n  # aws_s3_bucket.app_storage will be created\n  + resource "aws_s3_bucket" "app_storage" {\n      + arn                         = (known after apply)\n      + bucket                      = "shaikhsir-production-assets"\n      + id                          = (known after apply)\n      + region                      = "us-east-1"\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.';
      } else if (lower.startsWith('terraform apply')) {
        outLine.className = 'term-boot-line text-green font-mono';
        tfResourcesApplied = true;
        outLine.textContent = 'aws_s3_bucket.app_storage: Creating...\naws_s3_bucket.app_storage: Creation complete after 1s [id=shaikhsir-production-assets]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\n\nOutputs:\nbucket_arn = "arn:aws:s3:::shaikhsir-production-assets"';

        if (tfCurrentStep === 8) {
          tfTasksDone = Math.min(2, tfTasksDone + 1);
          tfCompletedSteps.add(8);
          updateTfProgressMetrics();
          showToast("✓ Step 8 Task Verified: S3 Bucket provisioned!");
        }
      } else if (lower === 'terraform state list') {
        outLine.className = 'term-boot-line font-mono';
        if (tfResourcesApplied) {
          outLine.textContent = 'aws_s3_bucket.app_storage';
        } else {
          outLine.textContent = 'No state file found. Run terraform apply first.';
        }
      } else if (lower === 'terraform validate') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'Success! The configuration is valid.';
      } else if (lower === 'terraform fmt') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'main.tf';
      } else if (lower === 'clear') {
        tfTerminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type terraform commands below:</div>';
        tfTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: terraform version, terraform init, terraform plan, terraform apply, terraform state list, terraform validate, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${rawCmd.split(' ')[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        tfTerminalViewport.appendChild(outLine);
      }

      tfTerminalCliInput.value = '';
      tfTerminalViewport.scrollTop = tfTerminalViewport.scrollHeight;
    }

    if (tfBtnCliSubmit) {
      tfBtnCliSubmit.addEventListener('click', executeTfWorkspaceCommand);
    }

    if (tfTerminalCliInput) {
      tfTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeTfWorkspaceCommand();
      });
    }

    if (tfLessonThemeToggle) {
      tfLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderTfLesson(1);
  }

  /* ==========================================================================
     20. DEVOPS FUNDAMENTALS 3-COLUMN INTERACTIVE LESSON WORKSPACE CONTROLLER (lesson-devops-fundamentals.html)
     ========================================================================== */
  const devopsLessonStepperItems = document.querySelectorAll('#devops-sidebar-stepper-list .stepper-item');
  const devopsLessonStepCounter = document.getElementById('devops-lesson-step-counter');
  const devopsLessonHeading = document.getElementById('devops-lesson-heading');
  const devopsLessonTypePill = document.getElementById('devops-lesson-type-pill');
  const devopsLessonBodyContent = document.getElementById('devops-lesson-body-content');
  const devopsLessonQuizContainer = document.getElementById('devops-lesson-quiz-container');
  const devopsQuizQuestionText = document.getElementById('devops-quiz-question-text');
  const devopsQuizOptionsList = document.getElementById('devops-quiz-options-list');
  const devopsQuizFeedbackBox = document.getElementById('devops-quiz-feedback-box');
  const devopsBtnLessonPrev = document.getElementById('devops-btn-lesson-prev');
  const devopsBtnLessonNext = document.getElementById('devops-btn-lesson-next');

  const devopsBtnVoicePlay = document.getElementById('devops-btn-voice-play');
  const devopsVoiceIcon = document.getElementById('devops-voice-icon');
  const devopsVoiceStatusText = document.getElementById('devops-voice-status-text');
  const devopsVoiceTimer = document.getElementById('devops-voice-timer');

  const devopsLessonProgressPercent = document.getElementById('devops-lesson-progress-percent');
  const devopsLessonProgressArc = document.getElementById('devops-lesson-progress-arc');
  const devopsStatDoneCount = document.getElementById('devops-stat-done-count');
  const devopsStatQuizzesCount = document.getElementById('devops-stat-quizzes-count');
  const devopsStatTasksCount = document.getElementById('devops-stat-tasks-count');

  const devopsTabTerminalBtn = document.getElementById('devops-tab-terminal-btn');
  const devopsTabEditorBtn = document.getElementById('devops-tab-editor-btn');
  const devopsTerminalStandbyView = document.getElementById('devops-terminal-standby-view');
  const devopsTerminalActiveView = document.getElementById('devops-terminal-active-view');
  const devopsEditorActiveView = document.getElementById('devops-editor-active-view');
  const devopsBtnStartLiveLab = document.getElementById('devops-btn-start-live-lab');
  const devopsTerminalViewport = document.getElementById('devops-terminal-viewport');
  const devopsTerminalCliInput = document.getElementById('devops-terminal-cli-input');
  const devopsBtnCliSubmit = document.getElementById('devops-btn-cli-submit');
  const devopsLessonThemeToggle = document.getElementById('btn-devops-lesson-theme-toggle');

  if (devopsLessonStepperItems.length > 0) {

    const devopsLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'The DevOps Philosophy',
        duration: '1:20',
        seconds: 80,
        voiceText: "Welcome to DevOps Fundamentals. DevOps unites software development and IT operations to deliver faster releases, automated quality, and reliable systems.",
        bodyHtml: `
          <p>
            <strong>DevOps</strong> is a cultural movement, set of practices, and toolchains designed to eliminate friction between software engineering (Dev) and IT operations (Ops).
          </p>
          <h3 class="lesson-subheading font-mono">Why DevOps Transformed Tech</h3>
          <p>
            Traditional waterfall cycles took months to deploy monolithic software. DevOps enables elite high-performing teams to deploy changes multiple times per day with rapid recovery times and low change failure rates.
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">CLI</div>
            <pre><code># Check current Git workspace status
git status
npm test</code></pre>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'The CAMS Framework',
        duration: '1:30',
        seconds: 90,
        voiceText: "The CAMS framework outlines the four foundational pillars of DevOps: Culture, Automation, Measurement, and Sharing.",
        bodyHtml: `
          <p>
            Coined by Damon Edwards and John Willis, <strong>C.A.M.S.</strong> represents the 4 core pillars:
          </p>
          <ul style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li><strong>Culture:</strong> Shared accountability, empathy, and blameless collaboration.</li>
            <li><strong>Automation:</strong> Automating builds, unit tests, infrastructure, and releases.</li>
            <li><strong>Measurement:</strong> Tracking DORA metrics, system telemetry, and application health.</li>
            <li><strong>Sharing:</strong> Open communication, transparent feedback loops, and shared toolchains.</li>
          </ul>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'The Three Ways of DevOps',
        duration: '1:35',
        seconds: 95,
        voiceText: "The Phoenix Project defines the Three Ways: Flow from left to right, Fast Feedback loops from right to left, and Continual Learning and Experimentation.",
        bodyHtml: `
          <p>
            Introduced in <em>The DevOps Handbook</em>:
          </p>
          <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #d1d5db;">
            <li><strong>The First Way (Flow):</strong> Accelerate the flow of work from Development to Operations to Customers.</li>
            <li><strong>The Second Way (Feedback):</strong> Create fast, amplified feedback loops to identify and fix issues immediately.</li>
            <li><strong>The Third Way (Continual Learning):</strong> Foster a high-trust culture of experimentation, learning from failure, and mastery.</li>
          </ol>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'Breaking Down Silos',
        duration: '1:25',
        seconds: 85,
        voiceText: "Organizational silos create delays and conflicting priorities. DevOps encourages cross-functional teams where developers understand infrastructure and operators understand code.",
        bodyHtml: `
          <p>
            When developers are only responsible for code and sysadmins are only responsible for uptime, finger-pointing occurs when outages happen.
          </p>
          <p>
            DevOps adopts the Amazon principle: <strong>"You build it, you run it."</strong> Developers gain visibility into production telemetry, while operators embed automation into early development pipelines.
          </p>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Continuous Feedback Loops',
        duration: '1:30',
        seconds: 90,
        voiceText: "Feedback loops allow engineers to detect defects early in development rather than finding them during major production incidents.",
        bodyHtml: `
          <p>
            Every code commit triggers an automated pipeline executing linting, unit tests, security scans, and build validation. If a test fails, the engineer is alerted within seconds.
          </p>
        `
      },
      6: {
        stepNum: 6,
        type: 'Task',
        title: 'Inspect Git Repo & Status',
        duration: '2:00',
        seconds: 120,
        voiceText: "Hands-on task. Click Start DevOps Runner on the right, run git status to check staged files, and inspect repo logs.",
        bodyHtml: `
          <div style="background: rgba(34, 229, 132, 0.08); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="margin-bottom: 8px;">🛠️ Git & Repository Inspection Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Click <strong>Start DevOps Runner</strong> on the right panel.</li>
              <li>Run <code>git status</code> to view active changes.</li>
              <li>Run <code>npm test</code> to execute local test suites.</li>
            </ol>
          </div>
          <p class="text-secondary font-mono" style="font-size: 12px;">The sandbox terminal will auto-grade and mark this task complete.</p>
        `
      },
      7: {
        stepNum: 7,
        type: 'Quiz',
        title: 'DevOps Culture Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Knowledge check. Answer the question below regarding DevOps culture and core incentives.",
        bodyHtml: ``,
        quiz: {
          q: "What is the primary cultural objective of the DevOps movement?",
          options: [
            { text: "Shared responsibility and collaboration across Development and Operations", correct: true, note: "Correct! DevOps bridges Dev and Ops with shared ownership of delivery and reliability." },
            { text: "Eliminating the need for all testing and QA engineers", correct: false, note: "DevOps automates testing, but quality assurance remains critical." },
            { text: "Forcing all developers to manage physical server hardware", correct: false, note: "Modern cloud abstractions and IaC handle physical infrastructure." },
            { text: "Writing slower monolithic codebases", correct: false, note: "DevOps advocates for fast, iterative, modular releases." }
          ]
        }
      },
      8: {
        stepNum: 8,
        type: 'Task',
        title: 'Run Automated Pipeline Build',
        duration: '2:15',
        seconds: 135,
        voiceText: "Hands-on task. Trigger your automated CI/CD pipeline using pipeline trigger, then verify application health endpoint.",
        bodyHtml: `
          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 class="font-mono text-accent" style="color: #38bdf8; margin-bottom: 8px;">🛠️ Automated Pipeline Execution Task</h4>
            <ol style="padding-left: 20px; font-size: 13px; line-height: 1.8; color: #e2e8f0;">
              <li>Run <code>pipeline trigger</code> in the terminal.</li>
              <li>Verify HTTP status with <code>curl -I localhost:8080/health</code>.</li>
            </ol>
          </div>
        `
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'CAMS Framework Check',
        duration: '1:15',
        seconds: 75,
        voiceText: "Final quiz for DevOps Fundamentals Module 1. Test your understanding of the CAMS pillars.",
        bodyHtml: ``,
        quiz: {
          q: "In the CAMS framework (Culture, Automation, Measurement, Sharing), what is the focus of 'Measurement'?",
          options: [
            { text: "Tracking system telemetry, error rates, and DORA deployment metrics", correct: true, note: "Correct! Measurement provides data-driven feedback on performance and reliability." },
            { text: "Counting lines of code written per engineer", correct: false, note: "Lines of code is an anti-metric that discourages clean architecture." },
            { text: "Measuring how long servers have stayed on without rebooting", correct: false, note: "Uptime alone is not indicative of delivery velocity or user happiness." },
            { text: "Limiting team communication to weekly emails", correct: false, note: "Sharing emphasizes open, real-time collaboration." }
          ]
        }
      }
    };

    let devopsCurrentStep = 1;
    let devopsCompletedSteps = new Set([1]);
    let devopsQuizzesDone = 0;
    let devopsTasksDone = 0;
    let devopsIsPlayingVoice = false;
    let devopsVoiceCountdownInterval = null;
    let devopsCurrentVoiceSeconds = 80;

    function loadDevopsSavedProgress() {
      const saved = localStorage.getItem('shaikhsir-devops-progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.completed) devopsCompletedSteps = new Set(parsed.completed);
          if (parsed.quizzesDone) devopsQuizzesDone = parsed.quizzesDone;
          if (parsed.tasksDone) devopsTasksDone = parsed.tasksDone;
        } catch (e) {
          console.error(e);
        }
      }
    }

    function saveDevopsProgress() {
      localStorage.setItem('shaikhsir-devops-progress', JSON.stringify({
        completed: Array.from(devopsCompletedSteps),
        quizzesDone: devopsQuizzesDone,
        tasksDone: devopsTasksDone
      }));
    }

    loadDevopsSavedProgress();

    function updateDevopsProgressMetrics() {
      const total = 9;
      const doneCount = devopsCompletedSteps.size;
      const percentage = Math.round((doneCount / total) * 100);

      if (devopsLessonProgressPercent) {
        devopsLessonProgressPercent.textContent = `${percentage}%`;
      }

      if (devopsLessonProgressArc) {
        const circumference = 264;
        const offset = circumference - (percentage / 100) * circumference;
        devopsLessonProgressArc.style.strokeDashoffset = offset;
      }

      if (devopsStatDoneCount) devopsStatDoneCount.textContent = `${doneCount}`;
      if (devopsStatQuizzesCount) devopsStatQuizzesCount.textContent = `${devopsQuizzesDone}/2`;
      if (devopsStatTasksCount) devopsStatTasksCount.textContent = `${devopsTasksDone}/2`;

      devopsLessonStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-devops-step'));
        if (devopsCompletedSteps.has(stepNum)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }

        if (stepNum === devopsCurrentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      saveDevopsProgress();
    }

    function renderDevopsLesson(stepIndex) {
      devopsCurrentStep = stepIndex;
      const lesson = devopsLessonsData[devopsCurrentStep] || devopsLessonsData[1];

      if (devopsLessonStepCounter) devopsLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 9`;
      if (devopsLessonHeading) devopsLessonHeading.textContent = lesson.title;
      if (devopsLessonTypePill) {
        devopsLessonTypePill.textContent = lesson.type;
        devopsLessonTypePill.className = `lesson-type-pill font-mono ${lesson.type.toLowerCase()}-pill`;
      }

      stopDevopsVoiceAudio();
      devopsCurrentVoiceSeconds = lesson.seconds;
      if (devopsVoiceTimer) devopsVoiceTimer.textContent = lesson.duration;
      if (devopsVoiceStatusText) devopsVoiceStatusText.textContent = "Explain this lesson";

      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (devopsLessonBodyContent) devopsLessonBodyContent.style.display = 'none';
        if (devopsLessonQuizContainer) {
          devopsLessonQuizContainer.style.display = 'block';
          devopsQuizQuestionText.textContent = lesson.quiz.q;
          devopsQuizOptionsList.innerHTML = '';
          devopsQuizFeedbackBox.className = 'quiz-feedback-box font-mono';
          devopsQuizFeedbackBox.style.display = 'none';

          lesson.quiz.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn font-mono';
            btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green);">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
              const allBtns = devopsQuizOptionsList.querySelectorAll('.quiz-option-btn');
              allBtns.forEach(b => b.disabled = true);

              if (opt.correct) {
                btn.classList.add('correct');
                devopsQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                devopsQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                devopsQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                devopsQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;

                devopsCompletedSteps.add(devopsCurrentStep);
                devopsQuizzesDone = Math.min(2, devopsQuizzesDone + 1);
                updateDevopsProgressMetrics();
                showToast("DevOps quiz passed! Progress updated.");
              } else {
                btn.classList.add('incorrect');
                devopsQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                devopsQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                devopsQuizFeedbackBox.style.border = '1px solid #ef4444';
                devopsQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
              }
            });
            devopsQuizOptionsList.appendChild(btn);
          });
        }
      } else {
        if (devopsLessonQuizContainer) devopsLessonQuizContainer.style.display = 'none';
        if (devopsLessonBodyContent) {
          devopsLessonBodyContent.style.display = 'block';
          devopsLessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      if (devopsBtnLessonPrev) devopsBtnLessonPrev.disabled = (devopsCurrentStep === 1);
      if (devopsBtnLessonNext) {
        devopsBtnLessonNext.textContent = (devopsCurrentStep === 9) ? "Complete Skill ✓" : "Next →";
      }

      updateDevopsProgressMetrics();

      const scrollable = document.getElementById('devops-lesson-theory-container');
      if (scrollable) scrollable.scrollTop = 0;
    }

    function formatTime(totalSecs) {
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startDevopsVoiceAudio() {
      const lesson = devopsLessonsData[devopsCurrentStep] || devopsLessonsData[1];
      devopsIsPlayingVoice = true;
      if (devopsBtnVoicePlay) devopsBtnVoicePlay.classList.add('playing');
      if (devopsVoiceIcon) devopsVoiceIcon.className = 'fa-solid fa-pause voice-play-icon';
      if (devopsVoiceStatusText) devopsVoiceStatusText.textContent = "Playing explanation";

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lesson.voiceText);
        utterance.rate = 1.0;
        utterance.onend = () => stopDevopsVoiceAudio();
        window.speechSynthesis.speak(utterance);
      }

      clearInterval(devopsVoiceCountdownInterval);
      devopsVoiceCountdownInterval = setInterval(() => {
        if (devopsCurrentVoiceSeconds > 0) {
          devopsCurrentVoiceSeconds--;
          if (devopsVoiceTimer) devopsVoiceTimer.textContent = formatTime(devopsCurrentVoiceSeconds);
        } else {
          stopDevopsVoiceAudio();
        }
      }, 1000);
    }

    function stopDevopsVoiceAudio() {
      devopsIsPlayingVoice = false;
      clearInterval(devopsVoiceCountdownInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (devopsBtnVoicePlay) devopsBtnVoicePlay.classList.remove('playing');
      if (devopsVoiceIcon) devopsVoiceIcon.className = 'fa-solid fa-play voice-play-icon';
      if (devopsVoiceStatusText) devopsVoiceStatusText.textContent = "Explain this lesson";
    }

    if (devopsBtnVoicePlay) {
      devopsBtnVoicePlay.addEventListener('click', () => {
        if (devopsIsPlayingVoice) {
          stopDevopsVoiceAudio();
        } else {
          startDevopsVoiceAudio();
        }
      });
    }

    devopsLessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-devops-step'));
        renderDevopsLesson(stepNum);
      });
    });

    if (devopsBtnLessonPrev) {
      devopsBtnLessonPrev.addEventListener('click', () => {
        if (devopsCurrentStep > 1) renderDevopsLesson(devopsCurrentStep - 1);
      });
    }

    if (devopsBtnLessonNext) {
      devopsBtnLessonNext.addEventListener('click', () => {
        devopsCompletedSteps.add(devopsCurrentStep);
        if (devopsCurrentStep < 9) {
          renderDevopsLesson(devopsCurrentStep + 1);
        } else {
          updateDevopsProgressMetrics();
          showToast("🎉 Congratulations! You have completed DevOps Fundamentals Module 1!");
        }
      });
    }

    // Tabs toggle
    if (devopsTabTerminalBtn && devopsTabEditorBtn) {
      devopsTabTerminalBtn.addEventListener('click', () => {
        devopsTabTerminalBtn.classList.add('active');
        devopsTabEditorBtn.classList.remove('active');
        if (devopsEditorActiveView) devopsEditorActiveView.style.display = 'none';
        if (devopsTerminalActiveView && devopsTerminalActiveView.getAttribute('data-started') === 'true') {
          devopsTerminalActiveView.style.display = 'flex';
        } else {
          if (devopsTerminalStandbyView) devopsTerminalStandbyView.style.display = 'flex';
        }
      });

      devopsTabEditorBtn.addEventListener('click', () => {
        devopsTabEditorBtn.classList.add('active');
        devopsTabTerminalBtn.classList.remove('active');
        if (devopsTerminalStandbyView) devopsTerminalStandbyView.style.display = 'none';
        if (devopsTerminalActiveView) devopsTerminalActiveView.style.display = 'none';
        if (devopsEditorActiveView) devopsEditorActiveView.style.display = 'flex';
      });
    }

    if (devopsBtnStartLiveLab) {
      devopsBtnStartLiveLab.addEventListener('click', () => {
        if (devopsTerminalStandbyView) devopsTerminalStandbyView.style.display = 'none';
        if (devopsTerminalActiveView) {
          devopsTerminalActiveView.style.display = 'flex';
          devopsTerminalActiveView.setAttribute('data-started', 'true');
        }
        if (devopsTerminalCliInput) devopsTerminalCliInput.focus();
        showToast("✓ DevOps CI/CD Runner initialized.");
      });
    }

    function executeDevopsWorkspaceCommand() {
      if (!devopsTerminalCliInput || !devopsTerminalViewport) return;
      const rawCmd = devopsTerminalCliInput.value.trim();
      if (!rawCmd) return;

      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `engineer@devops-runner:~$ ${rawCmd}`;
      devopsTerminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();

      if (lower === 'git status') {
        outLine.className = 'term-boot-line text-green';
        outLine.textContent = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:\n\tmodified:   pipeline.yml\n\tmodified:   src/server.js';

        if (devopsCurrentStep === 6) {
          devopsTasksDone = Math.min(2, devopsTasksDone + 1);
          devopsCompletedSteps.add(6);
          updateDevopsProgressMetrics();
          showToast("✓ Step 6 Task Verified: Git status inspected!");
        }
      } else if (lower === 'npm test' || lower === 'npm run test' || lower === 'yarn test') {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = 'PASS src/api.test.js (1.4s)\n  ✓ GET /health (12ms)\n  ✓ POST /auth/login (48ms)\n  ✓ GET /metrics (8ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        1.82s\nRan all test suites.';
      } else if (lower.startsWith('pipeline trigger') || lower.startsWith('pipeline run') || lower.startsWith('pipeline start')) {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = '[CI Pipeline #412]\n  ✓ Stage 1: Checkout Git Repository (0.4s)\n  ✓ Stage 2: Lint & Static Code Analysis (1.1s)\n  ✓ Stage 3: Run Unit Tests (1.8s)\n  ✓ Stage 4: Build Container Image (4.2s)\n  ✓ Stage 5: Deploy to Staging (3.0s)\nPipeline Status: SUCCESS';

        if (devopsCurrentStep === 8) {
          devopsTasksDone = Math.min(2, devopsTasksDone + 1);
          devopsCompletedSteps.add(8);
          updateDevopsProgressMetrics();
          showToast("✓ Step 8 Task Verified: Pipeline triggered!");
        }
      } else if (lower.startsWith('curl') && lower.includes('health')) {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"healthy","uptime":"14h 22m","version":"2.4.0"}';
      } else if (lower === 'clear') {
        devopsTerminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type DevOps commands below:</div>';
        devopsTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: git status, npm test, pipeline trigger, curl -I localhost:8080/health, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${rawCmd.split(' ')[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        devopsTerminalViewport.appendChild(outLine);
      }

      devopsTerminalCliInput.value = '';
      devopsTerminalViewport.scrollTop = devopsTerminalViewport.scrollHeight;
    }

    if (devopsBtnCliSubmit) {
      devopsBtnCliSubmit.addEventListener('click', executeDevopsWorkspaceCommand);
    }

    if (devopsTerminalCliInput) {
      devopsTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeDevopsWorkspaceCommand();
      });
    }

    if (devopsLessonThemeToggle) {
      devopsLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderDevopsLesson(1);
  }

  /* ==========================================================================
     22. CERTIFICATE ACCORDION HANDLER (skill-networking.html)
     ========================================================================== */
  const certReqBox = document.getElementById('cert-req-box');
  const certDetailsPanel = document.getElementById('cert-details-panel');

  if (certReqBox && certDetailsPanel) {
    certReqBox.addEventListener('click', () => {
      certReqBox.classList.toggle('active');
      const isVisible = certDetailsPanel.style.display === 'block';
      certDetailsPanel.style.display = isVisible ? 'none' : 'block';
    });
  }

  /* ==========================================================================
     23. NETWORKING 4-COLUMN INTERACTIVE LESSON CONTROLLER (lesson-networking.html)
     ========================================================================== */
  const netLessonStepperItems = document.querySelectorAll('#net-sidebar-stepper-list .stepper-item');
  const netLessonStepCounter = document.getElementById('net-lesson-step-counter');
  const netLessonHeading = document.getElementById('net-lesson-heading');
  const netLessonTypePill = document.getElementById('net-lesson-type-pill');
  const netLessonBodyContent = document.getElementById('net-lesson-body-content');
  const netLessonQuizContainer = document.getElementById('net-lesson-quiz-container');
  const netQuizQuestionText = document.getElementById('net-quiz-question-text');
  const netQuizOptionsList = document.getElementById('net-quiz-options-list');
  const netQuizFeedbackBox = document.getElementById('net-quiz-feedback-box');
  const netBtnLessonPrev = document.getElementById('net-btn-lesson-prev');
  const netBtnLessonNext = document.getElementById('net-btn-lesson-next');

  const netBtnVoicePlay = document.getElementById('net-btn-voice-play');
  const netVoiceIcon = document.getElementById('net-voice-icon');
  const netVoiceStatusText = document.getElementById('net-voice-status-text');
  const netVoiceTimer = document.getElementById('net-voice-timer');

  const netLessonProgressPercent = document.getElementById('net-lesson-progress-percent');
  const netLessonProgressArc = document.getElementById('net-lesson-progress-arc');
  const netStatDoneCount = document.getElementById('net-stat-done-count');
  const netStatQuizzesCount = document.getElementById('net-stat-quizzes-count');
  const netStatTasksCount = document.getElementById('net-stat-tasks-count');

  const netTabTerminalBtn = document.getElementById('net-tab-terminal-btn');
  const netTabAddBtn = document.getElementById('net-tab-add-btn');
  const netTerminalStandbyView = document.getElementById('net-terminal-standby-view');
  const netTerminalActiveView = document.getElementById('net-terminal-active-view');
  const netBtnStartLiveLab = document.getElementById('net-btn-start-live-lab');
  const netTerminalViewport = document.getElementById('net-terminal-viewport');
  const netTerminalCliInput = document.getElementById('net-terminal-cli-input');
  const netBtnCliSubmit = document.getElementById('net-btn-cli-submit');
  const netLessonThemeToggle = document.getElementById('btn-net-lesson-theme-toggle');

  const btnToggleEditor = document.getElementById('btn-toggle-editor');
  const btnToggleNotes = document.getElementById('btn-toggle-notes');
  const toolsDrawer = document.getElementById('tools-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerTitle = document.getElementById('drawer-title');

  if (netLessonStepperItems.length > 0) {

    const netLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What a network is',
        duration: '· 2:49',
        seconds: 169,
        voiceText: "In this lesson you will learn what a network is and the two roles every network conversation has: a client that asks and a server that answers. A network is two or more machines connected so they can send data to each other. The machine that asks is the client. The machine that answers is the server.",
        bodyHtml: `
          <p>
            In this lesson you will learn what a network is and the two roles every network conversation has: a client that asks and a server that answers.
          </p>
          <p>
            A network is two or more machines connected so they can send data to each other. That is the whole definition. Your laptop and your phone on the same wifi form a network. A company's thousand servers form a network. The internet is a network of networks.
          </p>
          <p>
            Every useful thing a network does follows one pattern: one machine asks, another machine answers. The machine that asks is called the client. The machine that answers is called the server.
          </p>
          <div class="network-diagram-container">
            <div class="diagram-title font-mono">one network conversation</div>
            <div class="diagram-flow">
              <div class="diagram-node client-node font-mono">
                <span>client</span>
              </div>
              <div class="diagram-arrows font-mono">
                <div class="arrow-down">
                  <span class="arrow-label">request &darr;</span>
                </div>
                <div class="arrow-up">
                  <span class="arrow-label">&uarr; response</span>
                </div>
              </div>
              <div class="diagram-node server-node font-mono">
                <span>server</span>
              </div>
            </div>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Task',
        title: 'Run a web server and fetch from it',
        duration: '· 2:00',
        seconds: 120,
        voiceText: "Now let us see client and server roles in action. Start a simple web server using Python or Nginx, then query it using curl to observe the client-server request and response.",
        bodyHtml: `
          <p>
            Now let's see client and server roles in action in your live sandbox.
          </p>
          <div class="task-instructions-box" style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 16px 0;">
            <h4 style="color: #22e584; margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-list-check"></i> Lab Task 1 of 4:</h4>
            <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #e5e7eb;">
              <li>Click <strong>&gt;_ Start Lab</strong> in the right terminal panel if not already running.</li>
              <li>Type <code class="text-accent">python3 -m http.server 8000</code> or <code class="text-accent">curl http://localhost:8000</code>.</li>
              <li>Observe the server processing incoming requests and replying with HTTP 200 OK.</li>
            </ol>
          </div>
        `
      },
      3: {
        stepNum: 3,
        type: 'Task',
        title: 'Run the server on a different port',
        duration: '· 1:45',
        seconds: 105,
        voiceText: "Ports allow multiple services to run on the same server simultaneously. Run your server on port 8080 and fetch from it with curl.",
        bodyHtml: `
          <p>
            Ports allow multiple server applications to run on the same machine without colliding.
          </p>
          <div class="task-instructions-box" style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 16px 0;">
            <h4 style="color: #22e584; margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-list-check"></i> Lab Task 2 of 4:</h4>
            <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #e5e7eb;">
              <li>Run <code class="text-accent">python3 -m http.server 8080</code> in the terminal.</li>
              <li>Verify the connection by executing <code class="text-accent">curl http://localhost:8080</code>.</li>
            </ol>
          </div>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'What a packet is',
        duration: '· 2:15',
        seconds: 135,
        voiceText: "Data does not travel across wires as a single stream. Instead, files, web pages, and API calls are chopped into small pieces called packets.",
        bodyHtml: `
          <p>
            Data does not travel across the internet as a continuous block. Instead, files, web pages, and API calls are chopped into small, standardized pieces called <strong>packets</strong>.
          </p>
          <p>
            Every packet contains metadata (headers) specifying source IP, destination IP, port number, sequence number, and the actual content (payload).
          </p>
          <div class="callout-card" style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); padding: 16px; border-radius: 8px; margin-top: 16px;">
            <strong class="text-accent">Standard MTU:</strong> Most Ethernet networks cap packets at 1,500 bytes (Maximum Transmission Unit).
          </div>
        `
      },
      5: {
        stepNum: 5,
        type: 'Task',
        title: 'Ping localhost and read the output',
        duration: '· 1:30',
        seconds: 90,
        voiceText: "Use the ping command to send ICMP echo packets to the loopback IP 127.0.0.1 and read the round trip latency.",
        bodyHtml: `
          <p>
            The <code>ping</code> tool sends ICMP Echo Request packets to test whether another machine or interface is alive and measure latency.
          </p>
          <div class="task-instructions-box" style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 16px 0;">
            <h4 style="color: #22e584; margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-list-check"></i> Lab Task 3 of 4:</h4>
            <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #e5e7eb;">
              <li>Type <code class="text-accent">ping -c 4 127.0.0.1</code> in the terminal and press <strong>Enter</strong>.</li>
              <li>Observe the round trip time (RTT) and 0% packet loss.</li>
            </ol>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Lesson',
        title: 'The two questions every network packet answers',
        duration: '· 2:00',
        seconds: 120,
        voiceText: "Every packet traveling across a network must answer two critical questions: Which machine should receive this, and which running program should handle it.",
        bodyHtml: `
          <p>
            Whenever a router or server receives a network packet, it inspects two essential header fields:
          </p>
          <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; color: #d1d5db;">
            <li><strong>Question 1: Which machine is this for?</strong> Answered by the <strong>Destination IP Address</strong> (e.g. <code>192.168.1.10</code>).</li>
            <li><strong>Question 2: Which running program is this for?</strong> Answered by the <strong>Port Number</strong> (e.g. <code>80</code> for web, <code>22</code> for SSH).</li>
          </ul>
        `
      },
      7: {
        stepNum: 7,
        type: 'Task',
        title: 'Explore interfaces with ip addr',
        duration: '· 1:40',
        seconds: 100,
        voiceText: "Inspect your active network adapters and IP assignments using the ip addr command.",
        bodyHtml: `
          <p>
            Let's inspect how your Linux kernel binds to the network.
          </p>
          <div class="task-instructions-box" style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 16px 0;">
            <h4 style="color: #22e584; margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-list-check"></i> Lab Task 4 of 4:</h4>
            <ol style="padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #e5e7eb;">
              <li>Type <code class="text-accent">ip addr</code> (or <code>ip a</code>) in the terminal.</li>
              <li>Locate interface 1 (<code>lo</code> / 127.0.0.1) and interface 2 (<code>eth0</code>).</li>
            </ol>
          </div>
        `
      }
    };

    let netCurrentStep = 1;
    let netCompletedSteps = new Set([1]);
    let netQuizzesDone = 0;
    let netTasksDone = 0;
    let netIsPlayingVoice = false;
    let netSpeechUtterance = null;
    let netVoiceTimerInterval = null;

    function renderNetLesson(stepNumber) {
      netCurrentStep = stepNumber;
      const lesson = netLessonsData[stepNumber];
      if (!lesson) return;

      // Update Top Nav Counter & Title
      if (netLessonStepCounter) netLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 7`;
      if (netLessonHeading) netLessonHeading.textContent = lesson.title;
      if (netLessonTypePill) {
        netLessonTypePill.textContent = lesson.type;
        netLessonTypePill.className = `lesson-type-badge font-mono ${lesson.type.toLowerCase()}-badge`;
      }

      // Render Dynamic Body
      if (netLessonQuizContainer) netLessonQuizContainer.style.display = 'none';
      if (netLessonBodyContent) {
        netLessonBodyContent.style.display = 'block';
        netLessonBodyContent.innerHTML = lesson.bodyHtml;
      }

      // Update AI Voice Bar
      if (netVoiceTimer) netVoiceTimer.textContent = lesson.duration;
      stopNetVoiceAudio();

      // Update Stepper List UI
      netLessonStepperItems.forEach(item => {
        const sNum = parseInt(item.getAttribute('data-net-step'));
        item.classList.remove('active');
        if (sNum === stepNumber) item.classList.add('active');
        if (netCompletedSteps.has(sNum)) {
          item.classList.add('done');
        }
      });

      // Update Prev / Next Buttons
      if (netBtnLessonPrev) netBtnLessonPrev.disabled = (stepNumber === 1);
      if (netBtnLessonNext) {
        if (stepNumber === 7) {
          netBtnLessonNext.innerHTML = `Complete Lesson ✓`;
        } else {
          netBtnLessonNext.innerHTML = `Next &rarr;`;
        }
      }

      updateNetProgressMetrics();
    }

    function updateNetProgressMetrics() {
      const completedCount = netCompletedSteps.size;
      const percent = Math.round((completedCount / 7) * 100);

      if (netLessonProgressPercent) netLessonProgressPercent.textContent = `${percent}%`;
      if (netLessonProgressArc) {
        const offset = 264 - (264 * (percent / 100));
        netLessonProgressArc.style.strokeDashoffset = offset;
      }

      if (netStatDoneCount) netStatDoneCount.textContent = completedCount;
      if (netStatQuizzesCount) netStatQuizzesCount.textContent = `0/0`;
      if (netStatTasksCount) netStatTasksCount.textContent = `${netTasksDone}/4`;
    }

    function startNetVoiceAudio() {
      const lesson = netLessonsData[netCurrentStep];
      if (!lesson || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      netSpeechUtterance = new SpeechSynthesisUtterance(lesson.voiceText);
      netSpeechUtterance.rate = 1.0;
      netSpeechUtterance.pitch = 1.0;

      netSpeechUtterance.onstart = () => {
        netIsPlayingVoice = true;
        if (netVoiceIcon) netVoiceIcon.className = "fa-solid fa-pause";
        if (netBtnVoicePlay) netBtnVoicePlay.classList.add('playing');
        if (netVoiceStatusText) netVoiceStatusText.textContent = "AI Tutor Speaking...";

        let remainingSec = lesson.seconds;
        clearInterval(netVoiceTimerInterval);
        netVoiceTimerInterval = setInterval(() => {
          remainingSec--;
          if (remainingSec <= 0) {
            clearInterval(netVoiceTimerInterval);
            return;
          }
          const mins = Math.floor(remainingSec / 60);
          const secs = remainingSec % 60;
          if (netVoiceTimer) netVoiceTimer.textContent = `· ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }, 1000);
      };

      netSpeechUtterance.onend = () => {
        stopNetVoiceAudio();
      };

      window.speechSynthesis.speak(netSpeechUtterance);
    }

    function stopNetVoiceAudio() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      netIsPlayingVoice = false;
      clearInterval(netVoiceTimerInterval);
      if (netVoiceIcon) netVoiceIcon.className = "fa-solid fa-play";
      if (netBtnVoicePlay) netBtnVoicePlay.classList.remove('playing');
      const lesson = netLessonsData[netCurrentStep];
      if (lesson && netVoiceTimer) netVoiceTimer.textContent = lesson.duration;
      if (netVoiceStatusText) netVoiceStatusText.textContent = "Explain this lesson";
    }

    if (netBtnVoicePlay) {
      netBtnVoicePlay.addEventListener('click', () => {
        if (netIsPlayingVoice) {
          stopNetVoiceAudio();
        } else {
          startNetVoiceAudio();
        }
      });
    }

    netLessonStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepNum = parseInt(item.getAttribute('data-net-step'));
        renderNetLesson(stepNum);
      });
    });

    if (netBtnLessonPrev) {
      netBtnLessonPrev.addEventListener('click', () => {
        if (netCurrentStep > 1) renderNetLesson(netCurrentStep - 1);
      });
    }

    if (netBtnLessonNext) {
      netBtnLessonNext.addEventListener('click', () => {
        netCompletedSteps.add(netCurrentStep);
        if (netCurrentStep < 7) {
          renderNetLesson(netCurrentStep + 1);
        } else {
          updateNetProgressMetrics();
          showToast("🎉 Congratulations! You have completed Lesson 01 - What is a Network!");
        }
      });
    }

    if (netBtnStartLiveLab) {
      netBtnStartLiveLab.addEventListener('click', () => {
        if (netTerminalStandbyView) netTerminalStandbyView.style.display = 'none';
        if (netTerminalActiveView) {
          netTerminalActiveView.style.display = 'flex';
          netTerminalActiveView.setAttribute('data-started', 'true');
        }
        if (netTerminalCliInput) netTerminalCliInput.focus();
        showToast("✓ Linux cloud sandbox ready.");
      });
    }

    if (netTabAddBtn) {
      netTabAddBtn.addEventListener('click', () => {
        showToast("✓ Secondary terminal session spawned.");
      });
    }

    // Tools Drawer (Editor / Your notes)
    if (btnToggleEditor && toolsDrawer) {
      btnToggleEditor.addEventListener('click', () => {
        if (drawerTitle) drawerTitle.innerHTML = '<i class="fa-regular fa-file-code"></i> Code Editor';
        toolsDrawer.style.display = 'flex';
      });
    }

    if (btnToggleNotes && toolsDrawer) {
      btnToggleNotes.addEventListener('click', () => {
        if (drawerTitle) drawerTitle.innerHTML = '<i class="fa-regular fa-note-sticky"></i> Your Notes';
        toolsDrawer.style.display = 'flex';
      });
    }

    if (btnCloseDrawer && toolsDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        toolsDrawer.style.display = 'none';
      });
      toolsDrawer.addEventListener('click', (e) => {
        if (e.target === toolsDrawer) toolsDrawer.style.display = 'none';
      });
    }

    function executeNetWorkspaceCommand() {
      if (!netTerminalCliInput || !netTerminalViewport) return;
      const rawCmd = netTerminalCliInput.value.trim();
      if (!rawCmd) return;

      const echoLine = document.createElement('div');
      echoLine.className = 'term-boot-line font-bold text-accent';
      echoLine.textContent = `student@net-box:~$ ${rawCmd}`;
      netTerminalViewport.appendChild(echoLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-boot-line';

      const lower = rawCmd.toLowerCase();

      if (lower.includes('http.server 8000') || (lower.startsWith('curl') && lower.includes('8000'))) {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = 'Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...\n127.0.0.1 - - [06/Oct/2026 00:00:01] "GET / HTTP/1.1" 200 -';

        if (netCurrentStep === 2) {
          netTasksDone = Math.min(4, netTasksDone + 1);
          netCompletedSteps.add(2);
          updateNetProgressMetrics();
          showToast("✓ Task 1: Web server started and queried on port 8000!");
        }
      } else if (lower.includes('http.server 8080') || (lower.startsWith('curl') && lower.includes('8080'))) {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = 'Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...\n127.0.0.1 - - [06/Oct/2026 00:00:02] "GET / HTTP/1.1" 200 -';

        if (netCurrentStep === 3) {
          netTasksDone = Math.min(4, netTasksDone + 1);
          netCompletedSteps.add(3);
          updateNetProgressMetrics();
          showToast("✓ Task 2: Server running on port 8080!");
        }
      } else if (lower.startsWith('ping')) {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = 'PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.032 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms\n64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.035 ms\n64 bytes from 127.0.0.1: icmp_seq=4 ttl=64 time=0.034 ms\n\n--- 127.0.0.1 ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3060ms\nrtt min/avg/max/mdev = 0.032/0.034/0.038/0.002 ms';

        if (netCurrentStep === 5) {
          netTasksDone = Math.min(4, netTasksDone + 1);
          netCompletedSteps.add(5);
          updateNetProgressMetrics();
          showToast("✓ Task 3: Localhost ping packets verified!");
        }
      } else if (lower === 'ip addr' || lower === 'ip a' || lower === 'ip addr show' || lower === 'ifconfig') {
        outLine.className = 'term-boot-line text-green font-mono';
        outLine.textContent = '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    link/ether 52:54:00:a1:b2:c3 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0\n       valid_lft 86120sec preferred_lft 86120sec';

        if (netCurrentStep === 7) {
          netTasksDone = Math.min(4, netTasksDone + 1);
          netCompletedSteps.add(7);
          updateNetProgressMetrics();
          showToast("✓ Task 4: Network interfaces inspected!");
        }
      } else if (lower === 'clear') {
        netTerminalViewport.innerHTML = '<div class="term-boot-line text-muted">Screen cleared. Type commands below:</div>';
        netTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.textContent = 'Available commands: python3 -m http.server 8000, curl http://localhost:8000, ping -c 4 127.0.0.1, ip addr, clear, help';
      } else {
        outLine.className = 'term-boot-line text-red';
        outLine.textContent = `bash: ${rawCmd.split(' ')[0]}: command not found. Try 'help'.`;
      }

      if (outLine.textContent) {
        netTerminalViewport.appendChild(outLine);
      }

      netTerminalCliInput.value = '';
      netTerminalViewport.scrollTop = netTerminalViewport.scrollHeight;
    }

    if (netBtnCliSubmit) {
      netBtnCliSubmit.addEventListener('click', executeNetWorkspaceCommand);
    }

    if (netTerminalCliInput) {
      netTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeNetWorkspaceCommand();
      });
    }

    if (netLessonThemeToggle) {
      netLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderNetLesson(1);
  }

  /* ==========================================================================
     24. GIT SKILL PAGE CONTROLLER (skill-git.html)
     ========================================================================== */
  const gitStarRatingBox = document.getElementById('git-star-rating-box');
  if (gitStarRatingBox) {
    const stars = gitStarRatingBox.querySelectorAll('.fa-star');
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '5', 10);
        stars.forEach((s) => {
          const r = parseInt(s.getAttribute('data-rating') || '0', 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        showToast(`Rated ${rating} out of 5 stars! Thank you.`);
      });
    });
  }

  const btnPreviewGitCert = document.getElementById('btn-preview-git-cert');
  const certModal = document.getElementById('cert-modal');
  const certModalClose = document.getElementById('cert-modal-close');

  if (btnPreviewGitCert && certModal) {
    btnPreviewGitCert.addEventListener('click', () => {
      certModal.style.display = 'flex';
    });
  }

  if (certModalClose && certModal) {
    certModalClose.addEventListener('click', () => {
      certModal.style.display = 'none';
    });
  }

  /* ==========================================================================
     25. GIT 4-COLUMN INTERACTIVE LESSON CONTROLLER (lesson-git.html)
     ========================================================================== */
  const gitLessonStepperItems = document.querySelectorAll('#git-sidebar-stepper-list .stepper-item');
  const gitLessonStepCounter = document.getElementById('git-lesson-step-counter');
  const gitLessonHeading = document.getElementById('git-lesson-heading');
  const gitLessonTypePill = document.getElementById('git-lesson-type-pill');
  const gitLessonBodyContent = document.getElementById('git-lesson-body-content');
  const gitLessonQuizContainer = document.getElementById('git-lesson-quiz-container');
  const gitQuizQuestionText = document.getElementById('git-quiz-question-text');
  const gitQuizOptionsList = document.getElementById('git-quiz-options-list');
  const gitQuizFeedbackBox = document.getElementById('git-quiz-feedback-box');
  const gitBtnLessonPrev = document.getElementById('git-btn-lesson-prev');
  const gitBtnLessonNext = document.getElementById('git-btn-lesson-next');

  const gitBtnVoicePlay = document.getElementById('git-btn-voice-play');
  const gitVoiceIcon = document.getElementById('git-voice-icon');
  const gitVoiceStatusText = document.getElementById('git-voice-status-text');
  const gitVoiceTimer = document.getElementById('git-voice-timer');

  const gitLessonProgressPercent = document.getElementById('git-lesson-progress-percent');
  const gitLessonProgressArc = document.getElementById('git-lesson-progress-arc');
  const gitStatDoneCount = document.getElementById('git-stat-done-count');
  const gitStatQuizzesCount = document.getElementById('git-stat-quizzes-count');
  const gitStatTasksCount = document.getElementById('git-stat-tasks-count');

  const gitTabTerminalBtn = document.getElementById('git-tab-terminal-btn');
  const gitTabAddBtn = document.getElementById('git-tab-add-btn');
  const gitTerminalStandbyView = document.getElementById('git-terminal-standby-view');
  const gitTerminalActiveView = document.getElementById('git-terminal-active-view');
  const gitBtnStartLiveLab = document.getElementById('git-btn-start-live-lab');
  const gitTerminalViewport = document.getElementById('git-terminal-viewport');
  const gitTerminalCliInput = document.getElementById('git-terminal-cli-input');
  const gitBtnCliSubmit = document.getElementById('git-btn-cli-submit');
  const gitLessonThemeToggle = document.getElementById('btn-git-lesson-theme-toggle');

  const gitBtnToggleEditor = document.getElementById('git-btn-toggle-editor');
  const gitBtnToggleNotes = document.getElementById('git-btn-toggle-notes');
  const gitToolsDrawer = document.getElementById('git-tools-drawer');
  const gitBtnCloseDrawer = document.getElementById('git-btn-close-drawer');
  const gitDrawerTitle = document.getElementById('git-drawer-title');

  if (gitLessonStepperItems.length > 0) {

    const gitLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What version control is',
        duration: '· 2:45',
        seconds: 165,
        voiceText: "In this lesson you will learn what version control is, why Git has become the global standard for software engineering, and how Git records full filesystem snapshots instead of fragile file diffs.",
        bodyHtml: `
          <p>
            In this lesson you will learn what version control is, why Git has become the global standard for software engineering, and how Git records full filesystem snapshots instead of fragile file diffs.
          </p>
          <p>
            A version control system (VCS) tracks changes to code over time. It lets you inspect history, revert bad commits, collaborate with teammates without overwriting work, and safely experiment in isolated branches.
          </p>
          <p>
            Git models project history as a directed graph of immutable snapshots. Every commit has a unique SHA-1 hash cryptographic fingerprint, an author, a timestamp, and a pointer to its parent commit.
          </p>
          <div class="git-workflow-diagram font-mono">
            <div class="git-diagram-header">THE THREE TREES OF GIT WORKFLOW</div>
            <div class="git-trees-row">
              <div class="git-tree-card working-dir">
                <span class="git-tree-title">1. Working Dir</span>
                <span class="text-xs text-muted">Untracked / Modified</span>
                <span class="git-tree-cmd">edit files</span>
              </div>
              <div class="git-tree-card staging-area">
                <span class="git-tree-title">2. Staging Area</span>
                <span class="text-xs text-muted">Index for snapshot</span>
                <span class="git-tree-cmd">git add .</span>
              </div>
              <div class="git-tree-card git-repo">
                <span class="git-tree-title">3. Git Repository</span>
                <span class="text-xs text-muted">Permanent commits</span>
                <span class="git-tree-cmd">git commit</span>
              </div>
            </div>
            <div class="git-commits-timeline">
              <div class="git-commit-bubble"><span>C1</span></div>
              <i class="fa-solid fa-arrow-right text-muted" style="font-size: 10px;"></i>
              <div class="git-commit-bubble"><span>C2</span></div>
              <i class="fa-solid fa-arrow-right text-accent" style="font-size: 10px;"></i>
              <div class="git-commit-bubble head">
                <span class="head-tag">HEAD -> main</span>
                <span>C3</span>
              </div>
            </div>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Snapshots vs delta diffs',
        duration: '· 3:10',
        seconds: 190,
        voiceText: "Traditional version control systems like SVN store changes as a set of file-based deltas. Git thinks of its data more like a series of snapshots of a miniature filesystem.",
        bodyHtml: `
          <p>
            Traditional version control systems (like CVS and Subversion) store information as a list of file-based changes (often called delta-based version control).
          </p>
          <p>
            Git does not think of or store its data this way. Instead, Git thinks of its data more like a series of snapshots of a miniature filesystem. Every time you commit, Git takes a picture of what all your files look like at that moment.
          </p>
          <p>
            If files have not changed, Git does not store the file again, just a link to the previous identical file it has already stored. Git thinks about its data more like a stream of snapshots.
          </p>
        `
      },
      3: {
        stepNum: 3,
        type: 'Task',
        title: 'Init your repository',
        duration: '· 4:00',
        seconds: 240,
        voiceText: "Now let's initialize a new Git repository. In your terminal on the right, click Start Lab and run git init to turn your current directory into a tracked Git repository.",
        bodyHtml: `
          <p>
            Now let's see Git in action by creating a new repository from scratch in your live terminal sandbox.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK 1 OF 1</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Click <strong>&gt;_ Start Lab</strong> in the right terminal panel.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">2. Run <code class="text-accent">git init</code> to initialize a new repository.</p>
            <p style="margin-bottom: 0; color: #d1d5db;">3. Run <code class="text-accent">git status</code> to inspect the clean working directory.</p>
          </div>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'The three trees of Git',
        duration: '· 2:30',
        seconds: 150,
        voiceText: "Git has three main states that your files can reside in: modified, staged, and committed. This leads to the three main sections of a Git project: the working tree, the staging area, and the Git directory.",
        bodyHtml: `
          <p>
            Git has three main states that your files can reside in: <strong>modified</strong>, <strong>staged</strong>, and <strong>committed</strong>:
          </p>
          <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px; margin-bottom: 16px;">
            <li><strong>Modified:</strong> You have changed the file in your working directory but have not committed it yet.</li>
            <li><strong>Staged:</strong> You have marked a modified file in its current version to go into your next commit snapshot via <code class="text-accent">git add</code>.</li>
            <li><strong>Committed:</strong> The data is safely stored in your local database (<code class="text-accent">.git/</code> directory).</li>
          </ul>
        `
      },
      5: {
        stepNum: 5,
        type: 'Task',
        title: 'Stage and make a commit',
        duration: '· 3:45',
        seconds: 225,
        voiceText: "Let's create a file, stage it, and commit it with a clear commit message. Run git add and git commit in your terminal.",
        bodyHtml: `
          <p>
            Let's walk through the full commit lifecycle: creating a file, inspecting it with <code class="text-accent">git status</code>, staging it with <code class="text-accent">git add</code>, and recording a snapshot with <code class="text-accent">git commit</code>.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK: FIRST COMMIT</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Create a README file: <code class="text-accent">echo "# My App" &gt; README.md</code></p>
            <p style="margin-bottom: 8px; color: #d1d5db;">2. Stage the file: <code class="text-accent">git add README.md</code></p>
            <p style="margin-bottom: 0; color: #d1d5db;">3. Commit: <code class="text-accent">git commit -m "feat: initial commit"</code></p>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Quiz',
        title: 'Concept Check: Git Core',
        duration: '· 2:00',
        seconds: 120,
        voiceText: "Time for a concept check to test your understanding of Git's architecture and staging area before moving to advanced topics.",
        quiz: {
          question: "Which Git command moves changes from your Working Directory into the Staging Area index?",
          options: [
            "git push origin main",
            "git commit -m 'update'",
            "git add <file>",
            "git checkout -b feature"
          ],
          correct: 2,
          explanation: "Correct! 'git add' moves modified files from your working directory into the staging area (index) so they will be included in the next commit snapshot."
        }
      },
      7: {
        stepNum: 7,
        type: 'Lesson',
        title: 'Next in Git mastery',
        duration: '· 1:30',
        seconds: 90,
        voiceText: "Congratulations on mastering the foundations of Git. Next you will learn branches, merge conflict resolution, rebasing, remotes, and GitHub pull requests.",
        bodyHtml: `
          <p>
            Congratulations! You have completed Topic 01 of the Git Track:
          </p>
          <div style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="color: var(--accent-green); margin: 0 0 10px 0; font-size: 14px;">Key Takeaways:</h4>
            <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px;">
              <li>Git records complete filesystem snapshots, not incremental deltas.</li>
              <li>Every commit has a unique cryptographic SHA-1 hash fingerprint.</li>
              <li>The 3 trees workflow: Working Directory &rarr; Staging Area &rarr; Git Repository.</li>
            </ul>
          </div>
          <p>
            Next up: <strong>02 &middot; Your first repository</strong> and <strong>08 &middot; Branches &amp; Merge Workflows</strong>.
          </p>
        `
      }
    };

    let currentGitStep = 1;
    let gitCompletedSteps = new Set([1]);
    let isGitVoicePlaying = false;
    let gitVoiceInterval = null;
    let gitVoiceSecondsRemaining = 165;
    let isGitLabRunning = false;
    let gitTasksDone = 0;
    let gitQuizzesDone = 0;

    function updateGitSidebarStats() {
      const doneCount = gitCompletedSteps.size;
      const totalSteps = Object.keys(gitLessonsData).length;
      const pct = Math.round((doneCount / totalSteps) * 100);

      if (gitLessonProgressPercent) gitLessonProgressPercent.textContent = `${pct}%`;
      if (gitLessonProgressArc) {
        const totalLength = 264;
        const offset = totalLength - (totalLength * pct) / 100;
        gitLessonProgressArc.style.strokeDashoffset = offset;
      }
      if (gitStatDoneCount) gitStatDoneCount.textContent = `${doneCount}`;
      if (gitStatQuizzesCount) gitStatQuizzesCount.textContent = `${gitQuizzesDone}/1`;
      if (gitStatTasksCount) gitStatTasksCount.textContent = `${gitTasksDone}/1`;
    }

    function renderGitLesson(stepId) {
      currentGitStep = parseInt(stepId, 10);
      const data = gitLessonsData[currentGitStep];
      if (!data) return;

      gitCompletedSteps.add(currentGitStep);

      // Update Header
      if (gitLessonStepCounter) {
        gitLessonStepCounter.textContent = `${data.type.toUpperCase()} · ${currentGitStep} OF 7`;
      }
      if (gitVoiceTimer) gitVoiceTimer.innerHTML = `&middot; ${data.duration.replace('· ', '')}`;
      if (gitLessonHeading) gitLessonHeading.textContent = data.title;
      if (gitLessonTypePill) {
        gitLessonTypePill.textContent = data.type;
        gitLessonTypePill.className = `lesson-type-badge font-mono ${data.type.toLowerCase()}-badge`;
      }

      // Render Content or Quiz
      if (data.type === 'Quiz' && data.quiz) {
        if (gitLessonBodyContent) gitLessonBodyContent.style.display = 'none';
        if (gitLessonQuizContainer) {
          gitLessonQuizContainer.style.display = 'block';
          if (gitQuizQuestionText) gitQuizQuestionText.textContent = data.quiz.question;
          if (gitQuizOptionsList) {
            gitQuizOptionsList.innerHTML = '';
            data.quiz.options.forEach((optText, idx) => {
              const optBtn = document.createElement('button');
              optBtn.className = 'quiz-option-btn';
              optBtn.innerHTML = `<span class="opt-key">${String.fromCharCode(65 + idx)}</span> <span class="opt-val">${optText}</span>`;
              optBtn.addEventListener('click', () => {
                const allBtns = gitQuizOptionsList.querySelectorAll('.quiz-option-btn');
                allBtns.forEach((b) => (b.disabled = true));

                if (idx === data.quiz.correct) {
                  optBtn.classList.add('correct');
                  if (gitQuizFeedbackBox) {
                    gitQuizFeedbackBox.style.display = 'block';
                    gitQuizFeedbackBox.className = 'quiz-feedback-box correct font-mono';
                    gitQuizFeedbackBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.quiz.explanation}`;
                  }
                  gitQuizzesDone = 1;
                  showToast("Quiz passed! Concept verified.");
                } else {
                  optBtn.classList.add('wrong');
                  if (allBtns[data.quiz.correct]) allBtns[data.quiz.correct].classList.add('correct');
                  if (gitQuizFeedbackBox) {
                    gitQuizFeedbackBox.style.display = 'block';
                    gitQuizFeedbackBox.className = 'quiz-feedback-box wrong font-mono';
                    gitQuizFeedbackBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Incorrect. ${data.quiz.explanation}`;
                  }
                  showToast("Review the explanation and try again.");
                }
                updateGitSidebarStats();
              });
              gitQuizOptionsList.appendChild(optBtn);
            });
          }
          if (gitQuizFeedbackBox) gitQuizFeedbackBox.style.display = 'none';
        }
      } else {
        if (gitLessonQuizContainer) gitLessonQuizContainer.style.display = 'none';
        if (gitLessonBodyContent) {
          gitLessonBodyContent.style.display = 'block';
          gitLessonBodyContent.innerHTML = data.bodyHtml || '';
        }
      }

      // Update Stepper Active and Done states
      gitLessonStepperItems.forEach((item) => {
        const itemStep = parseInt(item.getAttribute('data-git-step'), 10);
        if (itemStep === currentGitStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }

        if (gitCompletedSteps.has(itemStep) && itemStep !== currentGitStep) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });

      // Update Nav Buttons
      if (gitBtnLessonPrev) gitBtnLessonPrev.disabled = currentGitStep === 1;
      if (gitBtnLessonNext) {
        if (currentGitStep === 7) {
          gitBtnLessonNext.innerHTML = `Complete Track <i class="fa-solid fa-flag-checkered"></i>`;
        } else {
          gitBtnLessonNext.innerHTML = `Next &rarr;`;
        }
      }

      // Reset audio narration
      stopGitAudioNarrator();
      updateGitSidebarStats();
    }

    gitLessonStepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const stepNum = item.getAttribute('data-git-step');
        renderGitLesson(stepNum);
      });
    });

    if (gitBtnLessonPrev) {
      gitBtnLessonPrev.addEventListener('click', () => {
        if (currentGitStep > 1) renderGitLesson(currentGitStep - 1);
      });
    }

    if (gitBtnLessonNext) {
      gitBtnLessonNext.addEventListener('click', () => {
        if (currentGitStep < 7) {
          renderGitLesson(currentGitStep + 1);
        } else {
          showToast("Git Track Step 1 completed! Ready for Step 2.");
          setTimeout(() => {
            window.location.href = 'skill-git.html';
          }, 1200);
        }
      });
    }

    function stopGitAudioNarrator() {
      if (gitVoiceInterval) clearInterval(gitVoiceInterval);
      isGitVoicePlaying = false;
      if (gitVoiceIcon) gitVoiceIcon.className = 'fa-solid fa-play';
      if (gitVoiceStatusText) gitVoiceStatusText.textContent = 'Explain this lesson';
      if (gitBtnVoicePlay) gitBtnVoicePlay.classList.remove('playing');
    }

    function toggleGitAudioNarrator() {
      const data = gitLessonsData[currentGitStep];
      if (!data) return;

      if (isGitVoicePlaying) {
        stopGitAudioNarrator();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        showToast("Narrator paused");
      } else {
        isGitVoicePlaying = true;
        if (gitVoiceIcon) gitVoiceIcon.className = 'fa-solid fa-pause';
        if (gitVoiceStatusText) gitVoiceStatusText.textContent = 'Playing explanation...';
        if (gitBtnVoicePlay) gitBtnVoicePlay.classList.add('playing');

        gitVoiceSecondsRemaining = data.seconds || 165;
        gitVoiceInterval = setInterval(() => {
          gitVoiceSecondsRemaining--;
          const mins = Math.floor(gitVoiceSecondsRemaining / 60);
          const secs = gitVoiceSecondsRemaining % 60;
          if (gitVoiceTimer) gitVoiceTimer.textContent = `· ${mins}:${secs < 10 ? '0' : ''}${secs}`;

          if (gitVoiceSecondsRemaining <= 0) {
            stopGitAudioNarrator();
            showToast("Lesson audio walkthrough complete.");
          }
        }, 1000);

        if ('speechSynthesis' in window && data.voiceText) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.voiceText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
        showToast("Narrator started: Demonstrating concepts");
      }
    }

    if (gitBtnVoicePlay) {
      gitBtnVoicePlay.addEventListener('click', toggleGitAudioNarrator);
    }

    // Live Terminal Controls
    if (gitBtnStartLiveLab) {
      gitBtnStartLiveLab.addEventListener('click', () => {
        isGitLabRunning = true;
        if (gitTerminalStandbyView) gitTerminalStandbyView.style.display = 'none';
        if (gitTerminalActiveView) gitTerminalActiveView.style.display = 'flex';
        showToast("Live Linux Git sandbox container booted.");
        if (gitTerminalCliInput) gitTerminalCliInput.focus();
      });
    }

    if (gitTabAddBtn) {
      gitTabAddBtn.addEventListener('click', () => {
        showToast("Terminal 2 opened in parallel session.");
      });
    }

    // Tools Drawer (Editor & Your Notes)
    if (gitBtnToggleNotes && gitToolsDrawer) {
      gitBtnToggleNotes.addEventListener('click', () => {
        if (gitDrawerTitle) gitDrawerTitle.innerHTML = `<i class="fa-regular fa-note-sticky"></i> Your Notes`;
        gitToolsDrawer.style.display = 'flex';
      });
    }

    if (gitBtnToggleEditor && gitToolsDrawer) {
      gitBtnToggleEditor.addEventListener('click', () => {
        if (gitDrawerTitle) gitDrawerTitle.innerHTML = `<i class="fa-regular fa-file-code"></i> Scratchpad Editor`;
        gitToolsDrawer.style.display = 'flex';
      });
    }

    if (gitBtnCloseDrawer && gitToolsDrawer) {
      gitBtnCloseDrawer.addEventListener('click', () => {
        gitToolsDrawer.style.display = 'none';
      });
    }

    function executeGitWorkspaceCommand() {
      if (!gitTerminalCliInput || !gitTerminalViewport) return;
      const cmd = gitTerminalCliInput.value.trim();
      if (!cmd) return;

      const userLine = document.createElement('div');
      userLine.className = 'term-line font-mono font-bold text-accent';
      userLine.textContent = `student@git-box:~/devops-repo$ ${cmd}`;
      gitTerminalViewport.appendChild(userLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-line font-mono';

      const lower = cmd.toLowerCase();

      if (lower === 'clear') {
        gitTerminalViewport.innerHTML = '';
        gitTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.innerHTML = `
          Available Git sandbox commands:<br>
          &bull; <span class="text-accent">git init</span> - Initialize a new Git repository<br>
          &bull; <span class="text-accent">git status</span> - Show working tree status<br>
          &bull; <span class="text-accent">git add .</span> / <span class="text-accent">git add README.md</span> - Stage files for commit<br>
          &bull; <span class="text-accent">git commit -m "msg"</span> - Record snapshot to history<br>
          &bull; <span class="text-accent">git log --oneline</span> - View commit history<br>
          &bull; <span class="text-accent">git branch</span> - List branches<br>
          &bull; <span class="text-accent">ls -la</span> - List all directory files including .git<br>
          &bull; <span class="text-accent">clear</span> - Clear screen
        `;
        gitTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('git init')) {
        outLine.innerHTML = `
          <span class="text-accent">Initialized empty Git repository in /home/student/devops-repo/.git/</span><br>
          <span class="text-muted">Hint: Run 'git status' to inspect tracked files.</span>
        `;
        gitTerminalViewport.appendChild(outLine);
        gitTasksDone = 1;
        updateGitSidebarStats();
        showToast("Task verified: Git repository initialized!");
      } else if (lower.startsWith('git status')) {
        outLine.innerHTML = `
          On branch main<br>
          No commits yet<br><br>
          Untracked files:<br>
          &nbsp;&nbsp;(use "git add &lt;file&gt;..." to include in what will be committed)<br>
          &nbsp;&nbsp;<span style="color: #ef4444;">README.md</span><br>
          &nbsp;&nbsp;<span style="color: #ef4444;">app.py</span><br><br>
          nothing added to commit but untracked files present (use "git add" to track)
        `;
        gitTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('git add')) {
        outLine.innerHTML = `<span class="text-muted">Changes staged to index for next commit snapshot.</span>`;
        gitTerminalViewport.appendChild(outLine);
        showToast("Files staged to index.");
      } else if (lower.startsWith('git commit')) {
        outLine.innerHTML = `
          [main (root-commit) 8f3a9b1] feat: initial commit<br>
          &nbsp;2 files changed, 45 insertions(+)<br>
          &nbsp;create mode 100644 README.md<br>
          &nbsp;create mode 100644 app.py
        `;
        gitTerminalViewport.appendChild(outLine);
        gitTasksDone = 1;
        updateGitSidebarStats();
        showToast("Commit recorded to Git repository snapshot graph!");
      } else if (lower.startsWith('git log')) {
        outLine.innerHTML = `
          <span class="text-amber">8f3a9b1</span> (HEAD -> main) feat: initial commit<br>
          <span class="text-muted">Author: student &lt;student@shaikhsir.io&gt;</span><br>
          <span class="text-muted">Date:   Tue Oct 6 00:50:00 2026 +0530</span>
        `;
        gitTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('git branch')) {
        outLine.innerHTML = `<span class="text-accent">* main</span>`;
        gitTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('ls')) {
        outLine.innerHTML = `README.md  app.py  .git/`;
        gitTerminalViewport.appendChild(outLine);
      } else {
        outLine.innerHTML = `<span class="text-muted">Command executed: ${cmd}. Run <span class="text-accent">help</span> for guidance.</span>`;
        gitTerminalViewport.appendChild(outLine);
      }

      gitTerminalCliInput.value = '';
      gitTerminalViewport.scrollTop = gitTerminalViewport.scrollHeight;
    }

    if (gitBtnCliSubmit) {
      gitBtnCliSubmit.addEventListener('click', executeGitWorkspaceCommand);
    }

    if (gitTerminalCliInput) {
      gitTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeGitWorkspaceCommand();
      });
    }

    if (gitLessonThemeToggle) {
      gitLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderGitLesson(1);
  }

  /* ==========================================================================
     26. DOCKER SKILL PAGE CONTROLLER (skill-docker.html)
     ========================================================================== */
  const dockerStarRatingBox = document.getElementById('docker-star-rating-box');
  if (dockerStarRatingBox) {
    const stars = dockerStarRatingBox.querySelectorAll('.fa-star');
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '5', 10);
        stars.forEach((s) => {
          const r = parseInt(s.getAttribute('data-rating') || '0', 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        showToast(`Rated ${rating} out of 5 stars! Thank you.`);
      });
    });
  }

  const btnPreviewDockerCert = document.getElementById('btn-preview-docker-cert');
  if (btnPreviewDockerCert && certModal) {
    btnPreviewDockerCert.addEventListener('click', () => {
      certModal.style.display = 'flex';
    });
  }

  /* ==========================================================================
     27. DOCKER 4-COLUMN INTERACTIVE LESSON CONTROLLER (lesson-docker.html)
     ========================================================================== */
  const dockerLessonStepperItems = document.querySelectorAll('#docker-sidebar-stepper-list .stepper-item');
  const dockerLessonStepCounter = document.getElementById('docker-lesson-step-counter');
  const dockerLessonHeading = document.getElementById('docker-lesson-heading');
  const dockerLessonTypePill = document.getElementById('docker-lesson-type-pill');
  const dockerLessonBodyContent = document.getElementById('docker-lesson-body-content');
  const dockerLessonQuizContainer = document.getElementById('docker-lesson-quiz-container');
  const dockerQuizQuestionText = document.getElementById('docker-quiz-question-text');
  const dockerQuizOptionsList = document.getElementById('docker-quiz-options-list');
  const dockerQuizFeedbackBox = document.getElementById('docker-quiz-feedback-box');
  const dockerBtnLessonPrev = document.getElementById('docker-btn-lesson-prev');
  const dockerBtnLessonNext = document.getElementById('docker-btn-lesson-next');

  const dockerBtnVoicePlay = document.getElementById('docker-btn-voice-play');
  const dockerVoiceIcon = document.getElementById('docker-voice-icon');
  const dockerVoiceStatusText = document.getElementById('docker-voice-status-text');
  const dockerVoiceTimer = document.getElementById('docker-voice-timer');

  const dockerLessonProgressPercent = document.getElementById('docker-lesson-progress-percent');
  const dockerLessonProgressArc = document.getElementById('docker-lesson-progress-arc');
  const dockerStatDoneCount = document.getElementById('docker-stat-done-count');
  const dockerStatQuizzesCount = document.getElementById('docker-stat-quizzes-count');
  const dockerStatTasksCount = document.getElementById('docker-stat-tasks-count');

  const dockerTabTerminalBtn = document.getElementById('docker-tab-terminal-btn');
  const dockerTabAddBtn = document.getElementById('docker-tab-add-btn');
  const dockerTerminalStandbyView = document.getElementById('docker-terminal-standby-view');
  const dockerTerminalActiveView = document.getElementById('docker-terminal-active-view');
  const dockerBtnStartLiveLab = document.getElementById('docker-btn-start-live-lab');
  const dockerTerminalViewport = document.getElementById('docker-terminal-viewport');
  const dockerTerminalCliInput = document.getElementById('docker-terminal-cli-input');
  const dockerBtnCliSubmit = document.getElementById('docker-btn-cli-submit');
  const dockerLessonThemeToggle = document.getElementById('btn-docker-lesson-theme-toggle');

  const dockerBtnToggleEditor = document.getElementById('docker-btn-toggle-editor');
  const dockerBtnToggleNotes = document.getElementById('docker-btn-toggle-notes');
  const dockerToolsDrawer = document.getElementById('docker-tools-drawer');
  const dockerBtnCloseDrawer = document.getElementById('docker-btn-close-drawer');
  const dockerDrawerTitle = document.getElementById('docker-drawer-title');

  if (dockerLessonStepperItems.length > 0) {

    const dockerLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'Introduction to Docker',
        duration: '· 2:30',
        seconds: 150,
        voiceText: "In this lesson you will learn why Docker revolutionized software packaging and deployment, how containers differ from virtual machines, and the client daemon registry architecture.",
        bodyHtml: `
          <p>
            In this lesson you will learn why Docker revolutionized software packaging and deployment, how containers differ from traditional hypervisor virtual machines, and the client-daemon-registry architecture.
          </p>
          <p>
            Before Docker, deploying an application across staging and production often failed due to conflicting runtime versions, missing system libraries, or subtle OS differences (the classic <em>"it works on my machine"</em> problem).
          </p>
          <p>
            Docker packages an application and all its dependencies into an immutable, portable container image that runs identically anywhere Linux kernel primitives (namespaces &amp; cgroups) are available.
          </p>
          <div class="docker-arch-diagram font-mono">
            <div class="docker-arch-header">DOCKER ENGINE ARCHITECTURE</div>
            <div class="docker-arch-grid">
              <div class="docker-arch-card client">
                <span class="docker-arch-title">1. Docker Client</span>
                <span class="text-xs text-muted">CLI Interface</span>
                <span class="docker-arch-cmd">docker run</span>
              </div>
              <div class="docker-arch-card daemon">
                <span class="docker-arch-title">2. Docker Host</span>
                <span class="text-xs text-muted">dockerd daemon</span>
                <span class="docker-arch-cmd">Images &amp; Containers</span>
              </div>
              <div class="docker-arch-card registry">
                <span class="docker-arch-title">3. Registry</span>
                <span class="text-xs text-muted">Docker Hub / ECR</span>
                <span class="docker-arch-cmd">docker pull</span>
              </div>
            </div>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Containers vs Virtual Machines',
        duration: '· 3:00',
        seconds: 180,
        voiceText: "Virtual machines bundle a full guest operating system on top of a hypervisor. Docker containers share the host Linux kernel and run as isolated processes.",
        bodyHtml: `
          <p>
            <strong>Virtual Machines (VMs)</strong> include the application, necessary binaries and libraries, and an entire guest operating system (which can be tens of gigabytes). VMs run on top of a hypervisor.
          </p>
          <p>
            <strong>Containers</strong> share the host operating system's kernel. Each container runs as an isolated process in user space, taking up very little space and starting up in milliseconds.
          </p>
          <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px;">
            <li><strong>Speed:</strong> Containers boot in &lt;1 second vs minutes for VMs.</li>
            <li><strong>Resource Footprint:</strong> Megabytes of RAM vs Gigabytes per VM.</li>
            <li><strong>Portability:</strong> Standardized OCI container image format runs across all clouds.</li>
          </ul>
        `
      },
      3: {
        stepNum: 3,
        type: 'Task',
        title: 'Run your first container',
        duration: '· 4:15',
        seconds: 255,
        voiceText: "Now let's launch an Nginx web server container in your live sandbox. Click Start Lab and run docker run -d -p 80:80 nginx.",
        bodyHtml: `
          <p>
            Let's launch an Nginx web server in a lightweight container in your live Linux sandbox.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK: RUN A CONTAINER</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Click <strong>&gt;_ Start Lab</strong> in the right terminal panel.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">2. Run <code class="text-accent">docker run -d -p 80:80 nginx</code> to pull and launch in detached mode.</p>
            <p style="margin-bottom: 0; color: #d1d5db;">3. Verify with <code class="text-accent">docker ps</code> to see the running container ID and mapped ports.</p>
          </div>
        `
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'The Docker Architecture',
        duration: '· 2:40',
        seconds: 160,
        voiceText: "Docker uses a client-server architecture. The Docker client talks to the Docker daemon, which does the heavy lifting of building, running, and distributing your Docker containers.",
        bodyHtml: `
          <p>
            Docker uses a client-server architecture:
          </p>
          <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px; margin-bottom: 16px;">
            <li><strong>The Docker Daemon (dockerd):</strong> Listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes.</li>
            <li><strong>The Docker Client (docker):</strong> The primary way that Docker users interact with Docker. When you run commands like <code>docker run</code>, the client sends them to <code>dockerd</code>.</li>
            <li><strong>Docker Registries:</strong> Stores Docker images. Docker Hub is a public registry that anyone can use, and Docker is configured to look for images on Docker Hub by default.</li>
          </ul>
        `
      },
      5: {
        stepNum: 5,
        type: 'Task',
        title: 'Inspect running container',
        duration: '· 3:30',
        seconds: 210,
        voiceText: "Now let's inspect the container's logs and system metadata using docker logs and docker inspect.",
        bodyHtml: `
          <p>
            Debugging and inspecting containers is a core DevOps daily task.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK: INSPECTION & LOGS</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Run <code class="text-accent">docker logs &lt;container_id&gt;</code> to stream stdout from Nginx.</p>
            <p style="margin-bottom: 0; color: #d1d5db;">2. Run <code class="text-accent">docker inspect</code> to view IP address, network settings, and volume mounts.</p>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Quiz',
        title: 'Concept Check: Docker Core',
        duration: '· 2:00',
        seconds: 120,
        voiceText: "Time for a quick concept check on Docker container isolation and port binding.",
        quiz: {
          question: "What does the '-p 8080:80' flag do when running 'docker run -d -p 8080:80 nginx'?",
          options: [
            "Allocates 8080 megabytes of memory to port 80",
            "Maps host port 8080 to container port 80",
            "Creates 8080 replicas of container 80",
            "Sets the container PID to 8080"
          ],
          correct: 1,
          explanation: "Correct! The -p <host_port>:<container_port> flag publishes container port 80 to host port 8080 so external traffic can reach the container service."
        }
      },
      7: {
        stepNum: 7,
        type: 'Lesson',
        title: 'Next in containerization',
        duration: '· 1:45',
        seconds: 105,
        voiceText: "Congratulations on completing Topic 01 of the Docker Track. Next you will learn writing custom Dockerfiles, multi-stage builds, volumes, networks, and Docker Compose.",
        bodyHtml: `
          <p>
            Congratulations! You have completed Topic 01 of the Docker Track:
          </p>
          <div style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="color: var(--accent-green); margin: 0 0 10px 0; font-size: 14px;">Key Takeaways:</h4>
            <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px;">
              <li>Containers share the host kernel and provide lightweight process isolation.</li>
              <li>Docker client communicates with the <code>dockerd</code> daemon over REST API/sockets.</li>
              <li>Images are immutable templates; containers are running instances of images.</li>
            </ul>
          </div>
          <p>
            Next up: <strong>02 &middot; Running containers</strong> and <strong>10 &middot; Writing your first Dockerfile</strong>.
          </p>
        `
      }
    };

    let currentDockerStep = 1;
    let dockerCompletedSteps = new Set([1]);
    let isDockerVoicePlaying = false;
    let dockerVoiceInterval = null;
    let dockerVoiceSecondsRemaining = 150;
    let isDockerLabRunning = false;
    let dockerTasksDone = 0;
    let dockerQuizzesDone = 0;

    function updateDockerSidebarStats() {
      const doneCount = dockerCompletedSteps.size;
      const totalSteps = Object.keys(dockerLessonsData).length;
      const pct = Math.round((doneCount / totalSteps) * 100);

      if (dockerLessonProgressPercent) dockerLessonProgressPercent.textContent = `${pct}%`;
      if (dockerLessonProgressArc) {
        const totalLength = 264;
        const offset = totalLength - (totalLength * pct) / 100;
        dockerLessonProgressArc.style.strokeDashoffset = offset;
      }
      if (dockerStatDoneCount) dockerStatDoneCount.textContent = `${doneCount}`;
      if (dockerStatQuizzesCount) dockerStatQuizzesCount.textContent = `${dockerQuizzesDone}/2`;
      if (dockerStatTasksCount) dockerStatTasksCount.textContent = `${dockerTasksDone}/1`;
    }

    function renderDockerLesson(stepId) {
      currentDockerStep = parseInt(stepId, 10);
      const data = dockerLessonsData[currentDockerStep];
      if (!data) return;

      dockerCompletedSteps.add(currentDockerStep);

      // Update Header
      if (dockerLessonStepCounter) {
        dockerLessonStepCounter.textContent = `${data.type.toUpperCase()} · ${currentDockerStep} OF 7`;
      }
      if (dockerVoiceTimer) dockerVoiceTimer.innerHTML = `&middot; ${data.duration.replace('· ', '')}`;
      if (dockerLessonHeading) dockerLessonHeading.textContent = data.title;
      if (dockerLessonTypePill) {
        dockerLessonTypePill.textContent = data.type;
        dockerLessonTypePill.className = `lesson-type-badge font-mono ${data.type.toLowerCase()}-badge`;
      }

      // Render Content or Quiz
      if (data.type === 'Quiz' && data.quiz) {
        if (dockerLessonBodyContent) dockerLessonBodyContent.style.display = 'none';
        if (dockerLessonQuizContainer) {
          dockerLessonQuizContainer.style.display = 'block';
          if (dockerQuizQuestionText) dockerQuizQuestionText.textContent = data.quiz.question;
          if (dockerQuizOptionsList) {
            dockerQuizOptionsList.innerHTML = '';
            data.quiz.options.forEach((optText, idx) => {
              const optBtn = document.createElement('button');
              optBtn.className = 'quiz-option-btn';
              optBtn.innerHTML = `<span class="opt-key">${String.fromCharCode(65 + idx)}</span> <span class="opt-val">${optText}</span>`;
              optBtn.addEventListener('click', () => {
                const allBtns = dockerQuizOptionsList.querySelectorAll('.quiz-option-btn');
                allBtns.forEach((b) => (b.disabled = true));

                if (idx === data.quiz.correct) {
                  optBtn.classList.add('correct');
                  if (dockerQuizFeedbackBox) {
                    dockerQuizFeedbackBox.style.display = 'block';
                    dockerQuizFeedbackBox.className = 'quiz-feedback-box correct font-mono';
                    dockerQuizFeedbackBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.quiz.explanation}`;
                  }
                  dockerQuizzesDone = 2;
                  showToast("Quiz passed! Port forwarding concepts verified.");
                } else {
                  optBtn.classList.add('wrong');
                  if (allBtns[data.quiz.correct]) allBtns[data.quiz.correct].classList.add('correct');
                  if (dockerQuizFeedbackBox) {
                    dockerQuizFeedbackBox.style.display = 'block';
                    dockerQuizFeedbackBox.className = 'quiz-feedback-box wrong font-mono';
                    dockerQuizFeedbackBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Incorrect. ${data.quiz.explanation}`;
                  }
                  showToast("Review port binding and try again.");
                }
                updateDockerSidebarStats();
              });
              dockerQuizOptionsList.appendChild(optBtn);
            });
          }
          if (dockerQuizFeedbackBox) dockerQuizFeedbackBox.style.display = 'none';
        }
      } else {
        if (dockerLessonQuizContainer) dockerLessonQuizContainer.style.display = 'none';
        if (dockerLessonBodyContent) {
          dockerLessonBodyContent.style.display = 'block';
          dockerLessonBodyContent.innerHTML = data.bodyHtml || '';
        }
      }

      // Update Stepper Active and Done states
      dockerLessonStepperItems.forEach((item) => {
        const itemStep = parseInt(item.getAttribute('data-docker-step'), 10);
        if (itemStep === currentDockerStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }

        if (dockerCompletedSteps.has(itemStep) && itemStep !== currentDockerStep) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });

      // Update Nav Buttons
      if (dockerBtnLessonPrev) dockerBtnLessonPrev.disabled = currentDockerStep === 1;
      if (dockerBtnLessonNext) {
        if (currentDockerStep === 7) {
          dockerBtnLessonNext.innerHTML = `Complete Track <i class="fa-solid fa-flag-checkered"></i>`;
        } else {
          dockerBtnLessonNext.innerHTML = `Next &rarr;`;
        }
      }

      // Reset audio narration
      stopDockerAudioNarrator();
      updateDockerSidebarStats();
    }

    dockerLessonStepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const stepNum = item.getAttribute('data-docker-step');
        renderDockerLesson(stepNum);
      });
    });

    if (dockerBtnLessonPrev) {
      dockerBtnLessonPrev.addEventListener('click', () => {
        if (currentDockerStep > 1) renderDockerLesson(currentDockerStep - 1);
      });
    }

    if (dockerBtnLessonNext) {
      dockerBtnLessonNext.addEventListener('click', () => {
        if (currentDockerStep < 7) {
          renderDockerLesson(currentDockerStep + 1);
        } else {
          showToast("Docker Track Step 1 completed! Ready for Step 2.");
          setTimeout(() => {
            window.location.href = 'skill-docker.html';
          }, 1200);
        }
      });
    }

    function stopDockerAudioNarrator() {
      if (dockerVoiceInterval) clearInterval(dockerVoiceInterval);
      isDockerVoicePlaying = false;
      if (dockerVoiceIcon) dockerVoiceIcon.className = 'fa-solid fa-play';
      if (dockerVoiceStatusText) dockerVoiceStatusText.textContent = 'Explain this lesson';
      if (dockerBtnVoicePlay) dockerBtnVoicePlay.classList.remove('playing');
    }

    function toggleDockerAudioNarrator() {
      const data = dockerLessonsData[currentDockerStep];
      if (!data) return;

      if (isDockerVoicePlaying) {
        stopDockerAudioNarrator();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        showToast("Narrator paused");
      } else {
        isDockerVoicePlaying = true;
        if (dockerVoiceIcon) dockerVoiceIcon.className = 'fa-solid fa-pause';
        if (dockerVoiceStatusText) dockerVoiceStatusText.textContent = 'Playing explanation...';
        if (dockerBtnVoicePlay) dockerBtnVoicePlay.classList.add('playing');

        dockerVoiceSecondsRemaining = data.seconds || 150;
        dockerVoiceInterval = setInterval(() => {
          dockerVoiceSecondsRemaining--;
          const mins = Math.floor(dockerVoiceSecondsRemaining / 60);
          const secs = dockerVoiceSecondsRemaining % 60;
          if (dockerVoiceTimer) dockerVoiceTimer.textContent = `· ${mins}:${secs < 10 ? '0' : ''}${secs}`;

          if (dockerVoiceSecondsRemaining <= 0) {
            stopDockerAudioNarrator();
            showToast("Lesson audio walkthrough complete.");
          }
        }, 1000);

        if ('speechSynthesis' in window && data.voiceText) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.voiceText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
        showToast("Narrator started: Demonstrating concepts");
      }
    }

    if (dockerBtnVoicePlay) {
      dockerBtnVoicePlay.addEventListener('click', toggleDockerAudioNarrator);
    }

    // Live Terminal Controls
    if (dockerBtnStartLiveLab) {
      dockerBtnStartLiveLab.addEventListener('click', () => {
        isDockerLabRunning = true;
        if (dockerTerminalStandbyView) dockerTerminalStandbyView.style.display = 'none';
        if (dockerTerminalActiveView) dockerTerminalActiveView.style.display = 'flex';
        showToast("Live Linux Docker sandbox container booted.");
        if (dockerTerminalCliInput) dockerTerminalCliInput.focus();
      });
    }

    if (dockerTabAddBtn) {
      dockerTabAddBtn.addEventListener('click', () => {
        showToast("Terminal 2 opened in parallel session.");
      });
    }

    // Tools Drawer (Editor & Your Notes)
    if (dockerBtnToggleNotes && dockerToolsDrawer) {
      dockerBtnToggleNotes.addEventListener('click', () => {
        if (dockerDrawerTitle) dockerDrawerTitle.innerHTML = `<i class="fa-regular fa-note-sticky"></i> Your Notes`;
        dockerToolsDrawer.style.display = 'flex';
      });
    }

    if (dockerBtnToggleEditor && dockerToolsDrawer) {
      dockerBtnToggleEditor.addEventListener('click', () => {
        if (dockerDrawerTitle) dockerDrawerTitle.innerHTML = `<i class="fa-regular fa-file-code"></i> Dockerfile Editor`;
        dockerToolsDrawer.style.display = 'flex';
      });
    }

    if (dockerBtnCloseDrawer && dockerToolsDrawer) {
      dockerBtnCloseDrawer.addEventListener('click', () => {
        dockerToolsDrawer.style.display = 'none';
      });
    }

    function executeDockerWorkspaceCommand() {
      if (!dockerTerminalCliInput || !dockerTerminalViewport) return;
      const cmd = dockerTerminalCliInput.value.trim();
      if (!cmd) return;

      const userLine = document.createElement('div');
      userLine.className = 'term-line font-mono font-bold text-accent';
      userLine.textContent = `student@docker-box:~$ ${cmd}`;
      dockerTerminalViewport.appendChild(userLine);

      const outLine = document.createElement('div');
      outLine.className = 'term-line font-mono';

      const lower = cmd.toLowerCase();

      if (lower === 'clear') {
        dockerTerminalViewport.innerHTML = '';
        dockerTerminalCliInput.value = '';
        return;
      } else if (lower === 'help') {
        outLine.innerHTML = `
          Available Docker sandbox commands:<br>
          &bull; <span class="text-accent">docker run -d -p 80:80 nginx</span> - Run container in background<br>
          &bull; <span class="text-accent">docker ps</span> - List running containers<br>
          &bull; <span class="text-accent">docker images</span> - List local images<br>
          &bull; <span class="text-accent">docker logs &lt;id&gt;</span> - View container logs<br>
          &bull; <span class="text-accent">docker stop &lt;id&gt;</span> - Stop a running container<br>
          &bull; <span class="text-accent">docker version</span> - Show Docker engine version<br>
          &bull; <span class="text-accent">clear</span> - Clear screen
        `;
        dockerTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('docker run')) {
        outLine.innerHTML = `
          <span class="text-muted">Unable to find image 'nginx:latest' locally</span><br>
          <span class="text-muted">latest: Pulling from library/nginx</span><br>
          <span class="text-muted">a2abf6c4d29e: Pull complete</span><br>
          <span class="text-muted">Digest: sha256:4424e2037050e4521ec739d49a3e93734e79bec88f1807490f91a634e491f693</span><br>
          <span class="text-accent">7f93a1c8b930d4218a5f039a04918e7c10d3e2049b18204918</span>
        `;
        dockerTerminalViewport.appendChild(outLine);
        dockerTasksDone = 1;
        updateDockerSidebarStats();
        showToast("Task verified: Nginx container started on port 80!");
      } else if (lower.startsWith('docker ps')) {
        outLine.innerHTML = `
          CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                NAMES<br>
          <span class="text-accent">7f93a1c8b930</span>   nginx:latest   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:80->80/tcp   web-server
        `;
        dockerTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('docker images')) {
        outLine.innerHTML = `
          REPOSITORY   TAG       IMAGE ID       CREATED        SIZE<br>
          nginx        latest    a2abf6c4d29e   3 days ago     187MB<br>
          ubuntu       24.04     35a8814d94b1   2 weeks ago    77.8MB<br>
          alpine       latest    05455a08881e   1 month ago    7.38MB
        `;
        dockerTerminalViewport.appendChild(outLine);
      } else if (lower.startsWith('docker logs')) {
        outLine.innerHTML = `
          /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration<br>
          2026/10/06 01:05:00 [notice] 1#1: using the "epoll" event method<br>
          2026/10/06 01:05:00 [notice] 1#1: nginx/1.25.4<br>
          2026/10/06 01:05:00 [notice] 1#1: start worker processes
        `;
        dockerTerminalViewport.appendChild(outLine);
        showToast("Logs inspected successfully.");
      } else if (lower.startsWith('docker stop')) {
        outLine.innerHTML = `<span class="text-muted">7f93a1c8b930</span>`;
        dockerTerminalViewport.appendChild(outLine);
        showToast("Container stopped.");
      } else if (lower.startsWith('docker version')) {
        outLine.innerHTML = `
          Client: Docker Engine - Community<br>
          &nbsp;Version:           26.1.3<br>
          &nbsp;API version:       1.45<br>
          Server: Docker Engine - Community<br>
          &nbsp;Engine Version:    26.1.3
        `;
        dockerTerminalViewport.appendChild(outLine);
      } else {
        outLine.innerHTML = `<span class="text-muted">Command executed: ${cmd}. Run <span class="text-accent">help</span> for guidance.</span>`;
        dockerTerminalViewport.appendChild(outLine);
      }

      dockerTerminalCliInput.value = '';
      dockerTerminalViewport.scrollTop = dockerTerminalViewport.scrollHeight;
    }

    if (dockerBtnCliSubmit) {
      dockerBtnCliSubmit.addEventListener('click', executeDockerWorkspaceCommand);
    }

    if (dockerTerminalCliInput) {
      dockerTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeDockerWorkspaceCommand();
      });
    }

    if (dockerLessonThemeToggle) {
      dockerLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    // Initial render
    renderDockerLesson(1);
  }

  /* ==========================================================================
     28. HELM SKILL PAGE CONTROLLER (skill-helm.html)
     ========================================================================== */
  const helmStarRatingBox = document.getElementById('helm-star-rating-box');
  if (helmStarRatingBox) {
    const stars = helmStarRatingBox.querySelectorAll('.fa-star');
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '5', 10);
        stars.forEach((s) => {
          const r = parseInt(s.getAttribute('data-rating') || '0', 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        showToast(`Rated ${rating} out of 5 stars! Thank you.`);
      });
    });
  }

  const btnPreviewHelmCert = document.getElementById('btn-preview-helm-cert');
  if (btnPreviewHelmCert && certModal) {
    btnPreviewHelmCert.addEventListener('click', () => {
      certModal.style.display = 'flex';
    });
  }

  /* ==========================================================================
     29. HELM 4-COLUMN INTERACTIVE LESSON CONTROLLER (lesson-helm.html)
     ========================================================================== */
  const helmLessonStepperItems = document.querySelectorAll('#helm-sidebar-stepper-list .stepper-item');
  const helmLessonStepCounter = document.getElementById('helm-lesson-step-counter');
  const helmLessonHeading = document.getElementById('helm-lesson-heading');
  const helmLessonTypePill = document.getElementById('helm-lesson-type-pill');
  const helmLessonBodyContent = document.getElementById('helm-lesson-body-content');
  const helmLessonQuizContainer = document.getElementById('helm-lesson-quiz-container');
  const helmQuizQuestionText = document.getElementById('helm-quiz-question-text');
  const helmQuizOptionsList = document.getElementById('helm-quiz-options-list');
  const helmQuizFeedbackBox = document.getElementById('helm-quiz-feedback-box');
  const helmBtnLessonPrev = document.getElementById('helm-btn-lesson-prev');
  const helmBtnLessonNext = document.getElementById('helm-btn-lesson-next');

  const helmBtnVoicePlay = document.getElementById('helm-btn-voice-play');
  const helmVoiceIcon = document.getElementById('helm-voice-icon');
  const helmVoiceStatusText = document.getElementById('helm-voice-status-text');
  const helmVoiceTimer = document.getElementById('helm-voice-timer');

  const helmLessonProgressPercent = document.getElementById('helm-lesson-progress-percent');
  const helmLessonProgressArc = document.getElementById('helm-lesson-progress-arc');
  const helmStatDoneCount = document.getElementById('helm-stat-done-count');
  const helmStatQuizzesCount = document.getElementById('helm-stat-quizzes-count');
  const helmStatTasksCount = document.getElementById('helm-stat-tasks-count');

  const helmTabTerminalBtn = document.getElementById('helm-tab-terminal-btn');
  const helmTabAddBtn = document.getElementById('helm-tab-add-btn');
  const helmTerminalStandbyView = document.getElementById('helm-terminal-standby-view');
  const helmTerminalActiveView = document.getElementById('helm-terminal-active-view');
  const helmBtnStartLiveLab = document.getElementById('helm-btn-start-live-lab');
  const helmTerminalViewport = document.getElementById('helm-terminal-viewport');
  const helmTerminalCliInput = document.getElementById('helm-terminal-cli-input');
  const helmBtnCliSubmit = document.getElementById('helm-btn-cli-submit');
  const helmLessonThemeToggle = document.getElementById('btn-helm-lesson-theme-toggle');

  const helmBtnToggleEditor = document.getElementById('helm-btn-toggle-editor');
  const helmBtnToggleNotes = document.getElementById('helm-btn-toggle-notes');
  const helmToolsDrawer = document.getElementById('helm-tools-drawer');
  const helmBtnCloseDrawer = document.getElementById('helm-btn-close-drawer');
  const helmDrawerTitle = document.getElementById('helm-drawer-title');

  if (helmLessonStepperItems.length > 0) {

    const helmLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'The problem with plain Kubernetes YAML',
        duration: '· 3:51',
        seconds: 231,
        voiceText: "In this lesson you will learn the three problems that plain Kubernetes YAML creates as your apps grow. These three problems are the reason Helm exists.",
        bodyHtml: `
          <p>
            In this lesson you will learn the three problems that plain Kubernetes YAML creates as your apps grow. These three problems are the reason Helm exists.
          </p>
          <p>
            You already know how to deploy with kubectl. Write a Deployment manifest, apply it, done. So why does another tool exist on top of that? Watch what happens when the app gets real.
          </p>
          <h3 class="lesson-section-subtitle text-accent" style="color: var(--accent-green); font-size: 16px; font-weight: 700; margin: 24px 0 12px 0;">Problem 1: many files, no unit</h3>
          <p>
            A real app is not one manifest. A web frontend, an API, a worker, and Redis. Each piece needs a Deployment and a Service. Add a ConfigMap, a Secret, an Ingress. Count the files: ten, maybe fifteen.
          </p>
          <p>
            Now ask the cluster a simple question: what is "the app" here? It cannot answer. Kubernetes sees fifteen separate objects and nothing that groups them. Installing means applying every file. Removing means remembering every file and deleting each object yourself. Forget one, and it quietly keeps running.
          </p>
          <p>
            Here is the shape of the problem:
          </p>
          <div class="docker-arch-diagram font-mono">
            <div class="arch-box client" style="border-color: rgba(39, 122, 159, 0.4);">
              <div class="arch-title" style="color: #277a9f;"><i class="fa-solid fa-file-code"></i> Plain YAML Manifests</div>
              <div class="arch-desc">15+ separate disjointed files: Deployment.yaml, Service.yaml, Ingress.yaml, ConfigMap.yaml. No single app identity.</div>
            </div>
            <div class="arch-arrow">➜ VS ➜</div>
            <div class="arch-box daemon" style="border-color: rgba(34, 229, 132, 0.4);">
              <div class="arch-title" style="color: var(--accent-green);"><i class="fa-solid fa-dharmachakra"></i> 1 Helm Chart</div>
              <div class="arch-desc">Single release unit: <code>helm install my-app ./chart</code> and <code>helm uninstall my-app</code>. Full lifecycle management.</div>
            </div>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'What Helm is',
        duration: '· 2:10',
        seconds: 130,
        voiceText: "Helm is the package manager for Kubernetes. It packages manifests into charts, manages releases, and gives you a single unit to install, upgrade, and delete.",
        bodyHtml: `
          <p>
            <strong>Helm</strong> solves the multi-manifest problem by introducing the concept of a <strong>Package</strong> (Chart) for Kubernetes.
          </p>
          <p>
            Think of Helm like <code>apt</code>, <code>yum</code>, or <code>homebrew</code>, but specifically built for Kubernetes clusters.
          </p>
          <div style="background: rgba(39, 122, 159, 0.08); border: 1px solid rgba(39, 122, 159, 0.3); border-radius: 8px; padding: 18px; margin: 18px 0;">
            <h4 style="color: #38bdf8; margin-top: 0; margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-layer-group"></i> Key Capabilities of Helm:</h4>
            <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px; margin-bottom: 0;">
              <li><strong>Atomic Deployments:</strong> Install all 15 manifests in a single command. If one fails, the release can be safely rolled back.</li>
              <li><strong>Templating Engine:</strong> Parameterize image tags, replica counts, ports, and domain names using Go templates.</li>
              <li><strong>Versioned Releases:</strong> Track every deploy revision with <code>helm history</code> and roll back with <code>helm rollback</code>.</li>
            </ul>
          </div>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'Charts, releases, and repos...',
        duration: '· 2:40',
        seconds: 160,
        voiceText: "Let's explore the structure of a Helm chart: Chart.yaml for metadata, values.yaml for default configuration, and templates directory for parameterized Kubernetes YAML manifests.",
        bodyHtml: `
          <p>
            To understand Helm, you need to master three fundamental concepts:
          </p>
          <div class="docker-arch-diagram font-mono" style="grid-template-columns: 1fr 1fr 1fr;">
            <div class="arch-box client" style="border-color: rgba(56, 189, 248, 0.4);">
              <div class="arch-title" style="color: #38bdf8;"><i class="fa-solid fa-box-archive"></i> Chart</div>
              <div class="arch-desc">The template blueprint (Chart.yaml, values.yaml, templates/).</div>
            </div>
            <div class="arch-box daemon" style="border-color: rgba(34, 229, 132, 0.4);">
              <div class="arch-title" style="color: var(--accent-green);"><i class="fa-solid fa-server"></i> Release</div>
              <div class="arch-desc">A running instance in Kubernetes created by <code>helm install</code>.</div>
            </div>
            <div class="arch-box registry" style="border-color: rgba(239, 107, 74, 0.4);">
              <div class="arch-title" style="color: #ef6b4a;"><i class="fa-solid fa-globe"></i> Repository</div>
              <div class="arch-desc">An HTTP / OCI registry where charts are published and shared.</div>
            </div>
          </div>
          <p>
            Every chart has a standardized folder structure:
          </p>
          <div class="code-block-wrapper">
            <div class="code-lang-label font-mono">CHART STRUCTURE</div>
            <pre><code>mychart/
  ├── Chart.yaml          # Chart metadata (name, version, appVersion)
  ├── values.yaml         # Default configuration values
  ├── charts/             # Dependency charts
  └── templates/          # Go templates rendered into Kubernetes manifests
      ├── deployment.yaml
      ├── service.yaml
      └── _helpers.tpl</code></pre>
          </div>
        `
      },
      4: {
        stepNum: 4,
        type: 'Task',
        title: 'Check your Helm setup',
        duration: '· 2:30',
        seconds: 150,
        voiceText: "Hands-on task: Start your live lab session on the right, run helm version, and check cluster connectivity with kubectl get nodes.",
        bodyHtml: `
          <p>
            Now let's verify that your Helm CLI and local Kubernetes test cluster are healthy.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK: CHECK YOUR HELM SETUP</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Click <strong>&gt;_ Start Lab</strong> in the right terminal panel.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">2. Run <code class="text-accent">helm version</code> to verify the Helm client build.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">3. Run <code class="text-accent">kubectl get nodes</code> to verify connection to the kind Kubernetes node.</p>
            <p style="margin-bottom: 0; color: #d1d5db;">4. Run <code class="text-accent">helm list</code> to inspect existing releases.</p>
          </div>
          <p class="text-muted font-mono" style="font-size: 12px;">
            The sandbox terminal will auto-verify your command execution and record your score.
          </p>
        `
      }
    };

    let currentHelmStep = 1;
    let helmCompletedSteps = new Set([1]);
    let isHelmVoicePlaying = false;
    let helmVoiceInterval = null;
    let helmVoiceSecondsRemaining = 231;
    let isHelmLabRunning = false;
    let helmTasksDone = 0;

    function updateHelmSidebarStats() {
      const doneCount = helmCompletedSteps.size;
      const totalSteps = Object.keys(helmLessonsData).length;
      const pct = Math.round((doneCount / totalSteps) * 100);

      if (helmLessonProgressPercent) helmLessonProgressPercent.textContent = `${pct}%`;
      if (helmLessonProgressArc) {
        const offset = 264 - (264 * pct) / 100;
        helmLessonProgressArc.style.strokeDashoffset = offset;
      }
      if (helmStatDoneCount) helmStatDoneCount.textContent = `${doneCount}`;
      if (helmStatQuizzesCount) helmStatQuizzesCount.textContent = `0/0`;
      if (helmStatTasksCount) helmStatTasksCount.textContent = `${helmTasksDone}/1`;
    }

    function renderHelmLesson(stepNum) {
      const data = helmLessonsData[stepNum];
      if (!data) return;

      currentHelmStep = stepNum;

      if (helmLessonStepCounter) {
        helmLessonStepCounter.textContent = `LESSON · ${stepNum} OF ${Object.keys(helmLessonsData).length}`;
      }
      if (helmLessonTypePill) {
        helmLessonTypePill.textContent = data.type;
        helmLessonTypePill.className = `lesson-type-badge font-mono ${data.type.toLowerCase()}-pill`;
      }
      if (helmLessonHeading) {
        helmLessonHeading.textContent = data.title;
      }

      if (helmVoiceTimer) {
        helmVoiceTimer.textContent = data.duration;
      }
      helmVoiceSecondsRemaining = data.seconds;
      stopHelmVoice();

      if (data.type === 'Quiz' && data.quiz) {
        if (helmLessonBodyContent) helmLessonBodyContent.style.display = 'none';
        if (helmLessonQuizContainer) {
          helmLessonQuizContainer.style.display = 'block';
          if (helmQuizQuestionText) helmQuizQuestionText.textContent = data.quiz.question;
          if (helmQuizFeedbackBox) helmQuizFeedbackBox.style.display = 'none';

          if (helmQuizOptionsList) {
            helmQuizOptionsList.innerHTML = '';
            data.quiz.options.forEach((opt, idx) => {
              const optBtn = document.createElement('button');
              optBtn.className = 'quiz-option-btn font-mono';
              optBtn.innerHTML = `
                <span class="opt-key font-bold text-accent">${String.fromCharCode(65 + idx)}.</span>
                <span class="opt-text">${opt}</span>
              `;
              optBtn.addEventListener('click', () => {
                const isCorrect = idx === data.quiz.correct;
                const allBtns = helmQuizOptionsList.querySelectorAll('.quiz-option-btn');
                allBtns.forEach((b) => (b.disabled = true));

                if (isCorrect) {
                  optBtn.classList.add('correct');
                  if (helmQuizFeedbackBox) {
                    helmQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                    helmQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                    helmQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                    helmQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${data.quiz.explanation}`;
                    helmQuizFeedbackBox.style.display = 'block';
                  }
                  helmCompletedSteps.add(stepNum);
                  updateHelmSidebarStats();
                  showToast("Quiz passed! +50 XP");
                } else {
                  optBtn.classList.add('wrong');
                  if (allBtns[data.quiz.correct]) allBtns[data.quiz.correct].classList.add('correct');
                  if (helmQuizFeedbackBox) {
                    helmQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                    helmQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                    helmQuizFeedbackBox.style.border = '1px solid #ef4444';
                    helmQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${data.quiz.explanation}`;
                    helmQuizFeedbackBox.style.display = 'block';
                  }
                }
              });
              helmQuizOptionsList.appendChild(optBtn);
            });
          }
        }
      } else {
        if (helmLessonQuizContainer) helmLessonQuizContainer.style.display = 'none';
        if (helmLessonBodyContent) {
          helmLessonBodyContent.style.display = 'block';
          helmLessonBodyContent.innerHTML = data.bodyHtml;
        }
        helmCompletedSteps.add(stepNum);
        updateHelmSidebarStats();
      }

      helmLessonStepperItems.forEach((item) => {
        const itemStep = parseInt(item.getAttribute('data-helm-step') || item.getAttribute('data-step') || '1', 10);
        if (itemStep === stepNum) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }

        if (helmCompletedSteps.has(itemStep)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });

      if (helmBtnLessonPrev) helmBtnLessonPrev.disabled = stepNum <= 1;
      if (helmBtnLessonNext) {
        if (stepNum >= Object.keys(helmLessonsData).length) {
          helmBtnLessonNext.innerHTML = 'Finish Topic <i class="fa-solid fa-check"></i>';
        } else {
          helmBtnLessonNext.innerHTML = 'Next &rarr;';
        }
      }
    }

    function stopHelmVoice() {
      if (helmVoiceInterval) {
        clearInterval(helmVoiceInterval);
        helmVoiceInterval = null;
      }
      isHelmVoicePlaying = false;
      if (helmVoiceStatusText) helmVoiceStatusText.textContent = 'Explain this lesson';
      if (helmVoiceIcon) helmVoiceIcon.className = 'fa-solid fa-play';
    }

    if (helmBtnVoicePlay) {
      helmBtnVoicePlay.addEventListener('click', () => {
        if (isHelmVoicePlaying) {
          stopHelmVoice();
        } else {
          isHelmVoicePlaying = true;
          if (helmVoiceStatusText) helmVoiceStatusText.textContent = 'Playing explanation...';
          if (helmVoiceIcon) helmVoiceIcon.className = 'fa-solid fa-pause';

          showToast("Narration: " + (helmLessonsData[currentHelmStep]?.voiceText || ""));

          helmVoiceInterval = setInterval(() => {
            if (helmVoiceSecondsRemaining > 0) {
              helmVoiceSecondsRemaining--;
              const m = Math.floor(helmVoiceSecondsRemaining / 60);
              const s = helmVoiceSecondsRemaining % 60;
              if (helmVoiceTimer) {
                helmVoiceTimer.textContent = `· ${m}:${s < 10 ? '0' : ''}${s}`;
              }
            } else {
              stopHelmVoice();
              showToast("Explanation finished");
            }
          }, 1000);
        }
      });
    }

    helmLessonStepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-helm-step') || item.getAttribute('data-step') || '1', 10);
        renderHelmLesson(step);
      });
    });

    if (helmBtnLessonPrev) {
      helmBtnLessonPrev.addEventListener('click', () => {
        if (currentHelmStep > 1) {
          renderHelmLesson(currentHelmStep - 1);
        }
      });
    }

    if (helmBtnLessonNext) {
      helmBtnLessonNext.addEventListener('click', () => {
        if (currentHelmStep < Object.keys(helmLessonsData).length) {
          renderHelmLesson(currentHelmStep + 1);
        } else {
          showToast("🎉 Topic 01 Finished! Returned to Helm Curriculum.");
          setTimeout(() => {
            location.href = 'skill-helm.html';
          }, 1000);
        }
      });
    }

    // Terminal Commands
    if (helmBtnStartLiveLab) {
      helmBtnStartLiveLab.addEventListener('click', () => {
        if (helmTerminalStandbyView) helmTerminalStandbyView.style.display = 'none';
        if (helmTerminalActiveView) helmTerminalActiveView.style.display = 'flex';
        isHelmLabRunning = true;
        if (helmTerminalCliInput) helmTerminalCliInput.focus();
        showToast("✓ Helm sandbox ready.");
      });
    }

    function appendHelmTerminalLine(text, className = '') {
      if (!helmTerminalViewport) return;
      const line = document.createElement('div');
      line.className = `term-line ${className}`;
      line.textContent = text;
      helmTerminalViewport.appendChild(line);
      helmTerminalViewport.scrollTop = helmTerminalViewport.scrollHeight;
    }

    function executeHelmWorkspaceCommand() {
      if (!helmTerminalCliInput) return;
      const rawCmd = helmTerminalCliInput.value.trim();
      if (!rawCmd) return;

      appendHelmTerminalLine(`shaikh@helm-lab:~$ ${rawCmd}`, 'text-accent font-bold');
      helmTerminalCliInput.value = '';

      const cmd = rawCmd.toLowerCase();

      if (cmd === 'clear') {
        if (helmTerminalViewport) helmTerminalViewport.innerHTML = '<div class="term-line text-muted">Screen cleared. Type helm commands below:</div>';
        return;
      }

      if (cmd === 'help') {
        appendHelmTerminalLine("Available commands:", "text-green-glow");
        appendHelmTerminalLine("  helm version                     - Print Helm client version");
        appendHelmTerminalLine("  helm list                        - List releases in current namespace");
        appendHelmTerminalLine("  helm search repo <keyword>       - Search charts in configured repos");
        appendHelmTerminalLine("  helm install <name> <chart>      - Install a chart release");
        appendHelmTerminalLine("  helm status <release>            - Print release status");
        appendHelmTerminalLine("  kubectl get pods                 - List Kubernetes pods");
        appendHelmTerminalLine("  kubectl get nodes                - List cluster nodes");
        appendHelmTerminalLine("  clear                            - Clear terminal screen");
        return;
      }

      if (cmd === 'helm version' || cmd === 'helm -v' || cmd === 'helm --version') {
        appendHelmTerminalLine('version.BuildInfo{Version:"v3.14.0", GitCommit:"3fc3f4c2638e12d92c5102f5180eec5e047f9a66", GitTreeState:"clean", GoVersion:"go1.21.6"}', 'text-green-glow');
        if (currentHelmStep === 4) {
          helmTasksDone = 1;
          helmCompletedSteps.add(4);
          updateHelmSidebarStats();
          showToast("✓ Step 4 Task Verified: Helm CLI checked! +50 XP");
        }
        return;
      }

      if (cmd === 'kubectl get nodes' || cmd === 'kubectl get node') {
        appendHelmTerminalLine("NAME                 STATUS   ROLES           AGE   VERSION", "font-mono");
        appendHelmTerminalLine("kind-control-plane   Ready    control-plane   12m   v1.28.0", "font-mono text-green-glow");
        if (currentHelmStep === 4) {
          helmTasksDone = 1;
          helmCompletedSteps.add(4);
          updateHelmSidebarStats();
          showToast("✓ Step 4 Task Verified: Kubernetes cluster nodes ready! +50 XP");
        }
        return;
      }

      if (cmd.startsWith('helm search')) {
        appendHelmTerminalLine("NAME                     CHART VERSION   APP VERSION   DESCRIPTION", "font-mono");
        appendHelmTerminalLine("bitnami/nginx            15.4.4          1.25.3        NGINX Open Source is an open-source reverse proxy", "font-mono");
        appendHelmTerminalLine("bitnami/redis            18.6.1          7.2.3         Redis in-memory key-value database", "font-mono");
        appendHelmTerminalLine("bitnami/postgresql       13.2.2          16.1.0        PostgreSQL object-relational database system", "font-mono");
        return;
      }

      if (cmd.startsWith('helm install')) {
        appendHelmTerminalLine("NAME: my-nginx", "text-green-glow");
        appendHelmTerminalLine("LAST DEPLOYED: Tue Oct  6 01:40:00 2026");
        appendHelmTerminalLine("NAMESPACE: default");
        appendHelmTerminalLine("STATUS: deployed");
        appendHelmTerminalLine("REVISION: 1");
        appendHelmTerminalLine("TEST SUITE: None");
        appendHelmTerminalLine("NOTES:");
        appendHelmTerminalLine("NGINX can be accessed via port 80 on the following DNS name: my-nginx.default.svc.cluster.local");
        return;
      }

      if (cmd === 'helm list' || cmd === 'helm ls') {
        appendHelmTerminalLine("NAME        NAMESPACE   REVISION   UPDATED                                  STATUS     CHART          APP VERSION", "font-mono");
        appendHelmTerminalLine("my-nginx    default     1          2026-10-06 01:40:00.124578 +0530 IST     deployed   nginx-15.4.4   1.25.3", "font-mono");
        if (currentHelmStep === 4) {
          helmTasksDone = 1;
          helmCompletedSteps.add(4);
          updateHelmSidebarStats();
          showToast("✓ Step 4 Task Verified: Helm releases checked! +50 XP");
        }
        return;
      }

      if (cmd.startsWith('helm status')) {
        appendHelmTerminalLine("NAME: my-nginx");
        appendHelmTerminalLine("LAST DEPLOYED: Tue Oct  6 01:40:00 2026");
        appendHelmTerminalLine("STATUS: deployed");
        appendHelmTerminalLine("REVISION: 1");
        return;
      }

      if (cmd.startsWith('kubectl get pods') || cmd.startsWith('kubectl get po')) {
        appendHelmTerminalLine("NAME                        READY   STATUS    RESTARTS   AGE", "font-mono");
        appendHelmTerminalLine("my-nginx-7c4f69f8d5-4k8z9   1/1     Running   0          42s", "font-mono text-green-glow");
        return;
      }

      appendHelmTerminalLine(`bash: ${rawCmd.split(' ')[0]}: command executed.`);
    }

    if (helmBtnCliSubmit) {
      helmBtnCliSubmit.addEventListener('click', executeHelmWorkspaceCommand);
    }
    if (helmTerminalCliInput) {
      helmTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeHelmWorkspaceCommand();
      });
    }

    // Tools Drawer
    if (helmBtnToggleNotes) {
      helmBtnToggleNotes.addEventListener('click', () => {
        if (helmToolsDrawer) helmToolsDrawer.style.display = 'flex';
      });
    }
    if (helmBtnToggleEditor) {
      helmBtnToggleEditor.addEventListener('click', () => {
        if (helmToolsDrawer) helmToolsDrawer.style.display = 'flex';
        if (helmDrawerTitle) helmDrawerTitle.innerHTML = '<i class="fa-solid fa-code"></i> Code Editor';
      });
    }
    if (helmBtnCloseDrawer) {
      helmBtnCloseDrawer.addEventListener('click', () => {
        if (helmToolsDrawer) helmToolsDrawer.style.display = 'none';
      });
    }

    if (helmLessonThemeToggle) {
      helmLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    renderHelmLesson(1);
  }

  /* ==========================================================================
     30. ARGO CD SKILL PAGE CONTROLLER (skill-argocd.html)
     ========================================================================== */
  const argocdStarRatingBox = document.getElementById('argocd-star-rating-box');
  if (argocdStarRatingBox) {
    const stars = argocdStarRatingBox.querySelectorAll('.fa-star');
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '5', 10);
        stars.forEach((s) => {
          const r = parseInt(s.getAttribute('data-rating') || '0', 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        showToast(`Rated ${rating} out of 5 stars! Thank you.`);
      });
    });
  }

  const btnPreviewArgocdCert = document.getElementById('btn-preview-argocd-cert');
  if (btnPreviewArgocdCert && certModal) {
    btnPreviewArgocdCert.addEventListener('click', () => {
      certModal.style.display = 'flex';
    });
  }

  /* ==========================================================================
     31. ARGO CD 4-COLUMN INTERACTIVE LESSON CONTROLLER (lesson-argocd.html)
     ========================================================================== */
  const argocdLessonStepperItems = document.querySelectorAll('#argo-sidebar-stepper-list .stepper-item, #argocd-sidebar-stepper-list .stepper-item');
  const argocdLessonStepCounter = document.getElementById('argo-lesson-step-counter') || document.getElementById('argocd-lesson-step-counter');
  const argocdLessonHeading = document.getElementById('argo-lesson-heading') || document.getElementById('argocd-lesson-heading');
  const argocdLessonTypePill = document.getElementById('argo-lesson-type-pill') || document.getElementById('argocd-lesson-type-pill');
  const argocdLessonBodyContent = document.getElementById('argo-lesson-body-content') || document.getElementById('argocd-lesson-body-content');
  const argocdLessonQuizContainer = document.getElementById('argo-lesson-quiz-container') || document.getElementById('argocd-lesson-quiz-container');
  const argocdQuizQuestionText = document.getElementById('argo-quiz-question-text') || document.getElementById('argocd-quiz-question-text');
  const argocdQuizOptionsList = document.getElementById('argo-quiz-options-list') || document.getElementById('argocd-quiz-options-list');
  const argocdQuizFeedbackBox = document.getElementById('argo-quiz-feedback-box') || document.getElementById('argocd-quiz-feedback-box');
  const argocdBtnLessonPrev = document.getElementById('argo-btn-lesson-prev') || document.getElementById('argocd-btn-lesson-prev');
  const argocdBtnLessonNext = document.getElementById('argo-btn-lesson-next') || document.getElementById('argocd-btn-lesson-next');

  const argocdBtnVoicePlay = document.getElementById('argo-btn-voice-play') || document.getElementById('argocd-btn-voice-play');
  const argocdVoiceIcon = document.getElementById('argo-voice-icon') || document.getElementById('argocd-voice-icon');
  const argocdVoiceStatusText = document.getElementById('argo-voice-status-text') || document.getElementById('argocd-voice-status-text');
  const argocdVoiceTimer = document.getElementById('argo-voice-timer') || document.getElementById('argocd-voice-timer');

  const argocdLessonProgressPercent = document.getElementById('argo-lesson-progress-percent') || document.getElementById('argocd-lesson-progress-percent');
  const argocdLessonProgressArc = document.getElementById('argo-lesson-progress-arc') || document.getElementById('argocd-lesson-progress-arc');
  const argocdStatDoneCount = document.getElementById('argo-stat-done-count') || document.getElementById('argocd-stat-done-count');
  const argocdStatQuizzesCount = document.getElementById('argo-stat-quizzes-count') || document.getElementById('argocd-stat-quizzes-count');
  const argocdStatTasksCount = document.getElementById('argo-stat-tasks-count') || document.getElementById('argocd-stat-tasks-count');

  const argocdTabTerminalBtn = document.getElementById('argo-tab-terminal-btn') || document.getElementById('argocd-tab-terminal-btn');
  const argocdTabAddBtn = document.getElementById('argo-tab-add-btn') || document.getElementById('argocd-tab-add-btn');
  const argocdTerminalStandbyView = document.getElementById('argo-terminal-standby-view') || document.getElementById('argocd-terminal-standby-view');
  const argocdTerminalActiveView = document.getElementById('argo-terminal-active-view') || document.getElementById('argocd-terminal-active-view');
  const argocdBtnStartLiveLab = document.getElementById('argo-btn-start-live-lab') || document.getElementById('argocd-btn-start-live-lab');
  const argocdTerminalViewport = document.getElementById('argo-terminal-viewport') || document.getElementById('argocd-terminal-viewport');
  const argocdTerminalCliInput = document.getElementById('argo-terminal-cli-input') || document.getElementById('argocd-terminal-cli-input');
  const argocdBtnCliSubmit = document.getElementById('argo-btn-cli-submit') || document.getElementById('argocd-btn-cli-submit');
  const argocdLessonThemeToggle = document.getElementById('btn-argo-lesson-theme-toggle') || document.getElementById('btn-argocd-lesson-theme-toggle');

  const argocdBtnToggleEditor = document.getElementById('argo-btn-toggle-editor') || document.getElementById('argocd-btn-toggle-editor');
  const argocdBtnToggleNotes = document.getElementById('argo-btn-toggle-notes') || document.getElementById('argocd-btn-toggle-notes');
  const argocdToolsDrawer = document.getElementById('argo-tools-drawer') || document.getElementById('argocd-tools-drawer');
  const argocdBtnCloseDrawer = document.getElementById('argo-btn-close-drawer') || document.getElementById('argocd-btn-close-drawer');
  const argocdDrawerTitle = document.getElementById('argo-drawer-title') || document.getElementById('argocd-drawer-title');

  if (argocdLessonStepperItems.length > 0) {

    const argocdLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What is GitOps?',
        duration: '· 4:27',
        seconds: 267,
        voiceText: "In this lesson you will learn what GitOps is and why teams use it. GitOps fixes configuration drift with one rule: keep YAML files in Git, and an in-cluster controller makes the cluster match them.",
        bodyHtml: `
          <p>
            In this lesson you will learn what GitOps is and why teams use it.
          </p>
          <p>
            Think about how an app gets updated on a Kubernetes cluster today. A developer builds a new image. A DevOps engineer with access to the cluster edits a YAML file, or runs a kubectl command, and the new version starts. Tomorrow another DevOps engineer does the same for a different app. After a month, nobody can say for sure what is running, who changed it, or why.
          </p>
          <p>
            GitOps fixes this with one rule. You keep the YAML files for the cluster in Git, and a program inside the cluster reads those files and makes the cluster match them. Nobody changes the cluster directly. Let us start with the files.
          </p>

          <h3 class="lesson-section-subtitle text-accent" style="color: var(--accent-green); font-size: 16px; font-weight: 700; margin: 24px 0 12px 0;">The YAML files</h3>

          <p>
            Every app on a cluster can be described in YAML files. A file says what should exist: this Deployment, with this image, with this many replicas. Together, these files describe what you want the cluster to look like.
          </p>
          <p>
            This is called the <strong>desired state</strong>. The word <em>desired</em> is important. The files say what you want, not what is.
          </p>

          <div class="docker-arch-diagram font-mono">
            <div class="arch-box client" style="border-color: rgba(239, 107, 74, 0.4);">
              <div class="arch-title" style="color: #ef6b4a;"><i class="fa-brands fa-git-alt"></i> Git Repository</div>
              <div class="arch-desc">Desired State (Declarative YAML files) · Single source of truth with commit audit log.</div>
            </div>
            <div class="arch-arrow">⟵ Sync Loop ⟶</div>
            <div class="arch-box daemon" style="border-color: rgba(34, 229, 132, 0.4);">
              <div class="arch-title" style="color: var(--accent-green);"><i class="fa-solid fa-circle-nodes"></i> Live Cluster</div>
              <div class="arch-desc">Actual State · Argo CD continuously reconciles discrepancies and self-heals drift.</div>
            </div>
          </div>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'Why teams use GitOps',
        duration: '· 2:35',
        seconds: 155,
        voiceText: "Why do teams use GitOps? It provides complete audit trails through Git commits, instant disaster recovery, developer-friendly pull requests, and automated rollback.",
        bodyHtml: `
          <p>
            Engineering organizations adopt GitOps because it fundamentally solves four critical operational challenges:
          </p>
          <div style="background: rgba(34, 229, 132, 0.05); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 18px 0;">
            <ul style="color: #d1d5db; line-height: 1.8; margin-left: 20px; margin-bottom: 0;">
              <li><strong>1. Complete Audit Trail:</strong> Every change to infrastructure is a Git commit with an author, timestamp, and review approvals.</li>
              <li><strong>2. Fast Disaster Recovery:</strong> If a cluster is lost, recreate it and point Argo CD at the Git repo. The entire environment restores in minutes.</li>
              <li><strong>3. Instant Rollbacks:</strong> Reverting a broken release is as simple as <code>git revert</code>. Argo CD immediately synchronizes the previous stable state.</li>
              <li><strong>4. Stronger Security:</strong> Developers do not need direct <code>kubectl</code> cluster access. All changes go through reviewed Pull Requests.</li>
            </ul>
          </div>
        `
      },
      3: {
        stepNum: 3,
        type: 'Lesson',
        title: 'Changes without GitOps',
        duration: '· 2:15',
        seconds: 135,
        voiceText: "Without GitOps, engineers run kubectl edit or kubectl apply from local laptops. Configuration drift accumulates, and disaster recovery requires guessing what was deployed.",
        bodyHtml: `
          <p>
            Let's compare life before and after GitOps:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #94a3b8;">
                <th style="text-align: left; padding: 8px;">Activity</th>
                <th style="text-align: left; padding: 8px; color: #ef4444;">Without GitOps</th>
                <th style="text-align: left; padding: 8px; color: var(--accent-green);">With GitOps</th>
              </tr>
            </thead>
            <tbody style="color: #cbd5e1; line-height: 1.6;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <td style="padding: 8px; font-weight: 600;">Deploying App</td>
                <td style="padding: 8px;"><code>kubectl apply</code> from local machine</td>
                <td style="padding: 8px;">Merge PR into Git main branch</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <td style="padding: 8px; font-weight: 600;">Hotfix change</td>
                <td style="padding: 8px;"><code>kubectl edit deployment</code> (undocumented)</td>
                <td style="padding: 8px;">Git commit (reviewed & audited)</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: 600;">Config Drift</td>
                <td style="padding: 8px;">Permanent & untracked</td>
                <td style="padding: 8px;">Detected & Auto-remediated by Argo CD</td>
              </tr>
            </tbody>
          </table>
        `
      },
      4: {
        stepNum: 4,
        type: 'Task',
        title: 'Change a Deployment by...',
        duration: '· 3:00',
        seconds: 180,
        voiceText: "Hands-on task: Click Start Lab on the right, run argocd version and kubectl get pods -n argocd to verify the Argo CD controller is running.",
        bodyHtml: `
          <p>
            Let's inspect your live Argo CD controller in the cluster sandbox.
          </p>
          <div class="task-instructions-box font-mono" style="background: rgba(34, 229, 132, 0.04); border: 1px solid rgba(34, 229, 132, 0.2); border-radius: 8px; padding: 18px; margin: 20px 0;">
            <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;"><i class="fa-solid fa-terminal"></i> LAB TASK: CHECK ARGO CD CONTROLLER</div>
            <p style="margin-bottom: 8px; color: #d1d5db;">1. Click <strong>&gt;_ Start Lab</strong> in the right terminal panel.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">2. Run <code class="text-accent">kubectl get pods -n argocd</code> to check repo-server, application-controller, and server pods.</p>
            <p style="margin-bottom: 8px; color: #d1d5db;">3. Run <code class="text-accent">argocd version</code> to check CLI and API server connectivity.</p>
            <p style="margin-bottom: 0; color: #d1d5db;">4. Run <code class="text-accent">argocd app list</code> to see managed GitOps applications.</p>
          </div>
          <p class="text-muted font-mono" style="font-size: 12px;">
            The sandbox will verify your commands and update your progress.
          </p>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'The four OpenGitOps pri...',
        duration: '· 3:10',
        seconds: 190,
        voiceText: "The OpenGitOps CNCF standard defines four core principles: Declarative state, Versioned and immutable storage, Pulled automatically by software agents, and Continuously reconciled.",
        bodyHtml: `
          <p>
            The <strong>OpenGitOps</strong> standard (CNCF) defines 4 universal principles:
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 14px;">
              <strong class="text-accent" style="color: #38bdf8;">1. Declarative</strong>
              <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #cbd5e1;">A system managed by GitOps must have its desired state expressed declaratively (YAML manifests, Helm values).</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 14px;">
              <strong class="text-accent" style="color: #38bdf8;">2. Versioned & Immutable</strong>
              <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #cbd5e1;">Desired state is stored in a version control system (Git) that supports versioning, immutability, and full commit history.</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 14px;">
              <strong class="text-accent" style="color: var(--accent-green);">3. Pulled Automatically</strong>
              <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #cbd5e1;">Software agents automatically pull the desired state declarations from Git without opening inbound cluster firewall ports.</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 14px;">
              <strong class="text-accent" style="color: var(--accent-green);">4. Continuously Reconciled</strong>
              <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #cbd5e1;">Software agents continuously monitor actual system state and apply self-healing whenever drift occurs.</p>
            </div>
          </div>
        `
      },
      6: {
        stepNum: 6,
        type: 'Quiz',
        title: 'Concept Check: GitOps Core',
        duration: '· 1:30',
        seconds: 90,
        voiceText: "Concept check on GitOps core concepts.",
        quiz: {
          question: "What is the primary principle of GitOps regarding the source of truth?",
          options: [
            "The live Kubernetes etcd database is the source of truth",
            "Git is the single immutable source of truth for both application and infrastructure state",
            "The Docker registry image tags define the system state",
            "The CI pipeline server database holds the truth"
          ],
          correct: 1,
          explanation: "Correct! In GitOps, Git is the single source of truth. The cluster state is continuously reconciled to match Git."
        }
      },
      7: {
        stepNum: 7,
        type: 'Lesson',
        title: 'Pull vs Push in CI/CD',
        duration: '· 2:40',
        seconds: 160,
        voiceText: "In a push model, CI servers need cluster admin credentials and push manifests. In the GitOps pull model, Argo CD runs inside the cluster and pulls desired state securely.",
        bodyHtml: `
          <p>
            Traditional CI/CD uses a <strong>Push Model</strong>:
          </p>
          <div class="docker-arch-diagram font-mono">
            <div class="arch-box client" style="border-color: rgba(239, 68, 68, 0.4);">
              <div class="arch-title" style="color: #ef4444;"><i class="fa-solid fa-cloud-arrow-up"></i> Push CI/CD</div>
              <div class="arch-desc">CI runner holds high-privilege kubeconfig credentials and pushes <code>kubectl apply</code> into the cluster.</div>
            </div>
            <div class="arch-arrow">➜ VS ➜</div>
            <div class="arch-box daemon" style="border-color: rgba(34, 229, 132, 0.4);">
              <div class="arch-title" style="color: var(--accent-green);"><i class="fa-solid fa-arrows-rotate"></i> Pull GitOps (Argo CD)</div>
              <div class="arch-desc">Argo CD agent runs inside the cluster, observes Git repository, and pulls changes with zero external firewall ingress.</div>
            </div>
          </div>
        `
      },
      8: {
        stepNum: 8,
        type: 'Quiz',
        title: 'Concept Check: Pull Model',
        duration: '· 1:30',
        seconds: 90,
        voiceText: "Concept check on why the pull model provides enhanced security.",
        quiz: {
          question: "Why is the GitOps pull model more secure than traditional push CI/CD?",
          options: [
            "Because YAML manifests are automatically encrypted",
            "Because cluster admin credentials never leave the cluster and no inbound firewall ports need to be exposed",
            "Because Git blocks unauthorized users from reading repositories",
            "Because Kubernetes only allows read-only HTTP connections"
          ],
          correct: 1,
          explanation: "Correct! In the pull model, Argo CD lives inside the Kubernetes cluster with internal RBAC. CI servers do not require direct cluster API credentials."
        }
      },
      9: {
        stepNum: 9,
        type: 'Quiz',
        title: 'Concept Check: Drift & Self-Heal',
        duration: '· 1:30',
        seconds: 90,
        voiceText: "Final quiz for Argo CD Module 1 on automated self-healing and drift detection.",
        quiz: {
          question: "What happens when someone manually edits a Kubernetes Deployment in the cluster when Argo CD selfHeal is enabled?",
          options: [
            "Argo CD updates the Git repository with the changes",
            "Argo CD detects the out-of-sync drift and automatically reverts the cluster to match Git",
            "Argo CD disables synchronization until an admin approves",
            "Kubernetes terminates the cluster nodes"
          ],
          correct: 1,
          explanation: "Correct! When self-healing is enabled, Argo CD continuously detects configuration drift and automatically reverts live changes to match the declared Git state."
        }
      }
    };

    let currentArgoStep = 1;
    let argoCompletedSteps = new Set([1]);
    let isArgoVoicePlaying = false;
    let argoVoiceInterval = null;
    let argoVoiceSecondsRemaining = 267;
    let isArgoLabRunning = false;
    let argoTasksDone = 0;
    let argoQuizzesDone = 0;

    function updateArgoSidebarStats() {
      const doneCount = argoCompletedSteps.size;
      const totalSteps = Object.keys(argocdLessonsData).length;
      const pct = Math.round((doneCount / totalSteps) * 100);

      if (argocdLessonProgressPercent) argocdLessonProgressPercent.textContent = `${pct}%`;
      if (argocdLessonProgressArc) {
        const offset = 264 - (264 * pct) / 100;
        argocdLessonProgressArc.style.strokeDashoffset = offset;
      }
      if (argocdStatDoneCount) argocdStatDoneCount.textContent = `${doneCount}`;
      if (argocdStatQuizzesCount) argocdStatQuizzesCount.textContent = `${argoQuizzesDone}/3`;
      if (argocdStatTasksCount) argocdStatTasksCount.textContent = `${argoTasksDone}/1`;
    }

    function renderArgoLesson(stepNum) {
      const data = argocdLessonsData[stepNum];
      if (!data) return;

      currentArgoStep = stepNum;

      if (argocdLessonStepCounter) {
        argocdLessonStepCounter.textContent = `LESSON · ${stepNum} OF ${Object.keys(argocdLessonsData).length}`;
      }
      if (argocdLessonTypePill) {
        argocdLessonTypePill.textContent = data.type;
        argocdLessonTypePill.className = `lesson-type-badge font-mono ${data.type.toLowerCase()}-pill`;
      }
      if (argocdLessonHeading) {
        argocdLessonHeading.textContent = data.title;
      }

      if (argocdVoiceTimer) {
        argocdVoiceTimer.textContent = data.duration;
      }
      argoVoiceSecondsRemaining = data.seconds;
      stopArgoVoice();

      if (data.type === 'Quiz' && data.quiz) {
        if (argocdLessonBodyContent) argocdLessonBodyContent.style.display = 'none';
        if (argocdLessonQuizContainer) {
          argocdLessonQuizContainer.style.display = 'block';
          if (argocdQuizQuestionText) argocdQuizQuestionText.textContent = data.quiz.question;
          if (argocdQuizFeedbackBox) argocdQuizFeedbackBox.style.display = 'none';

          if (argocdQuizOptionsList) {
            argocdQuizOptionsList.innerHTML = '';
            data.quiz.options.forEach((opt, idx) => {
              const optBtn = document.createElement('button');
              optBtn.className = 'quiz-option-btn font-mono';
              optBtn.innerHTML = `
                <span class="opt-key font-bold text-accent">${String.fromCharCode(65 + idx)}.</span>
                <span class="opt-text">${opt}</span>
              `;
              optBtn.addEventListener('click', () => {
                const isCorrect = idx === data.quiz.correct;
                const allBtns = argocdQuizOptionsList.querySelectorAll('.quiz-option-btn');
                allBtns.forEach((b) => (b.disabled = true));

                if (isCorrect) {
                  optBtn.classList.add('correct');
                  if (argocdQuizFeedbackBox) {
                    argocdQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-green';
                    argocdQuizFeedbackBox.style.background = 'rgba(34, 229, 132, 0.1)';
                    argocdQuizFeedbackBox.style.border = '1px solid var(--accent-green)';
                    argocdQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${data.quiz.explanation}`;
                    argocdQuizFeedbackBox.style.display = 'block';
                  }
                  argoQuizzesDone = Math.min(3, argoQuizzesDone + 1);
                  argoCompletedSteps.add(stepNum);
                  updateArgoSidebarStats();
                  showToast("Quiz passed! +50 XP");
                } else {
                  optBtn.classList.add('wrong');
                  if (allBtns[data.quiz.correct]) allBtns[data.quiz.correct].classList.add('correct');
                  if (argocdQuizFeedbackBox) {
                    argocdQuizFeedbackBox.className = 'quiz-feedback-box font-mono show text-red';
                    argocdQuizFeedbackBox.style.background = 'rgba(239, 68, 68, 0.1)';
                    argocdQuizFeedbackBox.style.border = '1px solid #ef4444';
                    argocdQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${data.quiz.explanation}`;
                    argocdQuizFeedbackBox.style.display = 'block';
                  }
                }
              });
              argocdQuizOptionsList.appendChild(optBtn);
            });
          }
        }
      } else {
        if (argocdLessonQuizContainer) argocdLessonQuizContainer.style.display = 'none';
        if (argocdLessonBodyContent) {
          argocdLessonBodyContent.style.display = 'block';
          argocdLessonBodyContent.innerHTML = data.bodyHtml;
        }
        argoCompletedSteps.add(stepNum);
        updateArgoSidebarStats();
      }

      argocdLessonStepperItems.forEach((item) => {
        const itemStep = parseInt(item.getAttribute('data-argo-step') || item.getAttribute('data-step') || '1', 10);
        if (itemStep === stepNum) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }

        if (argoCompletedSteps.has(itemStep)) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });

      if (argocdBtnLessonPrev) argocdBtnLessonPrev.disabled = stepNum <= 1;
      if (argocdBtnLessonNext) {
        if (stepNum >= Object.keys(argocdLessonsData).length) {
          argocdBtnLessonNext.innerHTML = 'Finish Topic <i class="fa-solid fa-check"></i>';
        } else {
          argocdBtnLessonNext.innerHTML = 'Next &rarr;';
        }
      }
    }

    function stopArgoVoice() {
      if (argoVoiceInterval) {
        clearInterval(argoVoiceInterval);
        argoVoiceInterval = null;
      }
      isArgoVoicePlaying = false;
      if (argocdVoiceStatusText) argocdVoiceStatusText.textContent = 'Explain this lesson';
      if (argocdVoiceIcon) argocdVoiceIcon.className = 'fa-solid fa-play';
    }

    if (argocdBtnVoicePlay) {
      argocdBtnVoicePlay.addEventListener('click', () => {
        if (isArgoVoicePlaying) {
          stopArgoVoice();
        } else {
          isArgoVoicePlaying = true;
          if (argocdVoiceStatusText) argocdVoiceStatusText.textContent = 'Playing explanation...';
          if (argocdVoiceIcon) argocdVoiceIcon.className = 'fa-solid fa-pause';

          showToast("Narration: " + (argocdLessonsData[currentArgoStep]?.voiceText || ""));

          argoVoiceInterval = setInterval(() => {
            if (argoVoiceSecondsRemaining > 0) {
              argoVoiceSecondsRemaining--;
              const m = Math.floor(argoVoiceSecondsRemaining / 60);
              const s = argoVoiceSecondsRemaining % 60;
              if (argocdVoiceTimer) {
                argocdVoiceTimer.textContent = `· ${m}:${s < 10 ? '0' : ''}${s}`;
              }
            } else {
              stopArgoVoice();
              showToast("Explanation finished");
            }
          }, 1000);
        }
      });
    }

    argocdLessonStepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-argo-step') || item.getAttribute('data-step') || '1', 10);
        renderArgoLesson(step);
      });
    });

    if (argocdBtnLessonPrev) {
      argocdBtnLessonPrev.addEventListener('click', () => {
        if (currentArgoStep > 1) {
          renderArgoLesson(currentArgoStep - 1);
        }
      });
    }

    if (argocdBtnLessonNext) {
      argocdBtnLessonNext.addEventListener('click', () => {
        if (currentArgoStep < Object.keys(argocdLessonsData).length) {
          renderArgoLesson(currentArgoStep + 1);
        } else {
          showToast("🎉 Topic 01 Finished! Returned to Argo CD Curriculum.");
          setTimeout(() => {
            location.href = 'skill-argocd.html';
          }, 1000);
        }
      });
    }

    // Terminal Commands
    if (argocdBtnStartLiveLab) {
      argocdBtnStartLiveLab.addEventListener('click', () => {
        if (argocdTerminalStandbyView) argocdTerminalStandbyView.style.display = 'none';
        if (argocdTerminalActiveView) argocdTerminalActiveView.style.display = 'flex';
        isArgoLabRunning = true;
        if (argocdTerminalCliInput) argocdTerminalCliInput.focus();
        showToast("✓ Argo CD GitOps sandbox ready.");
      });
    }

    function appendArgoTerminalLine(text, className = '') {
      if (!argocdTerminalViewport) return;
      const line = document.createElement('div');
      line.className = `term-line ${className}`;
      line.textContent = text;
      argocdTerminalViewport.appendChild(line);
      argocdTerminalViewport.scrollTop = argocdTerminalViewport.scrollHeight;
    }

    function executeArgoWorkspaceCommand() {
      if (!argocdTerminalCliInput) return;
      const rawCmd = argocdTerminalCliInput.value.trim();
      if (!rawCmd) return;

      appendArgoTerminalLine(`shaikh@argocd-lab:~$ ${rawCmd}`, 'text-accent font-bold');
      argocdTerminalCliInput.value = '';

      const cmd = rawCmd.toLowerCase();

      if (cmd === 'clear') {
        if (argocdTerminalViewport) argocdTerminalViewport.innerHTML = '<div class="term-line text-muted">Screen cleared. Type kubectl or argocd commands below:</div>';
        return;
      }

      if (cmd === 'help') {
        appendArgoTerminalLine("Available commands:", "text-green-glow");
        appendArgoTerminalLine("  argocd version                     - Print Argo CD client and server version");
        appendArgoTerminalLine("  argocd app list                    - List managed GitOps applications");
        appendArgoTerminalLine("  argocd app get guestbook           - Inspect guestbook application status");
        appendArgoTerminalLine("  kubectl get pods -n argocd         - List pods in namespace argocd");
        appendArgoTerminalLine("  kubectl get namespaces             - List Kubernetes namespaces");
        appendArgoTerminalLine("  clear                              - Clear terminal screen");
        return;
      }

      if (cmd === 'argocd version') {
        appendArgoTerminalLine('argocd: v2.10.4+4a821e2', 'text-green-glow');
        appendArgoTerminalLine('  BuildDate: 2026-03-12T14:22:18Z');
        appendArgoTerminalLine('  GitCommit: 4a821e2712f5a5e305e7178c5208f40b8a4f9104');
        appendArgoTerminalLine('  GitTreeState: clean');
        appendArgoTerminalLine('  GoVersion: go1.21.8');
        appendArgoTerminalLine('  Compiler: gc');
        appendArgoTerminalLine('  Platform: linux/amd64');
        appendArgoTerminalLine('argocd-server: v2.10.4+4a821e2');
        if (currentArgoStep === 4) {
          argoTasksDone = 1;
          argoCompletedSteps.add(4);
          updateArgoSidebarStats();
          showToast("✓ Step 4 Task Verified: Argo CD Server connected! +50 XP");
        }
        return;
      }

      if (cmd.startsWith('kubectl get namespaces') || cmd.startsWith('kubectl get ns')) {
        appendArgoTerminalLine("NAME              STATUS   AGE", "font-mono");
        appendArgoTerminalLine("default           Active   45m", "font-mono");
        appendArgoTerminalLine("kube-system       Active   45m", "font-mono");
        appendArgoTerminalLine("argocd            Active   28m", "font-mono text-green-glow");
        return;
      }

      if (cmd.startsWith('kubectl get pods -n argocd') || cmd.startsWith('kubectl get pods') || cmd.startsWith('kubectl get po')) {
        appendArgoTerminalLine("NAME                                                 READY   STATUS    RESTARTS   AGE", "font-mono");
        appendArgoTerminalLine("argocd-application-controller-0                      1/1     Running   0          25m", "font-mono text-green-glow");
        appendArgoTerminalLine("argocd-applicationset-controller-5847cd65db-9z98k    1/1     Running   0          25m", "font-mono text-green-glow");
        appendArgoTerminalLine("argocd-redis-74b8f98d9f-k82zl                        1/1     Running   0          25m", "font-mono text-green-glow");
        appendArgoTerminalLine("argocd-repo-server-6784d85db8-2d88v                  1/1     Running   0          25m", "font-mono text-green-glow");
        appendArgoTerminalLine("argocd-server-5c747864f8-p291j                       1/1     Running   0          25m", "font-mono text-green-glow");
        if (currentArgoStep === 4) {
          argoTasksDone = 1;
          argoCompletedSteps.add(4);
          updateArgoSidebarStats();
          showToast("✓ Step 4 Task Verified: Argo CD pods inspected! +50 XP");
        }
        return;
      }

      if (cmd.startsWith('argocd app list')) {
        appendArgoTerminalLine("NAME        CLUSTER                         NAMESPACE  PROJECT  STATUS  HEALTH   SYNCPOLICY  CONDITIONS  REPO                                              PATH       TARGET", "font-mono");
        appendArgoTerminalLine("guestbook   https://kubernetes.default.svc  default    default  Synced  Healthy  Auto-Prune  <none>      https://github.com/argoproj/argocd-example-apps   guestbook  HEAD", "font-mono text-green-glow");
        if (currentArgoStep === 4) {
          argoTasksDone = 1;
          argoCompletedSteps.add(4);
          updateArgoSidebarStats();
          showToast("✓ Step 4 Task Verified: GitOps apps inspected! +50 XP");
        }
        return;
      }

      if (cmd.startsWith('argocd app get')) {
        appendArgoTerminalLine("Name:               guestbook", "text-green-glow font-mono");
        appendArgoTerminalLine("Project:            default", "font-mono");
        appendArgoTerminalLine("Server:             https://kubernetes.default.svc", "font-mono");
        appendArgoTerminalLine("Namespace:          default", "font-mono");
        appendArgoTerminalLine("URL:                https://localhost:8080/applications/guestbook", "font-mono");
        appendArgoTerminalLine("Repo:               https://github.com/argoproj/argocd-example-apps", "font-mono");
        appendArgoTerminalLine("Target:             HEAD", "font-mono");
        appendArgoTerminalLine("Path:               guestbook", "font-mono");
        appendArgoTerminalLine("Sync Window:        Sync Allowed", "font-mono");
        appendArgoTerminalLine("Sync Policy:        Automated (Prune, Self-Heal)", "font-mono");
        appendArgoTerminalLine("Sync Status:        Synced to HEAD (6a07c12)", "font-mono text-green-glow");
        appendArgoTerminalLine("Health Status:      Healthy", "font-mono text-green-glow");
        return;
      }

      appendArgoTerminalLine(`bash: ${rawCmd.split(' ')[0]}: command executed.`);
    }

    if (argocdBtnCliSubmit) {
      argocdBtnCliSubmit.addEventListener('click', executeArgoWorkspaceCommand);
    }
    if (argocdTerminalCliInput) {
      argocdTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeArgoWorkspaceCommand();
      });
    }

    // Tools Drawer
    if (argocdBtnToggleNotes) {
      argocdBtnToggleNotes.addEventListener('click', () => {
        if (argocdToolsDrawer) argocdToolsDrawer.style.display = 'flex';
      });
    }
    if (argocdBtnToggleEditor) {
      argocdBtnToggleEditor.addEventListener('click', () => {
        if (argocdToolsDrawer) argocdToolsDrawer.style.display = 'flex';
        if (argocdDrawerTitle) argocdDrawerTitle.innerHTML = '<i class="fa-solid fa-code"></i> Code Editor';
      });
    }
    if (argocdBtnCloseDrawer) {
      argocdBtnCloseDrawer.addEventListener('click', () => {
        if (argocdToolsDrawer) argocdToolsDrawer.style.display = 'none';
      });
    }

    if (argocdLessonThemeToggle) {
      argocdLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    renderArgoLesson(1);
  }

  /* ==========================================================================
     32. AWS FUNDAMENTALS LESSON CONTROLLER & SANDBOX WORKSPACE
     ========================================================================== */
  const awsLessonWorkspace = document.getElementById('aws-lesson-scroll-body');
  if (awsLessonWorkspace) {
    const awsStepperItems = document.querySelectorAll('.stepper-item[data-aws-step]');
    const awsProgressArc = document.getElementById('aws-lesson-progress-arc');
    const awsProgressPercent = document.getElementById('aws-lesson-progress-percent');
    const awsStatDoneCount = document.getElementById('aws-stat-done-count');
    const awsStatQuizzesCount = document.getElementById('aws-stat-quizzes-count');
    const awsStatTasksCount = document.getElementById('aws-stat-tasks-count');

    const awsLessonStepCounter = document.getElementById('aws-lesson-step-counter');
    const awsLessonHeading = document.getElementById('aws-lesson-heading');
    const awsLessonTypePill = document.getElementById('aws-lesson-type-pill');
    const awsLessonBodyContent = document.getElementById('aws-lesson-body-content');
    const awsLessonQuizContainer = document.getElementById('aws-lesson-quiz-container');
    const awsQuizQuestionText = document.getElementById('aws-quiz-question-text');
    const awsQuizOptionsList = document.getElementById('aws-quiz-options-list');
    const awsQuizFeedbackBox = document.getElementById('aws-quiz-feedback-box');

    const btnAwsPrevStep = document.getElementById('aws-btn-lesson-prev');
    const btnAwsNextStep = document.getElementById('aws-btn-lesson-next');

    const btnAwsVoicePlay = document.getElementById('aws-btn-voice-play');
    const awsVoiceIcon = document.getElementById('aws-voice-icon');
    const awsVoiceStatusText = document.getElementById('aws-voice-status-text');
    const awsVoiceTimer = document.getElementById('aws-voice-timer');

    // Terminal Elements
    const awsTerminalStandbyView = document.getElementById('aws-terminal-standby-view');
    const awsTerminalActiveView = document.getElementById('aws-terminal-active-view');
    const awsBtnStartLiveLab = document.getElementById('aws-btn-start-live-lab');
    const awsTerminalViewport = document.getElementById('aws-terminal-viewport');
    const awsTerminalCliInput = document.getElementById('aws-terminal-cli-input');
    const btnAwsCliSubmit = document.getElementById('aws-btn-cli-submit');

    // Tool Strip & Drawer
    const btnToggleEditor = document.getElementById('btn-toggle-editor');
    const btnToggleNotes = document.getElementById('btn-toggle-notes');
    const toolsDrawer = document.getElementById('tools-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerTitle = document.getElementById('drawer-title');
    const userScratchpadNotes = document.getElementById('user-scratchpad-notes');
    const btnCollapseSidebar = document.getElementById('btn-collapse-sidebar');
    const btnAwsLessonThemeToggle = document.getElementById('btn-aws-lesson-theme-toggle');

    let awsCurrentStep = 1;
    let awsVoicePlaying = false;
    let awsVoiceInterval = null;
    let awsCurrentVoiceSeconds = 182; // 3:02
    let awsQuizzesPassed = 0;

    const awsLessonsData = {
      1: {
        stepNum: 1,
        type: 'Lesson',
        title: 'What cloud computing is',
        duration: '· 3:02',
        seconds: 182,
        voiceText: 'In this lesson you will learn what cloud computing is, and why companies rent servers instead of buying them. Picture a small company that runs an online shop. Ten years ago the only way to get servers was to buy them up front. Cloud computing allows you to rent computing resources on demand and only pay for what you use.',
        bodyHtml: `
          <p>
            In this lesson you will learn what cloud computing is, and why companies rent servers instead of buying them.
          </p>
          <p>
            Picture a small company that runs an online shop. To put the shop on the internet, they need servers - real computers that run all day and answer requests from customers. Ten years ago the only way to get servers was to buy them. You paid a lot of money up front, waited weeks for delivery, found a room with power and cooling, and hired someone to fix them when a disk died.
          </p>
          <p>
            Then the holiday season arrives. Traffic triples for two weeks. The servers they bought cannot handle it, so the site slows down. They buy more servers. In January traffic drops back to normal, and the extra servers sit there doing nothing - but they were already paid for.
          </p>
          <h3 class="lesson-subheading-underline font-mono">Renting instead of buying</h3>
          <p>
            Cloud computing solves this. A cloud provider builds huge buildings full of servers, called <strong>data centers</strong>. You never see these buildings. You rent a slice of their computing power over the internet, use it for as long as you need, and stop paying the moment you are done. The provider handles electricity, cooling, hardware failures, and security guards at the door.
          </p>
        `
      },
      2: {
        stepNum: 2,
        type: 'Lesson',
        title: 'What AWS is - regions, services, and the console',
        duration: '· 3:15',
        seconds: 195,
        voiceText: 'Amazon Web Services, or AWS, is the world’s most comprehensive cloud platform. It offers compute, storage, databases, and networking across dozens of geographical regions around the globe.',
        bodyHtml: `
          <p>
            <strong>Amazon Web Services (AWS)</strong> launched in 2006 with simple storage and compute services. Today it powers millions of businesses worldwide, from early-stage startups to multinational enterprises and government agencies.
          </p>
          <p>
            AWS is structured across physical <strong>Regions</strong> (e.g. <code>us-east-1</code> in N. Virginia, <code>eu-west-1</code> in Ireland, <code>ap-south-1</code> in Mumbai). Inside every Region are multiple isolated <strong>Availability Zones (AZs)</strong> connected by ultra-low-latency fiber.
          </p>
          <h3 class="lesson-subheading-underline font-mono">Three Ways to Control AWS</h3>
          <ul class="lesson-bullet-list" style="margin-left: 20px; line-height: 1.8; color: #d1d5db;">
            <li><strong>AWS Management Console:</strong> A clean web UI for clicking, monitoring, and configuring services visually.</li>
            <li><strong>AWS Command Line Interface (CLI):</strong> Automate tasks directly from your shell with tools like <code>aws s3 ls</code> or <code>aws ec2 describe-instances</code>.</li>
            <li><strong>Software Development Kits (SDKs) & APIs:</strong> Programmatic access in Python (boto3), Go, Node.js, and Java.</li>
          </ul>
        `
      },
      3: {
        stepNum: 3,
        type: 'Quiz',
        title: 'Choosing what to migrate',
        duration: '· 1:30',
        seconds: 90,
        quiz: {
          q: 'When an online store migrates their physical datacenter servers to AWS, what is the primary economic benefit during seasonal holiday spikes?',
          options: [
            { text: 'They pay high upfront capital expenditures for servers that sit idle in January.', correct: false, note: 'That is the flaw of on-premise hardware.' },
            { text: 'They scale up server instances on demand during high traffic and turn them off immediately after, only paying for hours used.', correct: true, note: 'Elasticity converts fixed capital expense into flexible variable operating expense.' },
            { text: 'AWS gifts all compute and bandwidth instances completely free of charge.', correct: false, note: 'AWS operates on a pay-as-you-go commercial model.' },
            { text: 'Physical servers must still be delivered and racked manually in the company office.', correct: false, note: 'AWS manages 100% of the physical hardware in their data centers.' }
          ]
        }
      },
      4: {
        stepNum: 4,
        type: 'Lesson',
        title: 'How DevOps engineers use AWS',
        duration: '· 2:45',
        seconds: 165,
        voiceText: 'DevOps engineers bridge the gap between application software and cloud infrastructure. On AWS, DevOps engineers use managed container services, automated pipelines, and cloud monitoring.',
        bodyHtml: `
          <p>
            For DevOps and Platform engineers, AWS is not merely a place to host virtual machines—it is an automated software factory.
          </p>
          <p>
            DevOps teams leverage AWS building blocks including <strong>Amazon EC2</strong> (elastic compute), <strong>Amazon ECS & EKS</strong> (container orchestration), <strong>AWS Lambda</strong> (event-driven serverless), and <strong>Amazon S3</strong> (durable object storage).
          </p>
          <h3 class="lesson-subheading-underline font-mono">Key DevOps Responsibilities on AWS</h3>
          <ul class="lesson-bullet-list" style="margin-left: 20px; line-height: 1.8; color: #d1d5db;">
            <li><strong>Infrastructure Automation:</strong> Replace manual console clicks with reusable code.</li>
            <li><strong>Observability:</strong> Monitor CPU, memory, and application latency with Amazon CloudWatch metrics and alarms.</li>
            <li><strong>High Availability:</strong> Spread workloads across multiple Availability Zones with Auto Scaling and Elastic Load Balancing.</li>
          </ul>
        `
      },
      5: {
        stepNum: 5,
        type: 'Lesson',
        title: 'Where IaC and CI/CD fit',
        duration: '· 2:50',
        seconds: 170,
        voiceText: 'Infrastructure as Code allows teams to define AWS environments in code files like Terraform. CI/CD pipelines automate testing and deployment every time code is merged.',
        bodyHtml: `
          <p>
            Modern cloud engineering relies on two foundational pillars: <strong>Infrastructure as Code (IaC)</strong> and <strong>CI/CD pipelines</strong>.
          </p>
          <p>
            Instead of manually creating VPCs and databases in the AWS Console, you define your infrastructure in declarative files using tools like <strong>Terraform</strong> or <strong>AWS CloudFormation</strong>. Your infrastructure is version-controlled with Git, peer-reviewed in pull requests, and auditable.
          </p>
          <h3 class="lesson-subheading-underline font-mono">Automated CI/CD Delivery</h3>
          <p>
            When a developer commits code, automated pipelines (like GitHub Actions, GitLab CI, or AWS CodePipeline) run unit tests, build Docker images, and deploy new revisions to AWS without human downtime.
          </p>
        `
      },
      6: {
        stepNum: 6,
        type: 'Quiz',
        title: 'Knowledge check',
        duration: '· 1:45',
        seconds: 105,
        quiz: {
          q: 'Which practice describes defining cloud infrastructure declaratively in version-controlled configuration files like Terraform?',
          options: [
            { text: 'Manual Console Clicking', correct: false, note: 'Manual clicking is error-prone and cannot be peer-reviewed in Git.' },
            { text: 'Infrastructure as Code (IaC)', correct: true, note: 'IaC ensures repeatable, idempotent, version-controlled cloud environments.' },
            { text: 'On-premises Bare Metal Racking', correct: false, note: 'Bare metal racking refers to physical datacenter hardware installation.' },
            { text: 'Air-gapped Network Isolation', correct: false, note: 'Air-gapping is a specialized physical security technique.' }
          ]
        }
      }
    };

    function stopAwsVoiceAudio() {
      awsVoicePlaying = false;
      if (awsVoiceInterval) clearInterval(awsVoiceInterval);
      if (awsVoiceIcon) awsVoiceIcon.className = 'fa-solid fa-play';
      if (btnAwsVoicePlay) btnAwsVoicePlay.classList.remove('playing');
      if (awsVoiceStatusText) awsVoiceStatusText.textContent = "Explain this lesson";
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    function updateAwsProgress() {
      // 6 steps total: at step 1 = 0%, at step 2 = 20%, ..., at step 6 = 100%
      const percent = Math.round(((awsCurrentStep - 1) / 5) * 100);
      if (awsProgressPercent) awsProgressPercent.textContent = `${percent}%`;
      if (awsProgressArc) {
        const offset = Math.round(264 - (264 * percent) / 100);
        awsProgressArc.setAttribute('stroke-dashoffset', offset);
      }
      if (awsStatDoneCount) awsStatDoneCount.textContent = (awsCurrentStep - 1);

      awsStepperItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-aws-step'), 10);
        item.classList.remove('active');
        if (stepNum === awsCurrentStep) {
          item.classList.add('active');
        }
        if (stepNum < awsCurrentStep) {
          item.classList.add('done');
        } else {
          item.classList.remove('done');
        }
      });
    }

    function renderAwsLesson(stepIndex) {
      awsCurrentStep = stepIndex;
      const lesson = awsLessonsData[awsCurrentStep] || awsLessonsData[1];

      if (awsLessonStepCounter) awsLessonStepCounter.textContent = `${lesson.type.toUpperCase()} · ${lesson.stepNum} OF 6`;
      if (awsLessonHeading) awsLessonHeading.textContent = lesson.title;
      if (awsLessonTypePill) {
        awsLessonTypePill.textContent = lesson.type;
        awsLessonTypePill.className = `lesson-type-badge font-mono ${lesson.type.toLowerCase()}-badge`;
      }

      stopAwsVoiceAudio();
      awsCurrentVoiceSeconds = lesson.seconds;
      if (awsVoiceTimer) awsVoiceTimer.textContent = lesson.duration;

      if (lesson.type === 'Quiz' && lesson.quiz) {
        if (awsLessonBodyContent) awsLessonBodyContent.style.display = 'none';
        if (awsLessonQuizContainer) {
          awsLessonQuizContainer.style.display = 'block';
          if (awsQuizQuestionText) awsQuizQuestionText.textContent = lesson.quiz.q;
          if (awsQuizOptionsList) {
            awsQuizOptionsList.innerHTML = '';
            lesson.quiz.options.forEach((opt, idx) => {
              const btn = document.createElement('button');
              btn.className = 'quiz-option-btn font-mono';
              btn.style.cssText = 'width: 100%; text-align: left; padding: 12px 16px; margin-bottom: 10px; background: #141416; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #ffffff; cursor: pointer; display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.5; transition: all 0.2s;';
              btn.innerHTML = `<span style="font-weight: 700; color: var(--accent-green); min-width: 20px;">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
              
              btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) btn.style.borderColor = 'var(--accent-green)';
              });
              btn.addEventListener('mouseleave', () => {
                if (!btn.disabled) btn.style.borderColor = 'rgba(255,255,255,0.08)';
              });

              btn.addEventListener('click', () => {
                const allBtns = awsQuizOptionsList.querySelectorAll('.quiz-option-btn');
                allBtns.forEach(b => b.disabled = true);

                if (opt.correct) {
                  btn.style.background = 'rgba(34, 229, 132, 0.15)';
                  btn.style.borderColor = 'var(--accent-green)';
                  if (awsQuizFeedbackBox) {
                    awsQuizFeedbackBox.style.display = 'block';
                    awsQuizFeedbackBox.style.cssText = 'display: block; margin-top: 14px; padding: 14px; border-radius: 8px; font-size: 12.5px; background: rgba(34, 229, 132, 0.1); border: 1px solid var(--accent-green); color: #ffffff;';
                    awsQuizFeedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${opt.note}`;
                  }
                  showToast("🎯 Quiz passed! Well done.");
                  awsQuizzesPassed = Math.min(2, awsQuizzesPassed + 1);
                  if (awsStatQuizzesCount) awsStatQuizzesCount.textContent = `${awsQuizzesPassed}/2`;
                } else {
                  btn.style.background = 'rgba(239, 68, 68, 0.15)';
                  btn.style.borderColor = '#ef4444';
                  if (awsQuizFeedbackBox) {
                    awsQuizFeedbackBox.style.display = 'block';
                    awsQuizFeedbackBox.style.cssText = 'display: block; margin-top: 14px; padding: 14px; border-radius: 8px; font-size: 12.5px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ffffff;';
                    awsQuizFeedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${opt.note}`;
                  }
                }
              });
              awsQuizOptionsList.appendChild(btn);
            });
          }
          if (awsQuizFeedbackBox) awsQuizFeedbackBox.style.display = 'none';
        }
      } else {
        if (awsLessonQuizContainer) awsLessonQuizContainer.style.display = 'none';
        if (awsLessonBodyContent) {
          awsLessonBodyContent.style.display = 'block';
          awsLessonBodyContent.innerHTML = lesson.bodyHtml;
        }
      }

      if (btnAwsPrevStep) btnAwsPrevStep.disabled = (awsCurrentStep === 1);
      if (btnAwsNextStep) {
        if (awsCurrentStep === 6) {
          btnAwsNextStep.innerHTML = 'Complete Module &rarr;';
        } else {
          btnAwsNextStep.innerHTML = 'Next &rarr;';
        }
      }

      updateAwsProgress();
    }

    awsStepperItems.forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-aws-step'), 10);
        renderAwsLesson(step);
      });
    });

    if (btnAwsPrevStep) {
      btnAwsPrevStep.addEventListener('click', () => {
        if (awsCurrentStep > 1) renderAwsLesson(awsCurrentStep - 1);
      });
    }

    if (btnAwsNextStep) {
      btnAwsNextStep.addEventListener('click', () => {
        if (awsCurrentStep < 6) {
          renderAwsLesson(awsCurrentStep + 1);
        } else {
          showToast("🎉 Congratulations! You completed 01 - What Cloud and AWS Are.");
          setTimeout(() => {
            window.location.href = 'skill-aws.html';
          }, 1200);
        }
      });
    }

    // AI Voice Narrator
    if (btnAwsVoicePlay) {
      btnAwsVoicePlay.addEventListener('click', () => {
        if (awsVoicePlaying) {
          stopAwsVoiceAudio();
        } else {
          awsVoicePlaying = true;
          if (awsVoiceIcon) awsVoiceIcon.className = 'fa-solid fa-pause';
          btnAwsVoicePlay.classList.add('playing');
          if (awsVoiceStatusText) awsVoiceStatusText.textContent = "Explaining...";

          const lesson = awsLessonsData[awsCurrentStep];
          if (lesson && window.speechSynthesis) {
            const utter = new SpeechSynthesisUtterance(lesson.voiceText || lesson.title);
            utter.rate = 1.0;
            utter.onend = stopAwsVoiceAudio;
            window.speechSynthesis.speak(utter);
          }

          awsVoiceInterval = setInterval(() => {
            if (awsCurrentVoiceSeconds > 0) {
              awsCurrentVoiceSeconds--;
              const m = Math.floor(awsCurrentVoiceSeconds / 60);
              const s = awsCurrentVoiceSeconds % 60;
              if (awsVoiceTimer) awsVoiceTimer.textContent = `· ${m}:${s < 10 ? '0' : ''}${s}`;
            } else {
              stopAwsVoiceAudio();
            }
          }, 1000);
        }
      });
    }

    // Start Live Lab button toggles from Standby to Active CLI
    if (awsBtnStartLiveLab) {
      awsBtnStartLiveLab.addEventListener('click', () => {
        if (awsTerminalStandbyView) awsTerminalStandbyView.style.display = 'none';
        if (awsTerminalActiveView) {
          awsTerminalActiveView.style.display = 'flex';
          showToast("⚡ Cloud sandbox booted up! AWS CLI ready.");
          if (awsTerminalCliInput) awsTerminalCliInput.focus();
        }
      });
    }

    // Interactive Terminal CLI execution
    function executeAwsCliCommand(cmd) {
      const rawCmd = (cmd || (awsTerminalCliInput ? awsTerminalCliInput.value : '')).trim();
      if (!rawCmd) return;

      if (awsTerminalViewport) {
        const inLine = document.createElement('div');
        inLine.className = 'term-line input-text';
        inLine.style.cssText = 'margin: 4px 0; font-size: 11.5px;';
        inLine.innerHTML = `<span class="text-accent" style="font-weight: 700;">shaikh@aws:~$</span> ${rawCmd}`;
        awsTerminalViewport.appendChild(inLine);

        const outLine = document.createElement('div');
        outLine.className = 'term-line output-text';
        outLine.style.cssText = 'margin: 2px 0 8px 0; font-size: 11.5px; color: #d1d5db; white-space: pre-wrap; font-family: var(--font-mono);';

        const low = rawCmd.toLowerCase();
        if (low === 'clear') {
          awsTerminalViewport.innerHTML = '';
          if (awsTerminalCliInput) awsTerminalCliInput.value = '';
          return;
        } else if (low.includes('aws --version')) {
          outLine.textContent = 'aws-cli/2.15.30 Python/3.11.8 Linux/6.8.0-x86_64 botocore/2.4.30';
          showToast("✓ AWS CLI version confirmed!");
        } else if (low.includes('sts get-caller-identity')) {
          outLine.innerHTML = `{
  "UserId": "AIDAS4HAIKHSIRDEMOUSER",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/shaikh-cloud-admin"
}`;
          showToast("✓ STS caller identity verified!");
        } else if (low.includes('s3 ls')) {
          outLine.innerHTML = `2026-10-06 08:14:22  brightcart-assets-prod
2026-10-06 09:30:15  shaikh-sir-terraform-state-us-east-1
2026-10-06 11:45:00  app-release-artifacts-v1`;
          showToast("✓ S3 buckets listed successfully!");
        } else if (low.includes('describe-regions')) {
          outLine.innerHTML = `--------------------------------------
|           DescribeRegions          |
+------------------------------------+
|  ap-south-1   (Mumbai)             |
|  eu-west-1    (Ireland)            |
|  us-east-1    (N. Virginia)        |
|  us-west-2    (Oregon)             |
+------------------------------------+`;
        } else if (low.includes('help')) {
          outLine.textContent = 'Available AWS commands: aws --version, aws sts get-caller-identity, aws s3 ls, aws ec2 describe-regions, clear';
        } else {
          outLine.innerHTML = `<span style="color: #71717a;">[cloud sandbox] Executed '${rawCmd}'. Status: 200 OK.</span>`;
        }

        awsTerminalViewport.appendChild(outLine);
        awsTerminalViewport.scrollTop = awsTerminalViewport.scrollHeight;
      }

      if (awsTerminalCliInput) awsTerminalCliInput.value = '';
    }

    if (btnAwsCliSubmit) {
      btnAwsCliSubmit.addEventListener('click', () => executeAwsCliCommand());
    }

    if (awsTerminalCliInput) {
      awsTerminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeAwsCliCommand();
      });
    }

    const termChips = document.querySelectorAll('.term-chip');
    termChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) executeAwsCliCommand(cmd);
      });
    });

    // Vertical Tools Drawer (Editor & Notes)
    if (btnToggleEditor && toolsDrawer) {
      btnToggleEditor.addEventListener('click', () => {
        toolsDrawer.style.display = 'flex';
        if (drawerTitle) drawerTitle.innerHTML = '<i class="fa-regular fa-file-code"></i> Code Editor';
        if (userScratchpadNotes) {
          userScratchpadNotes.placeholder = "// Write Python/Terraform/BASH scratchpad code here...\nprovider \"aws\" {\n  region = \"us-east-1\"\n}";
        }
      });
    }

    if (btnToggleNotes && toolsDrawer) {
      btnToggleNotes.addEventListener('click', () => {
        toolsDrawer.style.display = 'flex';
        if (drawerTitle) drawerTitle.innerHTML = '<i class="fa-regular fa-note-sticky"></i> Your Notes';
        if (userScratchpadNotes) {
          userScratchpadNotes.placeholder = "Write your notes or insights for 01 - What Cloud and AWS Are...";
        }
      });
    }

    if (btnCloseDrawer && toolsDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        toolsDrawer.style.display = 'none';
      });
    }

    if (toolsDrawer) {
      toolsDrawer.addEventListener('click', (e) => {
        if (e.target === toolsDrawer) toolsDrawer.style.display = 'none';
      });
    }

    // Sidebar Collapse Toggle
    if (btnCollapseSidebar) {
      btnCollapseSidebar.addEventListener('click', () => {
        const workspace = document.getElementById('lesson-workspace');
        if (workspace) {
          workspace.classList.toggle('sidebar-collapsed');
          showToast("Sidebar toggled");
        }
      });
    }

    // Theme Toggle
    if (btnAwsLessonThemeToggle) {
      btnAwsLessonThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        showToast("Theme switched");
      });
    }

    renderAwsLesson(1);
  }

});






