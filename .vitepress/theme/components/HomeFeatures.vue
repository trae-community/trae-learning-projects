<template>
  <section class="features-root" ref="sectionRef">
    <!-- Left side light bar -->
    <div class="light-bar" :style="{ '--light-y': lightY + 'px' }">
      <div class="light-bloom"></div>
      <div class="light-glow"></div>
      <div class="light-core"></div>
      <div class="light-line"></div>
    </div>

    <!-- Section header -->
    <div class="section-header">
      <h2 class="heading">重新定义编程体验</h2>
      <p class="sub">汇聚社区智慧，探索 AI 辅助开发的无限可能</p>
    </div>

    <!-- Feature items -->
    <div class="features-list">
      <div class="feature-item" v-for="(item, idx) in features" :key="idx">
        <div class="feature-text">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <div class="feature-card glass">
          <div class="card-header">
            <span class="card-dot"></span>
            <span class="card-dot"></span>
            <span class="card-dot"></span>
            <span class="card-lang">{{ item.lang }}</span>
          </div>
          <pre class="card-code"><code v-html="item.highlighted"></code></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- Manifesto -->
  <section class="manifesto">
    <div class="manifesto-inner glass">
      <span class="manifesto-label">Manifesto</span>
      <blockquote>
        在 AI 时代，编程的门槛正在消失，而审美的价值正在凸显。Vibecoding 不仅仅是关于写代码，它是关于如何与智能伙伴共鸣，如何将模糊的直觉转化为精致的数字现实。
      </blockquote>
      <div class="manifesto-author">— Trae Community</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const lightY = ref(200)

let onMouseMove = null
let onScroll = null

