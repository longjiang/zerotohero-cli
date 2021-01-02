<template>
  <div class="main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1>Study Sheet Generator</h1>
          <Loader class="mb-5" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <textarea
            id="reader-textarea"
            class="form-control"
            cols="30"
            rows="5"
            :placeholder="$t('Paste {l1} translation here', { l1: $l1.name })"
            v-model="translation"
          ></textarea>
        </div>
        <div class="col-sm-12 col-md-6">
          <textarea
            id="reader-textarea"
            class="form-control"
            cols="30"
            rows="5"
            :placeholder="$t('Paste {l2} text here', { l2: $l2.name })"
            v-model="text"
          ></textarea
          ><br />
          <button class="btn btn-secondary" @click="breakIntoLines">
            Break into Lines
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-sm-12">
          <table class="table">
            <tbody>
              <tr
                v-for="(line, index) in marked
                  .trim()
                  .replace(/<(div|p|li|h1|h2|h3|h4|h5|h6)/g, '\n<$1')
                  .replace(/^\n/, '')
                  .split('\n')"
                v-bind:key="line"
              >
                <td>
                  <span
                    v-html="
                      translation
                        .trim()
                        .split('\n')[index]
                    "
                  />
                </td>
                <td>
                  <Annotate v-if="line.trim().length > 0" tag="div" :sticky="true">
                    <span v-html="line.trim()" />
                  </Annotate>
                </td>
                <td>
                  dictionary
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- .container -->
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import Marked from 'marked'

export default {
  data() {
    return {
      text: '',
      translation: ''
    }
  },
  watch: {
    text() {
      this.save(this.text, 'zthStudySheetText')
    },
    translation() {
      this.save(this.translation, 'zthStudySheetTranslation')
    }
  },
  methods: {
    getSaved(key) {
      let textJSON = localStorage.getItem(key)
      try {
        if (textJSON) {
          let saved = JSON.parse(textJSON)
          return saved
        }
      } catch (e) {}
    },
    get(key) {
      let saved = this.getSaved(key)
      if (saved) {
        return saved[this.$l2.code] || localStorage.getItem(key)
      } else {
        return localStorage.getItem(key)
      }
    },
    save(text, key) {
      let saved = this.getSaved(key) || {}
      saved[this.$l2.code] = text
      localStorage.setItem(key, JSON.stringify(saved))
    },
    breakIntoLines() {
      this.text = this.text
        .replace(/([。，？！：；、])/g, '$1\n')
        .replace(/\n”/g, '”\n')
        .replace(/\n\n+/g, '\n\n')
        .replace(/[　\t]+/g, '')
    }
  },
  mounted() {
    const text = this.get('zthStudySheetText')
    if (text) {
      this.text = text
    }
    const translation = this.get('zthStudySheetTranslation')
    if (translation) {
      this.translation = translation
    }
  },
  computed: {
    marked() {
      return (
        Marked(this.text.replace(/^ {4,}/gm, '')) || this.text // 4 spaces in a row would emit <code>!
      )
    }
  }
}
</script>

<style lang="scss"></style>
