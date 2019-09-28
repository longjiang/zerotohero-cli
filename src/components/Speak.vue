<template>
  <i
    v-if="$hasFeature('speech')"
    class="fas fa-volume-up focus-exclude speak"
    @click="speak"
  ></i>
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
        var utterance = new SpeechSynthesisUtterance(this.text)
        utterance.lang = this.$l2.code
        speechSynthesis.speak(utterance)
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
