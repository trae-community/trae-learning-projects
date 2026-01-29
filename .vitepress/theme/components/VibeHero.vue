<template>
  <div class="vibe-hero">
    <div class="matrix-bg" ref="matrix"></div>
    <div class="hero-content">
      <h1 class="glitch-title" data-text="TRAE LEARNING">TRAE LEARNING</h1>
      <p class="subtitle">The Art of Vibecoding</p>
      <div class="cta-group">
        <a href="/guide/what-is-vibecoding" class="vibe-btn primary">开启 Vibe 之旅</a>
        <a href="/tutorials/" class="vibe-btn secondary">专家教程</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const matrix = ref(null)

onMounted(() => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  matrix.value.appendChild(canvas)

  let width = canvas.width = window.innerWidth
  let height = canvas.height = 400

  const letters = '01'
  const fontSize = 14
  const columns = width / fontSize
  const drops = []

  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#0fdc78'
    ctx.font = fontSize + 'px monospace'

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length))
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  const interval = setInterval(draw, 33)

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth
    // Keep height consistent with hero
  })
})
</script>

<style scoped>
.vibe-hero {
  position: relative;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  border-bottom: 1px solid rgba(15, 220, 120, 0.2);
}

.matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.glitch-title {
  font-size: 4rem;
  font-weight: 900;
  color: #0fdc78;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  position: relative;
  text-shadow: 0 0 10px rgba(15, 220, 120, 0.5);
}

.subtitle {
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  margin-bottom: 2.5rem;
  font-family: 'JetBrains Mono', monospace;
}

.cta-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.vibe-btn {
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  text-decoration: none;
}

.vibe-btn.primary {
  background: #0fdc78;
  color: #000;
  box-shadow: 0 0 20px rgba(15, 220, 120, 0.4);
}

.vibe-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 35px rgba(15, 220, 120, 0.7);
}

.vibe-btn.secondary {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.vibe-btn.secondary:hover {
  border-color: #0fdc78;
  color: #0fdc78;
}

@media (max-width: 768px) {
  .glitch-title {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1.1rem;
  }
  .vibe-hero {
    height: 400px;
  }
}
</style>
