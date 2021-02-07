<template>
  <span>
    <i
      class="fas fa-volume-up focus-exclude speak"
      @click="speak"
    ></i>
    <span v-if="!$hasFeature('speech') && (!mp3)" class="text-muted ml-1" style="opacity: 0.7; font-size: 0.8em">Forvo</span>
  </span>
</template>
<script>
import commons from 'wikimedia-commons-file-path'
export default {
  data() {
    return {}
  },
  props: ['text', 'mp3', 'wiktionary'],
  methods: {
    speak() {
      if (this.mp3) {
        let url = this.wiktionary ? commons(`File:${this.mp3}`) : this.mp3
        let audio = new Audio(url)
        audio.play()
      } else if (this.text) {
        if (this.$hasFeature('speech')) {
          var utterance = new SpeechSynthesisUtterance(this.text)
          let speechCode = this.$l2.code === 'yue' ? 'zh-HK' : this.$l2.code === 'zh' ? 'zh-TW' : this.$l2.locales.length > 0 ? this.$l2.locales[0] : 'en'
          utterance.lang = speechCode
          utterance.rate = 0.7
          speechSynthesis.speak(utterance)
        } else {
          window.open(`https://forvo.com/search/${this.text}/${this.$l2.code}`)
        }
      }
    }
  }
}
</script>

<style>
.speak {
  cursor: pointer;
  color: #999;
  position: relative;
}

.speak:hover {
  color: inherit;
}
</style>
