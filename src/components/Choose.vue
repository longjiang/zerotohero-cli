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
      <LanguageSwitch />
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
import LanguageLogo from '@/components/LanguageLogo'
import LanguageSwitch from '@/components/LanguageSwitch'

export default {
  components: {
    LanguageLogo,
    LanguageSwitch
  },
  data() {
    return {
      languages: []
    }
  },
  methods: {
    language(code) {
      return this.languages.find(language => language.code === code)
    },
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