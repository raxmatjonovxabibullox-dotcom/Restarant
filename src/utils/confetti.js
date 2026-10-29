// High-performance Luxury Gold Confetti & Stardust Engine
// 100% Native Web Canvas, Zero external dependencies, 60fps smooth physics

class LuxuryConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.colors = [
      '#F59E0B', // Amber
      '#FBBF24', // Warm Gold
      '#FDE68A', // Light Champagne
      '#D97706', // Deep Gold
      '#10B981', // Emerald Sparkle
      '#FFFFFF'  // Diamond White
    ];
  }

  ensureCanvas() {
    if (!this.canvas && typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'luxury-confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '99999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  burst({ x = 0.5, y = 0.4, count = 100 } = {}) {
    this.ensureCanvas();
    if (!this.ctx) return;

    const originX = x * this.canvas.width;
    const originY = y * this.canvas.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 7,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        decay: 0.009 + Math.random() * 0.012
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx || this.particles.length === 0) {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.animationId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}

export const luxuryConfetti = new LuxuryConfettiEngine();
