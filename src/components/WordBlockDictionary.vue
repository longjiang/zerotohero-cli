<template>
  <span
    :class="{
      'word-block-dictionary': true,
      seen: seen
    }"
    v-if="token && token.candidates && token.candidates.length > 0 && !seen"
    :data-level="token.candidates[0].level"
  >
    <span
      class="word-block-dictionary-simplified"
      @click="cycleCandidate"
      :data-level="token.candidates[0].level"
      >{{ token.candidates[0].simplified }}</span
    >
    <span
      class="word-block-dictionary-pinyin"
      :data-level="token.candidates[0].level"
      > ({{ token.candidates[candidateIndex].pinyin }}) </span
    >
    <span
      class="word-block-dictionary-definition"
    >{{ token.candidates[candidateIndex].definitions.join(', ') }}. </span>
  </span>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    token: {
      type: Object
    },
    seen: {
      default: false // whether this word has already been annotated ('seen') before
    }
  },
  data() {
    return {
      transliteration: undefined,
      id: `wordblock-dictionary-${Helper.uniqueId()}`,
      candidateIndex: 0
    }
  },
  methods: {
    cycleCandidate() {
      if (this.token && this.token.candidates && this.token.candidates.length > 0) {
        let newCandidateIndex = this.candidateIndex + 1
        if (newCandidateIndex > this.token.candidates.length - 1) newCandidateIndex = 0
        this.candidateIndex = newCandidateIndex
      }
    }
  }
}
</script>

<style lang="scss">
.word-block-dictionary-simplified {
  font-weight: bold
}
</style>