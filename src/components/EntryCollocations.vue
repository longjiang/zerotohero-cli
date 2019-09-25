<template>
  <div :key="'collocations-' + collocationsKey" v-if="colDesc">
    <div>
      <div class="row">
        <div
          class="col-sm-12 col-md-6 col-lg-4"
          v-for="(description, name) in colDesc"
          v-if="
            entry.sketch &&
              entry.sketch.Gramrels &&
              getGramrelsByName(entry.sketch.Gramrels, name)
          "
          v-bind:key="'collocation-' + name"
        >
          <Collocation
            v-if="entry.sketch && entry.sketch.Gramrels"
            class="mb-4"
            :word="entry.simplified"
            :level="entry.hsk"
            :title="colDesc[name]"
            :type="name"
            :id="`collocation-${name}`"
            :collocation="getGramrelsByName(entry.sketch.Gramrels, name)"
          ></Collocation>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collocation from '@/components/Collocation.vue'
import SketchEngine from '@/lib/sketch-engine'

export default {
  props: ['entry'],
  components: {
    Collocation
  },
  methods: {
    getGramrelsByName(gramrels, name) {
      return gramrels.find(gram => gram.name === name)
    },
    // showClick() {
    //   this.show = true
    // }
  },
  data() {
    return {
      // show: false,
      colDesc: undefined,
      collocationsKey: 0
    }
  },
  mounted() {
    SketchEngine.wsketch(this.entry.simplified, response => {
      this.entry.sketch = response
      this.collocationsKey += 1
    })
    this.colDesc = SketchEngine.collocationDescription(this.entry.simplified)
  }
}
</script>
