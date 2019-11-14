<template>
  <v-popover
    placement="top"
    :open="hover"
    trigger="manual"
    :open-group="'id' + _uid"
    :id="id"
    style="display: inline-block"
  >
    <span
      :class="{
        'word-block': true,
        saved: saved
      }"
      :data-hover-level="
        words && words.length > 0 ? words[0].level || 'outside' : 'outside'
      "
      @mouseover="mouseover"
      @mouseout="mouseout"
    >
      <template v-if="token && token.candidates && token.candidates.length > 0">
        <span class="word-block-definition" v-html="token.candidates[0].definitions[0]"></span>
        <span
          class="word-block-pinyin"
          v-if="transliteration && transliteration !== token.candidates[0].head"
        >{{ savedTransliteration || transliteration }}</span>
        <span v-if="['zh', 'yue', 'nan', 'hak'].includes($l2.code)" class="word-block-simplified">{{ token.candidates[0].simplified }}</span>
        <span v-if="['zh', 'yue', 'nan', 'hak'].includes($l2.code)" class="word-block-traditional">{{ token.candidates[0].traditional }}</span>
        <span v-else class="word-block-text">{{ token.candidates[0].head }}</span>
      </template>
      <template v-else>
        <span
          class="word-block-pinyin"
          v-if="transliteration && transliteration !== text"
        >{{ savedTransliteration || transliteration }}</span>
        <span class="word-block-text">
          <template v-if="$l2.code === 'ru' && text.length > 9">{{ segment(text) }}</template>
          <slot v-else></slot>
        </span>
      </template>
    </span>
    <template slot="popover">
      <div
        class="tooltip-images"
        :key="`tooltip-images-${text}`"
        v-cloak
        v-if="images && images.length > 0"
      >
        <img
          alt
          class="image-wall-image"
          v-for="(image, index) in images"
          :key="`web-images-${text}-${index}`"
          :src="`${Config.imageProxy}?${image.src}`"
        />
      </div>
      <div v-for="word in words" :class="classes">
        <div v-if="word">
          <div v-for="match in word.matches" style="color: #999">
            <b>{{ match.field }} {{ match.number }}</b>
            {{ match.table !== 'declension' ? match.table : '' }}
            of
          </div>
          <div>
            <span style="color: #999" v-if="word.pronunciation">/{{ word.pronunciation }}/</span>
            <span style="color: #999" v-else-if="word.jyutping">{{ word.jyutping }}</span>
            <span style="color: #999" v-else-if="word.pinyin">{{ word.pinyin }}</span>
            <span style="color: #999" v-else-if="word.kana && word.kana !== word.bare">{{ word.kana }}</span>
            <span style="color: #999" v-else-if="$hasFeature('transliteration')">{{ tr(word.bare) }}</span>
            <span style="color: #999" v-if="word.jyutping && word.pinyin"> / {{ word.pinyin }}</span>
            <Speak :text="word.kana || word.bare" :mp3="word.audio" :wiktionary="word.wiktionary" class="ml-1" />
          </div>
          <Star :word="word" :text="text" class="mr-1" style="position: relative; bottom: 0.1rem"></Star>
          <b :data-level="word.level || 'outside'" style="font-size: 1.5rem">{{ $l2.code === 'ru' && text.length > 9 ? segment(word.accented) : word.accented }}</b>
          <span
            v-if="word.traditional && word.traditional !== word.simplified"
            class="ml-1"
            style="font-size: 1.2em; color: #999"
          >{{ word.traditional }}</span>
          <span
            v-if="$l2.code === 'ko' && word.cjk && word.cjk.canonical"
            class="ml-1"
            style="font-size: 1.2em; color: #999"
          >[{{ word.cjk.canonical }}]</span>
          <span
            v-if="word.level && word.level !== 'outside'"
            :data-bg-level="word.level"
            class="pl-1 pr-1 ml-1 rounded d-inline-block"
            style="font-size: 0.8em; position: relative; bottom: 0.1rem"
          >{{ $l2.code === 'zh' ? 'HSK ' : ''}}{{ word.level }}</span>
          <a :href="`#/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${words[0].id}`" class="ml-1 link-unstyled" style="color: #999">
            <i class="fas fa-book"></i>
          </a>
        </div>
        <div>
          <span class="word-type" v-if="word.type !== 'other'" style="color: #999">
            {{ word.verbs ? abbreviate(word.verbs.aspect) : '' }}
            {{ abbreviate(word.type) }}
          </span>
          <span class="word-translation" v-if="word.definitions">
            <em v-html="word.definitions.map(definition => definition.replace(/\[.*\] /g, '')).join(', ')"></em>
          </span>
        </div>
      </div>
      <div v-if="loading === true">💭 Thinking...</div>
      <div v-if="words && words.length === 0 && loading === false">
        🤷‍ No clue.
        <br />
        <a :href="`https://www.google.com/search?q=${this.text}`" target="_blank">Google</a>
        |
        <a :href="`https://en.wiktionary.org/wiki/${this.text}`" target="_blank">Wiktionary</a>
      </div>
    </template>
  </v-popover>
