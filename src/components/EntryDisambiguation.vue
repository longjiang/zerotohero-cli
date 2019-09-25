<template>
  <div v-if="similarWords.length > 0">
    <div class="widget-title">Compare with</div>
    <div class="jumbotron-fluid bg-light p-4">
      <WordList
        collapse="10"
        :words="similarWords"
        :compareWith="entry"
        :key="wordsKey"
        :traditional="entry.simplified.length === 1"
      ></WordList>
      <hr />
      <div class="text-center">
        <a
          class="btn show-more focus-exclude"
          :href="`#/explore/related/${entry.identifier}`"
          :data-bg-hsk="entry.hsk"
        >
          <i class="glyphicon glyphicon-fullscreen"></i> Explore Related Words
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList.vue'
import Helper from '@/lib/helper'

export default {
  components: {
    WordList
  },
  props: ['entry'],
  mounted() {
    if (this.entry.simplified.length > 1) {
      this.getReverse()
      this.getHomonyms()
    } else {
      this.getOtherPronunciations()
    }
    this.getSimilarWords()
  },
  watch: {
    similarWords() {
      this.wordsKey++
    }
  },
  data() {
    return {
      wordsKey: 0,
      similarWords: []
    }
  },
  methods: {
    getOtherPronunciations() {
      Helper.loaded(
        (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
          LoadedHSKCEDICT.lookupSimplified(
            words => {
              for (let word of words) {
                if (word.identifier !== this.entry.identifier) {
                  this.similarWords.push(word)
                }
              }
            },
            [this.entry.simplified]
          )
        }
      )
    },
    getReverse() {
      const reverse = this.entry.simplified
        .split('')
        .reverse()
        .join('')

      Helper.loaded(
        (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
          LoadedHSKCEDICT.lookupSimplified(
            words => {
              for (let word of words) {
                this.similarWords.push(word)
              }
            },
            [reverse]
          )
        }
      )
    },
    getSimilarWords() {
      Helper.loaded(
        (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
          for (let definition of this.entry.definitions) {
            LoadedHSKCEDICT.lookupByDefinition(
              words => {
                for (let word of words) {
                  if (word.identifier !== this.entry.identifier) {
                    this.similarWords.push(word)
                  }
                }
              },
              [definition.text]
            )
          }
        }
      )
    },
    getHomonyms() {
      Helper.loaded(
        (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
          LoadedHSKCEDICT.lookupPinyinFuzzy(
            words => {
              for (let word of words) {
                if (word.identifier !== this.entry.identifier) {
                  this.similarWords.push(word)
                }
              }
            },
            [this.entry.pinyin]
          )
        }
      )
    }
  }
}
</script>
