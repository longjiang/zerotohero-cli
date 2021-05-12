<template>
  <component
    :is="tag"
    v-observe-visibility="visibilityChanged"
    :dir="
      foreign &&
      $l2.scripts &&
      $l2.scripts.length > 0 &&
      $l2.scripts[0].direction === 'rtl'
        ? 'rtl'
        : 'ltr'
    "
    :class="{
      annotated: annotated,
      'text-right':
        foreign &&
        $l2.scripts &&
        $l2.scripts.length > 0 &&
        $l2.scripts[0].direction === 'rtl',
      'add-pinyin': $hasFeature('transliteration'),
      phonetics,
      fullscreen: fullscreenMode,
    }"
  >
    <div class="annotator-buttons" v-if="!empty()">
      <b-dropdown no-caret toggle-class="annotator-menu-toggle" dropleft>
        <template #button-content><i class="fas fa-ellipsis-h"></i></template>
        <b-dropdown-item
          ><Speak
            :text="text"
            style="position: relative; top: 0.08rem; position: relative" /><span
            class="annotator-show-translate ml-2 focus-exclude"
            @click="translateClick"
          >
            <i class="fas fa-language"></i> </span
          ><span
            class="annotator-fullscreen ml-2 focus-exclude"
            @click="fullscreenClick"
          >
            <i class="fas fa-expand"></i>
          </span>
          <span
            @click="copyClick"
            class="annotator-copy ml-2 focus-exclude"
          >
            <i class="fas fa-copy"></i> </span
        ></b-dropdown-item>
      </b-dropdown>
    </div>
    <span
      class="annotator-close ml-2 focus-exclude"
      @click="fullscreenClick"
      v-if="fullscreen && fullscreenMode"
    >
      <i class="fas fa-times" />
    </span>
    <slot v-if="!annotated"></slot>
    <v-runtime-template
      v-if="annotated"
      v-for="template of annotatedSlots"
      :template="template"
    />
    <div>{{ translation }}</div>
  </component>
</template>

<script>
import wordblock from '@/components/WordBlock'
import VRuntimeTemplate from 'v-runtime-template'
import MyanmarTools from 'myanmar-tools'
import Helper from '@/lib/helper'
import Config from '@/lib/config'

