<template>
  <div class="container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12 text-center" v-if="grammar">
        <h3 class="mb-4">Grammar Note {{ grammar.code }}</h3>
        <button @click="prevClick" v-if="id > 1" class="btn btn-medium bg-light mr-2">
          <i class="fa fa-chevron-left" title="previous" />
        </button>
        <button @click="nextClick" class="btn btn-medium bg-light">
          <i class="fa fa-chevron-right" title="next" />
        </button>
        <div class="shadow rounded p-4 mt-4 mb-5">
          <GrammarPoint :grammar="grammar" :key="id" />
          <hr />
          <div class="text-left mt-5" v-if="drills && drills.length > 0">
            <h4 class="text-center">Practice Drills</h4>
            <Drill v-for="drill in drills" :drill="drill" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GrammarPoint from '@/components/GrammarPoint'
import Grammar from '@/lib/grammar'
import Drill from '@/components/Drill'
import Config from '@/lib/config'

export default {
  components: {
    GrammarPoint,
    Drill
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    async getDrill(grammarID) {
      console.log('geting drills')
      let response = await $.getJSON(
        `${Config.wiki}items/drills?filter[grammar_id][eq]=${grammarID}&fields=*,file.*`
      )
      if (response && response.data && response.data[0]) {
        this.drills = response.data
      }
    },
    async loadGrammar() {
      this.drills = []
      this.grammar = (await this.$grammar)._grammarData.find(
        row => row.id === this.id
      )
      this.getDrill(this.grammar.id)
    },
    prevClick() {
      location.href =
        `/${this.$l1.code}/${this.$l2.code}/grammar/view/` +
        Math.max(0, parseInt(this.id) - 1)
    },
    nextClick() {
      location.href =
        `/${this.$l1.code}/${this.$l2.code}/grammar/view/` +
        Math.min(Grammar._grammarData.length - 1, parseInt(this.id) + 1)
    }
  },
  data() {
    return {
      grammar: undefined,
      drills: []
    }
  },
  mounted() {
    this.loadGrammar()
  },
  watch: {
    id() {
      this.loadGrammar()
    }
  }
}
</script>

<style></style>
