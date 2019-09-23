<template>
  <div>
    <div class="d-flex">
      <select class="custom-select custom-select-lg mb-3 mr-2" v-model="l2">
        <option value="undefined">I want to learn...</option>
        <option v-for="language in languages" :value="language.code">{{ language.name }}</option>
      </select>
      <select class="custom-select custom-select-lg mb-3" v-model="l1" v-if="l2 == 'en'">
        <option value="undefined">Choose your native language...</option>
        <option v-for="language in enLanguages" :value="language.code">{{ language.name }}</option>
      </select>
    </div>
    <div class="zerotohero mt-5">
      <LanguageLogo
        class="zerotohero-item mb-4"
        v-for="language in languages"
        :l1="$languages.get('eng')"
        :l2="language"
        v-if="l2 !== 'en' && (!l2 || l2 === language.code)"
      />
    </div>
    <div class="zerotohero">
      <LanguageLogo
        class="zerotohero-item mb-4"
        v-for="language in enLanguages"
        :l1="language"
        :l2="$languages.get('eng')"
        v-if="(!l2 || l2 === 'en') && (!l1 || l1 === language.code)"
      />
    </div>
    <hr class="border-light mt-5 mb-5" style="opacity: 0.5" />
    <p>
      <b style="font-weight: 900">Zero to Hero Education, Canada</b> is dedicated to help you learn the world’s languages, from the very beginning (“zero”) to a very very advanced level (“hero”).
    </p>
    <p>
      Although our focus is teaching Mandarin Chinese to English speakers (
      <a href="#/en/zh/">Chinese Zero to Hero</a>), and teaching English to Mandarin Chinese speakers (
      <a href="#/zh/en/">English Zero to Hero</a>), we've also created free, open-source learning resources that work with hundres of other language pairs.
    </p>
  </div>
</template>

<script>
import LanguageLogo from '@/components/LanguageLogo'

export default {
  components: {
    LanguageLogo
  },
  data() {
    return {
      languages: [],
      enLanguages: [],
      l1: undefined,
      l2: undefined
    }
  },
  mounted() {
    this.languages = this.$languages.l1s
      .filter(
        language =>
          !language.name.includes('languages') &&
          !language.name.includes('Creoles')
      )
      .sort((a, b) => (b.name > a.name ? -1 : 0))
    this.enLanguages = this.$languages.l1s
      .filter(language => language.translations)
      .sort((a, b) => (b.name > a.name ? -1 : 0))
  }
}
</script>

<style>
</style>