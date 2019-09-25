<template>
  <div class="question-decomposition" v-if="text" :id="id">
    <div class="question-slide-aspect" v-for="rc in [randomChar(text)]">
      <div class="question-slide" :id="`question-${id}-slide-1`">
        <div :data-hsk="hsk" class="text-center big-word-pinyin mb-4">
          {{ pinyin }}
          <Speak :text="text" class="ml-2"></Speak>
        </div>
        <div class="decomposition-word">
          <span
            v-if="rc.before !== ''"
            class="decomposition-before"
            v-html="Helper.highlight(rc.before, rc.before, hsk)"
          ></span>
          <decomposition :char="rc.char"></decomposition>
          <span
            class="decomposition-after"
            v-if="rc.after !== ''"
            v-html="Helper.highlight(rc.after, rc.after, hsk)"
          ></span>
        </div>
        <div class="text-center character-example-english mt-4">
          {{ definitions[0].text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Decomposition from '@/components/Decomposition.vue'
import Helper from '@/lib/helper'
import Config from '@/lib/config'
import $ from 'jquery'

export default {
  props: ['id', 'text', 'type', 'definitions', 'hsk', 'pinyin'],
  components: {
    decomposition: Decomposition
  },
  data() {
    return {
      Helper,
      Config
    }
  },
  mounted() {
    $(this.$el)
      .find('.decomposition')
      .each(function() {
        let $characters = $(this).find('.part-character')
        let character =
          $characters[Math.floor(Math.random() * $characters.length)]
        $(character)
          .parent()
          .addClass('hide')
        $(this).click(function() {
          if ($(this).is('.decomposition')) {
            $(this).toggleClass('show-answer')
          } else {
            $(this)
              .parents('.decomposition')
              .toggleClass('show-answer')
          }
        })
      })
  },
  methods: {
    randomChar(word) {
      const index = Math.floor(Math.random() * word.length)
      return {
        before: word.slice(0, index),
        char: word[index],
        after: word.slice(index + 1)
      }
    }
  }
}
</script>
