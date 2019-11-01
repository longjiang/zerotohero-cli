<template>
  <span>
    <i
      class="fas fa-volume-up focus-exclude speak"
      @click="speak"
    ></i>
    <span v-if="!$hasFeature('speech')" class="text-muted ml-1" style="opacity: 0.7; font-size: 0.8em">Forvo</span>
  </span>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['text', 'mp3'],
  methods: {
    speak() {
      if (this.mp3) {
        let audio = new Audio(this.mp3)
        audio.play()
      } else if (this.text) {
        if (this.$hasFeature('speech')) {
          var utterance = new SpeechSynthesisUtterance(this.text)
          let speechCode = this.$l2.code === 'yue' ? 'zh-HK' : options.l2.code
          utterance.lang = speechCode
          speechSynthesis.speak(utterance)
        } else {
          window.open(`https://forvo.com/search/${this.text}`)
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
