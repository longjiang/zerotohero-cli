<template>
  <div>
    <div class="d-flex">
      <select class="custom-select custom-select-lg mb-3 mr-2" v-model="l2">
        <option value="undefined">I want to learn...</option>
        <option v-for="language in languages" :value="language.code">{{ language.name }}{{ language.type === 'A' ? ' [Ancient]' : ''}}{{ language.type === 'C' ? ' [Constructed]' : ''}}{{ language.type === 'H' ? ' [Historic]' : ''}}{{ language.type === 'E' ? ' [Extinct]' : ''}}</option>
      </select>
      <select class="custom-select custom-select-lg mb-3" v-model="l1" v-if="l2 == 'en'">
        <option value="undefined">Choose your native language...</option>
        <option v-for="language in enLanguages" :value="language.code">{{ language.name }}</option>
      </select>
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
  props: {
    compact: false
  },
  data() {
    return {
      languages: [],
      enLanguages: [],
      l1: undefined,
      l2: undefined
    }
  },
  watch: {
    l2() {
      this.route()
    },
    l1() {
      this.route()
    }
  },
  methods: {
    route() {
      if (this.l2 !== 'en') {
        location.hash = `#/en/${this.l2}/`
      } else {
        if (this.l1) {
          location.hash = `#/${this.l1}/${this.l2}/`
        }
      }
    }
  },
  mounted() {
    this.languages = this.$languages.l1s
      .filter(
        language =>
          ['A', 'C', 'L', 'E', 'H'].includes(language.type) // Only living, extinct or historical languages (exclusing special codes 'S' and macro languages 'M')
      )
      .sort((a, b) => {
        if(a.name < b.name) { return -1 }
        if(a.name > b.name) { return 1 }
        return 0
      })
    this.enLanguages = this.languages.filter(language => !['E', 'H'].includes(language.type))
  }
}
</script>

<style>
</style>