<template>
  <div :key="'concordance-' + concordanceKey">
    <div class="widget-title">{{ $t('Sentences with “{text}”', {text: term}) }}</div>
    <div class="jumbotron-fluid bg-light p-4">
      <div v-if="examples && examples.length > 0">
        <ul v-if="examples" class="collapsed list-unstyled" data-collapse-target>
          <li v-for="example in examples">
            <Annotate tag="div" class="pt-2 pb-2">
              <span
                v-html="
                  Helper.highlightMultiple(
                    example.english,
                    words,
                    level || 'outside'
                  )
                "
              />
            </Annotate>
            <div v-if="example.l1">{{ example.l1 }}</div>
            <hr />
          </li>
        </ul>
        <ShowMoreButton :length="examples.length" :min="4" :data-bg-level="level" />
      </div>
      <div v-if="examples && examples.length === 0">
        Sorry, we could not find any “{{ term }}” examples. You can set a
        different corpus in
        <a :href="`#/${$lang.code}/settings`">Settings</a>.
      </div>
      <hr v-if="examples && examples.length === 0" />
      <div class="mt-4">
        <p>{{ $t('Sentences provided by') }}</p>
        <a
          :href="
            `https://app.sketchengine.eu/#concordance?corpname=${encodeURIComponent(
              SketchEngine.corpname
            )}&tab=basic&keyword=${
              term
            }&structs=s%2Cg&refs=%3Ddoc.website&showresults=1&operations=%5B%7B%22name%22%3A%22iquery%22%2C%22arg%22%3A%22${
              term
            }%22%2C%22active%22%3Atrue%2C%22query%22%3A%7B%22queryselector%22%3A%22iqueryrow%22%2C%22iquery%22%3A%22${
              term
            }%22%7D%2C%22id%22%3A3859%7D%5D`
          "
          target="_blank"
        >
          <img src="img/logo-sketch-engine.png" alt="Sketch Engine" class="ml-2 logo-small" />
        </a>
      </div>
      <hr />
      <div>
        <p>{{ $t('Search for more sentences at') }}</p>
        <a
          :href="
            `https://tatoeba.org/eng/sentences/search?from=rus&to=eng&query=${term}`
          "
          target="_blank"
        >
          <img src="/img/logo-tatoeba.png" alt="Tatoeba" class="logo-small mr-3" />
          Tatoeba
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import SketchEngine from '@/lib/sketch-engine'

export default {
  props: {
    word: {
      type: Object
    },
    text: {
      type: String
    },
    level: {
      default: 'outside'
    }
  },
  data() {
    return {
      Helper,
      examples: undefined,
      concordanceKey: 0,
      words: [],
      SketchEngine
    }
  },
  computed: {
    term() {
      return this.word ? this.word.bare : this.text
    }
  },
  watch: {
    word() {
      this.update()
    }
  },
  methods: {
    async update() {
      this.examples = undefined
      let forms = this.word ? (await (await this.$dictionary).wordForms(this.word)).map(
        form => form.form.replace(/'/g, '')
      ) : []
      this.words = [this.term].concat(forms)
      this.examples = await SketchEngine.concordance({
        term: this.term,
        lang: this.$lang.code
      })
      this.concordanceKey += 1
    }
  },
  async mounted() {
    this.update()
  }
}
</script>
