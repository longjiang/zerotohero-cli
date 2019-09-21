<template>
  <div :id="id || `collocation-${type}`">
    <h6>{{ title }}</h6>
    <hr class="mt-0 mb-2" />
    <div v-if="collocation">
      <ul class="collapsed gramrel pl-0" data-collapse-target>
        <li v-for="(line, index) in lines" class="gramrel-item list-unstyled" :key="`${term}-collocation-${type}-${index}`">
          <Annotate>
            <span v-html="line" />
          </Annotate>
        </li>
      </ul>
      <ShowMoreButton :data-bg-level="level" :length="collocation.Words.length" :min="4" />
    </div>
    <div v-else>No collocation.</div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    word: {
      type: Object
    },
    text: {
      type: String
    },
    level: {
      type: String
    },
    type: {
      type: String
    },
    title: {
      type: String
    },
    collocation: {
      type: Object
    },
    id: {
      default: undefined
    }
  },
  data() {
    return {
      Helper,
      lines: []
    }
  },
  computed: {
    term() {
      return this.word ? this.word.bare : this.text
    }
  },
  watch: {
    collocation() {
      this.update()
    },
    word() {
      this.update()
    },
    text() {
      this.update()
    }
  },
  async beforeMount() {
    this.update()
  },
  methods: {
    async getForms() {
      if (this.word) {
        let forms = (await (await this.$dictionary).wordForms(this.word)).map(
          form => form.form.replace(/'/g, '')
        )
        return forms
      } else {
        return [this.term]
      }
    },
    async update() {
      this.lines = []
      let forms = await this.getForms()
      if (this.collocation && this.collocation.Words) {
        this.collocation.Words = this.collocation.Words.filter(Word => Word.cm)
          .sort((a, b) => {
            return a.cm.length - b.cm.length
          })
          .filter(Word => !Word.cm.match(/(。|？)/))
          .slice(0, 20)
        let lines = []
        for (let Word of this.collocation.Words) {
          if (Word.cm) {
            lines.push(
              Helper.highlightMultiple(
                Word.cm,
                forms,
                this.level || 'outside'
              )
            )
          }
        }
        this.lines = lines
      }
    }
  }
}
</script>
