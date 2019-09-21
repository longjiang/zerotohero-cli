<template>
  <div class="toggle-saved-word focus-exclude">
    <button
      class="star remove-word"
      v-if="saved()"
      v-on:click="removeWordClick"
      title="Remove word"
    >
      <i class="fas fa-star"></i>
    </button>
    <button class="star add-word" v-if="!saved()" v-on:click="saveWordClick" title="Add word">
      <i class="far fa-star"></i>
    </button>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    word: {
      type: Object
    },
    text: {
      type: String
    }
  },
  data() {
    return {
      id: Helper.uniqueId(),
      Helper
    }
  },
  methods: {
    async allForms() {
      let wordForms =
        (await (await this.$dictionary).wordForms(this.word)) || []
      wordForms = wordForms.filter(form => form !== '')
      wordForms = Helper.unique(
        [this.word.bare.toLowerCase()].concat(wordForms)
      )
      return wordForms
    },
    saved() {
      let saved = this.$store.getters.hasSavedWord({
        text: this.word
          ? this.word.bare.toLowerCase()
          : this.text.toLowerCase(),
        lang: this.$lang.code
      })
      return saved
    },
    async saveWordClick() {
      let word = this.word ? await this.allForms() : [this.text.toLowerCase()]
      this.$store.dispatch('addSavedWord', {
        wordForms: word,
        lang: this.$lang.code
      })
    },
    removeWordClick() {
      this.$store.dispatch('removeSavedWord', {
        wordForm: this.word
          ? this.word.bare.toLowerCase()
          : this.text.toLowerCase(),
        lang: this.$lang.code
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toggle-saved-word {
  display: inline-block;
  position: relative;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  color: #ffe597;
}

.star {
  background: none;
  border: none;
  color: #f8b61e;
  padding: 0;
}
</style>
