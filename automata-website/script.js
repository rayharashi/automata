// ── Particles ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '124,109,255' : '79,209,197'
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,109,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Terminal typewriter ──
const terminalLines = [
  { text: '$ automata start --mode autonomous', class: '' },
  { text: '✓ Conway infrastructure connected', class: 't-success', delay: 400 },
  { text: '✓ Wallet 0x4Fd3...573F authenticated', class: 't-success', delay: 700 },
  { text: '✓ Twitter stream initialized', class: 't-success', delay: 1000 },
  { text: '✓ On-chain monitor active', class: 't-success', delay: 1300 },
  { text: '✓ GitHub watcher running', class: 't-success', delay: 1600 },
  { text: '─────────────────────────────', class: 't-dim', delay: 2000 },
  { text: '[SIGNAL] Whale moved 2.4M USDC → Base', class: '', delay: 2500 },
  { text: '[SIGNAL] @vitalik tweeted about L2 scaling', class: '', delay: 3200 },
  { text: '[FILTER] 847 low-relevance events discarded', class: 't-dim', delay: 3800 },
  { text: '[SIGNAL] Conway compute cost: $0.0023 USDC', class: '', delay: 4400 },
];

function buildTerminal() {
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';

  terminalLines.forEach((line, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'terminal-line';

      if (line.text.startsWith('[SIGNAL]')) {
        el.innerHTML = `<span class="t-label">[SIGNAL]</span> <span class="t-highlight">${line.text.replace('[SIGNAL] ', '')}</span>`;
      } else if (line.text.startsWith('[FILTER]')) {
        el.innerHTML = `<span class="t-label">[FILTER]</span> <span class="t-dim">${line.text.replace('[FILTER] ', '')}</span>`;
      } else if (line.text.startsWith('$')) {
        el.innerHTML = `<span class="t-dim">$</span> <span class="t-cmd">${line.text.replace('$ ', '')}</span>`;
      } else {
        el.className += ` ${line.class}`;
        el.textContent = line.text;
      }

      body.appendChild(el);

      // Add cursor at end
      if (i === terminalLines.length - 1) {
        setTimeout(() => {
          const cursor = document.createElement('div');
          cursor.className = 'terminal-line t-blink';
          cursor.textContent = '█';
          body.appendChild(cursor);
        }, 500);
      }

      body.scrollTop = body.scrollHeight;
    }, line.delay || i * 200);
  });
}

buildTerminal();
// Restart terminal animation every 12 seconds
setInterval(buildTerminal, 12000);

// ── Score bar animation on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.score-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = width; }, 100);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.feed-card').forEach(card => observer.observe(card));

// ── Feature cards stagger animation ──
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, background 0.3s, box-shadow 0.3s';
  featureObserver.observe(card);
});

// ── Copy address ──
function copyAddress() {
  const addr = document.getElementById('wallet-addr').textContent;
  navigator.clipboard.writeText(addr).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.color = '#4ade80';
    setTimeout(() => {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
      btn.style.color = '';
    }, 2000);
  });
}

// ── Copy code blocks ──
function copyCode(btn) {
  const code = btn.getAttribute('data-code');
  navigator.clipboard.writeText(code).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    btn.style.color = '#4ade80';
    btn.style.borderColor = '#4ade80';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Live feed ticker (simulate new signals) ──
const feedMessages = [
  { type: 'On-Chain', icon: '🐋', text: 'Whale wallet <code>0x9a2f...</code> bridged <strong>1.8M USDC</strong> to Arbitrum.', score: 87 },
  { type: 'Twitter', icon: '𝕏', text: '<strong>@hasufl</strong> posted analysis on MEV and block builder centralization risks.', score: 74 },
  { type: 'GitHub', icon: '⌥', text: 'New release: <strong>ethereum/go-ethereum v1.14.0</strong> — major performance improvements.', score: 91 },
  { type: 'On-Chain', icon: '📊', text: 'Unusual options activity on <strong>ETH</strong>: $2B notional expiring this Friday.', score: 83 },
];

let feedIdx = 0;
setInterval(() => {
  const cards = document.querySelectorAll('.feed-card');
  const card = cards[feedIdx % cards.length];
  const msg = feedMessages[feedIdx % feedMessages.length];

  card.style.opacity = '0.5';
  card.style.transform = 'scale(0.98)';

  setTimeout(() => {
    card.querySelector('.feed-type').textContent = msg.type;
    card.querySelector('.feed-icon').textContent = msg.icon;
    card.querySelector('.feed-text').innerHTML = msg.text;
    card.querySelector('.score-fill').style.width = msg.score + '%';
    card.querySelector('.score-val').textContent = msg.score;
    card.querySelector('.feed-time').textContent = 'just now';

    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
  }, 300);

  feedIdx++;
}, 5000);
