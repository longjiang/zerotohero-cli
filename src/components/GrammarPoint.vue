<template>
  <div class="grammar-notes-item">
    <Annotate tag="div" :copy="false" class="character-example-header-word grammar-structure">
      <h4
        v-html="
          Helper.highlightMultiple(
            grammar.structure,
            grammar.words,
            grammar.book
          )
        "
      ></h4>
    </Annotate>
    <div class="example-sentence-english grammar-english">{{ grammar.english }}</div>
    <Annotate tag="div" class="example-sentence-word grammar-example" :showTranslate="false">
      <span
        v-html="
        Helper.highlightMultiple(grammar.example, grammar.words, grammar.book)
      "
      ></span>
    </Annotate>
    <div class="character-example-english grammar-example-english">{{ grammar.exampleTranslation }}</div>
    <a
      v-if="grammar.url !== ''"
      :href="grammar.url"
      :data-bg-level="grammar.book"
      class="btn-medium btn-gray mt-3 pl-3 pr-3"
      target="_blank"
    >
      <i class="glyphicon glyphicon-facetime-video mr-2"></i>
      <b>Grammar Lesson</b>
      {{ grammar.book }}.{{ grammar.lesson }}.{{ grammar.number }}
    </a>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
export default {
  data() {
    return {
      Helper
    }
  },
  props: {
    grammar: {
      type: Object
    }
  }
}
</script>

<style>
.grammar-notes-item {
  padding: 2rem 0;
}

.grammar-english {
  margin-bottom: 1rem;
}
</style>
