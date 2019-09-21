<template>
  <component :is="tag" v-observe-visibility="visibilityChanged" 
    :class="{
      'annotated': true,
      'show-definition': showDefOn,
      fullscreen: fullscreenMode
    }">
    <div class="annotator-buttons" v-if="!empty()">
      <Speak
        v-if="speak"
        :text="text()"
        style="position: relative; top: 0.08rem; position: relative;"
      />
      <span class="annotator-show-def ml-2 focus-exclude" @click="showDefClick" v-if="showDef">
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
    <v-runtime-template
      v-else
      v-for="template of annotatedSlots"
      :template="template"
    />
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
    showDef: {
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
      showDefOn: false,
      fullscreenMode: false,
    }
  },
  methods: {
    empty() {
      return (
        $(this.$el)
          .text()
          .trim() === ''
      )
    },
    text() {
      return $(this.$slots.default[0].elm).text()
    },
    showDefClick() {
      this.showDefOn = !this.showDefOn
    },
    fullscreenClick() {
      this.fullscreenMode = !this.fullscreenMode
    },
    visibilityChanged(isVisible) {
      if (isVisible && !this.annotated) {
        this.annotated = true
        this.annotate()
      }
    },
    annotate() {
      if (this.$slots.default) {
        for (let slot of this.$slots.default) {
          let $before = $(slot.elm)
          this.annotatedSlots.push($(this.recursive($before[0]))[0].outerHTML)
        }
      }
    },
    breakSentences(text) {
      text = text.replace(/([.!?:])/g, '$1SENTENCEENDING!!!')
      let sentences = text.split('SENTENCEENDING!!!')
      return sentences.filter(sentence => sentence.trim() !== '')
    },
    markL2Words(text) {
      let html = text.replace(/([\Sß]+)/gi, '<WordBlock>$1</WordBlock>')
      return html
    },
    recursive(node) {
      if (node.nodeType === 3) {
        // textNode
        // break setnences
        let sentences = this.breakSentences(node.nodeValue)
        for (let sentence of sentences) {
          let sentenceSpan = $(
            `<span class="sentence">${this.markL2Words(sentence)}</span>`
          )
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
          this.recursive(n)
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
  .annotator-show-def,
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
