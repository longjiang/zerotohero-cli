<template>
  <div class="main pt-3 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1>Study Sheet Creator</h1>
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
          <b-dropdown id="targetHSK" :text="targetLevel ? targetLevel === 7 ? 'Outside HSK' : `HSK ${targetLevel}` : 'Target Level'" class="mr-1">
            <b-dropdown-item v-for="level of [1,2,3,4,5,6]" :value="level" @click="setLevel(level)" v-bind:key="level">HSK {{ level }}</b-dropdown-item>
            <b-dropdown-item @click="setLevel(7)">Outside HSK</b-dropdown-item>
          </b-dropdown>
          <button class="btn btn-secondary" @click="breakIntoLines">
            Break into Lines
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-sm-12">
          <StudySheet :text="text" :translation="translation" :target-level="targetLevel" v-bind:key="text" />
        </div>
      </div>
    </div>
    <!-- .container -->
  </div>
</template>

<script>
import StudySheet from '@/components/StudySheet'

export default {
  components: {
    StudySheet
  },
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
    },
    targetLevel() {
      this.save(this.targetLevel, 'zthStudySheetTargetLevel')
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
    const targetLevel = this.get('zthStudySheetTargetLevel')
    if (targetLevel) {
      this.targetLevel = targetLevel
    }
  }
}
</script>

<style lang="scss"></style>