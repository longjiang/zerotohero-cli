<template>
  <div class="main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <Loader class="mb-5" />
          <p v-if="text.length > 0" class="mt-2 mb-5 hide-for-present">👇 Now, hover or tap on words 👇</p>
          <div
            v-if="text.length > 0"
            :key="readerKey"
            id="reader-annotated"
            :class="{focus: true, present: presentMode}"
            :style="`font-size: ${fontSize}rem; margin-bottom: 3rem;`"
          >
            <template 
              v-for="line of marked
                .trim()
                .replace(/<(div|p|li|h1|h2|h3|h4|h5|h6)/g, '\n<$1')
                .split('\n')">
              <Annotate v-if="line.trim().length > 0" class="mb-3" tag="div" :showTranslate="true">
                <span v-html="line.trim()" />
              </Annotate>
            </template>
          </div>
          <div class="text-right">
            <button @click="smaller" class="btn btn-unstyled"><small>A</small></button>
            <button @click="bigger" class="btn btn-unstyled" style="font-size:1.25rem;">A</button>
            <button @click="togglePresentMode" class="btn btn-unstyled">Present Mode</button>
          </div>
          <div>
            <textarea
              id="reader-textarea"
              class="form-control"
              cols="30"
              rows="5"
              :placeholder="$t('Paste {l2} text here', {l2: $l2.name})"
              v-model="text"
            ></textarea>
          </div>
        </div>
      </div>
      <h5 class="mt-5">Usage tips</h5>
      <ul>
        <li><code>Markdown</code> and <code>HTML</code> are also supported.</li>
      </ul>
      <div class="row mt-5">
        <div class="col-sm-12">
          <h5 class="mb-3">{{$t('Not sure what to read?')}}</h5>
          <ul>
            <li>
              {{ $t(`Look for ${$l2.name} music lyrics on Google.`) }}
            </li>
            <li v-html="$t('libraryIntro', {l2: $l2.name})" />
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


export default {
  template: '#reader-template',
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
      this.save(this.text)
    }
  },
  mounted() {
    if (this.$route.name === 'reader') {
      this.$store.dispatch('updateSavedWordsDisplay')
      this.route()
    }
  },
  methods: {
    getSaved() {
      let json = localStorage.getItem('zthReaderText')
      try {
        if (json) {
          let saved = JSON.parse(json)
          return saved
        }
      } catch(e) {

      }
    },
    get() {
      let saved = this.getSaved()
      if (saved) {
        return saved[this.$l2.code] || localStorage.getItem('fzhReaderText')
      } else {
        return localStorage.getItem('fzhReaderText')
      }
    },
    save(text) {
      let saved = this.getSaved() || {}
      saved[this.$l2.code] = text
      localStorage.setItem('zthReaderText', JSON.stringify(saved))
      localStorage.removeItem('fzhReaderText')
    },
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
        this.save(this.text)
        this.readerKey++
      }
    },
    show() {
      const marked = Marked(this.text) || this.text
      if (marked) {
        $('#reader-annotated').html(marked)
      }
    },
    async route() {
      let method = this.$route.params.method
      let arg = this.$route.params.arg
      if (method) {
        if (method === 'md-url') {
          Helper.proxy(arg).then(response => {
            console.log(response)
            this.text = response || ''
          })
        }
        if (method === 'html-url') {
          Helper.scrape(arg, (html, response, text) => {
            this.text = text
          })
        }
        if (method === 'md') {
          this.text = arg
        }
        if (method === 'html') {
          this.text = arg
        }
        if (method === 'txt') {
          this.text = arg.replace(/\n/g, '<br>')
        }
      } else {
        if (!this.text) {
          const text = this.get()
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

  .hide-for-present {
    display: none;
  }
}

</style>