import DefaultTheme from 'vitepress/theme'
import './custom.css'
import VibeHero from './components/VibeHero.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('VibeHero', VibeHero)
  }
}
