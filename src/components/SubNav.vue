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
      <router-link
        v-if="$l1.code === 'en' && $l2.code === 'zh'"
        class="secondary-menu-item"
        :to="{ name: 'video-count' }"
      >
        <i class="fas fa-list-ol"></i>
        {{$t('Video Count')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'pricing' }">
        <i class="fas fa-tag"></i>
        {{$t('Pricing')}}
      </router-link>
      <router-link
        v-if="$l1.code === 'zh' && $l2.code === 'en'"
        class="secondary-menu-item"
        :to="{ name: 'transfer' }"
      >
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
            $route.name === 'idioms' ||
            $route.name === 'separable' ||
            $route.name === 'learn' ||
            $route.name === 'saved-words' ||
            $route.name.startsWith('explore') ||
            $route.name === 'pinyin-list')
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'dictionary' }">
        <i class="fas fa-font"></i>
        {{$t('Look Up Words')}}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'phrase' }">
        <i class="fas fa-quote-left" />
        {{$t('Look Up Phrases')}}
      </router-link>
      <router-link
        v-if="$hasFeature('levels')"
        class="secondary-menu-item"
        :to="{ name: 'levels' }"
      >
        <i class="fa fa-signal" />Words by Level
      </router-link>
      <router-link v-if="$l2.code === 'zh'" class="secondary-menu-item" :to="{ name: 'idioms' }">
        <i class="fa fa-border-all" />Idioms
      </router-link>
      <router-link v-if="$l2.code === 'zh'" class="secondary-menu-item" :to="{ name: 'separable' }">
        <i class="fa fa-angle-double-right" />Separables
      </router-link>
      <router-link
        v-if="$hasFeature('roots')"
        class="secondary-menu-item"
        :to="{ name: 'explore-roots' }"
      >
        <i class="fab fa-pagelines" />Roots
      </router-link>
      <router-link
        v-if="$hasFeature('explore-topics')"
        class="secondary-menu-item"
        :to="{ name: 'explore-topics' }"
      >
        <i class="fas fa-certificate" />Topics
      </router-link>
      <router-link
        v-if="$hasFeature('related')"
        class="secondary-menu-item"
        :to="{ name: 'explore-related' }"
      >
        <i class="fas fa-expand-arrows-alt" />Related
      </router-link>
      <router-link v-if="$hasFeature('learn')" class="secondary-menu-item" :to="{ name: 'learn' }">
        <i class="fa fa-chalkboard" />Learn
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'saved-words' }">
        <i class="fas fa-star"></i>
        {{$t('Saved')}}
        <span class="saved-words-count" v-cloak>{{ savedWordsCount() }}</span>
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        $route.name &&
          ($route.name.startsWith('youtube') ||
            $route.name === 'hero-academy' ||
            $route.name === 'music')
      "
    >
      <router-link class="secondary-menu-item" :to="{ name: 'youtube-browse' }">
        <i class="fab fa-youtube" />
        {{ $t('YouTube Transcript') }}
      </router-link>
      <router-link
        v-if="$hasFeature('hero-academy')"
        class="secondary-menu-item"
        :to="{ name: 'hero-academy' }"
      >
        <i class="fas fa-school" />Hero Academy
      </router-link>
      <router-link v-if="$hasFeature('music')" class="secondary-menu-item" :to="{ name: 'music' }">
        <i class="fas fa-music" />Music Video Lyrics
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        ($route.name &&
          ($route.name.startsWith('book-') || $route.name === 'library')) ||
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
        $route.name &&
          ($route.name === 'grammar' || $route.name === 'noun-cases' || $route.name === 'analyzer' || $route.name === 'endings')"
    >
      <router-link
        v-if="$hasFeature('grammar')"
        class="secondary-menu-item"
        :to="{ name: 'grammar' }"
        title="A concise list of grammar points."
      ><i class="fas fa-list-ul"></i> Grammar Cheat Sheet</router-link>
      <router-link
        v-if="$hasFeature('noun-cases')"
        class="secondary-menu-item"
        :to="{ name: 'noun-cases' }"
        title="Learn how to decline nouns."
      ><i class="fas fa-dice-two"></i> Noun Cases</router-link>
      <router-link
        v-if="$hasFeature('analyzer')"
        class="secondary-menu-item"
        :to="{ name: 'analyzer' }"
        title="Take a piece of text and figure out the case of each adjective + noun combo."
      ><i class="fas fa-dice-two"></i> Case Analyzer</router-link>
      <router-link
        v-if="$hasFeature('endings')"
        class="secondary-menu-item"
        :to="{ name: 'endings' }"
        title="Figure out the dictionary form and case by looking up the ending."
      ><i class="fas fa-dice-two"></i> Case Ending Lookup</router-link>
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
      <router-link class="secondary-menu-item" :to="{ name: 'faq' }" v-if="$hasFeature('courses')">
        <i class="fas fa-question"></i>
        {{$t('FAQ')}}
      </router-link>
      <router-link
        class="secondary-menu-item"
        :to="{ name: 'affiliate-program' }"
        v-if="$hasFeature('courses')"
      >
        <i class="fas fa-share-alt"></i>
        {{$t('Affiliate Program')}}
      </router-link>
    </nav>

    <nav
      class="secondary-menu text-center"
      v-if="
        ['resources', 'tutoring', 'tutoring-lesson', 'articles-wiki', 'reddit', 'articles-reddit', 'learning-path'].includes($route.name)
      "
    >
      <router-link
        class="secondary-menu-item"
        :to="`/${$l1.code}/${$l2.code}/resource/list/all/all`"
      >
        <i class="fas fa-gem"></i>
        {{ $t('Resources') }}
      </router-link>
      <router-link
        class="secondary-menu-item"
        :to="{name: 'learning-path'}"
      >
        <i class="fas fa-road"></i>
        {{ $t('Learning Path') }}
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'tutoring' }">
        <i class="fas fa-folder"></i>
        {{ $t('Tutoring Kit') }}
      </router-link>
      <router-link
        class="secondary-menu-item"
        :to="{ name: 'articles-reddit' }"
      >
        <i class="fab fa-reddit" />Reddit Articles
      </router-link>
      <router-link class="secondary-menu-item" :to="{ name: 'articles-wiki' }">
        <i class="fab fa-wikipedia-w" />{{ $l2.name }} Learning Wiki
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    savedWordsCount() {
      let count = this.$store.getters.savedWordCount({ l2: this.$l2.code })
      // eslint-disable-next-line vue/no-parsing-error
      return count < 100 ? count : '99+'
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
