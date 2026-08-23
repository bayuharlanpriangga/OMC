function initGalaxyBackground() {
  // ══════════════════════════════════════════
  // GALAXY BACKGROUND — Stars + Shooting Stars
  // Covers the entire app, fixed behind everything
  // ══════════════════════════════════════════
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-galaxy';
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Static star field
  const STAR_COUNT = window.innerWidth < 768 ? 180 : 380;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.15,
      opacity: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 0.006 + 0.002,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() < 0.15 
        ? `rgba(201,168,76,` 
        : Math.random() < 0.1 
          ? `rgba(155,168,232,`
          : `rgba(237,232,223,`
    });
  }

  // Shooting stars pool
  const shooters = [];
  function spawnShooter() {
    const angle = (Math.random() * 30 + 15) * Math.PI / 180; // 15–45 deg
    const speed = Math.random() * 6 + 4;
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * (canvas.height * 0.5);
    shooters.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: Math.random() * 180 + 80,
      opacity: 1,
      fade: Math.random() * 0.015 + 0.008,
      width: Math.random() * 1.5 + 0.5,
      color: Math.random() < 0.3 ? '201,168,76' : '237,232,223',
      trail: []
    });
  }
  // Continuously spawn
  setInterval(() => {
    if (shooters.length < 8) spawnShooter();
  }, Math.random() * 400 + 300);
  // Initial burst
  for (let i = 0; i < 3; i++) setTimeout(spawnShooter, i * 600);

  let frame = 0;
  function drawGalaxy() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static stars with twinkle
    for (const s of stars) {
      const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
      const op = s.opacity * (0.6 + 0.4 * twinkle);
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + op.toFixed(3) + ')';
      ctx.fill();
      // Add tiny glow to brighter stars
      if (s.r > 1.0 && op > 0.55) {
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * 2.8, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(
          s.x * canvas.width, s.y * canvas.height, 0,
          s.x * canvas.width, s.y * canvas.height, s.r * 2.8
        );
        grd.addColorStop(0, s.color + (op * 0.18).toFixed(3) + ')');
        grd.addColorStop(1, s.color + '0)');
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    // Draw & update shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > Math.round(s.length / (Math.sqrt(s.vx**2 + s.vy**2)))) {
        s.trail.shift();
      }
      s.x += s.vx;
      s.y += s.vy;
      s.opacity -= s.fade;

      if (s.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (let t = 1; t < s.trail.length; t++) {
          ctx.lineTo(s.trail[t].x, s.trail[t].y);
        }
        const grad = ctx.createLinearGradient(
          s.trail[0].x, s.trail[0].y, s.x, s.y
        );
        grad.addColorStop(0, `rgba(${s.color},0)`);
        grad.addColorStop(0.6, `rgba(${s.color},${(s.opacity * 0.4).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${s.color},${s.opacity.toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${(s.opacity * 0.9).toFixed(3)})`;
        ctx.fill();
      }

      if (s.opacity <= 0 || s.x > canvas.width + 50 || s.y > canvas.height + 50) {
        shooters.splice(i, 1);
      }
    }

    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();

}
