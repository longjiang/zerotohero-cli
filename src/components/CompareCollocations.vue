<template>
  <div class="container" :key="'collocations-' + collocationsKey">
    <div class="widget-title">
      Collocations with “{{ a.simplified }}” and “{{ b.simplified }}”
    </div>
    <div class="jumbotron-fluid bg-light p-4">
      <div
        class="row"
        v-for="(description, name) in colDesc.a"
        v-bind:key="'collocation-' + name"
        v-if="
          (a.sketch &&
            a.sketch.Gramrels &&
            getGramrelsByName(a.sketch.Gramrels, name) &&
            getGramrelsByName(a.sketch.Gramrels, name).Words.length > 0) ||
            (b.sketch &&
              b.sketch.Gramrels &&
              getGramrelsByName(b.sketch.Gramrels, name) &&
              getGramrelsByName(b.sketch.Gramrels, name).Words.length > 0)
        "
      >
        <div class="col-sm-6 mb-5">
          <Collocation
            v-if="a.sketch && a.sketch.Gramrels"
            :word="a.simplified"
            :level="a.hsk"
            :title="colDesc.a[name]"
            :type="name"
            :id="`collocation-a-${name}`"
            :collocation="getGramrelsByName(a.sketch.Gramrels, name)"
          ></Collocation>
        </div>
        <div class="col-sm-6 mb-5">
          <Collocation
            v-if="b.sketch && b.sketch.Gramrels"
            :word="b.simplified"
            :level="b.hsk"
            :title="colDesc.b[name]"
            :type="name"
            :id="`collocation-a-${name}`"
            :collocation="getGramrelsByName(b.sketch.Gramrels, name)"
          ></Collocation>
        </div>
      </div>
      <div
        v-if="
          !a.sketch || !b.sketch || !a.sketch.Gramrels || !b.sketch.Gramrels
        "
      >
        Sorry, we could not find matching collocations for both words in this
        corpus (dataset). You can set a different corpus in
        <a href="#/settings">Settings</a>.
      </div>
      <hr />
      <div class="mt-2">
        Collocations provided by
        <a
          target="_blank"
          :href="
            `https://app.sketchengine.eu/#wordsketch?corpname=${encodeURIComponent(
              SketchEngine.corpname
            )}&tab=basic&lemma=${a.simplified}&showresults=1`
          "
        >
          <img
            src="img/logo-sketch-engine.png"
            alt="Sketch Engine"
            class="ml-2 logo-small"
          />
        </a>
        <br />
        Don't like the collocations? Choose a different corpus (dataset) in
        <a href="#/settings">Settings</a>.
      </div>
    </div>
  </div>
</template>

<script>
import Collocation from '@/components/Collocation.vue'
import SketchEngine from '@/lib/sketch-engine'

export default {
  props: ['a', 'b'],
  components: {
    Collocation
  },
  data() {
    return {
      SketchEngine,
      colDesc: {
        a: SketchEngine.collocationDescription(this.a.simplified),
        b: SketchEngine.collocationDescription(this.b.simplified)
      },
      collocationsKey: 0
    }
  },
  methods: {
    getGramrelsByName(gramrels, name) {
      return gramrels.find(
        gram => gram.name === name && gram.Words && gram.Words.length > 0
      )
    }
  },
  mounted() {
    SketchEngine.wsketch(this.a.simplified, response => {
      this.a.sketch = response
      this.collocationsKey += 1
    })
    SketchEngine.wsketch(this.b.simplified, response => {
      this.b.sketch = response
      this.collocationsKey += 1
    })
  }
}
</script>
