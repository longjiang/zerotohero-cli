<template>
  <div class="main pt-3 pb-5">
    <div class="container-fluid">
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
            v-model="translation"
            :placeholder="$t('Paste {l1} translation here', { l1: $l1.name })"
          ></textarea>
        </div>
        <div class="col-sm-12 col-md-6">
          <textarea
            id="reader-textarea"
            class="form-control"
            cols="30"
            rows="5"
            v-model="text"
            :placeholder="$t('Paste {l2} text here', { l2: $l2.name })"
          ></textarea
          ><br />
          <button class="btn btn-secondary mr-1" @click="breakIntoLines">
            Break into Lines
          </button>
          <b-dropdown id="targetHSK" :text="targetLevel ? targetLevel === 7 ? 'Outside HSK' : `HSK ${targetLevel}` : 'Target Level'" class="mr-1">
            <b-dropdown-item v-for="level of [1,2,3,4,5,6]" :value="level" @click="setLevel(level)" v-bind:key="level">HSK {{ level }}</b-dropdown-item>
            <b-dropdown-item @click="setLevel(7)">Outside HSK</b-dropdown-item>
          </b-dropdown>
          <button class="btn btn-primary" @click="generate">
            Generate
          </button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-sm-12" v-bind:key="genKey" :class="targetLevelClasses">
          <StudySheet v-if="genKey > 0" :text="genText" :translation="genTranslation" />
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
      genText: '',
      genTranslation: '',
      genKey: 0
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
  computed: {
    targetLevelClasses() {
      let classes = {
        'show-level-1': this.targetLevel <= 1,
        'show-level-2': this.targetLevel <= 2,
        'show-level-3': this.targetLevel <= 3,
        'show-level-4': this.targetLevel <= 4,
        'show-level-5': this.targetLevel <= 5,
        'show-level-6': this.targetLevel <= 6,
        'show-level-outside': this.targetLevel <= 7
      }
      return classes
    }
  },
  methods: {
    generate() {
      this.genText = this.text
      this.genTranslation = this.translation
      this.genKey++
    },
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
        return saved[this.$l2.code] || ''
      } else {
        return ''
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

<style lang="scss">
/* for the text column */
.show-level-1 .study-sheet-table [data-hover-level='1'].sticky:not(.seen),
.show-level-2 .study-sheet-table [data-hover-level='2'].sticky:not(.seen),
.show-level-3 .study-sheet-table [data-hover-level='3'].sticky:not(.seen),
.show-level-4 .study-sheet-table [data-hover-level='4'].sticky:not(.seen),
.show-level-5 .study-sheet-table [data-hover-level='5'].sticky:not(.seen),
.show-level-6 .study-sheet-table [data-hover-level='6'].sticky:not(.seen),
.show-level-outside .study-sheet-table [data-hover-level='outside'].sticky:not(.seen):not(.common) {
  color: #B74900 !important;
}

/* for the definition column */
.show-level-1 .study-sheet-table [data-level='1']:not(.seen),
.show-level-2 .study-sheet-table [data-level='2']:not(.seen),
.show-level-3 .study-sheet-table [data-level='3']:not(.seen),
.show-level-4 .study-sheet-table [data-level='4']:not(.seen),
.show-level-5 .study-sheet-table [data-level='5']:not(.seen),
.show-level-6 .study-sheet-table [data-level='6']:not(.seen),
.show-level-outside .study-sheet-table [data-level='outside']:not(.seen):not(.common) {
  color: #B74900 !important;
}
</style>