onMounted(() => {
  onMouseMove = (e) => {
    if (!sectionRef.value) return
    const rect = sectionRef.value.getBoundingClientRect()
    const relY = e.clientY - rect.top
    lightY.value = Math.max(0, Math.min(relY, rect.height))
  }

  onScroll = () => {
    if (!sectionRef.value) return
    const rect = sectionRef.value.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const relY = viewportCenter - rect.top
    lightY.value = Math.max(0, Math.min(relY, rect.height))
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('scroll', onScroll)
  onScroll()
})

onUnmounted(() => {
  if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

// ── Simple syntax highlighter ──
function hl(code, lang) {
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (lang === 'prompt') {
    // Prompt lines starting with >
    s = s.replace(/^(&gt;.*)$/gm, '<span class="hl-prompt">$1</span>')
    // Check marks
    s = s.replace(/^(✓.*)$/gm, '<span class="hl-success">$1</span>')
    return s
  }

  if (lang === 'yaml') {
    // Keys
    s = s.replace(/^(\s*)(\w[\w\s]*):/gm, '$1<span class="hl-key">$2</span><span class="hl-punct">:</span>')
    // Strings in quotes
    s = s.replace(/"([^"]*)"/g, '<span class="hl-string">"$1"</span>')
    // List items
    s = s.replace(/^(\s*)(- )/gm, '$1<span class="hl-punct">- </span>')
    // Numbers
    s = s.replace(/:\s+(\d[\d.]*k?)\b/g, ': <span class="hl-number">$1</span>')
    return s
  }

  // JS / TS
  // Comments (single line)
  s = s.replace(/(\/\/.*)/g, '<span class="hl-comment">$1</span>')
  // Strings
  s = s.replace(/"([^"]*)"/g, '<span class="hl-string">"$1"</span>')
  // Keywords
  s = s.replace(/\b(const|let|var|async|await|return|function|import|export|from|if|else|new)\b/g, '<span class="hl-keyword">$1</span>')
  // Function calls
  s = s.replace(/\b(\w+)\(/g, '<span class="hl-fn">$1</span>(')
  // Numbers
  s = s.replace(/\b(\d+)\b/g, '<span class="hl-number">$1</span>')
  // Arrow
  s = s.replace(/=&gt;/g, '<span class="hl-punct">=&gt;</span>')

  return s
}

const features = [
  {
    title: '心流编码',
    desc: '超越传统的语法约束，专注于构建逻辑与创意表达。让 AI 处理繁琐细节，你只需专注于创造。',
    lang: 'typescript',
    code: `// 描述意图，AI 完成实现
const api = createAPI({
  auth: "jwt",
  rateLimit: 100,
  cache: "redis"
});

// 自动生成类型安全的端点
api.get("/users/:id", async (ctx) => {
  return await db.users.find(ctx.params.id);
});`
  },
  {
    title: '极速反馈',
    desc: '利用 Trae 的 AI 能力实现即时原型设计与代码迭代。从想法到实现，只需几分钟。',
    lang: 'prompt',
    code: `> 创建一个带有暗色主题的登录表单
> 添加邮箱验证和密码强度检测
> 集成 OAuth 登录按钮

✓ 生成 LoginForm 组件
✓ 添加表单验证逻辑
✓ 集成 Google/GitHub OAuth
✓ 应用暗色主题样式`
  },
  {
    title: '专家共建',
    desc: '来自全球 Vibecoding 专家的实战课程与最佳实践。社区驱动，持续更新。',
    lang: 'yaml',
    code: `contributors:
  - name: "社区专家"
    courses: 12
    students: 2.4k

topics:
  - AI 辅助开发
  - 提示词工程
  - 代码审美
  - 效率工具链`
  },
  {
    title: '技术审美',
    desc: '培养对代码优雅度与系统设计的敏锐嗅觉。在 AI 时代，审美成为核心竞争力。',
    lang: 'javascript',
    code: `// 优雅的代码自己会说话
const pipeline = compose(
  validate,
  transform,
  enrich,
  persist
);

// 清晰的架构胜过冗长的注释
await pipeline(data);`
  }
].map(f => ({ ...f, highlighted: hl(f.code, f.lang) }))
</script>

<style scoped>
/* ─── Root ─── */
.features-root {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 24px 60px;
}

/* ─── Light Bar ─── */
.light-bar {
  position: absolute;
  left: -80px;
  top: 0;
  bottom: 0;
  width: 300px;
  pointer-events: none;
  z-index: 0;
}

/* Outermost bloom — very wide, soft diffusion */
.light-bloom {
  position: absolute;
  left: -80px;
  top: var(--light-y, 200px);
  width: 500px;
  height: 700px;
  transform: translateY(-50%);
  background: radial-gradient(
    ellipse 70% 45% at 0% 50%,
    rgba(15, 220, 120, 0.18) 0%,
    rgba(15, 220, 120, 0.04) 50%,
    transparent 100%
  );
  filter: blur(50px);
  transition: top 0.35s ease-out;
}

/* Main glow — bright center */
.light-glow {
  position: absolute;
  left: -20px;
  top: var(--light-y, 200px);
  width: 250px;
  height: 500px;
  transform: translateY(-50%);
  background: radial-gradient(
    ellipse 80% 40% at 0% 50%,
    rgba(15, 220, 120, 0.55) 0%,
    rgba(15, 220, 120, 0.15) 40%,
    transparent 80%
  );
  filter: blur(35px);
  transition: top 0.35s ease-out;
}

/* Bright core strip */
.light-core {
  position: absolute;
  left: 0;
  top: var(--light-y, 200px);
  width: 4px;
  height: 200px;
  transform: translateY(-50%);
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(15, 220, 120, 0.9) 30%,
    rgba(15, 220, 120, 1) 50%,
    rgba(15, 220, 120, 0.9) 70%,
    transparent
  );
  border-radius: 2px;
  box-shadow:
    0 0 12px rgba(15, 220, 120, 0.8),
    0 0 40px rgba(15, 220, 120, 0.4);
  transition: top 0.35s ease-out;
}

/* Vertical guide line */
.light-line {
  position: absolute;
  left: 1px;
  top: 60px;
  bottom: 60px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(15, 220, 120, 0.06) 15%,
    rgba(15, 220, 120, 0.06) 85%,
    transparent
  );
}

