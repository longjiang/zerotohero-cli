<template>
  <div>
    <template v-if="languages && languages.length > 0">
      <p class="lead mt-4">Sinitic Languages:</p>
      <div class="logo-grid">
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('zh')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('hak')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('nan')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('yue')" />
      </div>
      <p class="lead mt-4">Other popular Languages:</p>
      <div class="logo-grid">
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ar')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ca')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('da')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('nl')" />
        <LanguageLogo :compact="true" :l1="language('zh')" :l2="language('en')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('fi')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('fr')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('de')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('hu')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ga')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('is')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('it')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ja')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ko')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('la')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('ru')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('es')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('fa')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('pt')" />
        <LanguageLogo :compact="true" :l1="language('en')" :l2="language('cy')" />
      </div>
    </template>
    <p class="lead mt-4">Even more languages:</p>
    <div>
      <Search
        placeholder="Search for a language..."
        :hrefFunc="hrefFunc"
        :suggestionsFunc="suggestionsFunc"
        type="generic"
        :defaultURL="text => `#/en/${text}/`"
        ref="l1"
      />
    </div>
    <div class="mt-5">
      <h4 class="mb-4">About Us</h4>
      <p>
        <b style="font-weight: 900">Zero to Hero Education, Canada</b> is dedicated to help you learn the world’s languages, from the very beginning (“zero”) to a very very advanced level (“hero”).
      </p>
      <p>
        Although our focus is
        <a href="#/en/zh/" class="text-light">
          <b>teaching Mandarin Chinese to English speakers</b>
        </a>, and
        <a href="#/zh/en/" class="text-light">
          <b>teaching English to Mandarin Chinese speakers</b>
        </a>, we've also created free, open-source learning resources that work with hundres of other language pairs.
      </p>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search'
import LanguageLogo from '@/components/LanguageLogo'

export default {
  components: {
    Search,
    LanguageLogo
  },
  data() {
    return {
      languages: [],
      enLanguages: []
    }
  },
  mounted() {
    this.languages = this.$languages.l1s
      .filter(
        language => ['A', 'C', 'L', 'E', 'H'].includes(language.type) // Only living, extinct or historical languages (exclusing special codes 'S' and macro languages 'M')
      )
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
    this.enLanguages = this.languages.filter(
      language => !['E', 'H'].includes(language.type)
    )
  },
  methods: {
    language(code) {
      return this.languages.find(language => language.code === code)
    },
    suggestionsFunc(text) {
      text = text.toLowerCase()
      let english = this.languages.find(language => language.code === 'en')
      return this.languages
        .filter(
          language =>
            language.code.includes(text) ||
            language['iso639-3'].includes(text) ||
            language.name.toLowerCase().includes(text)
        )
        .sort((a, b) => b.name.length - a.name.length)
        .sort(language =>
          language['iso639-3'].startsWith(text) ||
          language.name.startsWith(text)
            ? 1
            : -1
        )
        .map(language => {
          return {
            bare: `${language.name} (${
              language.code !== language['iso639-3'] ? language.code + ', ' : ''
            }${language['iso639-3']})`,
            definitions: this.$languages.getFeatures({
              l1: english,
              l2: language
            }),
            l1: english,
            l2: language
          }
        })
        .slice(0, 30)
    },
    hrefFunc(suggestion) {
      if (suggestion && suggestion.l1 && suggestion.l2) {
        return `#/${suggestion.l1.code}/${suggestion.l2.code}/`
      }
    }
  }
}
</script>

<style>
  .logo-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }
  .logo-grid > * {
    width: 13rem;
  }
</style>