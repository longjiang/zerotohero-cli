<template>
  <div
    :dir="
      foreign &&
      $l2.scripts &&
      $l2.scripts.length > 0 &&
      $l2.scripts[0].direction === 'rtl'
        ? 'rtl'
        : 'ltr'
    "
    :class="{
      annotated: true,
      'add-pinyin': true,
      'text-right':
        foreign &&
        $l2.scripts &&
        $l2.scripts.length > 0 &&
        $l2.scripts[0].direction === 'rtl'
    }"
  >
    <table class="study-sheet-table" id="description">
      <tbody>
        <tr v-for="(line, index) in textLines" v-bind:key="line">
          <td class="study-sheet-td-translation">
            <span v-html="translationLines[index]" />
          </td>
          <td></td>
          <td class="study-sheet-td-text">
            <template v-if="line.trim().length > 0">
              <span v-if="!annotated" v-html="line.trim()"></span>
              <span v-html="annotatedLines[index]" />
            </template>
          </td>
          <td></td>
          <td class="study-sheet-td-definition">
            <template v-if="line.trim().length > 0">
              <v-runtime-template
                v-if="annotated"
                :template="`<span>${dictionaryTemplateLines[index]}</span>`"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WordBlock from '@/components/WordBlock'
import WordBlockDictionary from '@/components/WordBlockDictionary'
import VRuntimeTemplate from 'v-runtime-template'
import Helper from '@/lib/helper'

export default {
  components: {
    WordBlock,
    WordBlockDictionary,
    VRuntimeTemplate
  },
  props: {
    foreign: {
      default: true
    },
    text: {
      default: ''
    },
    translation: {
      default: ''
    },
    targetLevel: {
      default: 1
    }
  },
  data() {
    return {
      annotated: false,
      annotatedLines: [],
      dictionaryTemplateLines: [],
      batchId: 0,
      tokenized: [],
      seen: []
    }
  },
  computed: {
    textLines() {
      return this.text
        .trim()
        .split('\n')
    },
    translationLines() {
      return this.translation
        .trim()
        .split('\n')
    }
  },
  async mounted() {
    if (!this.annotated) {
      if (this.$hasFeature('dictionary') || this.nonLatin()) {
        await this.annotate()
        this.annotated = true
      }
    }
  },
  methods: {
    nonLatin() {
      var rforeign = /[^\u0000-\u007f]/
      let nonLatin = rforeign.test(this.text)
      return nonLatin
    },
    async annotate() {
      if (this.text) {
        for (let line of this.textLines) {
          let tokenized = await this.tokenize(line, this.batchId++)
          let annotatedLine = tokenized.annotatedHtml
          let dictionaryTemplateLine = tokenized.dictionaryTemplate
          this.annotatedLines.push(annotatedLine)
          this.dictionaryTemplateLines.push(dictionaryTemplateLine)
        }
      }
    },
    async tokenize(text, batchId) {
      let annotatedHtml = text
      let dictionaryTemplate = text
      if (this.$l2.continua) {
        annotatedHtml = ''
        dictionaryTemplate = ''
        let tokenized = await (await this.$dictionary).tokenize(text)
        this.tokenized[batchId] = tokenized
        for (let index = 0; index < this.tokenized[batchId].length; index++) {
          let item = this.tokenized[batchId][index]
          if (typeof item === 'object') {
            let seen = this.seen.includes(item.text)
            if (!seen) this.seen.push(item.text)
            let common = item && item.candidates && item.candidates.length > 0 && item.candidates[0].weight && item.candidates[0].weight > 750
            annotatedHtml += `<span sticky="true" class="word-block sticky${seen ? ' seen' : ''}${common ? ' common' : ''}" data-hover-level="${item.candidates[0].level}" ><span class="word-block-simplified">${item.candidates[0].simplified}</span></span>`
            dictionaryTemplate += `<WordBlockDictionary :sticky="true" :token="tokenized[${batchId}][${index}]" :seen="${seen}" />`
          } else {
            if (item !== '') {
              annotatedHtml += `<span class="word-block"><span class="word-block-text">${item.replace(/ /g, '&nbsp;')}</span></span>`
              annotatedHtml = annotatedHtml.trim()
            }
          }
        }
      } else {
        annotatedHtml = ''
        dictionaryTemplate = ''
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents e.g. résumé -> resume
        this.tokenized[batchId] = []
        let segs = this.splitByReg(text, /([a-zA-Z0-9]+)/gi)
        var lemmatizer = new Lemmatizer()
        for (let seg of segs) {
          if (/.*([a-zA-Z0-9]+).*/.test(seg)) {
            let word = seg.toLowerCase()
            let lemmas = lemmatizer.lemmas(word)
            lemmas = [[word, 'inflected']].concat(lemmas)
            let found = false
            for (let lemma of lemmas) {
              let candidates = await (await this.$dictionary).lookupMultiple(lemma[0])
              if (candidates.length > 0) {
                let token = {
                  text: seg,
                  candidates
                }
                this.tokenized[batchId].push(token)
                found = true
                break
              }
            }
            if (!found) {
              this.tokenized[batchId].push(seg)
            }
          } else {
            this.tokenized[batchId].push(seg)
          }
        }
        for (let index = 0; index < this.tokenized[batchId].length; index++) {
          let item = this.tokenized[batchId][index]
          if (typeof item === 'object') {
            let seen = this.seen.includes(item.text)
            if (!seen) this.seen.push(item.text)
            annotatedHtml += `<span data-level="${this.tokenized[batchId][index].candidates[0].level}">${this.tokenized[batchId][index].text}</span>`
            dictionaryTemplate += `<WordBlockDictionary :sticky="true" :token="tokenized[${batchId}][${index}]" :seen="${seen}"/>`
          } else {
            annotatedHtml += `<span>${item}</span>`
          }
        }
        this.tokenized[batchId]
      }
      return {
        annotatedHtml,
        dictionaryTemplate
      }
    },
    splitByReg(text, reg) {
      let words = text.replace(reg, `!!!BREAKWORKD!!!$1!!!BREAKWORKD!!!`).replace(/^!!!BREAKWORKD!!!/, '').replace(/!!!BREAKWORKD!!!$/, '')
      return words.split('!!!BREAKWORKD!!!')
    }
  }
}
</script>

