<template>
  <div>
    <ul
      :class="{
        wordlist: true,
        'list-unstyled': true,
        collapsed: collapse > 0
      }"
      data-collapse-target
    >
      <li class="wordlist-item" v-for="word in words">
        <Star v-if="word && star === true" :word="word" class="mr-1"></Star>
        <a
          v-if="compareWith"
          :href="`#/${$lang.code}/compare/freedict/${compareWith.id},${word.id}`"
          class="btn btn-small mr-2"
          >Compare</a
        >
        <a v-if="word" :href="`#/${$lang.code}/dictionary/freedict/${word.id}`">
          <span
            class="wordlist-item-word ml-1"
            :data-level="word.level || 'outside'"
            >{{ word.accented }}</span
          >&nbsp;
          <span v-if="word.pronunciation" class="wordlist-item-pinyin">
            /{{ word.pronunciation }}/
          </span>
          <span v-if="word.definitions" class="wordlist-item-l1">
            {{ word.definitions.join(', ') }}
          </span>
        </a>
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
</style>
