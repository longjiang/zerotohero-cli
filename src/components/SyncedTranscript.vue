<template>
  <div class="synced-transcript">
    <div
      id="transcript"
      :class="{
        'mb-4': true,
        collapsed: collapse
      }"
      data-collapse-target
      :key="reviewKey"
    >
      <template v-for="(line, lineIndex) in lines">
        <div
          :key="lineIndex"
          :class="{
            'transcript-line': true,
            matched: highlight && line & line.line.includes(highlight),
            'transcript-line-current': currentLine === line
          }"
          @click="seekVideoTo(line.starttime)"
          :id="`transcript-line-${lineIndex}`"
        >
          <Annotate tag="div" class="transcript-line-chinese">
            <span
              v-html="
                highlight
                  ? Helper.highlight(line.line, highlight, word.level || 'outside')
                  : line.line
              "
            />
          </Annotate>
          <div
            v-if="$l2.code !== $l1.code"
            :class="{
              'transcript-line-l1': true,
              'text-right':
                $l2.scripts &&
                $l2.scripts.length > 0 &&
                $l2.scripts[0].direction === 'rtl'
            }"
          >
            <template
              v-for="parallelLine in parallellines.filter(
                l => l.starttime === line.starttime
              )"
            >
              <span v-html="parallelLine.line" />
            </template>
          </div>
        </div>
        <template v-if="review[lineIndex] && review[lineIndex].length > 0">
          <div class="review" v-for="reviewItem in review[lineIndex]">
            <h6>Pop Quiz</h6>
            <div class="review-item mt-2">
              <div
                v-if="$l2.code !== $l1.code"
                :class="{
                'transcript-line-l1': true,
                'text-right':
                  $l2.scripts &&
                  $l2.scripts.length > 0 &&
                  $l2.scripts[0].direction === 'rtl'
              }"
              >
                <template
                  v-for="parallelLine in parallellines.filter(
                  l => l.starttime === reviewItem.line.starttime
                )"
                >
                  <span v-html="parallelLine.line" />
                </template>
              </div>
              <Annotate tag="div" class="transcript-line-chinese">
                <span v-html="Helper.highlight(reviewItem.line.line, reviewItem.text, hsk)" />
              </Annotate>
              <div class="mt-2">
                <button
                  v-for="answer in reviewItem.answers"
                  :class="{
                  'btn': true,
                  'btn-small': true,
                  'bg-white': true,
                  'mr-2': true,
                  'review-answer': true,
                  'checked': false,
                  'review-answer-correct': answer.correct
                }"
                  @click="answerClick"
                >{{ answer.text }}</button>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <ShowMoreButton v-if="collapse" :data-bg-level="hsk ? hsk : 'outside'">Show More</ShowMoreButton>
  </div>
</template>

<script>
import Helper from '@/lib/helper'
import { mapState } from 'vuex'

