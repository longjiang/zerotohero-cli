<template>
  <div class="main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <ReaderComp ref="reader" @readerTextChanged="save(text)"/>
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
import ReaderComp from '@/components/ReaderComp'
import Helper from '@/lib/helper'


export default {
  template: '#reader-template',
  components: {
    ReaderComp
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'reader') {
        this.route()
      }
    },
    text() {
      this.$refs.reader.text = this.text
    },
  },
  mounted() {
    if (this.$route.name === 'reader') {
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

</style>