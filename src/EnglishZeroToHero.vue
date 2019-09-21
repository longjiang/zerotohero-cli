<template>
  <div id="english-zero-to-hero">
    <template v-if="langLoaded">
      <div class="container-fluid bg-dark pt-4 pl-0 pr-0">
        <div class="container">
          <div class="row mb-4">
            <div class="col-sm-12 text-center pt-3">
              <router-link :to="`/${$lang.code}`">
                <EnglishLogo :language="$lang" style="transform: scale(1.5)" />
              </router-link>
              <a
                v-if="$lang.options.features && $lang.options.features.includes('courses')"
                class="btn btn-success btn-sign-in text-white"
                href="https://wazuc.duanshu.com/#/"
                target="_blank"
                >登陆 <img src="/img/logo-duanshu-light.png" class="logo-small ml-1"
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
              <p v-if="$lang.enDictionary">
                <b>Credits:</b>
                {{ $lang.name }}-English dictionary data from
                <span
                  v-if="$lang.enDictionary === 'freedict'"
                >
                  <a href="https://freedict.org/">freedict.org</a>
                </span>
                <span v-if="$lang.enDictionary === 'ecdict'">
                  <a href="https://github.com/skywind3000/ECDICT">ECDICT</a>
                </span>
                .
              </p>
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
      lang: undefined,
      langLoaded: false
    }
  },
  async mounted() {
    this.languages = this.$langs
  },
  watch: {
    async $route() {
      if (this.lang && this.$route.params.lang !== this.lang) {
        // switching language
        location.reload()
      } else {
        // first time loading, set the language
        this.lang = this.$route.params.lang
        Vue.prototype.$lang = this.languages.find(
          lang => lang.code === this.$route.params.lang
        )
        if (!Vue.prototype.$dictionary) {
          Vue.prototype.$dictionary = Dict.load({
            dict: this.$lang.enDictionary,
            lang: this.lang
          })
        }
        this.$lang.options = (await import(
          `@/lib/langs/${this.$lang.code}.js`
        )).default
        let enOptions = (await import(`@/lib/langs/en.js`))
          .default
        this.$i18n.setLocaleMessage('en', enOptions.translations)
        this.$i18n.setLocaleMessage(
          this.$lang.code,
          this.$lang.options.translations
        )
        this.$i18n.locale = this.$lang.code
        this.langLoaded = true
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
