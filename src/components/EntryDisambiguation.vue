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
          :href="`#/${$l1.code}/${$l2.code}/explore/related/${entry.identifier}`"
          :data-bg-level="entry.hsk"
        >
          <i class="glyphicon glyphicon-fullscreen"></i> Explore Related Words
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import WordList from '@/components/WordList.vue'

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
    async getOtherPronunciations() {
      let words = await (await this.$dictionary).lookupSimplified(this.entry.simplified)
      for (let word of words) {
        if (word.identifier !== this.entry.identifier) {
          this.similarWords.push(word)
        }
      }
    },
    async getReverse() {
      const reverse = this.entry.simplified
        .split('')
        .reverse()
        .join('')
      let words = await (await this.$dictionary).lookupSimplified(reverse)
      for (let word of words) {
        this.similarWords.push(word)
      }
    },
    async getSimilarWords() {
      for (let definition of this.entry.definitions) {
        let words = await (await this.$dictionary).lookupByDefinition(definition.text)
        for (let word of words) {
          if (word.identifier !== this.entry.identifier) {
            this.similarWords.push(word)
          }
        }
      }
    },
    async getHomonyms() {
      let words = await (await this.$dictionary).lookupPinyinFuzzy(this.entry.pinyin)
      for (let word of words) {
        if (word.identifier !== this.entry.identifier) {
          this.similarWords.push(word)
        }
      }
    }
  }
}
</script>
