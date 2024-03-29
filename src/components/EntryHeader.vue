<template>
  <!-- ANCHOR img/anchors/entry.png  -->
  <div class="entry-head-wrapper" v-if="entry">
    <div>
      <div>
        <button class="btn btn-small" v-if="entry.newHSK" @click="prevWord()">
          <i class="fa fa-caret-left" />
        </button>
        <span
          v-if="entry.level && entry.level !== 'outside' && $l2.code === 'zh'"
          class="entry-level p-1 rounded font-weight-bold"
          style="position: relative; bottom: 0.5em; font-size: 0.8em"
          :data-level="entry.level"
          >HSK {{ entry.level }}</span
        >
        <span
          v-if="entry.newHSK"
          class="entry-level p-1 rounded font-weight-bold"
          :style="`position: relative; bottom: 0.5em; font-size: 0.8em; color: ${
            entry.newHSK === '7-9' ? '#00716B' : 'inherit'
          }`"
          ><i class="fa fa-arrow-right mr-2" />New HSK {{ entry.newHSK }}
          <span
            v-if="entry.newHSKMatches.length === 1"
            style="color: #999; font-weight: normal"
            >#{{ entry.newHSKMatches[0].num }}</span
          ></span
        >
        <button class="btn btn-small" v-if="entry.newHSK" @click="nextWord()">
          <i class="fa fa-caret-right" />
        </button>
      </div>
      <Annotate tag="div" class="mt-1 mb-2" v-if="entry.counters"
        ><span
          >一{{
            entry.counters.map((counter) => counter.simplified).join('、一')
          }}
        </span></Annotate
      >
      <div class="entry-word-wrapper" style="display: inline-block">
        <div class="mb-2">
          <div class="entry-pinyin">
            <Star :word="entry"></Star>
            <span v-if="entry.pronunciation && !entry.pinyin" class="ml-2 mr-1"
              >/{{ entry.pronunciation }}/</span
            >
            <span
              v-if="['zh', 'ja', 'yue'].includes($l2.code)"
              class="ml-2 mr-1"
              >{{ entry.cjk.phonetics }}</span
            >
            <Speak
              class="ml-1"
              :text="entry.bare"
              :mp3="entry.audio"
              :wiktionary="entry.wiktionary"
            />
          </div>
        </div>
        <div>
          <router-link
            :to="`/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${entry.id}`"
          >
            <template v-if="['zh', 'yue'].includes($l2.code)">
              <span
                class="entry-word simplified"
                :data-level="
                  entry.newHSK && entry.newHSK === '7-9'
                    ? '7-9'
                    : entry.level || 'outside'
                "
                v-html="entry.simplified"
              ></span>
              <span
                class="entry-word traditional"
                :data-level="entry.level || 'outside'"
                v-html="entry.traditional"
              ></span>
            </template>
            <template v-else>
              <span
                class="entry-word"
                :data-level="entry.level || 'outside'"
                v-html="entry.accented"
              ></span>
            </template>
            <span
              v-if="
                entry.level && entry.level !== 'outside' && $l2.code !== 'zh'
              "
              class="entry-level p-1 rounded ml-2"
              style="position: relative; bottom: 0.5em"
              :data-bg-level="entry.level"
              >{{ entry.level }}</span
            >
          </router-link>
        </div>
        <div
          v-if="$l2.code === 'ko' && entry.cjk && entry.cjk.canonical"
          class="mt-1"
        >
          <span class="ml-2 entry-cjk">{{ entry.cjk.canonical }}</span>
        </div>
        <div
          v-if="
            ['zh', 'yue'].includes($l2.code) &&
            entry.simplified !== entry.traditional
          "
          class="mt-1"
        >
          <span class="ml-2 entry-cjk simplified">{{ entry.traditional }}</span>
          <span class="ml-2 entry-cjk traditional">{{ entry.simplified }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '@/lib/helper'

export default {
  props: {
    entry: {
      type: Object,
    },
    minimal: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      Helper,
    }
  },
  methods: {
    async nextWord() {
      if (this.entry.newHSK && this.entry.newHSK.includes('7-9')) {
        let match = this.entry.newHSKMatches.find(
          (match) => match.level === '7-9'
        )
        let newEntry = await (await this.$dictionary).getByNewHSK(
          '7-9',
          Math.min(Number(match.num) + 1),
          5635
        )
        this.$router.push({
          path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${newEntry.id}`,
        })
      }
    },
    async prevWord() {
      if (this.entry.newHSK && this.entry.newHSK.includes('7-9')) {
        let match = this.entry.newHSKMatches.find(
          (match) => match.level === '7-9'
        )
        let newEntry = await (await this.$dictionary).getByNewHSK(
          '7-9',
          Math.max(0, Number(match.num) - 1)
        )
        this.$router.push({
          path: `/${this.$l1.code}/${this.$l2.code}/dictionary/${this.$dictionaryName}/${newEntry.id}`,
        })
      }
    }
  }
}
</script>

<style lang="scss">
.entry-pinyin {
  font-size: 1.1rem;
}

.entry-word {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
  margin: 0.5rem 0;
}

.entry-hanja {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .entry-word {
    font-size: 3rem;
  }
}

.entry-word img {
  width: 4.8rem;
  border: 1px solid #ccc;
}

.entry-word-wrapper a {
  color: inherit;
  text-decoration: inherit;
}

.entry-head-wrapper {
  position: relative;
}

.entry-cjk {
  font-size: 1.5rem;
}
</style>