<style lang="scss">
.study-sheet-table {
  position: relative;
}
.study-sheet-td-translation,
.study-sheet-td-text {
  min-width: 20vw;
}

 
.show-pinyin .study-sheet-table .word-block .word-block-pinyin,
.show-simplified .study-sheet-table .word-block .word-block-simplified,
.show-traditional .study-sheet-table .word-block .word-block-traditional,
.show-definition .study-sheet-table .word-block .word-block-definition {
  display: inline;
}

.add-pinyin .study-sheet-table .word-block .word-block-text {
  display: inline;
}

.study-sheet-td-translation {
  padding: 5px;
  vertical-align: top;
  padding-right: 21px;
  color: #8FA9C1;
  line-height: 1;
}

.study-sheet-td-text {
  padding: 5px;
  vertical-align: top;
  padding-right: 21px;
  color: black;
  line-height: 1.2;
}

.study-sheet-td-definition {
  padding: 5px;
  vertical-align: top;
  color: #929292;
  line-height: 1.75;
}

.study-sheet-td-translation span {
  font-size: 8px;
  font-family: "Adobe Text Pro", serif;
}

.study-sheet-td-text span {
  font-family: "Source Han Serif SC", serif;
  font-size: 11px;
}

.study-sheet-td-definition span {
  font-family: "Adobe Text Pro", serif;
  font-size: 8px;
}

.study-sheet-td-definition span .word-block-dictionary-simplified {
  font-family: "Source Han Serif SC", serif;
}

</style>
