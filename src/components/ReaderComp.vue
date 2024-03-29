<template>
  <div>
    <button
      v-if="iconMode && !fullscreen"
      @click="fullscreen = !fullscreen"
      class="reader-icon"
    >
      <i class="fas fa-pencil-alt" />
    </button>
    <div :class="{ reader: true, fullscreen }" v-else>
      <Loader class="mb-5" />
      <p
        v-if="text.length > 0 && !fullscreen"
        class="mt-2 mb-5 hide-for-present"
      >
        👇 Now, hover or tap on words 👇
      </p>
      <div
        v-if="text.length > 0 && !showTranslate"
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
      <iframe
        v-if="showTranslate"
        :src="translationSrc"
        id="translation-iframe"
      ></iframe>
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
        <div class="mt-1">
          <button
            v-if="!fullscreen"
            @click="toggleFullscreen"
            class="reader-button"
          ><i class="fa fa-expand" /></button>
          <button
            v-if="fullscreen"
            @click="toggleFullscreen"
            class="reader-button"
          >
            <i class="fa fa-times" />
          </button>
          <button @click="bigger" class="reader-button">
            <span style="font-size: 1.25rem">A</span>
          </button>
          <button @click="smaller" class="reader-button">
            <small>A</small>
          </button>
          <button
            @click="toggleTranslation('en')"
            :class="{
              'reader-button': true,
              'reader-button-active': showTranslate === 'en',
            }"
          ><span style="font-size: 0.7em">EN</span></button>
          <button
            @click="toggleTranslation('ko')"
            :class="{
              'reader-button': true,
              'reader-button-active': showTranslate === 'ko',
            }"
          ><span style="font-size: 0.7em">한</span></button>
          <button
            @click="toggleTranslation('ja')"
            :class="{
              'reader-button': true,
              'reader-button-active': showTranslate === 'ja',
            }"
          ><span style="font-size: 0.7em">日</span></button>
          <button
            @click="toggleTranslation('ru')"
            :class="{
              'reader-button': true,
              'reader-button-active': showTranslate === 'ru',
            }"
          ><span style="font-size: 0.7em">РУ</span></button>
          <button
            @click="toggleTranslation('es')"
            :class="{
              'reader-button': true,
              'reader-button-active': showTranslate === 'es',
            }"
          ><span style="font-size: 0.7em">ES</span></button>
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
      fontSize: this.iconMode ? 2 : 1,
      fullscreen: false,
      showTranslate: false,
      translationSrc: this.translationUrl(
        this.$l1.code,
        this.$l2.code,
        this.text
      ),
    }
  },
  props: {
    iconMode: {
      default: false,
    },
  },
  computed: {
    marked() {
      return (
        Marked(this.text.replace(/^ {4,}/gm, '')) || this.text // 4 spaces in a row would emit <code>!
      )
    },
  },
  methods: {
    toggleTranslation(lang) {
      this.showTranslate = this.showTranslate === lang ? false : lang
      this.translationSrc = this.translationUrl(lang, this.$l2.code, this.text)
    },
    translationUrl(l1Code, l2Code, text) {
      let langs = {
        en: {
          zh: (text) => `https://www.bing.com/translator/?from=zh&to=en&text=${text}`,
        },
        // yandex, papago, baidu all refuse iframes
      }
      if (langs[l1Code] && langs[l1Code][l2Code]) {
        return langs[l1Code][l2Code](text)
      } else {
        return `https://www.bing.com/translator/?from=auto&to=${l1Code}&text=${text}`
      }
    },
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
}
</script>
<style lang="scss" scoped>
.reader-icon {
  border: none;
  background: white;
  color: #666;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
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
#translation-iframe {
  width: 100%;
  border: 1px solid #eee;
  height: calc(100vh - 14rem);
  border-radius: 0.5rem;
  background: #ccc;
}

.reader-button {
  border: none;
  background: none;
  display: inline-block;
  margin: 0 0.25rem 0 0;
  border-radius: 0.2rem;
  height: 1.5rem;
  width: 1.5rem;
  overflow: hidden;
  line-height: 1em;
  text-align: center;
  padding: 0;
}

.reader-button-active {
  background: #666;
  color: white;
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
    #reader-textarea {
      max-height: 15vh;
    }
  }

  #reader-annotated,
  #translation-iframe {
    position: fixed;
    width: calc(100vw - 2rem);
    height: calc(100vh - 15vh - 4.5rem);
    overflow: scroll;
  }
}
</style>
