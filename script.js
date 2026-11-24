// JavaScript for Paul Jacksen B — Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Set Current Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Clock
  updateISTTime();
  setInterval(updateISTTime, 1000);

  // Handle Projects Nav Click
  document.querySelectorAll('a[href="#projects"]').forEach(link => {
    link.addEventListener('click', () => {
      const activeFilter = document.querySelector('.filter-btn.active');
      if (activeFilter && activeFilter.getAttribute('data-filter') === 'exp') {
        filterCategory('all');
      }
    });
  });
});

// Update IST Clock
function updateISTTime() {
  const timeEl = document.getElementById('local-time');
  if (!timeEl) return;
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const istTimeStr = new Intl.DateTimeFormat('en-US', options).format(now);
  timeEl.textContent = `${istTimeStr} IST (UTC+5:30)`;
}

// Copy Email Functionality
function copyEmail() {
  const email = 'pauljacksenb@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById('copy-text');
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyText) {
      const orig = copyText.textContent;
      copyText.textContent = 'Copied to Clipboard!';
      copyBtn.classList.add('bg-emerald-400');
      setTimeout(() => {
        copyText.textContent = orig;
        copyBtn.classList.remove('bg-emerald-400');
      }, 2500);
    }
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Showcase Filter Functionality
function filterCategory(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.card-item');
  cards.forEach(card => {
    const catAttr = card.getAttribute('data-category') || '';
    if (category === 'all' || catAttr.includes(category)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}


// ==================== LAZY LOADING ====================
// Heavy features live in separate files and are fetched only when needed,
// so the hero and project cards never wait on them. Classic <script> tags
// (not import()) keep this working when index.html is opened directly.
const _lazy = {};
function loadScript(src) {
  if (!_lazy[src]) {
    _lazy[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => { delete _lazy[src]; reject(new Error('Failed to load ' + src)); };
      document.body.appendChild(s);
    });
  }
  return _lazy[src];
}

// AI assistant: chat.js replaces these stubs with the real functions on load.
let chatLoaded = false;
function withChat(name, args) {
  return loadScript('chat.js').then(() => { chatLoaded = true; return window[name](...args); });
}
function toggleChat(force) {
  if (!chatLoaded && force === false) return; // closing something never opened
  return withChat('toggleChat', [force]);
}
function sendQuickPrompt(...a) { return withChat('sendQuickPrompt', a); }
function resetChat(...a) { return withChat('resetChat', a); }
function handleChatSubmit(event) { event.preventDefault(); return withChat('handleChatSubmit', [event]); }

// Warm the assistant when the user shows intent (hover/focus on the button)
document.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('chat-launcher');
  ['pointerenter', 'focus', 'touchstart'].forEach(ev =>
    launcher?.addEventListener(ev, () => loadScript('chat.js').catch(() => {}), { once: true, passive: true }));
});

// Small one-time "Ask me" hint next to the button (desktop only)
function hideChatHint() {
  document.getElementById('chat-hint')?.classList.remove('show');
}
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.getElementById('chat-hint');
  if (!hint) return;
  setTimeout(() => {
    if (!document.body.classList.contains('chat-open')) hint.classList.add('show');
    setTimeout(hideChatHint, 5000);
  }, 2500);
});

// Open Project Details Modal
async function openModal(id) {
  try { await loadScript('project-details.js'); } catch (e) { console.error(e); return; }
  const modal = document.getElementById('project-modal');
  const contentEl = document.getElementById('modal-content');
  const data = projectDetails[id];
  if (!modal || !contentEl || !data) return;

  const techBadges = data.tech.map(t => `<span class="tech-tag text-xs">${t}</span>`).join(' ');

  contentEl.innerHTML = `
    <div class="space-y-3">
      <div class="pr-6">
        <h3 class="text-xl sm:text-2xl font-bold text-white">${data.title}</h3>
        <p class="text-xs font-mono text-teal-400 mt-1">${data.subtitle}</p>
      </div>

      <div class="flex flex-wrap gap-1.5 pt-2 pb-3 border-b border-neutral-800">
        ${techBadges}
      </div>

      <div class="pt-2">
        ${data.content}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-icon');
  const close = document.getElementById('close-icon');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    hamburger?.classList.add('hidden');
    close?.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
    hamburger?.classList.remove('hidden');
    close?.classList.add('hidden');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-icon');
  const close = document.getElementById('close-icon');
  if (menu) menu.classList.add('hidden');
  hamburger?.classList.remove('hidden');
  close?.classList.add('hidden');
}

// Close mobile menu on click outside
document.addEventListener('click', (e) => {
  const header = document.querySelector('header');
  const menu = document.getElementById('mobile-menu');
  if (menu && !menu.classList.contains('hidden') && header && !header.contains(e.target)) {
    closeMobileMenu();
  }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeMobileMenu();
    toggleChat(false);
  }
});

// Close when clicking modal backdrop
document.getElementById('project-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'project-modal') closeModal();
});