export default {
  props: {
    lines: {
      type: Array
    },
    parallellines: {
      default: false
    },
    collapse: {
      default: false
    },
    onSeek: {
      default: false
    },
    highlight: {
      default: false
    },
    hsk: {
      default: 'outside'
    }
  },
  computed: mapState(['savedWords']),
  data() {
    return {
      sW: [],
      Helper,
      currentTime: 0,
      currentLine: this.lines ? this.lines[0] : undefined,
      review: {},
      reviewKey: 0
    }
  },
  mounted() {
    this.updateWords()
  },
  watch: {
    savedWords() {
      this.updateWords()
    },
    currentTime() {
      for (let lineIndex = this.lines.length - 1; lineIndex >= 0; lineIndex--) {
        let line = this.lines[lineIndex]
        if (
          parseFloat(line.starttime) <
          this.currentTime + 0.5 // current time marker passed the start time of the line
        ) {
          if (this.currentLine !== line) {
            this.scrollTo(lineIndex)
          }
          this.currentLine = line
          return
        }
      }
    }
  },
  methods: {
    answerClick(e) {
      $(e.target).addClass('checked')
      if ($(e.target).hasClass('review-answer-correct')) {
        $(e.target).parents('.review').addClass('show-answer')
      }
    },
    async findSimilar(text) {
      let words = await (await this.$dictionary).lookupFuzzy(text)
      words = words.filter(word => word.head !== text)
      words = Helper.uniqueByValue(words, 'head')
      return words.map(word => word.head).sort((a,b) => b.length - a.length)
    },
    async updateWords() {
      let review = {}
      let lineOffset = 10 // Show review this number of lines after the first appearance of the word
      let lineOffsetRandom = 5
      if (
        this.$store.state.savedWords &&
        this.$store.state.savedWords[this.$l2.code]
      ) {
        for (let savedWord of this.$store.state.savedWords[this.$l2.code]) {
          let word = await (await this.$dictionary).get(savedWord.id)
          if (word) {
            let seenLines = []
            for (let form of savedWord.forms) {
              for (let lineIndex in this.lines) {
                if (!seenLines.includes(lineIndex)) {
                  let line = this.lines[lineIndex]
                  if (line.line.includes(form)) {
                    let reviewIndex = Math.min(
                      Number(lineIndex) + lineOffset + Helper.randomInt(lineOffsetRandom),
                      this.lines.length - 1
                    )
                    let answers = await this.findSimilar(form)
                    if (answers.length < 2) {
                      for (let i of [1, 2]) {
                        let randomWord = await (await this.$dictionary).random()
                        answers.push(randomWord.head)
                      }
                    }
                    answers = answers
                      .map(similarText => {
                        return {
                          text: similarText,
                          correct: false
                        }
                      })
                      .slice(0, 2)
                    answers.push({
                      text: form,
                      correct: true
                    })
                    review[reviewIndex] = review[reviewIndex] || []
                    review[reviewIndex].push({
                      line: line,
                      text: form,
                      word: word,
                      answers: Helper.shuffle(answers)
                    })
                    seenLines.push(lineIndex)
                  }
                }
              }
            }
          }
        }
      }
      this.review = review
      this.reviewKey++
    },
    seekVideoTo(starttime) {
      if (this.onSeek) {
        this.onSeek(starttime)
      }
    },
    scrollTo(lineIndex) {
      let el = document.getElementById(`transcript-line-${lineIndex}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    },
    previousLine() {
      let currentLineIndex = this.lines.findIndex(
        line => line === this.currentLine
      )
      let previousLineIndex = Math.max(currentLineIndex - 1, 0)
      this.currentLine = this.lines[previousLineIndex]
      this.seekVideoTo(this.currentLine.starttime)
      this.scrollTo(previousLineIndex)
    },
    nextLine() {
      let currentLineIndex = this.lines.findIndex(
        line => line === this.currentLine
      )
      let nextLineIndex = Math.min(currentLineIndex + 1, this.lines.length - 1)
      this.currentLine = this.lines[nextLineIndex]
      this.seekVideoTo(this.currentLine.starttime)
      this.scrollTo(nextLineIndex)
    }
  }
}
</script>

<style lang="scss">
.review {
  margin: 0.5rem 0;
  padding: 1rem;
  background-color: #f3f3f3;
  border-radius: 0.5rem;
  &.show-answer {
    background-color: #d6f5d8
  }
}

.review:not(.show-answer) {
  .highlight {
    background-color: #ccc;
    border-radius: 0.2rem;
  }
  .highlight * {
    opacity: 0;
    pointer-events: none
  }
}

.review-answer {
  border: 1px solid #999;
}

.review-answer.checked:not(.review-answer-correct) {
  background-color: #dc3838 !important;
  border-color: #a03030 !important;
  color: white !important;
}

.review-answer.checked.review-answer-correct {
  background-color: #63ab67 !important;
  border-color: #36823b !important;
  color: white !important;
}

.transcript.collapsed .transcript-line:nth-child(n + 6) {
  display: none;
}

.transcript-line {
  cursor: pointer;
  position: relative;
  color: #666;
  font-size: 1.2rem;
  padding: 0.5rem;
}

.transcript-line-current,
.transcript-line:hover {
  box-shadow: 0 0 10px rgba(255, 95, 32, 0.301);
  border-radius: 0.25rem;
}

.transcript-line.matched {
  color: #616161;
  font-weight: bold;
}

.transcript-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.transcript-line:hover::before {
  content: '▶︎';
  font-size: 1.5rem;
  width: 4rem;
  line-height: 0.8rem;
  display: block;
  color: #f7613540;
  position: absolute;
  right: -2rem;
  bottom: 1rem;
  font-weight: bold;
}

.transcript-line-l1 {
  color: #aaa;
  font-style: italic;
  font-size: 0.8em;
  display: none;
}
.show-translation .transcript-line-l1 {
  display: inherit;
}
</style>
