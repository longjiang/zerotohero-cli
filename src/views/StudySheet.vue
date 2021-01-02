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
          <b-dropdown id="targetHSK" text="Target Level" class="mr-1">
            <b-dropdown-item v-for="level of [1,2,3,4,5,6]" :value="level" @click="setLevel(level)" v-bind:key="number">HSK {{ level }}</b-dropdown-item>
            <b-dropdown-item @click="setLevel(7)">Outside HSK</b-dropdown-item>
          </b-dropdown>
          <button class="btn btn-secondary" @click="breakIntoLines">
            Break into Lines
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-sm-12">
          <table class="table" :class=targetLevelClasses>
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
      translation: '',
      targetLevel: 1,
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
    setLevel(level) {
      this.targetLevel = level
    },
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
    targetLevelClasses() {
      let classes = {
        'show-level-1': this.targetLevel <= 1,
        'show-level-2': this.targetLevel <= 2,
        'show-level-3': this.targetLevel <= 3,
        'show-level-4': this.targetLevel <= 4,
        'show-level-5': this.targetLevel <= 5,
        'show-level-6': this.targetLevel <= 6,
        'show-level-outside': this.targetLevel <= 7,
      }
      return classes
    },
    marked() {
      return (
        Marked(this.text.replace(/^ {4,}/gm, '')) || this.text // 4 spaces in a row would emit <code>!
      )
    }
  }
}
</script>

<style lang="scss"></style>
