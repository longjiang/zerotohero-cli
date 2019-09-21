<template>
  <div>
    <nav
      class="secondary-menu text-center"
      v-if="
        $route.name === 'courses' ||
          $route.name === 'video-count' ||
          $route.name === 'pricing' ||
          $route.name === 'course-release-schedule' ||
          $route.name === 'textbooks-workbooks' ||
          $route.name === 'transfer'
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'courses' }">
        <i class="fas fa-chalkboard-teacher"></i>
        {{ $t('Language Courses')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'textbooks-workbooks' }">
        <i class="fas fa-book"></i>
        {{$t('Textbooks')}}
      </router-link>
      <!-- <router-link class="secondary-menu-item" :to="{ name: 'video-count' }">
        <i class="fas fa-list-ol"></i>{{$t('Video Count')}}
      </router-link>-->
      <router-link class="secondary-menu-item" :to="{ name: 'pricing' }">
        <i class="fas fa-tag"></i>
        {{$t('Pricing')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'transfer' }">
        <i class="fas fa-exchange-alt"></i>
        {{ $t('Transfer Purchases')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'course-release-schedule' }">
        <i class="fas fa-clock"></i>
        {{$t('Schedule')}}
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        $route.name &&
          ($route.name === 'dictionary' ||
            $route.name === 'compare' ||
            $route.name === 'phrase' ||
            $route.name === 'levels' ||
            $route.name === 'learn' ||
            $route.name === 'saved-words' ||
            $route.name.startsWith('explore'))
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'dictionary' }">
        <i class="fas fa-font"></i>
        {{$t('Lookup Words')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'phrase' }">
        <i class="fas fa-quote-left" />Lookup Phrases
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'saved-words' }">
        <i class="fas fa-star"></i>
        {{$t('Saved')}}
        <span class="saved-words-count" v-cloak>{{ savedWordsCount() }}</span>
      </router-link>
    </nav>

    <nav class="secondary-menu text-center" v-if="$route.name && $route.name.startsWith('youtube')">
      <router-link class="secondary-menu-item" :to="{ name: 'youtube-browse' }">
        <i class="fab fa-youtube"></i>
        {{ $t('YouTube Transcript') }}
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        ($route.name &&
          ($route.name.startsWith('book') || $route.name === 'library')) ||
          $route.name === 'reader'
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'reader' }">
        <i class="fas fa-file-alt"></i>
        {{$t('Text Reader')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'library' }">
        <i class="fas fa-book-open"></i>
        {{$t('Library')}}
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        $route.name === 'contact' ||
          $route.name === 'faq' ||
          $route.name === 'affiliate-program'
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'contact' }">
        <i class="fas fa-id-card"></i>
        {{$t('Contact Us')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'faq' }">
        <i class="fas fa-question"></i>
        {{$t('FAQ')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'affiliate-program' }">
        <i class="fas fa-share-alt"></i>
        {{$t('Affiliate Program')}}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    savedWordsCount() {
      let count = this.$store.getters.savedWordCount({ lang: this.$lang.code })
      // eslint-disable-next-line vue/no-parsing-error
      return count < 100 ? count : '多'
    }
  }
}
</script>

<style scoped>
a svg,
a i {
  margin-right: 0.5rem;
}
.secondary-menu {
  white-space: nowrap;
  overflow: scroll;
  overflow-y: hidden;
  padding-left: 1rem;
  padding-right: 1rem;
}

.saved-words-count {
  background: #666;
  border-radius: 100%;
  font-size: 0.8rem;
  color: white;
  font-weight: bold;
  display: inline-block;
  width: 1.3rem;
  height: 1.3rem;
  line-height: 1.4rem;
  text-align: center;
  position: relative;
  top: -0.1rem;
}

.router-link-active .saved-words-count {
  color: #fd4f1c;
  background: white;
}

.secondary-menu-item {
  padding: 0.5rem 1rem;
  margin: 0.2rem;
  border-radius: 0.3rem;
  color: #666;
  display: inline-block;
}

.secondary-menu-item:hover {
  text-decoration: none;
  color: inherit;
  background-color: #f7f7f7;
}

.secondary-menu-item.router-link-active {
  background: #fd4f1c;
  color: white;
}
</style>
