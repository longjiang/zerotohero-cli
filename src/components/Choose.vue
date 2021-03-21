<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <LanguageSwitch class="mt-3 mb-4" />
          <ul v-if="languages && languages.length > 0" class="language-list">
            <li v-for="language in languages" class="language-list-item">
              <a :href="`/en/${language.code}`">{{ language.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid bg-dark text-light">
      <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="mt-5">
            <h4 class="mb-4">About Us</h4>
            <p>
              <b style="font-weight: 900">Zero to Hero Education, Canada</b>
              is dedicated to help you learn the world’s languages, from the
              very beginning (“zero”) to a very very advanced level (“hero”).
            </p>
            <p>
              Although our focus is
              <a href="/en/zh/" class="text-light">
                <b>teaching Mandarin Chinese to English speakers</b> </a
              >, and
              <a href="/zh/en/" class="text-light">
                <b>teaching English to Mandarin Chinese speakers</b> </a
              >, we've also created free, open-source learning resources that
              work with hundres of other language pairs.
            </p>
          </div>
          <div class="mt-5">
            <h4 class="mb-4">This is an open-source project</h4>
            <p>
              <b>Project info:</b> This website is built on
              <code>Vue.js</code> and is fully open source. Check out the code
              on GitHub at
              <a href="https://github.com/longjiang/zerotohero-cli"
                >https://github.com/longjiang/zerotohero-cli</a
              >.
            </p>
          </div>
          <div class="mt-5">
            <h4 class="mb-4">Credits</h4>
            <p v-html="dictionaryCredit"></p>
            <p>
              The collocations and example sentences are provided by
              <a target="_blank" href="https://www.sketchengine.eu/"
                >SketchEngine</a
              >.
            </p>
          </div>
        </div>
      </div>

      </div>
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
      languages: [],
      dictionaryCredit: ''
    }
  },
  methods: {
    language(code) {
      return this.languages.find(language => language.code === code)
    }
  },
  async mounted() {
    if (this.$dictionary) {
      this.dictionaryCredit = await (await this.$dictionary).credit()
    }
    let english = this.$languages.l1s.find(language => language.code === 'en')
    this.languages = this.$languages.l1s
      .filter(
        language => ['A', 'C', 'L', 'E', 'H'].includes(language.type) // Only living, extinct or historical languages (exclusing special codes 'S' and macro languages 'M')
      )
      .filter(language => this.$languages.hasYouTube(english, language))
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

.language-list {
  color: #666;
  list-style: none;
  padding: 0;
  column-gap: 2rem;
}

@media (min-width: 576px) {
  .language-list {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .language-list {
    column-count: 3;
  }
}

@media (min-width: 992px) {
  .language-list {
    column-count: 4;
  }
}

@media (min-width: 1200px) {
  .language-list {
    column-count: 5;
  }
}

.language-list-item {
  color: #666;
}
</style>
