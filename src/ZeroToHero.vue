<template>
  <div id="english-zero-to-hero">
    <template v-if="langsLoaded && this.$route.path !== '/'">
      <div class="container-fluid bg-dark pt-4 pl-0 pr-0">
        <div class="container">
          <div class="row mb-4">
            <div class="col-sm-12 text-center pt-3">
              <LanguageLogo :l1="$l1" :l2="$l2" style="transform: scale(1.5)" />
              <a
                v-if="$hasFeature('courses')"
                class="btn btn-success btn-sign-in text-white"
                href="https://wazuc.duanshu.com/#/"
                target="_blank"
              >
                登陆
                <img src="/img/logo-duanshu-light.png" class="logo-small ml-1" />
              </a>
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
              <a href="#/">Study other languages</a>
              <hr class="border-light" style="opacity: 0.5" />
              <p>
                <b>Zero to Hero Education, Canada.</b>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </template>
    <template v-else>
      <div class="container-fluid bg-dark text-light pt-4 pb-4">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1 class="text-light mt-5 mb-5 text-center" style="font-weight: 500">Learn languages, from zero to hero.</h1>
              <p class="lead">
                <b style="font-weight: 900">Zero to Hero Education, Canada</b> is dedicated to help you learn languages, from the very beginning (“zero”) to a very very advanced level (“hero”).
              </p>
              <p>Although our focus is teaching Mandarin Chinese to English speakers (<a href="#/en/zh/">Chinese Zero to Hero</a>), and teaching English to Mandarin Chinese speakers (<a href="#/zh/en/">English Zero to Hero</a>), we've also created free, open-source learning resources that work with hundres of other language pairs.</p>
              <Choose class="mt-5" />
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
      languages: [],
      langsLoaded: false
    }
  },
  methods: {
    async setL1() {
      Vue.prototype.$l1 = this.$languages.getSmart(this.$route.params.l1)
      this.$i18n.locale = this.$l1.code
      try {
        this.$i18n.setLocaleMessage(
          this.$l1.code,
          (await import(`@/lib/langs/${this.$l1['iso639-2t']}.js`)).default
            .translations
        )
      } catch (err) {
        console.log(
          `UI translations for ${this.$l1['iso639-2t']} is unavailable.`
        )
      }
    },
    async setL2() {
      Vue.prototype.$l2 = this.$languages.getSmart(this.$route.params.l2)
      try {
        this.$i18n.setLocaleMessage(
          this.$l2.code,
          (await import(`@/lib/langs/${this.$l2['iso639-2t']}.js`)).default
            .translations
        )
      } catch (err) {
        console.log(
          `UI translations for ${this.$l2['iso639-2t']} is unavailable.`
        )
      }
    }
  },
  watch: {
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
          Vue.prototype.$hasFeature = feature =>
            this.$languages
              .getFeatures({
                l1: this.$l1,
                l2: this.$l2
              })
              .includes(feature)
          let dictionaries = this.$l1.dictionaries
            ? this.$l1.dictionaries[this.$l2['iso639-2t']]
            : undefined
          if (!Vue.prototype.$dictionary && dictionaries) {
            Vue.prototype.$dictionary = Dict.load({
              dict: dictionaries[0],
              l1: this.$l1['iso639-2t'],
              l2: this.$l2['iso639-2t']
            })
          }
          this.langsLoaded = true
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
