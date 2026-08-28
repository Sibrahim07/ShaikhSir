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
  const darkIcon = themeToggle.querySelector('.theme-icon-dark');
  const lightIcon = themeToggle.querySelector('.theme-icon-light');

  // Load user preference
  const savedTheme = localStorage.getItem('shaikhsir-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    enableLightMode();
  } else {
    enableDarkMode();
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  });

  function enableLightMode() {
    document.body.classList.add('light-mode');
    darkIcon.style.display = 'none';
    lightIcon.style.display = 'block';
    localStorage.setItem('shaikhsir-theme', 'light');
  }

  function enableDarkMode() {
    document.body.classList.remove('light-mode');
    darkIcon.style.display = 'block';
    lightIcon.style.display = 'none';
    localStorage.setItem('shaikhsir-theme', 'dark');
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
  const viewToggleList = document.getElementById('view-toggle-list');
  const viewToggleGrid = document.getElementById('view-toggle-grid');
  const topicsContainer = document.getElementById('topics-container');

  if (viewToggleList && viewToggleGrid && topicsContainer) {
    viewToggleList.addEventListener('click', () => {
      viewToggleList.classList.add('active');
      viewToggleGrid.classList.remove('active');
      topicsContainer.classList.remove('topics-grid-view');
      topicsContainer.classList.add('topics-list-view');
      showToast("Switched to List view");
    });

    viewToggleGrid.addEventListener('click', () => {
      viewToggleGrid.classList.add('active');
      viewToggleList.classList.remove('active');
      topicsContainer.classList.remove('topics-list-view');
      topicsContainer.classList.add('topics-grid-view');
      showToast("Switched to Grid view");
    });
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
        showToast("🔒 Topic locked. Pro or AI membership required to access this lab.");
      } else if (status === 'active' || status === 'free') {
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

  /* ==========================================================================
     17. DOCKER 3-COLUMN INTERACTIVE LESSON WORKSPACE CONTROLLER (lesson-docker.html)
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
  const dockerTabEditorBtn = document.getElementById('docker-tab-editor-btn');
  const dockerTerminalStandbyView = document.getElementById('docker-terminal-standby-view');
  const dockerTerminalActiveView = document.getElementById('docker-terminal-active-view');
  const dockerEditorActiveView = document.getElementById('docker-editor-active-view');
  const dockerBtnStartLiveLab = document.getElementById('docker-btn-start-live-lab');
  const dockerTerminalViewport = document.getElementById('docker-terminal-viewport');
  const dockerTerminalCliInput = document.getElementById('docker-terminal-cli-input');
  const dockerBtnCliSubmit = document.getElementById('docker-btn-cli-submit');
  const dockerLessonThemeToggle = document.getElementById('docker-lesson-theme-toggle');

  if (dockerLessonStepperItems.length > 0) {

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

});

