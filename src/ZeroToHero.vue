<template>
  <div id="zerotohero" :class="classes">
    <template v-if="langsLoaded && this.$route.path !== '/'">
      <div class="container-fluid pl-0 pr-0 p-2 site-top-bar">
        <LanguageSwitch style="flex: 1" />
        <a
          v-if="$l1.code === 'zh' && $l2.code === 'en'"
          class="btn btn-primary btn-sign-in text-white ml-1"
          href="https://wazuc.duanshu.com/#/"
          target="_blank"
        >
          登陆
          <img src="/img/logo-duanshu-light.png" class="logo-small ml-1" />
        </a>
        <a
          v-if="$l1.code === 'en' && $l2.code === 'zh'"
          class="btn btn-primary btn-sign-in text-white ml-1"
          href="https://sso.teachable.com/secure/133035/users/sign_in"
        >
          Login to
          <img src="/img/teachable_light.png" class="logo-small" />
        </a>
      </div>
      <div class="container-fluid bg-dark pl-0 pr-0">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 text-center">
              <LanguageLogo :l1="$l1" :l2="$l2" style="margin-top: 1.5rem" />
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid bg-dark sticky" style="z-index: 3">
        <div class="row">
          <Nav />
        </div>
      </div>
      <SubNav class="pt-4" />

      <keep-alive>
        <router-view ref="routerView" />
      </keep-alive>

      <footer class="container-fluid bg-dark text-light pt-4 pb-4">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <Choose :compact="true" />
            </div>
          </div>
        </div>
      </footer>
    </template>
    <template v-else>
      <div
        class="container-fluid bg-dark text-light pt-4 pb-4"
        style="min-height: 100vh"
      >
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1
                class="text-light mt-5 mb-5 text-center"
                style="font-weight: 500"
              >
                Zero to Hero Education
              </h1>
              <Choose :compact="true" class="mt-5" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import SubNav from '@/components/SubNav'
import LanguageLogo from '@/components/LanguageLogo'
import Choose from '@/components/Choose'
import Config from '@/lib/config'
import Search from '@/components/Search'
import Vue from 'vue'
import Dict from '@/lib/dict'
import LanguageSwitch from '@/components/LanguageSwitch'

export default {
  components: {
    Nav,
    SubNav,
    Choose,
    LanguageLogo,
    LanguageSwitch
  },
  data() {
    return {
      Config,
      classes: undefined,
      languages: [],
      langsLoaded: false,
      focus: false,
      loaded: false,
      showDefinition: localStorage.getItem('zthShowDefinition') === 'true',
      hidePinyinExceptSaved:
        localStorage.getItem('zthHidePinyinExceptSaved') === 'false' ? false : true,
      useTraditional: localStorage.getItem('zthUseTraditional') === 'true',
      showTranslation:
        localStorage.getItem('zthShowTranslation') === 'false' ? false : true,
      showQuiz: localStorage.getItem('zthShowQuiz') === 'false' ? false : true,
    }
  },
  methods: {
    updateClasses() {
      this.classes = {
        'hide-except-focus': this.focus,
        'show-pinyin': !this.hidePinyinExceptSaved,
        'show-pinyin-for-saved': this.hidePinyinExceptSaved,
        'show-simplified': !this.useTraditional,
        'show-traditional': this.useTraditional,
        'show-definition': this.showDefinition,
        'show-translation': this.showTranslation
      }
      if (this.$l1) this.classes[`l1-${this.$l1.code}`] = true
      if (this.$l2) this.classes[`l2-${this.$l2.code}`] = true
    },
    updateFavicon() {
      var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = `/img/logo-square/${this.$l2.code}.jpeg`
      document.getElementsByTagName('head')[0].appendChild(link)
    },
    updateTitle() {
      document.title = document.title
        .replace('| Zero to Hero', `| ${this.$l2.name} Zero to Hero`)
        .replace(/^Zero to Hero/, `${this.$l2.name} Zero to Hero`)
    },
    async setL1() {
      Vue.prototype.$l1 = this.$languages.getSmart(this.$route.params.l1)
      this.$i18n.locale = this.$l1.code
      try {
        this.$i18n.setLocaleMessage(
          this.$l1.code,
          (await import(`@/lib/langs/${this.$l1['iso639-3']}.js`)).default
            .translations
        )
      } catch (err) {
        console.log(
          `UI translations for ${this.$l1['iso639-3']} is unavailable.`
        )
      }
    },
    async setL2() {
      Vue.prototype.$l2 = this.$languages.getSmart(this.$route.params.l2)
      try {
        this.$i18n.setLocaleMessage(
          this.$l2.code,
          (await import(`@/lib/langs/${this.$l2['iso639-3']}.js`)).default
            .translations
        )
      } catch (err) {
        console.log(
          `UI translations for ${this.$l2['iso639-3']} is unavailable.`
        )
      }
    }
  },
  watch: {
    showDefinition() {
      this.updateClasses()
    },
    hidePinyinExceptSaved() {
      this.updateClasses()
    },
    useTraditional() {
      this.updateClasses()
    },
    showTranslation() {
      this.updateClasses()
    },
    showQuiz() {
      Vue.prototype.$showQuiz = this.showQuiz
    },
    async $route() {
      this.$ga.page(this.$route.path)
      if (this.$route.params.l1 && this.$route.params.l2) {
        if (
          (this.$l1 && this.$route.params.l1 !== this.$l1.code) ||
          (this.$l2 && this.$route.params.l2 !== this.$l2.code)
        ) {
          // switching language
          location.reload()
        } else {
          // first time loading, set the language
          await this.setL1()
          await this.setL2()
          this.updateClasses()
          this.updateFavicon()
          this.updateTitle()
          Vue.prototype.$hasFeature = feature => {
            return this.$languages
              .getFeatures({
                l1: this.$l1,
                l2: this.$l2
              })
              .includes(feature)
          }
          Vue.prototype.$showQuiz = this.showQuiz
          let dictionaries = this.$l1.dictionaries // ['freedict']
            ? this.$l1.dictionaries[this.$l2['iso639-3']]
            : undefined
          if (!Vue.prototype.$dictionary && dictionaries) {
            Vue.prototype.$dictionaryName = dictionaries[0] // 'freedict'
            Vue.prototype.$dictionary = Dict.load({
              dict: Vue.prototype.$dictionaryName,
              l1: this.$l1['iso639-3'],
              l2: this.$l2['iso639-3']
            })
          }
          if (
            !Vue.prototype.$hanzi &&
            ['zh', 'ko', 'ja'].includes(this.$l2.code)
          ) {
            Vue.prototype.$hanzi = (await import(
              `@/lib/hanzi.js`
            )).default.load()
            Vue.prototype.$unihan = (await import(
              `@/lib/unihan.js`
            )).default.load()
          }
          if (!Vue.prototype.$grammar && ['zh'].includes(this.$l2.code)) {
            Vue.prototype.$grammar = (await import(
              `@/lib/grammar.js`
            )).default.load()
          }
          this.langsLoaded = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
.site-top-bar {
  background-color: rgb(29, 29, 29);
  display: flex;
  justify-content: space-between;
}

.logo {
  height: 6rem;
}

.zerotohero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.zerotohero-item {
  width: 15rem;
}

.btn-sign-in {
  font-size: 0.8rem;
  text-decoration: none;
  img {
    height: 1.2rem;
    margin-bottom: 0.2rem;
  }
}
</style>