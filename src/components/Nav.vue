<template>
  <nav class="site-nav tabs">
    <router-link
      v-if="$hasFeature('courses')"
      :class="{
        tab: true,
        'router-link-active':
          $route.name === 'courses' ||
          $route.name === 'textbooks-workbooks' ||
          $route.name === 'video-count' ||
          $route.name === 'pricing' ||
          $route.name === 'course-release-schedule'
      }"
      :to="{ name: 'courses' }"
      title="Courses"
    >
      <i class="fas fa-graduation-cap"></i>
      {{$t('Courses')}}
    </router-link>
    <router-link
      v-if="$l1.code === 'en' && $l2.code === 'zh'"
      class="tab"
      :to="{ name: 'hall-of-heroes' }"
      title="Hall of Heroes"
    >
      <i class="fa fa-trophy" />Heroes
    </router-link>
    <router-link
      v-if="$hasFeature('youtube')"
      :class="{
        tab: true,
        'router-link-active': $route.name && $route.name.startsWith('youtube') ||
          $route.name === 'hero-academy' ||
          $route.name === 'music'
      }"
      :to="{ name: 'youtube-browse' }"
      :title="`Learn ${l2 ? l2.name : ''} with audio-visual material.`"
    >
      <i class="fas fa-video"></i>
      {{ $t('Audio-Visual') }}
    </router-link>
    <router-link
      v-if="$hasFeature('dictionary')"
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          ($route.name === 'dictionary' ||
            $route.name === 'compare' ||
            $route.name === 'phrase' ||
            $route.name === 'levels' ||
            $route.name.startsWith('explore') ||
            $route.name === 'learn' ||
            $route.name === 'saved-words')
      }"
      :to="{ name: 'dictionary' }"
      title="Look up and compare words"
    >
      <i class="fas fa-book"></i>
      {{ $t('Dictionary') }}
    </router-link>
    <router-link
      v-if="$hasFeature('dictionary') || $hasFeature('transliteration')"
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          ($route.name.startsWith('book-') ||
            $route.name === 'library' ||
            $route.name === 'reader')
      }"
      :to="{ name: 'reader' }"
      :title="`Improve your ${l2 ? l2.name : ''} through reading`"
    >
      <i class="fas fa-book-open"></i>
      {{ $t('Reading') }}
    </router-link>
    <router-link
      v-if="$hasFeature('grammar')"
      class="tab"
      :to="{ name: 'grammar' }"
      title="Grammar cheatsheet"
    >
      <i class="fas fa-list-ul"></i>Grammar
    </router-link>
    <router-link
      v-if="$hasFeature('noun-cases')"
      :class="{
        tab: true,
        'router-link-active': $route.name && $route.name === 'noun-cases' ||
          $route.name === 'analyzer' ||
          $route.name === 'endings'
      }"
      :to="{ name: 'noun-cases' }"
      title="Grammar tools."
    >
      <i class="fas fa-list-ul"></i>Grammar
    </router-link>
    <router-link
      v-if="$hasFeature('keyboard')"
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          $route.name === 'keyboard'
      }"
      :to="{ name: 'keyboard' }"
      :title="`Type in ${l2 ? l2.name : ''} using this online keyboard`"
    >
      <i class="fas fa-keyboard"></i>
      {{ $t('Keyboard') }}
    </router-link>
    <router-link
      v-if="$hasFeature('bookmarklet')"
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          $route.name === 'bookmarklet'
      }"
      :to="{ name: 'bookmarklet' }"
      :title="`Read ${l2 ? l2.name : ''} with phonetic annotations using our bookmarklet.`"
    >
      <i class="fas fa-bookmark"></i>
      {{ $t('Bookmarklet') }}
    </router-link>
    <router-link
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          ['resources', 'tutoring', 'tutoring-lesson', 'articles-wiki', 'reddit', 'articles-reddit', 'learning-path'].includes($route.name)
      }"
      :to="`/${$l1.code}/${$l2.code}/resource/list/all/all`"
      :title="`Resources for learning ${l2 ? l2.name : 'the language'}.`"
    >
      <i class="fas fa-gem"></i>
      {{ $t('Resources') }}
    </router-link>
    <router-link
      :class="{
        tab: true,
        'router-link-active': $route.name && 
          ($route.name === 'contact' ||
            $route.name === 'faq' ||
            $route.name === 'affiliate-program')
      }"
      v-if="['en', 'zh'].includes($l2.code)"
      :to="{ name: 'contact' }"
      title="Contact Us"
    >
      <i class="fas fa-id-card"></i>
      {{ $t('Contact') }}
    </router-link>
    <router-link class="tab" :to="{ name: 'settings' }" title="Settings">
      <i class="fas fa-cog"></i>
      {{ $t('Settings') }}
    </router-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      l2: this.$l2
    }
  }
}
</script>

<style lang="scss">

.site-nav {
  margin: 0 auto;
}

.tabs {
  a svg,
  a i {
    margin-right: 0.5rem;
  }
}

.tabs {
  white-space: nowrap;
  overflow: scroll;
  overflow-y: hidden;
}

.tab {
  padding: 0.5rem 1rem;
  border-radius: 0.3rem 0.3rem 0 0;
  color: white;
  display: inline-block;
  margin-right: 0.2rem;
  border: none;
}

.tab.router-link-active,
.tab:hover {
  color: #fd4f1c;
  background: white;
  text-decoration: none;
}

.tab-saved-words.router-link-active,
.tab-saved-words:hover {
  color: #f8b61e;
}

.tab-saved-words-count[v-cloak] {
  display: none;
}

.tab-saved-words.router-link-active .tab-saved-words-count,
.tab-saved-words:hover .tab-saved-words-count {
  background: #f8b61e;
  color: white;
}
</style>
