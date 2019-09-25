<template>
  <!-- ANCHOR img/anchors/entry.png  -->
  <div class="entry-head-wrapper" v-if="entry">
    <div>
      <div class="entry-word-wrapper" style="display:inline-block">
        <div class="mb-2">
          <div class="entry-pinyin">
            <Star :word="entry"></Star>
            <span v-if="entry.pronunciation" class='ml-2 mr-1'>/{{ entry.pronunciation }}/</span>
            <span v-if="['zh', 'ja'].includes($l2.code)" class="ml-2 mr-1">{{ entry.cjk.phonetics }}</span>
            <Speak class="ml-1" :text="entry.bare" :mp3="entry.audio" />
          </div>
        </div>
        <div>
          <a :href="`#/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${entry.bare}`">
            <span
              class="entry-word"
              :data-level="entry.level || 'outside'"
              v-html="entry.accented"
            ></span>
            <span
              v-if="entry.level"
              class="entry-level p-1 rounded ml-2"
              style="position: relative; bottom: 0.5em"
              :data-bg-level="entry.level"
              >{{ entry.level }}</span
            >
          </a>
        </div>
        <div v-if="$l2.code === 'ko' && entry.cjk && entry.cjk.canonical" class="mt-1">
          <span class="ml-2 entry-cjk">{{ entry.cjk.canonical }}</span>
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
      type: Object
    },
    minimal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Helper
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

.entry-cjk{
  font-size: 1.5rem;
}
</style>
