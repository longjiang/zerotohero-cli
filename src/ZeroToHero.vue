<template>
  <div id="english-zero-to-hero">
    <template v-if="langsLoaded">
      <div class="container-fluid bg-dark pt-4 pl-0 pr-0">
        <div class="container">
          <div class="row mb-4">
            <div class="col-sm-12 text-center pt-3">
              <router-link :to="`/${$l1.code}`">
                <EnglishLogo :language="$l1" style="transform: scale(1.5)" />
              </router-link>
              <a
                v-if="$l1.options.features && $l1.options.features.includes('courses')"
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
              <h6 class="mb-4 text-white">{{ $t('Learn varous languages through English:') }}</h6>
              <div class="zerotohero">
                <LanguageLogo
                  v-for="language in languages.filter(language => language.url && language.published === true).sort((a,b) => b.name > a.name ? -1 : 0)"
                  :language="language"
                />
              </div>
              <hr class="border-light" style="opacity: 0.5" />
              <h6 class="mt-4 mb-4 text-white">{{ $t('Learn English through various languages:') }}</h6>
              <div class="zerotohero">
                <EnglishLogo
                  v-for="language in languages.filter(language => language.enURL && language.enPublished === true).sort((a,b) => b.name > a.name ? -1 : 0)"
                  class="zerotohero-item"
                  :language="language"
                />
              </div>
              <hr class="border-light mt-0 mb-4" style="opacity: 0.5" />
              <p>
                <b>Zero to Hero Education, Canada.</b>
              </p>
              <p v-if="$l1.enDictionary">
                <b>Credits:</b>
                {{ $l1.name }}-English dictionary data from
                <span
                  v-if="$l1.enDictionary === 'freedict'"
                >
                  <a href="https://freedict.org/">freedict.org</a>
                </span>
                <span v-if="$l1.enDictionary === 'ecdict'">
                  <a href="https://github.com/skywind3000/ECDICT">ECDICT</a>
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </footer>
    </template>
    <template v-else>
      <div class="container-fluid bg-dark text-light pt-5 pb-5">
        <div class="container">
          <div class="row mb-4">
            <div class="col-sm-12 text-center pt-3">
              <h1 style="font-family: 'Helvetica Neue'; font-weight: 500;">Zero to Hero Education</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="container main mt-5 mb-5">
        Choose your language
      </div>

      <footer class="container-fluid bg-dark text-light pt-4 pb-4">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
            </div>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import SubNav from '@/components/SubNav'
import LanguageLogo from '@/components/LanguageLogo'
import EnglishLogo from '@/components/EnglishLogo'
import Config from '@/lib/config'
import Vue from 'vue'
import Dict from '@/lib/dict'

export default {
  components: {
    Nav,
    SubNav,
    LanguageLogo,
    EnglishLogo
  },
  data() {
    return {
      Config,
      languages: [],
      l1: undefined,
      l2: undefined,
      langsLoaded: false
    }
  },
  async mounted() {
    this.languages = this.$langs
  },
  methods: {
    async setL1() {
      this.l1 = this.$route.params.l1
      Vue.prototype.$l1 = this.languages.find(
        l1 => l1.code === this.$route.params.l1
      )
      this.$l1.options = (await import(
        `@/lib/langs/${this.$l1.code}.js`
      )).default
      this.$i18n.setLocaleMessage(
        this.$l1.code,
        this.$l1.options.translations
      )
      this.$i18n.locale = this.$l1.code
    },
    async setL2() {
      this.l2 = this.$route.params.l2
      Vue.prototype.$l2 = this.languages.find(
        l2 => l2.code === this.$route.params.l2
      )
      this.$l2.options = (await import(
        `@/lib/langs/${this.$l2.code}.js`
      )).default
      this.$i18n.setLocaleMessage(
        this.$l2.code,
        this.$l2.options.translations
      )
    }
  },
  watch: {
    async $route() {
      if (this.$route.params.l1 && this.$route.params.l2) {
        if (this.l1 && this.$route.params.l1 !== this.l1 || this.l2 && this.$route.params.l2 !== this.l2) {
          // switching language
          location.reload()
        } else {
          // first time loading, set the language
          await this.setL1()
          await this.setL2()
          let dictionaries = this.$l1.dictionaries[this.$l2['iso639-2t']]
          if (!Vue.prototype.$dictionary && dictionaries) {
            Vue.prototype.$dictionary = Dict.load({
              dict: dictionaries[0],
              l1: this.l1,
              l2: this.l2
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