export default {
  components: {
    wordblock,
    VRuntimeTemplate,
  },
  props: {
    phonetics: {
      default: true,
    },
    sticky: {
      default: false, // whether or not to show each word's level color by default (without hovering)
    },
    speak: {
      default: false,
    },
    popup: {
      default: true,
    },
    tag: {
      default: 'span',
    },
    showTranslate: {
      default: false,
    },
    fullscreen: {
      default: false,
    },
    foreign: {
      default: true,
    },
    explore: {
      default: false,
    },
  },
  data() {
    return {
      annotatedSlots: [],
      annotated: false,
      translate: false,
      translation: undefined,
      fullscreenMode: false,
      batchId: 0,
      text: '',
      tokenized: [],
    }
  },
  mounted() {
    if (this.$slots.default) {
      for (let slot of this.$slots.default) {
        this.text += $(slot.elm).text()
      }
    }
  },
  methods: {
    async translateClick() {
      let text = this.$l2.continua ? this.text.replace(/ /g, '') : this.text
      window.open(
        `https://translate.google.com/#view=home&op=translate&sl=${
          this.$l2.code === 'zh' ? 'zh-CN' : this.$l2.code
        }&tl=${this.$l1.code}&text=${encodeURIComponent(text)}`
      )
    },
    // https://stackoverflow.com/questions/2550951/what-regular-expression-do-i-need-to-check-for-some-non-latin-characters
    nonLatin() {
      var rforeign = /[^\u0000-\u007f]/
      let nonLatin = rforeign.test(this.text)
      return nonLatin
    },
    empty() {
      return this.text.trim() === ''
    },
    fullscreenClick() {
      this.fullscreenMode = !this.fullscreenMode
    },
    copyClick() {
      let text = this.$l2.continua ? this.text.replace(/ /g, '') : this.text
      var tempInput = document.createElement("input");
      tempInput.style = "position: absolute; left: -1000px; top: -1000px";
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    },
    async visibilityChanged(isVisible) {
      if (isVisible && !this.annotated) {
        if (this.$hasFeature('dictionary') || this.nonLatin()) {
          if (this.$slots.default) {
            for (let slot of this.$slots.default) {
              let $slotElems = $(slot.elm)
              this.convertToSentencesRecursive($slotElems[0])
            }
            for (let slot of this.$slots.default) {
              let $slotElems = $(slot.elm)
              this.annotatedSlots.push(
                $(
                  await this.annotateRecursive($slotElems[0].cloneNode(true))
                )[0].outerHTML
              )
            }
            // await Helper.delay(1000)
            this.annotated = true
          }
        }
      }
    },
    async annotateRecursive(node) {
      if (node && node.classList && node.classList.contains('sentence')) {
        // .sentence node
        let sentence = node.innerText
        let html = await this.tokenize(sentence, this.batchId)
        let $tokenizedSentenceSpan = $(`<span class="sentence">${html}</span>`)
        this.batchId = this.batchId + 1
        $(node).before($tokenizedSentenceSpan)
        $(node).remove()
      } else {
        // work with child nodes
        let nodes = []
        for (let n of node.childNodes) {
          nodes.push(n)
        }
        for (let n of nodes) {
          await this.annotateRecursive(n)
        }
      }

      return node
    },
    breakSentences(text) {
      text = text.replace(/([!?:。！？：])/g, '$1SENTENCEENDING!!!')
      text = text.replace(/(\. )/g, '$1SENTENCEENDING!!!')
      let sentences = text.split('SENTENCEENDING!!!')
      return sentences.filter((sentence) => sentence.trim() !== '')
    },
    async tokenize(text, batchId) {
      let html = text
      if (this.$l2.continua) {
        html = ''
        let tokenized = await (await this.$dictionary).tokenize(text)
        this.tokenized[batchId] = tokenized
        for (let index = 0; index < this.tokenized[batchId].length; index++) {
          let item = this.tokenized[batchId][index]
          if (typeof item === 'object') {
            let token = this.tokenized[batchId]
            if (token && typeof token === 'object') {
              html += `<WordBlock :phonetics="${this.phonetics}" :popup="${this.popup}" :sticky="${this.sticky}" :explore="${explore}" :token="tokenized[${batchId}][${index}]"/>`
            }
          } else {
            item = item.trim().replace(/\s+/gi, ' ')
            if (item !== '') {
              for (let word of item.trim().split(/\s+/)) {
                html += `<WordBlock :phonetics="${this.phonetics}" :popup="${this.popup}" :sticky="${this.sticky}" :explore="${explore}">${word}</WordBlock> `
              }
              html = html.trim()
            }
          }
        }
      } else {
        html = ''
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents e.g. résumé -> resume
        this.tokenized[batchId] = []
        let segs = Helper.splitByReg(text, /([a-zA-Z0-9]+)/gi)
        var lemmatizer = new Lemmatizer()
        let reg = new RegExp(`.*([a-z0-9${this.$l2.apostrophe ? "'ʼ" : ""}]+).*`)
        for (let seg of segs) {
          let word = seg.toLowerCase()
          if (reg.test(word) && (!Config.reject[this.$l2.code] || !Config.reject[this.$l2.code].includes(word))) {
            let lemmas = lemmatizer.lemmas(word)
            lemmas = [[word, 'inflected']].concat(lemmas)
            let found = false
            let token = {
              text: seg,
              candidates: []
            }
            for (let lemma of lemmas) {
              let candidates = await (await this.$dictionary).lookupMultiple(lemma[0])
              if (candidates.length > 0) {
                found = true
                token.candidates = token.candidates.concat(candidates)
              }
            }
            token.candidates = Helper.uniqueByValue(token.candidates, 'id')
            if (found) {
              this.tokenized[batchId].push(token)
            } else {
              this.tokenized[batchId].push(seg)
            }
          } else {
            this.tokenized[batchId].push(seg)
          }
        }
        for (let index = 0; index < this.tokenized[batchId].length; index++) {
          let item = this.tokenized[batchId][index]
          if (typeof item === 'object') {
            let text = item.text.toLowerCase()
            html += `<WordBlock :sticky="${this.sticky}" :token="tokenized[${batchId}][${index}]">${item.text}</WordBlock>`
          } else {
            html += `<span>${item.replace(/\s/g, '&nbsp;')}</span>`
          }
        }
          
      }
      // html = text.replace(/([\S]+)/gi, '<WordBlock>$1</WordBlock>')
      // $(`#sentence-placeholder-${batchId}`).remove()
      return html
    },
    convertBurmese(text) {
      const detector = new MyanmarTools.ZawgyiDetector()
      const score = detector.getZawgyiProbability(text)
      if (score > 0.5) {
        const converter = new MyanmarTools.ZawgyiConverter()
        return converter.zawgyiToUnicode(text)
      } else {
        return text
      }
    },
    convertToSentencesRecursive(node) {
      if (node.nodeType === 3) {
        // textNode
        // break setnences
        let text = node.nodeValue
        if (this.$l2.code === 'my') text = this.convertBurmese(text)
        let sentences = this.breakSentences(text)
        for (let sentence of sentences) {
          // $(node).before(`<span id="sentence-placeholder-${this.batchId}">${sentence}</span>`)
          let sentenceSpan = $(`<span class="sentence">${sentence}</span>`)
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
          this.convertToSentencesRecursive(n)
        }
      }
      return node
    },
  },
}
</script>

<style lang="scss">
.show-pinyin-for-saved .add-pinyin.phonetics .sentence,
.show-pinyin .add-pinyin.phonetics:not(.annotated) .sentence {
  line-height: 2.6;
}
.sentence + .sentence {
  margin-left: 0.3em;
}
.l2-zh {
  .sentence {
    margin-right: 0;
  }
  .sentence + .highlight {
    margin-left: 0;
  }
  .highlight + .sentence {
    margin-left: 0;
  }
  .sentence + .sentence {
    margin-left: 0;
  }
}
.annotated {
  min-height: 2rem;
}
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
  flex-direction: row-reverse;
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

.annotated:hover .annotator-buttons {
  visibility: visible;
}

.annotator-buttons {
  float: right;
  padding: 0 0 0 0.5rem;
  visibility: hidden;
}

[dir='rtl'] .annotator-buttons {
  float: left;
  padding: 0 0.5rem 0 0;
}
.annotator-menu-toggle {
  font-size: 0.8rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.2rem;
  background: none;
  border: none;
  color: #aaa;
}

.annotator-buttons .dropdown-item {
  &:hover {
    background: none;
  }
  span {
    color: #888;
    &:hover {
      color: #666;
    }
  }
}
</style>