/* ─── Section Header ─── */
.section-header {
  text-align: center;
  margin-bottom: 72px;
  position: relative;
  z-index: 1;
}

.heading {
  font-family: 'Inter', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
}

.sub {
  font-size: 1rem;
  color: #52525B;
  max-width: 400px;
  margin: 0 auto;
}

/* ─── Feature Items ─── */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 80px;
  position: relative;
  z-index: 1;
}

.feature-item {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 48px;
  align-items: center;
}

.feature-item:nth-child(even) {
  direction: rtl;
}

.feature-item:nth-child(even) > * {
  direction: ltr;
}

/* ─── Feature Text ─── */
.feature-text {
  padding: 20px 0;
}

.feature-text h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

.feature-text p {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #71717A;
  margin: 0;
}

/* ─── Glass Card ─── */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.feature-card {
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(0, 0, 0, 0.2);
}

.card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.card-dot:nth-child(1) { background: rgba(255, 95, 87, 0.7); }
.card-dot:nth-child(2) { background: rgba(255, 189, 46, 0.7); }
.card-dot:nth-child(3) { background: rgba(39, 201, 63, 0.7); }

.card-lang {
  margin-left: auto;
  font-size: 0.7rem;
  color: #52525B;
  font-family: 'JetBrains Mono', monospace;
  text-transform: lowercase;
}

.card-code {
  margin: 0;
  padding: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #A1A1AA;
  overflow-x: auto;
}

.card-code code {
  color: inherit;
  font-family: inherit;
}

/* ─── Syntax Highlight Colors ─── */
.card-code :deep(.hl-keyword) {
  color: #c792ea;
}

.card-code :deep(.hl-string) {
  color: #0FDC78;
}

.card-code :deep(.hl-comment) {
  color: #546e7a;
  font-style: italic;
}

.card-code :deep(.hl-fn) {
  color: #82aaff;
}

.card-code :deep(.hl-number) {
  color: #f78c6c;
}

.card-code :deep(.hl-punct) {
  color: #89ddff;
}

.card-code :deep(.hl-key) {
  color: #f07178;
}

.card-code :deep(.hl-prompt) {
  color: #82aaff;
}

.card-code :deep(.hl-success) {
  color: #0FDC78;
}

/* ─── Manifesto ─── */
.manifesto {
  max-width: 750px;
  margin: 60px auto 100px;
  padding: 0 24px;
}

.manifesto-inner {
  padding: 56px 48px;
  text-align: center;
  position: relative;
}

.manifesto-inner::before {
  content: '\201C';
  position: absolute;
  top: 20px;
  left: 36px;
  font-family: Georgia, serif;
  font-size: 4.5rem;
  color: #0FDC78;
  opacity: 0.12;
  line-height: 1;
}

.manifesto-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #0FDC78;
  margin-bottom: 24px;
}

.manifesto blockquote {
  font-size: 1.1rem;
  line-height: 2;
  color: #A1A1AA;
  font-weight: 400;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
}

.manifesto-author {
  margin-top: 28px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0FDC78;
  letter-spacing: 0.04em;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .light-bar { display: none; }
}

@media (max-width: 768px) {
  .features-root { padding: 60px 20px 40px; }
  .heading { font-size: 1.75rem; }
  .section-header { margin-bottom: 48px; }
  .features-list { gap: 48px; }

  .feature-item,
  .feature-item:nth-child(even) {
    grid-template-columns: 1fr;
    direction: ltr;
  }

  .feature-text { text-align: center; padding: 0; }
  .feature-text h3 { font-size: 1.25rem; }
  .card-code { font-size: 0.72rem; padding: 16px; }
  .manifesto { margin: 40px auto 60px; }
  .manifesto-inner { padding: 40px 24px; }
  .manifesto blockquote { font-size: 1rem; line-height: 1.8; }
}
</style>
