const box = document.getElementById('brownianparticlebox');
const ctx = box.getContext('2d');

function resize() {
  box.width = window.innerWidth;
  box.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const N = 100;
const particles = [];
const radius = 15;
const maxSpeed = 300;

for (let i = 0; i < N; i++) {
  particles.push({
    x: Math.random() * (box.width - 2 * radius) + radius,
    y: Math.random() * (box.height - 2 * radius) + radius,
    vx: (Math.random() - 0.5) * 200,
    vy: (Math.random() - 0.5) * 200
  });
}

function velocityToColor(v) {
  const vClamped = Math.min(v, maxSpeed);
  const hue = (1 - vClamped / maxSpeed) * 0 + (vClamped / maxSpeed) * 270;
  return `hsl(${hue}, 100%, 50%)`;
}

function collide(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 2 * radius) {
    const nx = dx / dist;
    const ny = dy / dist;
    const dvx = p2.vx - p1.vx;
    const dvy = p2.vy - p1.vy;
    const vn = dvx * nx + dvy * ny;
    if (vn < 0) {
      const damp = 0.8;
      const impulse = (1 + damp) * vn / 2;
      p1.vx += impulse * nx;
      p1.vy += impulse * ny;
      p2.vx -= impulse * nx;
      p2.vy -= impulse * ny;
    }
  }
}

let last = performance.now();
function animate(t) {
  const dt = (t - last) / 1000;
  last = t;

  ctx.clearRect(0, 0, box.width, box.height);

  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.x < radius) { p.x = radius; p.vx *= -1; }
    if (p.x > box.width - radius) { p.x = box.width - radius; p.vx *= -1; }
    if (p.y < radius) { p.y = radius; p.vy *= -1; }
    if (p.y > box.height - radius) { p.y = box.height - radius; p.vy *= -1; }
  }

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      collide(particles[i], particles[j]);
    }
  }

  for (const p of particles) {
    const v = Math.hypot(p.vx, p.vy);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = velocityToColor(v);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
