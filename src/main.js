import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import EnglishZeroToHero from './EnglishZeroToHero'
import Test from './Test'
import Annotate from '@/components/Annotate'
import WordList from '@/components/WordList'
import Loader from '@/components/Loader.vue'
import Star from '@/components/Star'
import Speak from '@/components/Speak'
import ShowMoreButton from '@/components/ShowMoreButton'
import VueObserveVisibility from 'vue-observe-visibility'
import Config from '@/lib/config'

Vue.config.productionTip = false

import { i18n } from './plugins/i18n.js'
import router from './router'
import store from './store'

Vue.use(BootstrapVue)
Vue.use(VTooltip)
Vue.use(VueObserveVisibility)

Vue.component('Annotate', Annotate)
Vue.component('Loader', Loader)
Vue.component('Star', Star)
Vue.component('Speak', Speak)
Vue.component('ShowMoreButton', ShowMoreButton)
Vue.component('WordList', WordList)

// https://alligator.io/vuejs/vue-router-modify-head/
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
    el => el.parentNode.removeChild(el)
  )

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement('meta')

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key])
      })

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '')

      return tag
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag))

  next()
})

if (location.hash === '#/test') {
  new Vue({
    store,
    render: h => h(Test)
  }).$mount('#test')
} else {
  $.getJSON('/data/languages.json', langs => {
    Vue.prototype.$langs = langs
    new Vue({
      router,
      store,
      i18n,
      render: h => h(EnglishZeroToHero)
    }).$mount('#englishzerotohero')
  })
}
