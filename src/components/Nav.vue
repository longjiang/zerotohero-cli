<template>
  <nav class="tabs">
    <router-link
      v-if="$lang.options.features && $lang.options.features.includes('courses')"
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
      <i class="fas fa-graduation-cap"></i>{{$t('Courses')}}
    </router-link>
    <router-link
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
      title="Lookup and compare words"
    >
      <i class="fas fa-book"></i>{{ $t('Dictionary') }}
    </router-link>
    <router-link
      :class="{
        tab: true,
        'router-link-active':
          $route.name &&
          ($route.name.startsWith('book') ||
            $route.name === 'library' ||
            $route.name === 'reader')
      }"
      :to="{ name: 'reader' }"
      :title="`Improve your ${lang ? lang.name : ''} through reading`"
    >
      <i class="fas fa-book-open"></i>{{ $t('Reading') }}
    </router-link>
    <router-link
      :class="{
        tab: true,
        'router-link-active': $route.name && $route.name.startsWith('youtube')
      }"
      :to="{ name: 'youtube-browse' }"
      :title="`Learn ${lang ? lang.name : ''} with audio-visual material.`"
    >
      <i class="fas fa-video"></i>{{ $t('Audio-Visual') }}
    </router-link>
    <router-link 
      :class="{
        tab: true,
        'router-link-active': $route.name && 
          ($route.name === 'contact' ||
            $route.name === 'faq' ||
            $route.name === 'affiliate-program')
      }" :to="{ name: 'contact' }" title="Contact Us">
      <i class="fas fa-id-card"></i>{{ $t('Contact') }}
    </router-link>
    <router-link class="tab" :to="{ name: 'settings' }" title="Settings">
      <i class="fas fa-cog"></i>{{ $t('Settings') }}
    </router-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      lang: this.$lang
    }
  }
}
</script>

<style lang="scss">
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
