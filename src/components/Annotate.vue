<template>
  <component
    :is="tag"
    v-observe-visibility="visibilityChanged"
    :dir="$l2.scripts && $l2.scripts[0].direction === 'rtl' ? 'rtl' : 'ltr'"
    :class="{
      'annotated': true,
      'add-pinyin': $hasFeature('transliteration'),
      fullscreen: fullscreenMode
    }"
  >
    <div class="annotator-buttons" v-if="!empty()">
      <Speak
        v-if="speak"
        :text="text"
        style="position: relative; top: 0.08rem; position: relative;"
      />
      <span class="annotator-show-translate ml-2 focus-exclude" @click="translate = !translate" v-if="showTranslate">
        <i class="fas fa-language"></i>
      </span>
      <span
        class="annotator-fullscreen ml-2 focus-exclude"
        @click="fullscreenClick"
        v-if="fullscreen"
      >
        <i class="fas fa-expand"></i>
      </span>
    </div>
    <span
      class="annotator-close ml-2 focus-exclude"
      @click="fullscreenClick"
      v-if="fullscreen && fullscreenMode"
    >
      <i class="fas fa-times" />
    </span>
    <slot v-if="!this.annotated"></slot>
    <v-runtime-template v-else v-for="template of annotatedSlots" :template="template" />
    <iframe v-if="translate" height="500" width="100%" :src="`https://www.bing.com/translator/?from=${$l2.code}&to=${$l1.code}&text=${text}`" />
  </component>
</template>

<script>
import wordblock from '@/components/WordBlock'
import VRuntimeTemplate from 'v-runtime-template'

export default {
  components: {
    wordblock,
    VRuntimeTemplate
  },
  props: {
    speak: {
      default: false
    },
    tag: {
      default: 'span'
    },
    showTranslate: {
      default: false
    },
    fullscreen: {
      default: false
    }
  },
  data() {
    return {
      annotatedSlots: [],
      annotated: false,
      translate: false,
      fullscreenMode: false,
      batchId: 0,
      text: '',
      tokenized: []
    }
  },
  methods: {
    // https://stackoverflow.com/questions/2550951/what-regular-expression-do-i-need-to-check-for-some-non-latin-characters
    nonLatin() {
      var rforeign = /[^\u0000-\u007f]/
      let nonLatin = rforeign.test(this.text)
      return nonLatin
    },
    empty() {
      return (
        $(this.$el)
          .text()
          .trim() === ''
      )
    },
    fullscreenClick() {
      this.fullscreenMode = !this.fullscreenMode
    },
    async visibilityChanged(isVisible) {
      if (isVisible && !this.annotated) {
        if (this.$hasFeature('dictionary') || this.nonLatin()) {
          await this.annotate()
          this.annotated = true
        }
      }
    },
    async annotate() {
      if (this.$slots.default) {
        for (let slot of this.$slots.default) {
          let $before = $(slot.elm)
          this.text += $before.text()
          this.annotatedSlots.push(
            $(await this.recursive($before[0]))[0].outerHTML
          )
        }
      }
    },
    breakSentences(text) {
      text = text.replace(/([.!?:。！？：])/g, '$1SENTENCEENDING!!!')
      let sentences = text.split('SENTENCEENDING!!!')
      return sentences.filter(sentence => sentence.trim() !== '')
    },
    async tokenize(text, batchId) {
      let html = text
      if (await this.$dictionary && (await this.$dictionary).tokenize) {
        html = ''
        let tokenized = await (await this.$dictionary).tokenize(text)

        this.tokenized[batchId] = tokenized
        for (let index = 0; index < this.tokenized[batchId].length; index++) {
          let item = this.tokenized[batchId][index]
          if (typeof item === 'object') {
            let token = this.tokenized[batchId]
            if (token && typeof token === 'object') {
              html += `<WordBlock :token="tokenized[${batchId}][${index}]"/>`
            }
          } else {
            html += `<span class="word-block-text">${item}</span>`
          }
        }
      } else {
        html = text.replace(/([\Sß]+)/gi, '<WordBlock>$1</WordBlock>')
      }
      return html
    },
    async recursive(node) {
      if (node.nodeType === 3) {
        // textNode
        // break setnences
        let sentences = this.breakSentences(node.nodeValue)
        for (let sentence of sentences) {
          let sentenceSpan = $(
            `<span class="sentence">${await this.tokenize(
              sentence,
              this.batchId
            )}</span>`
          )
          this.batchId = this.batchId + 1
          $(node).before(sentenceSpan)
        }
        $(node).remove()
      } else {
        // work with child nodes
        let nodes = []
        for (let n of node.childNodes) {
          nodes.push(n)
        }
        for (let n of nodes) {
          await this.recursive(n)
        }
      }
      return node
    }
  }
}
</script>

<style lang="scss">
.annotated.fullscreen {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: scroll;
  font-size: 3rem;
  padding: 3rem;
  .speak,
  .annotator-copy,
  .annotator-show-translate,
  .annotator-fullscreen {
    display: none;
  }
  .annotator-close {
    opacity: 0;
    position: absolute;
    top: 0.75rem;
    right: 2.5rem;
    transition: 0.5s all ease-in-out;
  }
  .annotator-close:hover {
    opacity: 1;
  }
}

.annotator-buttons {
  float: right;
  padding: 0 0 0.5rem 0.5rem;
}

.annotator-buttons > *:not(.speak) {
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
}
</style>
