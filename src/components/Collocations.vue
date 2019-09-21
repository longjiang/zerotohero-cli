<template>
  <div>
    <div class="widget-title">{{ $t('Collocations with “{text}”', {text: term}) }}</div>
    <div class="jumbotron-fluid bg-light p-4">
      <div class="row">
        <div
          class="col-sm-12 col-md-6 col-lg-4"
          v-for="(description, name) in colDesc"
          v-if="
            sketch &&
              sketch.Gramrels &&
              getGramrelsByName(sketch.Gramrels, name)
          "
        >
          <Collocation
            v-if="sketch && sketch.Gramrels"
            class="mb-4"
            :word="word"
            :text="text"
            :level="level"
            :title="$t(colDesc[name], {word: term})"
            :type="name"
            :id="`collocation-${name}`"
            :collocation="getGramrelsByName(sketch.Gramrels, name)"
          ></Collocation>
        </div>
      </div>
      <div v-if="sketch !== undefined && (sketch === false || !sketch.Gramrels)">
        Sorry, we could not find any “{{ term }}” collocations in this corpus
        (dataset). You can set a different corpus in
        <a
          :href="`#/${$lang.code}/settings`"
        >Settings</a>.
      </div>
      <hr />
      <div class="mt-2">
        <p>{{ $t('Collocations provided by') }}</p>
        <a
          target="_blank"
          :href="
            `https://app.sketchengine.eu/#wordsketch?corpname=${encodeURIComponent(
              SketchEngine.corpname
            )}&tab=basic&lemma=${term}&showresults=1`
          "
        >
          <img src="img/logo-sketch-engine.png" alt="Sketch Engine" class="ml-2 logo-small" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Collocation from '@/components/Collocation.vue'
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
  components: {
    Collocation
  },
  methods: {
    async update() {
      this.colDesc = undefined
      this.sketch = undefined
      this.sketch = await SketchEngine.wsketch({
        term: this.term,
        lang: this.$lang.code
      })
      this.colDesc = await SketchEngine.collocationDescription(this.term)
    },
    getGramrelsByName(gramrels, name) {
      return gramrels.find(
        gram => gram.name === name && gram.Words && gram.Words.length > 0
      )
    }
  },
  data() {
    return {
      colDesc: undefined,
      sketch: undefined,
      SketchEngine
    }
  },
  computed: {
    term() {
      return this.word ? this.word.bare : this.text
    }
  },
  mounted() {
    if (!this.colDesc) {
      this.update()
    }
  },
  watch: {
    word() {
      this.update()
    },
    text() {
      this.update()
    }
  }
}
</script>
