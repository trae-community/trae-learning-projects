import DefaultTheme from 'vitepress/theme'
import './custom.css'
import VibeHero from './components/VibeHero.vue'
import HomeFeatures from './components/HomeFeatures.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VibeHero', VibeHero)
    app.component('HomeFeatures', HomeFeatures)
  }
}
