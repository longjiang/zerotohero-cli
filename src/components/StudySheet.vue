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
      'text-right':
        foreign &&
        $l2.scripts &&
        $l2.scripts.length > 0 &&
        $l2.scripts[0].direction === 'rtl'
    }"
  >
    <table class="table" :class="targetLevelClasses">
      <tbody>
        <tr
          v-for="(line, index) in textLines"
          v-bind:key="line"
        >
          <td>
            <span v-html="translationLines[index]" />
          </td>
          <td>
            <template v-if="line.trim().length > 0">
              <span v-if="!annotated" v-html="line.trim()"></span>
              <v-runtime-template
                v-else
                :template="`<span>${annotatedLines[index]}</span>`"
              />
            </template>
          </td>
          <td>
            dictionary
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WordBlock from '@/components/WordBlock'
import VRuntimeTemplate from 'v-runtime-template'
import TinySegmenter from 'tiny-segmenter'
import MyanmarTools from 'myanmar-tools'

export default {
  components: {
    WordBlock,
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
      batchId: 0,
      tokenized: []
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
  computed: {
    targetLevelClasses() {
      let classes = {
        'show-level-1': this.targetLevel <= 1,
        'show-level-2': this.targetLevel <= 2,
        'show-level-3': this.targetLevel <= 3,
        'show-level-4': this.targetLevel <= 4,
        'show-level-5': this.targetLevel <= 5,
        'show-level-6': this.targetLevel <= 6,
        'show-level-outside': this.targetLevel <= 7
      }
      return classes
    },
    textLines() {
      return this.text
        .trim()
        .replace(/^\n/, '')
        .split('\n')
    },
    translationLines() {
      return this.translation
        .trim()
        .replace(/^\n/, '')
        .split('\n')
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
          this.annotatedLines.push(await this.tokenize(line, this.batchId++))
        }
      }
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
              html += `<WordBlock sticky="true" :token="tokenized[${batchId}][${index}]"/>`
            }
          } else {
            item = item.trim().replace(/\s+/gi, ' ')
            if (item !== '') {
              for (let word of item.trim().split(/\s+/)) {
                html += `<WordBlock>${word}</WordBlock> `
              }
              html = html.trim()
            }
          }
        }
      } else {
        if (this.$l2.apostrophe) {
          html = text.replace(
            /(((?![?])['ʼ\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u086F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CC0-\u1CCF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2070-\u209F\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2800-\u28FF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E80-\u2EFF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA720-\uA7FF\uA800-\uA82F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFEFF\uFF00-\uFFEF\u10000-\u1007F\u10080-\u100FF\u10140-\u1018F\u10190-\u101CF\u101D0-\u101FF\u10280-\u1029F\u102A0-\u102DF\u102E0-\u102FF\u10300-\u1032F\u10330-\u1034F\u10350-\u1037F\u10380-\u1039F\u103A0-\u103DF\u10400-\u1044F\u10450-\u1047F\u10480-\u104AF\u104B0-\u104FF\u10500-\u1052F\u10530-\u1056F\u10600-\u1077F\u10800-\u1083F\u10840-\u1085F\u10860-\u1087F\u10880-\u108AF\u108E0-\u108FF\u10900-\u1091F\u10920-\u1093F\u10980-\u1099F\u109A0-\u109FF\u10A00-\u10A5F\u10A60-\u10A7F\u10A80-\u10A9F\u10AC0-\u10AFF\u10B00-\u10B3F\u10B40-\u10B5F\u10B60-\u10B7F\u10B80-\u10BAF\u10C00-\u10C4F\u10C80-\u10CFF\u10D00-\u10D3F\u10E60-\u10E7F\u10F00-\u10F2F\u10F30-\u10F6F\u10FE0-\u10FFF\u11000-\u1107F\u11080-\u110CF\u110D0-\u110FF\u11100-\u1114F\u11150-\u1117F\u11180-\u111DF\u111E0-\u111FF\u11200-\u1124F\u11280-\u112AF\u112B0-\u112FF\u11300-\u1137F\u11400-\u1147F\u11480-\u114DF\u11580-\u115FF\u11600-\u1165F\u11660-\u1167F\u11680-\u116CF\u11700-\u1173F\u11800-\u1184F\u118A0-\u118FF\u119A0-\u119FF\u11A00-\u11A4F\u11A50-\u11AAF\u11AC0-\u11AFF\u11C00-\u11C6F\u11C70-\u11CBF\u11D00-\u11D5F\u11D60-\u11DAF\u11EE0-\u11EFF\u11FC0-\u11FFF\u12000-\u123FF\u12480-\u1254F\u13000-\u1342F\u13430-\u1343F\u14400-\u1467F\u16800-\u16A3F\u16A40-\u16A6F\u16AD0-\u16AFF\u16B00-\u16B8F\u16E40-\u16E9F\u16F00-\u16F9F\u17000-\u187FF\u18800-\u18AFF\u1B000-\u1B0FF\u1B100-\u1B12F\u1B130-\u1B16F\u1B170-\u1B2FF\u1BC00-\u1BC9F\u1D200-\u1D24F\u1D800-\u1DAAF\u1E000-\u1E02F\u1E100-\u1E14F\u1E2C0-\u1E2FF\u1E800-\u1E8DF\u1E900-\u1E95F\u1EE00-\u1EEFF\u1F200-\u1F2FF\u1F300-\u1F5FF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F\uE0100-\uE01EF\uF0000-\uFFFFF\u100000-\u10FFFF])+)/gi,
            '<WordBlock>$1</WordBlock>'
          )
        } else {
          html = text.replace(
            /(((?![?…])[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u086F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CC0-\u1CCF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2070-\u209F\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2800-\u28FF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E80-\u2EFF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA720-\uA7FF\uA800-\uA82F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFEFF\uFF00-\uFFEF\u10000-\u1007F\u10080-\u100FF\u10140-\u1018F\u10190-\u101CF\u101D0-\u101FF\u10280-\u1029F\u102A0-\u102DF\u102E0-\u102FF\u10300-\u1032F\u10330-\u1034F\u10350-\u1037F\u10380-\u1039F\u103A0-\u103DF\u10400-\u1044F\u10450-\u1047F\u10480-\u104AF\u104B0-\u104FF\u10500-\u1052F\u10530-\u1056F\u10600-\u1077F\u10800-\u1083F\u10840-\u1085F\u10860-\u1087F\u10880-\u108AF\u108E0-\u108FF\u10900-\u1091F\u10920-\u1093F\u10980-\u1099F\u109A0-\u109FF\u10A00-\u10A5F\u10A60-\u10A7F\u10A80-\u10A9F\u10AC0-\u10AFF\u10B00-\u10B3F\u10B40-\u10B5F\u10B60-\u10B7F\u10B80-\u10BAF\u10C00-\u10C4F\u10C80-\u10CFF\u10D00-\u10D3F\u10E60-\u10E7F\u10F00-\u10F2F\u10F30-\u10F6F\u10FE0-\u10FFF\u11000-\u1107F\u11080-\u110CF\u110D0-\u110FF\u11100-\u1114F\u11150-\u1117F\u11180-\u111DF\u111E0-\u111FF\u11200-\u1124F\u11280-\u112AF\u112B0-\u112FF\u11300-\u1137F\u11400-\u1147F\u11480-\u114DF\u11580-\u115FF\u11600-\u1165F\u11660-\u1167F\u11680-\u116CF\u11700-\u1173F\u11800-\u1184F\u118A0-\u118FF\u119A0-\u119FF\u11A00-\u11A4F\u11A50-\u11AAF\u11AC0-\u11AFF\u11C00-\u11C6F\u11C70-\u11CBF\u11D00-\u11D5F\u11D60-\u11DAF\u11EE0-\u11EFF\u11FC0-\u11FFF\u12000-\u123FF\u12480-\u1254F\u13000-\u1342F\u13430-\u1343F\u14400-\u1467F\u16800-\u16A3F\u16A40-\u16A6F\u16AD0-\u16AFF\u16B00-\u16B8F\u16E40-\u16E9F\u16F00-\u16F9F\u17000-\u187FF\u18800-\u18AFF\u1B000-\u1B0FF\u1B100-\u1B12F\u1B130-\u1B16F\u1B170-\u1B2FF\u1BC00-\u1BC9F\u1D200-\u1D24F\u1D800-\u1DAAF\u1E000-\u1E02F\u1E100-\u1E14F\u1E2C0-\u1E2FF\u1E800-\u1E8DF\u1E900-\u1E95F\u1EE00-\u1EEFF\u1F200-\u1F2FF\u1F300-\u1F5FF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F\uE0100-\uE01EF\uF0000-\uFFFFF\u100000-\u10FFFF])+)/gi,
            '<WordBlock>$1</WordBlock>'
          )
        }
      }
      return html
    }
  }
}
</script>

<style lang="scss"></style>
