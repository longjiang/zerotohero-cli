<template>
  <div>
    <Loader class="mb-5" />
    <p v-if="text.length > 0" class="mt-2 mb-5 hide-for-present">
      👇 Now, hover or tap on words 👇
    </p>
    <div
      v-if="text.length > 0"
      id="reader-annotated"
      :class="{ focus: true, present: presentMode }"
      :style="`font-size: ${fontSize}rem; margin-bottom: 3rem;`"
    >
      <template
        v-for="(line, index) of marked
          .trim()
          .replace(/<(div|p|li|h1|h2|h3|h4|h5|h6)/g, '\n<$1')
          .split('\n')"
      >
        <Annotate
          v-if="line.trim().length > 0"
          class="mb-3"
          tag="div"
          :key="`reader-${readerKey}-${index}`"
        >
          <span v-html="line.trim()" />
        </Annotate>
      </template>
    </div>
    <div class="text-right">
      <button @click="smaller" class="btn btn-unstyled">
        <small>A</small>
      </button>
      <button
        @click="bigger"
        class="btn btn-unstyled"
        style="font-size: 1.25rem"
      >
        A
      </button>
      <button @click="togglePresentMode" class="btn btn-unstyled">
        Present Mode
      </button>
    </div>
    <div>
      <textarea
        id="reader-textarea"
        class="form-control"
        cols="30"
        rows="5"
        :placeholder="$t('Paste {l2} text here', { l2: $l2.name })"
        v-model="text"
      ></textarea>
    </div>
  </div>
</template>
<script>
import Marked from 'marked'
export default {
  data() {
    return {
      text: '',
      annotated: false,
      readerKey: 0, // used to force re-render this component
      savedWordsKey: 0,
      fontSize: 1,
      presentMode: false,
    }
  },
  computed: {
    marked() {
      return (
        Marked(this.text.replace(/^ {4,}/gm, '')) || this.text // 4 spaces in a row would emit <code>!
      )
    },
  },
  methods: {
    togglePresentMode() {
      this.presentMode = !this.presentMode
    },
    toggleButtons() {
      this.buttons = !this.buttons
    },
    smaller() {
      this.fontSize = this.fontSize * 0.8
    },
    bigger() {
      this.fontSize = this.fontSize * 1.25
    },
    reset() {
      this.fontSize = 1
    },
    show() {
      const marked = Marked(this.text) || this.text
      if (marked) {
        $('#reader-annotated').html(marked)
      }
    },
  },
  watch: {
    text() {
      this.$emit('readerTextChanged', this.text)
      this.readerKey++
    },
  },
  mounted() {
    this.$store.dispatch('updateSavedWordsDisplay')
  },
}
</script>
