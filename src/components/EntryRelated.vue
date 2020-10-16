<template>
  <div :key="'related-' + relatedKey">
    <div class="widget-title">
      Words related to “<span v-if="!$l2.han || $l2.code === 'ja'">{{
        entry.head
      }}</span
      ><span class="traditional">{{ entry.traditional }}</span
      ><span class="simplified">{{ entry.simplified }}</span
      >”
    </div>
    <div class="jumbotron-fluid bg-light p-4">
      <WordList
        v-if="words && words.length > 0"
        :words="words"
        class="related"
        :compareWith="entry"
        collapse="10"
      />
      <div v-if="words && words.length === 0">
        Sorry, we could not find words related to “{{ entry.head }}”. You can set a
        different corpus in
        <a :href="`#/${$l1.code}/${$l2.code}/settings`">Settings</a>.
      </div>
      <hr v-if="words && words.length === 0" />
      <div class="mt-4">
        <p>{{ $t('Related words provided by') }}</p>
        <a
          href="https://www.sketchengine.eu/"
          target="_blank"
        >
          <img src="/img/logo-sketch-engine.png" alt="Sketch Engine" class="ml-2 logo-small" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import SketchEngine from '@/lib/sketch-engine'
import Helper from '@/lib/helper'

export default {
  props: ['entry'],
  data() {
    return {
      Helper,
      words: undefined,
      relatedKey: 0
    }
  },
  async mounted() {
    let response = await SketchEngine.thesaurus({
      l2: this.$l2,
      term: this.entry.simplified || this.entry.head
    })
    if (response && response.Words) {
      this.words = []
      for (let Word of response.Words) {
        let words =
          this.$l2.han && this.$l2.code !== 'ja'
            ? await (await this.$dictionary).lookupSimplified(Word.word)
            : [await (await this.$dictionary).lookup(Word.word)]
        if (words.length > 0 && words[0]) {
          let word = words[0]
          this.words.push(word)
        }
      }
    } else {
    }
  }
}
</script>

<style>
.related {
  list-style: none;
  padding: 0;
  columns: 2;
}

.related .saved-words.collapsed li {
  display: block;
}

.related .saved-words.collapsed li:nth-child(n + 11) {
  display: none;
}

@media (max-width: 768px) {
  .related {
    column-count: 1;
  }
}

.related.collapsed li:nth-child(n + 13) {
  display: none;
}
</style>
