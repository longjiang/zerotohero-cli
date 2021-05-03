<template>
  <div>
    <button v-if="iconMode && !fullscreen" @click="fullscreen = !fullscreen" class="reader-icon"><i class="fas fa-pencil-alt" /></button>
    <div :class="{reader: true, fullscreen}" v-else>
      <Loader class="mb-5" />
      <p v-if="text.length > 0 && !fullscreen" class="mt-2 mb-5 hide-for-present">
        👇 Now, hover or tap on words 👇
      </p>
      <div
        v-if="text.length > 0"
        id="reader-annotated"
        :class="{ focus: true }"
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
      <div class="reader-editor">
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
        <div>
          <button v-if="!fullscreen" @click="toggleFullscreen" class="btn btn-unstyled">
            <i class="fa fa-expand" />
          </button>
          <button v-if="fullscreen" @click="toggleFullscreen" class="btn btn-unstyled">
            <i class="fa fa-times" />
          </button>
          <button
            @click="bigger"
            class="btn btn-unstyled"
            style="font-size: 1.25rem"
          >
            A
          </button>
          <button @click="smaller" class="btn btn-unstyled">
            <small>A</small>
          </button>
        </div>

      </div>

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
      fontSize: this.iconMode ? 2 : 1,
      fullscreen: false,
    }
  },
  props: {
    iconMode: {
      default: false
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
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
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
<style lang="scss" scoped>
.reader-icon {
  border: none;
  background: white;
  color: #666;
  box-shadow: 5px 5px 20px rgba(0,0,0,0.5);
  width: 2rem;
  height: 2rem;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  border-radius: 100%;
  opacity: 0.2;
  z-index: 10;
  &:hover {
    opacity: 1;
  }
}

#reader-annotated >>> del .word-block {
  color: red !important;
}
#reader-annotated >>> del .word-block .word-block-simplified::after {
  content: ' \2717';
  color: red !important;
}
.reader.fullscreen {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 10;
  overflow: scroll;
  margin-top: 0 !important;
  padding: 1rem;

  .reader-editor {
    position: fixed;
    bottom: 1rem;
    width: calc(100vw - 2rem);
  }

  #reader-annotated {
    position: fixed;
    width: calc(100vw - 2rem);
    height: calc(100vh - 13rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}


</style>
