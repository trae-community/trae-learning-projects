<template>
  <div class="hero-root">
    <canvas ref="cvs" class="globe-canvas"></canvas>
    <div class="hero-content">
      <div class="badge">
        <span class="dot"></span>
        AI-Powered Development
      </div>
      <h1 class="title">TRAE<br /><span class="accent">LEARNING</span></h1>
      <p class="desc">The Art of Vibecoding<br />探索 AI 辅助开发的无限可能</p>
      <div class="actions">
        <a :href="base + 'guide/what-is-vibecoding'" class="btn-primary">
          开始学习
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
        <a :href="base + 'tutorials/'" class="btn-ghost">浏览教程</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

const { site } = useData()
const base = site.value.base || '/'

const cvs = ref(null)
let raf = null
let onResize = null

onMounted(() => {
  const canvas = cvs.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // ── Sizing ──
  function resize() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()
  onResize = resize
  window.addEventListener('resize', onResize)

  // ── Procedural texture (data-continent patterns) ──
  const TEX_W = 140, TEX_H = 70
  const tex = new Float32Array(TEX_W * TEX_H)
  for (let r = 0; r < TEX_H; r++) {
    for (let c = 0; c < TEX_W; c++) {
      const u = (c / TEX_W) * Math.PI * 2
      const v = (r / TEX_H) * Math.PI
      let val = 0
      val += Math.sin(u * 2 + 0.5) * Math.cos(v * 1.5 + 0.8) * 0.35
      val += Math.sin(u * 5 + 2.1) * Math.sin(v * 3 + 1.2) * 0.28
      val += Math.cos(u * 9 - v * 4 + 3.0) * 0.16
      val += Math.sin(u * 17 + v * 13 + 5.0) * 0.11
      val += Math.sin(u * 3 - v * 7 + 1.5) * 0.14
      val += Math.cos(u * 11 + v * 2 - 4.0) * 0.10
      val = val * 0.5 + 0.5
      tex[r * TEX_W + c] = Math.pow(Math.max(0, Math.min(1, val)), 0.75)
    }
  }

  // ── Sphere grid ──
  const LAT = 60, LON = 100
  const grid = []
  for (let i = 0; i < LAT; i++) {
    const phi = ((i + 0.5) / LAT) * Math.PI
    const sinP = Math.sin(phi), cosP = Math.cos(phi)
    for (let j = 0; j < LON; j++) {
      const theta = (j / LON) * Math.PI * 2
      const tc = Math.floor((j / LON) * TEX_W) % TEX_W
      const tr = Math.floor((i / LAT) * TEX_H) % TEX_H
      grid.push({
        ox: sinP * Math.cos(theta),
        oy: cosP,
        oz: sinP * Math.sin(theta),
        b: tex[tr * TEX_W + tc],
        sinP
      })
    }
  }

  // ── Floating code symbols ──
  const syms = [
    { p: 0.65, t: 0.4, s: '{}', sz: 1.5 },
    { p: 1.1, t: 1.7, s: '</>', sz: 1.3 },
    { p: 0.45, t: 3.0, s: 'AI', sz: 1.7 },
    { p: 1.7, t: 0.8, s: 'fn()', sz: 1.1 },
    { p: 0.85, t: 4.3, s: '#', sz: 1.9 },
    { p: 2.1, t: 2.3, s: 'vibe', sz: 1.1 },
    { p: 1.4, t: 5.2, s: '=>', sz: 1.4 },
    { p: 0.35, t: 1.1, s: '$', sz: 1.6 },
    { p: 2.3, t: 3.7, s: '%', sz: 1.5 },
    { p: 0.95, t: 5.7, s: 'code', sz: 1.0 },
    { p: 0.55, t: 2.6, s: 'let', sz: 1.0 },
    { p: 2.5, t: 1.4, s: '[]', sz: 1.4 },
    { p: 1.25, t: 3.9, s: 'git', sz: 1.0 },
    { p: 0.7, t: 0.05, s: '<div>', sz: 0.9 },
    { p: 1.85, t: 5.5, s: 'npm', sz: 1.0 },
    { p: 0.4, t: 4.8, s: 'class', sz: 0.9 },
    { p: 2.0, t: 0.3, s: '&&', sz: 1.3 },
    { p: 1.5, t: 2.8, s: '0xFF', sz: 1.1 },
  ].map(s => ({
    ...s,
    ox: Math.sin(s.p) * Math.cos(s.t),
    oy: Math.cos(s.p),
    oz: Math.sin(s.p) * Math.sin(s.t),
  }))

  // ── Sparkle particles ──
  const sparkles = []
  for (let i = 0; i < 40; i++) {
    const phi = Math.random() * Math.PI
    const theta = Math.random() * Math.PI * 2
    sparkles.push({
      ox: Math.sin(phi) * Math.cos(theta),
      oy: Math.cos(phi),
      oz: Math.sin(phi) * Math.sin(theta),
      phase: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2
    })
  }

  // ── Rotation constants ──
  const TILT = 0.38
  const cosT = Math.cos(TILT), sinT = Math.sin(TILT)
  let angle = 0

  // ── Draw ──
  function draw() {
    const w = canvas.width, h = canvas.height
    if (!w || !h) { raf = requestAnimationFrame(draw); return }

    ctx.clearRect(0, 0, w, h)

    // Globe position — right side, large
    const cx = w * 0.66
    const cy = h * 0.46
    const R = Math.max(h * 0.50, w * 0.30, 280)

    const cosA = Math.cos(angle), sinA = Math.sin(angle)

    // Helper: rotate a point
    function rot(ox, oy, oz) {
      const rx = ox * cosA - oz * sinA
      const rz = ox * sinA + oz * cosA
      const ry = oy * cosT - rz * sinT
      const fz = oy * sinT + rz * cosT
      return { rx, ry, fz }
    }

    // ─── 1. Background atmosphere ───
    const g1 = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.6)
    g1.addColorStop(0, 'rgba(15, 220, 120, 0.04)')
    g1.addColorStop(0.5, 'rgba(15, 220, 120, 0.015)')
    g1.addColorStop(1, 'transparent')
    ctx.fillStyle = g1
    ctx.fillRect(0, 0, w, h)

    // ─── 2. Rim glow (drawn behind the sphere) ───
    const g2 = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.15)
    g2.addColorStop(0, 'rgba(15, 220, 120, 0.0)')
    g2.addColorStop(0.3, 'rgba(15, 220, 120, 0.10)')
    g2.addColorStop(0.6, 'rgba(15, 220, 120, 0.06)')
    g2.addColorStop(1, 'rgba(15, 220, 120, 0.0)')
    ctx.fillStyle = g2
    ctx.beginPath()
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2)
    ctx.fill()

    // ─── 3. Dark sphere base ───
    const g3 = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.15, R * 0.1, cx, cy, R)
    g3.addColorStop(0, 'rgba(6, 24, 14, 0.7)')
    g3.addColorStop(0.7, 'rgba(2, 10, 5, 0.85)')
    g3.addColorStop(1, 'rgba(0, 4, 2, 0.95)')
    ctx.fillStyle = g3
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fill()

    // ─── 4. Mosaic cells ───
    for (let i = 0; i < grid.length; i++) {
      const p = grid[i]
      const { rx, ry, fz } = rot(p.ox, p.oy, p.oz)
      if (fz < 0.01) continue

      const sx = cx + rx * R
      const sy = cy - ry * R
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue

      // Directional light from upper-right
      const NdotL = Math.max(0, rx * 0.35 + ry * 0.25 + fz * 0.45)
      // Rim
      const edge = 1 - fz
      const rim = edge * edge * edge * 0.35
      // Total light
      const light = 0.08 + NdotL * 0.65 + rim

      const brightness = p.b * light
      const size = (1.2 + fz * 3.2) * (0.35 + p.sinP * 0.65)
      const alpha = 0.12 + fz * 0.75

      // Color palette: dark teal → green → bright green
      let cr, cg, cb
      if (brightness > 0.5) {
        cr = 10 + brightness * 60 | 0
        cg = 130 + brightness * 90 | 0
        cb = 70 + brightness * 55 | 0
      } else if (brightness > 0.2) {
        cr = 3 + brightness * 30 | 0
        cg = 50 + brightness * 110 | 0
        cb = 28 + brightness * 55 | 0
      } else {
        cr = brightness * 18 | 0
        cg = 15 + brightness * 65 | 0
        cb = 10 + brightness * 35 | 0
      }

      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
      ctx.fillRect(sx - size * 0.5, sy - size * 0.5, size, size)
    }

    // ─── 5. Grid lines (subtle latitude/longitude) ───
    ctx.strokeStyle = 'rgba(15, 220, 120, 0.04)'
    ctx.lineWidth = 0.5

    // Longitude lines
    for (let li = 0; li < 12; li++) {
      const lonAngle = (li / 12) * Math.PI * 2
      ctx.beginPath()
      let started = false
      for (let s = 0; s <= 64; s++) {
        const phi = (s / 64) * Math.PI
        const ox = Math.sin(phi) * Math.cos(lonAngle)
        const oy = Math.cos(phi)
        const oz = Math.sin(phi) * Math.sin(lonAngle)
        const { rx, ry, fz } = rot(ox, oy, oz)
        if (fz < 0) { started = false; continue }
        const x = cx + rx * R
        const y = cy - ry * R
        if (!started) { ctx.moveTo(x, y); started = true }
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Latitude lines
    for (let li = 1; li < 8; li++) {
      const phi = (li / 8) * Math.PI
      const sinP = Math.sin(phi), cosP = Math.cos(phi)
      ctx.beginPath()
      let started = false
      for (let s = 0; s <= 72; s++) {
        const theta = (s / 72) * Math.PI * 2
        const ox = sinP * Math.cos(theta)
        const oy = cosP
        const oz = sinP * Math.sin(theta)
        const { rx, ry, fz } = rot(ox, oy, oz)
        if (fz < 0) { started = false; continue }
        const x = cx + rx * R
        const y = cy - ry * R
        if (!started) { ctx.moveTo(x, y); started = true }
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // ─── 6. Floating code symbols ───
    for (const s of syms) {
      const { rx, ry, fz } = rot(s.ox, s.oy, s.oz)
      if (fz < 0.1) continue
      const dist = 1.06
      const sx = cx + rx * R * dist
      const sy = cy - ry * R * dist
      if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue

      const fontSize = (10 + fz * 14) * s.sz
      const alpha = (0.08 + fz * 0.55)

      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Glow
      ctx.fillStyle = `rgba(15, 220, 120, ${alpha * 0.3})`
      ctx.fillText(s.s, sx + 1, sy + 1)
      // Main text
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillText(s.s, sx, sy)
    }

    // ─── 7. Sparkle particles ───
    const time = angle * 80
    for (const sp of sparkles) {
      const { rx, ry, fz } = rot(sp.ox, sp.oy, sp.oz)
      if (fz < 0.2) continue
      const sx = cx + rx * R * 1.02
      const sy = cy - ry * R * 1.02
      const flicker = (Math.sin(time * sp.speed + sp.phase) * 0.5 + 0.5)
      if (flicker < 0.6) continue
      const alpha = fz * flicker * 0.8
      const r = 1 + flicker * 2
      ctx.fillStyle = `rgba(200, 255, 220, ${alpha})`
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // ─── 8. Top-edge specular highlight ───
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    const g4 = ctx.createRadialGradient(
      cx + R * 0.25, cy - R * 0.55, R * 0.05,
      cx + R * 0.25, cy - R * 0.55, R * 0.6
    )
    g4.addColorStop(0, 'rgba(15, 220, 120, 0.12)')
    g4.addColorStop(0.4, 'rgba(15, 220, 120, 0.04)')
    g4.addColorStop(1, 'transparent')
    ctx.fillStyle = g4
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    angle += 0.002
    raf = requestAnimationFrame(draw)
  }

  draw()
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.hero-root {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  background: #000;
  overflow: hidden;
}

.globe-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ── Content: left-aligned ── */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 64px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #0FDC78;
  border: 1px solid rgba(15, 220, 120, 0.25);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  margin-bottom: 28px;
  letter-spacing: 0.04em;
  animation: fadeUp 0.7s ease forwards;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0FDC78;
  box-shadow: 0 0 6px rgba(15, 220, 120, 0.9);
  animation: blink 2.4s ease-in-out infinite;
}

.title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: #fff;
  margin: 0 0 24px;
  animation: fadeUp 0.7s ease 0.08s forwards;
  opacity: 0;
}

.accent {
  background: linear-gradient(135deg, #0FDC78 30%, #fff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.desc {
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  line-height: 1.8;
  color: #71717A;
  margin: 0 0 36px;
  max-width: 380px;
  animation: fadeUp 0.7s ease 0.16s forwards;
  opacity: 0;
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  animation: fadeUp 0.7s ease 0.24s forwards;
  opacity: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 13px 28px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #000;
  background: #0FDC78;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 24px rgba(15, 220, 120, 0.3);
}

.btn-primary:hover {
  background: #fff;
  color: #000;
  box-shadow: 0 4px 32px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 13px 28px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  border-color: #0FDC78;
  color: #0FDC78;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-content {
    padding: 0 24px;
    text-align: center;
  }
  .desc {
    margin-left: auto;
    margin-right: auto;
  }
  .actions {
    justify-content: center;
  }
}
</style>
