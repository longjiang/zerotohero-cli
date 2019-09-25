<template>
  <div class="main mt-4 mb-4 container" v-cloak>
    <div class="row">
      <div class="col-sm-12">
        <h4 class="page-title mb-4" v-if="method === 'saved'">
          Learn the words you saved
        </h4>
        <p
          v-if="method === 'saved' && savedWordIds.length === 0"
          class="alert alert-warning no-saved-words"
        >
          You don't have any words saved yet. Save words by clicking on the
          <i class="glyphicon glyphicon-star-empty"></i> icon next to it.
        </p>
        <h4 class="page-title mb-4" v-if="method === 'hsk'">
          <b :data-hsk="args[0]">HSK {{ args[0] }}</b>
          <b> Lesson {{ args[1] }}</b> (Part {{ args[2] }}) Vocabulary
        </h4>
        <Loader class="mt-5" />
        <div v-if="words.length > 0">
          <Questions
            :words="words"
            :book="args[0] ? args[0] : words[0].hsk"
          ></Questions>
          <h5 class="mt-4 mb-2">Words to learn:</h5>
          <WordList :words="words" style="column-count: 2"></WordList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList.vue'
import Questions from '@/components/Questions.vue'
import Helper from '@/lib/helper'
import { mapState } from 'vuex'

export default {
  components: {
    WordList,
    Questions
  },
  data() {
    return {
      started: false,
      words: [],
      method: false,
      args: [],
      questionTypes: [
        'fill-in-the-blank',
        'make-a-sentence',
        'collocation',
        'decomposition'
      ]
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'learn') {
        this.route()
      }
    },
    savedWordIds() {
      if (this.method == 'saved') {
        this.updateWords()
      }
    }
  },
  beforeMount() {
    this.route()
  },
  computed: mapState({
    savedWordIds: state => state.savedWords
  }),
  methods: {
    updateWords() {
      this.words = []
      for (let item of this.savedWordIds) {
        let identifier = item.join(',').replace(/ /g, '_')
        Helper.loaded(
          (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
            LoadedHSKCEDICT.getByIdentifier(
              entry => {
                this.words.push(entry)
              },
              [identifier]
            )
          }
        )
      }
    },
    route() {
      if (this.$route.params.method) {
        this.method = this.$route.params.method
        if (this.method == 'saved') {
          this.updateWords()
          return
        } else if (this.method == 'hsk' && this.$route.params.args) {
          this.args = this.$route.params.args.split(',')
          Helper.loaded(
            (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
              LoadedHSKCEDICT.getByBookLessonDialog(
                words => {
                  this.words = words
                },
                [this.args[0], this.args[1], this.args[2]]
              )
            }
          )
          return
        }
      } else {
        if (this.method) return
        location.hash = '/learn/saved'
      }
    }
  }
}
</script>
