<template>
  <div class="widget">
    <div class="widget-title">
      {{ $t('Collocations with “{text}”', { text: term }) }}
    </div>
    <div class="widget-body jumbotron-fluid p-4">
      <div class="row">
        <div class="col-sm-12">
          <ul class="list-unstyled mb-4">
            <li
              v-for="collocation of savedCollocations[$l2.code].filter(
                (collocation) => collocation.term === term
              )"
              :key="`collocation-${collocation.term}-${collocation.line}`"
              class="mb-2 text-center"
            >
              <SmallStar
                :item="collocation.line"
                :saved="saved"
                :save="saveLine"
                :remove="removeSavedLine"
                style="overflow: hidden; margin-right: 1rem; float: right"
              />
              <Annotate tag="span" :checkSaved="false">
                <span
                  v-html="
                    Helper.highlight(
                      collocation.line,
                      word ? word.bare : text,
                      level
                    )
                  "
                  style="font-size: 1.5em"
                />
              </Annotate>
            </li>
          </ul>
        </div>
        <div
          class="col-sm-6 col-md-4 col-lg-3"
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
            :title="colDesc[name]"
            :type="name"
            :id="`collocation-${name}`"
            :collocation="getGramrelsByName(sketch.Gramrels, name)"
          ></Collocation>
        </div>
      </div>
      <div
        v-if="sketch !== undefined && (sketch === false || !sketch.Gramrels)"
      >
        Sorry, we could not find any “{{ term }}” collocations in this corpus
        (dataset). You can set a different corpus in
        <a :href="`/${$l1.code}/${$l2.code}/settings`">Settings</a>.
      </div>
      <div class="mt-2">
        {{ $t('Collocations provided by') }}
        <a
          target="_blank"
          :href="`https://app.sketchengine.eu/#wordsketch?corpname=${encodeURIComponent(
            SketchEngine.corpname
          )}&tab=basic&lemma=${term}&showresults=1`"
        >
          <img
            src="/img/logo-sketch-engine.png"
            alt="Sketch Engine"
            class="ml-2 logo-small"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Collocation from '@/components/Collocation.vue'
import SketchEngine from '@/lib/sketch-engine'
import Helper from '@/lib/helper'
import SmallStar from '@/components/SmallStar'
import { mapState } from 'vuex'

export default {
  components: {
    Collocation,
    SmallStar,
  },
  props: {
    word: {
      type: Object,
    },
    text: {
      type: String,
    },
    level: {
      default: 'outside',
    },
  },
  data() {
    return {
      colDesc: undefined,
      sketch: undefined,
      SketchEngine,
      Helper,
    }
  },
  methods: {
    saved(line) {
      let saved = false
      saved = this.$store.getters['savedCollocations/has']({
        term: this.term,
        line,
        l2: this.$l2.code,
      })
      return saved
    },
    saveLine(line) {
      this.$store.dispatch('savedCollocations/add', {
        term: this.term,
        line,
        l2: this.$l2.code,
      })
    },
    removeSavedLine(line) {
      this.$store.dispatch('savedCollocations/remove', {
        term: this.term,
        line,
        l2: this.$l2.code,
      })
    },
    async update() {
      this.colDesc = undefined
      this.sketch = undefined
      this.sketch = await SketchEngine.wsketch({
        term: this.term,
        l2: this.$l2,
      })
      this.colDesc = await SketchEngine.collocationDescription({ l2: this.$l2 })
    },
    getGramrelsByName(gramrels, name) {
      return gramrels.find(
        (gram) => gram.name === name && gram.Words && gram.Words.length > 0
      )
    },
  },
  computed: {
    ...mapState('savedCollocations', ['savedCollocations']),
    term() {
      return this.word ? this.word.bare : this.text
    },
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
    },
  },
}
</script>
