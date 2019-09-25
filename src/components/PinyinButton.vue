<template>
  <div
    class="pinyin-button-wrapper concealed"
    v-observe-visibility="visibilityChanged"
  >
    <button class="btn-medium btn-gray pinyin-button add-pinyin" v-on:click="annotate">
      <span v-if="state == 'idle'">{{ this.buttonText }}</span>
      <span v-if="state == 'annotating'">Adding...</span>
    </button>
    <button
      class="btn-medium btn-gray show-pinyin"
      v-if="annotated && !shown"
      v-on:click="showPinyin()"
    >
      Show Pinyin
    </button>
    <button
      class="btn-medium btn-gray hide-pinyin"
      v-if="annotated && shown"
      v-on:click="hidePinyin()"
    >
      Hide Pinyin
    </button>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import $ from 'jquery'

export default {
  props: {
    always: {
      default: 'false'
    },
    selector: {
      type: String,
      default: undefined
    },
    sticky: {
      // Do not change button face or function on click (useful when the annotation target changes)
      type: String,
      default: 'false'
    },
    wordBlockTemplateFilter: {
      type: Function,
      default: Helper.wordBlockTemplateFilter
    }
  },
  data() {
    return {
      buttonText: 'Add Pinyin',
      state: 'idle',
      $target: undefined,
      annotated: false,
      shown: false,
      Helper
    }
  },
  mounted() {
    this.buttonText = this.$el.innerText
    this.$target = this.selector ? $(this.selector) : $(this.$el).next()
    if (this.always === 'true' && !this.annotated) {
      this.annotate()
    }
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible && !this.annotated) {
        this.annotate()
      }
    },
    showPinyin() {
      this.shown = true
    },
    hidePinyin() {
      this.shown = false
    },
    annotate() {
      if (this.$target.find('.word-block').length === 0) {
        this.$target.addClass('add-pinyin') // Soo it will have the pinyin looks
        this.state = 'annotating'
        // eslint-disable-next-line no-undef
        for (let node of this.$target.get()) {
          Helper.loaded(
            (LoadedAnnotator, LoadedHSKCEDICT, loadedGrammar, LoadedHanzi) => {
              LoadedAnnotator.annotateIteratively(
                node,
                node => {
                  this.state = 'idle'
                  if (this.sticky === 'false') {
                    this.annotated = true
                    this.shown = true
                  }
                },
                this.wordBlockTemplateFilter
              )
            }
          )
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