</template>

<script>
import Helper from '@/lib/helper'
import Config from '@/lib/config'
import WordPhotos from '@/lib/word-photos'
import { mapState } from 'vuex'
import { transliterate as tr } from 'transliteration'

export default {
  props: {
    token: {
      type: Object
    }
  },
  data() {
    return {
      transliteration: undefined,
      savedTransliteration: undefined,
      id: `wordblock-${Helper.uniqueId()}`,
      hover: false,
      loading: true,
      text: this.$slots.default ? this.$slots.default[0].text : undefined,
      saved: false,
      images: [],
      words: [],
      classes: {
        'tooltip-entry': true
      },
      Config
    }
  },
  computed: mapState(['savedWords']),
  mounted() {
    if (!this.transliteration && this.$hasFeature('transliteration')) {
      if (this.token && this.token.candidates && this.token.candidates.length > 0) {
        if (this.$l2.code === 'ja' && this.token.candidates[0].kana) {
          this.transliteration = this.token.candidates[0].kana
        } else if (['zh', 'nan', 'hak'].includes(this.$l2.code) && this.token.candidates[0].pinyin) {
          this.transliteration = this.token.candidates[0].pinyin
        } else if (this.$l2.code === 'yue' && this.token.candidates[0].jyutping) {
          this.transliteration = this.token.candidates[0].jyutping
        } else {
          this.transliteration = tr(this.token.candidates[0].head)
        }
      }
      if (!this.transliteration && !['ja', 'zh', 'nan', 'hak'].includes(this.$l2.code)) {
        this.transliteration = tr(this.text)
      }
    }
    this.update()
  },
  watch: {
    savedWords() {
      this.update()
    }
  },
  methods: {
    tr(text) {
      return tr(text)
    },
    segment(text) {
      return text.replace(/([́ёеуюйыаоэяицкнгшщзхъфвпрлджчсмтьб])([цкнгшщзхъфвпрлджчсмтб])/gi, '$1·$2').replace(/·([цкнгшщзхъфвпрлджчсмтб])([цкнгшщзхъфвпрлджчсмтб])/gi, '$1·$2').replace(/·([цкнгшщзхъфвпрлджчсмтб])ь/gi, '$1ь').replace(/·([цкнгшщзхъфвпрлджчсмтб])·/gi, '·$1').replace(/^(.)·/, '$1').replace(/·(.)$/, '$1')
      //([ёеуюйыаоэяи])
    },
    async update() {
      if (this.$l1) this.classes[`l1-${this.$l1.code}`] = true
      if (this.$l2) this.classes[`l2-${this.$l2.code}`] = true
      let savedWord = false
      if (this.token) {
        for(let word of this.token.candidates) {
          savedWord = this.$store.getters.hasSavedWord({
            l2: this.$l2.code,
            text: word.bare
          })
        }
      } else {
        if (this.$slots.default) {
          savedWord = this.$store.getters.hasSavedWord({
            l2: this.$l2.code,
            text: this.$slots.default[0].text.toLowerCase()
          })
        }
      }
      if (savedWord && savedWord.id && ['ja', 'zh', 'nan', 'hak'].includes(this.$l2.code)) {
        let word = await (await this.$dictionary).get(savedWord.id)
        let text = this.text || (this.token && this.token.candidates.length > 0 ? this.token.candidates[0].head : undefined)
        if (word && word.head && word.head === text) {
          this.savedTransliteration = word.jyutping || word.pinyin || word.kana || this.transliteration
        }
        this.saved = word ? word : false
      } else {
        this.saved = savedWord ? savedWord : false
      }
    },
    matchCase(text) {
      if (this.text.match(/^[\wА-ЯЁ]/)) {
        if (this.text.match(/^.[\wА-ЯЁ]/)) {
          return text.toUpperCase()
        } else {
          return Helper.ucFirst(text)
        }
      } else {
        return text
      }
    },
    async mouseover() {
      if (await this.$dictionary) {
        if (this.loading === true) {
          if (this.words && this.words.length === 0) {
            this.lookup()
          }
        }
        setTimeout(() => {
          if ($('.popover:hover').length === 0) {
            this.hover = true
          }
        }, 300) // Allow user to interact with previous popover
        if (this.images.length === 0) {
          this.images = (await WordPhotos.getGoogleImages({
            term: this.token ? this.token.text : this.text,
            lang: this.$l2.code
          })).slice(0, 5)
        }
      }
    },
    mouseout() {
      setTimeout(() => {
        // Allow user to interact with popover
        let $popovers = $('.popover:hover')
        if ($popovers && $popovers.length === 0) {
          this.hover = false
        }
      }, 300)
    },
    async lookup() {
      if (this.token && this.$l2.code !== 'ja') {
        this.words = this.token.candidates
      } else {
        if (!this.text && this.token) this.text = this.token.candidates[0].head
        let words = await (await this.$dictionary).lookupFuzzy(this.text)
        if (words) {
          for (let word of words) {
            if (word && word.matches) {
              for (let match of word.matches) {
                match.form = await (await this.$dictionary).accent(match.form)
                match.field = await (await this.$dictionary).stylize(
                  match.field
                )
                match.number = await (await this.$dictionary).stylize(
                  match.number
                )
                match.table = await (await this.$dictionary).stylize(
                  match.table
                )
              }
            }
          }
        }
        this.words = words
      }
      this.loading = false
    },
    abbreviate(type) {
      let abb = {
        noun: 'n.',
        adjective: 'adj.',
        verb: 'v.',
        pronoun: 'pron.',
        perfective: 'perf.',
        imperfective: 'imperf.'
      }
      return abb[type] || type
    },
    speak(text) {
      if (this.$hasFeature('speech')) {
        if (!speechSynthesis.speaking) {
          this.utterance = new SpeechSynthesisUtterance(text)
          this.utterance.lang = this.$l2.code
          speechSynthesis.speak(this.utterance)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.word-block {
  cursor: pointer;
  &.saved {
    font-weight: bold;
  }
}

.add-pinyin {
  line-height: 2;

  .word-block {
    display: inline-block;
    text-align: center;
    margin: 0;
    position: relative;
    text-indent: 0;

    span {
      display: block;
      line-height: 1.3;
      text-indent: 0;
    }

    /* Hide by default */
    .word-block-pinyin,
    .word-block-simplified,
    .word-block-traditional,
    .word-block-definition {
      display: none;
    }
  }
}

/* Shown on demand */

.show-pinyin .word-block .word-block-pinyin,
.show-simplified .word-block .word-block-simplified,
.show-traditional .word-block .word-block-traditional,
.show-definition .word-block .word-block-definition {
  display: block;
}

.show-definition .word-block {
  position: relative;
}

/* Line style */

.word-block-pinyin {
  font-size: 0.7em;
  margin: 0 0.2rem;
  opacity: 0.7;
}

.word-block-definition {
  display: none;
  color: #aaa;
  font-size: 0.7em;
  font-style: italic;
  margin-top: 0.5em;
  max-width: 6rem;
  margin: 0 0.5em 0.2em 0.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.show-pinyin-for-saved {
  .word-block:hover:not(.saved) {
    .word-block-pinyin {
      display: inherit;
      position: absolute;
      top: -1.25em;
      left: 50%;
      margin-left: -5em;
      width: 10em;
    }
  }
  .word-block.saved {
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    .word-block-pinyin {
      display: block;
    }
  }
}

.tooltip-images {
  margin-bottom: 0.5rem;
  display: flex;
  img {
    flex: 1;
    height: 4rem;
    width: auto;
    margin: 0 0.2rem;
  }
}

.tooltip-entry {
  color: #666;
}

.tooltip-entry + .tooltip-entry {
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.tooltip {
  display: block !important;

  .tooltip-inner {
    border-radius: 1rem;
    text-align: left;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
  }

  &[x-placement^='top'] {
    margin-bottom: 1rem;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='right'] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^='left'] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }

  &.popover {
    $color: white;
    border: none;

    .popover-inner {
      overflow: scroll;
      max-height: 15rem;
      min-width: 20rem;
      background: $color;
      color: black;
      padding: 1rem;
      border-radius: 5px;
      box-shadow: 0 5px 20px rgba(black, 0.2);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>
