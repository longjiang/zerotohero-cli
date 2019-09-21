<template>
  <div class="main pt-3 pb-5">
    <div class="container mt2 mb2">
      <div class="row">
        <div class="col-sm-12">
          <h4>{{ $t('Text Reader') }}</h4>
          <p v-html="$t('textReaderIntro')"/>
          <Loader class="mb-5" />
          <div
            v-if="text.length > 0"
            :key="readerKey"
            id="reader-annotated"
            :class="{focus: true, present: presentMode}"
            :style="`font-size: ${fontSize}rem; margin-top: 3rem; margin-bottom: 3rem;`"
          >
            <Annotate
              tag="div"
              :fullscreen="buttons"
              v-for="line of marked
                .trim()
                .replace(/<(div|p|li|h1|h2|h3|h4|h5|h6)/g, '\n<$1')
                .split('\n')"
              v-if="line.trim().length > 0"
              class="mb-3"
              ><div v-html="line.trim()"
            /></Annotate>
          </div>
          <div class="text-right">
            <button @click="smaller" class="btn btn-unstyled"><small>A</small></button>
            <button @click="bigger" class="btn btn-unstyled" style="font-size:1.25rem;">A</button>
            <button @click="togglePresentMode" class="btn btn-unstyled">Present Mode</button>
            <button @click="toggleButtons" class="btn btn-unstyled">{{ this.buttons ? 'Hide Buttons' : 'Show Buttons' }}</button>
          </div>
          <div>
            <textarea
              id="reader-textarea"
              class="form-control"
              cols="30"
              rows="5"
              :placeholder="$t('Enter your English text here. Markdown and HTML also supported.')"
              v-model="text"
            ></textarea>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-5">
        <div class="col-sm-12">
          <h5 class="mb-3">{{$t('Not sure what to read?')}}</h5>
          <p>{{ $t('Try these resources:') }}</p>
          <ul>
            <li>
              {{ $t('Look for English music lyrics on Google.') }}
            </li>
            <li v-html="$t('libraryIntro', {lang: $lang.code})" />
          </ul>
        </div>
      </div>
    </div>
    <!-- .container -->

    <!-- ANCHOR img/anchors/learn-this.png -->
    <div class="container-fluid learn-this-bar">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 text-center"></div>
        </div>
      </div>
    </div>
    <!-- .container-fluid -->
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import Marked from 'marked'

const Reader = {
  get() {
    return localStorage.getItem('fzhReaderText')
  },
  save(text) {
    localStorage.setItem('fzhReaderText', text)
  }
}

export default {
  template: '#reader-template',
  data() {
    return {
      text: '',
      annotated: false,
      readerKey: 0, // used to force re-render this component
      savedWordsKey: 0,
      fontSize: 1,
      buttons: true,
      presentMode: true,
    }
  },
  computed: {
    marked() {
      return (
        Marked(this.text.replace(/^ {4,}/gm, '')) || this.text // 4 spaces in a row would emit <code>!
      )
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'reader') {
        this.$store.dispatch('updateSavedWordsDisplay')
        this.route()
      }
    },
    text() {
      this.readerKey++
      Reader.save(this.text)
    }
  },
  mounted() {
    if (this.$route.name === 'reader') {
      this.$store.dispatch('updateSavedWordsDisplay')
      this.route()
    }
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
    startClick() {
      if (this.text) {
        Reader.save(this.text)
        this.readerKey++
      }
    },
    show() {
      const marked = Marked(this.text) || this.text
      if (marked) {
        $('#reader-annotated').html(marked)
      }
    },
    route() {
      let method = this.$route.params.method
      let arg = this.$route.params.arg
      if (method) {
        if (method === 'md-url') {
          Helper.proxy(arg, md => {
            this.text = md
            // this.show()
          })
        }
        if (method === 'html-url') {
          Helper.scrape(arg, (html, response, text) => {
            this.text = text
            // this.show()
          })
        }
        if (method === 'md') {
          this.text = arg
          // this.show()
        }
        if (method === 'html') {
          this.text = arg
          // this.show()
        }
        if (method === 'txt') {
          this.text = arg.replace(/\n/g, '<br>')
          // this.show()
        }
      } else {
        if (!this.text) {
          const text = Reader.get()
          if (text) {
            this.text = text
            // this.show()
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">

#reader-annotated.present {
  height: 40rem;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

</style>