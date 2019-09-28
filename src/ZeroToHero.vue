<template>
  <div id="zerotohero"
    :class="classes">
    <template v-if="langsLoaded && this.$route.path !== '/'">
      <div class="container-fluid bg-dark pt-4 pl-0 pr-0">
        <div class="container">
          <div class="row mb-4">
            <div class="col-sm-12 text-center pt-3">
              <LanguageLogo :l1="$l1" :l2="$l2" style="transform: scale(1.5)" />
              <a
                v-if="$l1.code === 'zh' && $l2.code === 'en'"
                class="btn btn-success btn-sign-in text-white"
                href="https://wazuc.duanshu.com/#/"
                target="_blank"
              >
                登陆
                <img src="/img/logo-duanshu-light.png" class="logo-small ml-1" />
              </a>
              <a
                v-if="$l1.code === 'en' && $l2.code === 'zh'"
                class="btn btn-success btn-sign-in text-white"
                href="https://sso.teachable.com/secure/133035/users/sign_in"
                >Login to <img src="/img/teachable_light.png" class="logo-small"
              /></a>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 text-center">
              <Nav />
            </div>
          </div>
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
              <p class="lead mt-4">Learn other languages:</p>
              <Choose :compact="true" />
            </div>
          </div>
        </div>
      </footer>
    </template>
    <template v-else>
      <div class="container-fluid bg-dark text-light pt-4 pb-4" style="min-height: 100vh">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1
                class="text-light mt-5 mb-5 text-center"
                style="font-weight: 500"
              >Learn the world’s languages, from zero to hero.</h1>
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
import Vue from 'vue'
import Dict from '@/lib/dict'

export default {
  components: {
    Nav,
    SubNav,
    Choose,
    LanguageLogo
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
        localStorage.getItem('zthHidePinyinExceptSaved') === 'true',
      useTraditional: localStorage.getItem('zthUseTraditional') === 'true',
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
      }
      if (this.$l1) this.classes[`l1-${this.$l1.code}`] = true
      if (this.$l2) this.classes[`l2-${this.$l2.code}`] = true
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
    async $route() {
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
          Vue.prototype.$hasFeature = feature => {
            if (feature === 'dictionary') {
              return this.$l1.dictionaries && this.$l1.dictionaries[this.$l2['iso639-3']]
            } else if (feature === 'youtube') {
              return this.$languages.hasYouTube(this.$l1, this.$l2)
            } else if (feature === 'speech') {
              return speechSynthesis
                .getVoices()
                .find(voice => voice.lang.startsWith(this.$l2.code))
            } else {
              return this.$languages
                .getFeatures({
                  l1: this.$l1,
                  l2: this.$l2
                })
                .includes(feature)
            }
          }
          this.langsLoaded = true
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
          if (!Vue.prototype.$hanzi && ['zh', 'ko', 'ja'].includes(this.$l2.code)) {
            Vue.prototype.$hanzi = (await import(`@/lib/hanzi.js`)).default.load()
            Vue.prototype.$unihan = (await import(`@/lib/unihan.js`)).default.load()
          }
          if (!Vue.prototype.$grammar && ['zh'].includes(this.$l2.code)) {
            Vue.prototype.$grammar = (await import(`@/lib/grammar.js`)).default.load()
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
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
  padding: 0.5 1rem;
  position: absolute;
  top: 0;
  right: 1rem;
  img {
    height: 1.2rem;
    margin-bottom: 0.2rem;
  }
}
</style>