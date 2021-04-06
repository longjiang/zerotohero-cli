<template>
  <div>
    <ul
      :class="classes()"
      data-collapse-target
    >
      <li :class="{
        'wordlist-item': true,
        'matched': matchedWords && matchedWords.map(word => word.id).includes(word.id)
        }" v-for="word in words">
        <Star v-if="word && star === true" :word="word" class="mr-1"></Star>
        <router-link
          v-if="compareWith"
          :to="`/${$l1.code}/${$l2.code}/compare/${$dictionaryName}/${compareWith.id},${word.id}`"
          class="btn btn-small mr-2"
          >Compare</router-link
        >
        <router-link v-if="word" :to="`/${$l1.code}/${$l2.code}/dictionary/${$dictionaryName}/${word.id}`">
          <span
            class="wordlist-item-word ml-1"
            :data-level="word.level || 'outside'"
            >{{ word.accented }}</span
          >&nbsp;
          <span v-if="word.pronunciation" class="wordlist-item-pinyin">
            /{{ word.pronunciation }}/
          </span>
          <span v-if="word.definitions" class="wordlist-item-l1">
            {{ word.definitions.filter(def => !def.startsWith('CL')).join(', ') }}
          </span>
        </router-link>
      </li>
      <li class="wordlist-item" v-for="text in texts">
        <Star v-if="text && star === true" :text="text" class="mr-1"></Star>
        <span class="wordlist-item-word ml-1" data-level="outside">{{
          text
        }}</span>
      </li>
    </ul>
    <ShowMoreButton
      v-if="collapse > 0"
      :length="words.length"
      :min="collapse"
    />
  </div>
</template>
<script>
import Helper from '@/lib/helper'

export default {
  data() {
    return {
      Helper
    }
  },
  props: {
    words: {
      type: Array
    },
    texts: {
      type: Array
    },
    matchedWords: {
      default: undefined
    },
    compareWith: {
      default: false
    },
    traditional: {
      default: false
    },
    highlight: {
      default: false
    },
    collapse: {
      default: 0
    },
    star: {
      default: true
    },
    level: {
      default: false
    }
  },
  methods: {
    classes() {
      let classes = {
        wordlist: true,
        'list-unstyled': true,
        collapsed: this.collapse > 0
      }
      classes[`collapse-${this.collapse}`] = true
      return classes
    }
  }
}
</script>

<style>
.wordlist-item a {
  color: inherit;
}

.wordlist-item a:hover {
  text-decoration: none;
}

.wordlist-item-word {
  font-weight: bold;
  font-size: 1.4em;
}

.wordlist-item-l1 {
  font-style: italic;
  color: #aaa;
}

.wordlist-item.matched {
  opacity: 0.2
}
</style>
