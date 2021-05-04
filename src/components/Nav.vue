<template>
  <div
    class="container-fluid sticky"
    style="z-index: 3"
    :set="
      (parent = menu.find(
        (item) =>
          $route.name === item.name ||
          $route.path.includes($router.resolve({ name: item.name }).href) ||
          (item.children &&
            item.children.map((child) => child.name).includes($route.name))
      ))
    "
  >
    <div class="row">
      <nav class="site-nav tabs">
        <router-link
          v-for="item in menu.filter((item) => item.show)"
          :class="{
            tab: true,
            'router-link-active': parent && parent.name === item.name,
          }"
          :to="last(item) || { name: item.name }"
          :title="item.title"
          :key="`nav-${item.name}`"
        >
          <i :class="item.icon"></i>
          {{ $t(item.title) }}
        </router-link>
      </nav>
    </div>

    <div class="row">
      <nav class="secondary-menu text-center bg-white pt-3" v-if="parent">
        <router-link
          class="secondary-menu-item"
          v-for="child in parent.children.filter((child) => child.show)"
          :key="`subnav-${child.name}`"
          :to="{ name: child.name }"
        >
          <i :class="child.icon"></i>
          {{ $t(child.title) }}
          <span
            class="saved-words-count"
            v-cloak
            v-if="child.name === 'saved-words'"
            >{{ savedWordsCount() }}</span
          >
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      l2: this.$l2,
      menu: [
        {
          name: 'courses',
          icon: 'fas fa-graduation-cap',
          title: 'Courses',
          show: this.$hasFeature('courses'),
          children: [
            {
              name: 'courses',
              title: 'Language Courses',
              icon: 'fas fa-chalkboard-teacher',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'textbooks-workbooks',
              title: 'Textbooks',
              icon: 'fas fa-book',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'video-count',
              title: 'Video Count',
              icon: 'fas fa-list-ol',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'pricing',
              title: 'Pricing',
              icon: 'fas fa-tag',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'course-release-schedule',
              title: 'Schedule',
              icon: 'fas fa-clock',
              show: this.$l2.code === 'zh',
            },
          ],
        },
        {
          name: 'hall-of-heroes',
          icon: 'fa fa-trophy',
          title: 'Heroes',
          show: this.$l1.code === 'en' && this.$l2.code === 'zh',
          children: [],
        },
        {
          name: 'youtube-browse',
          icon: 'fas fa-video',
          title: 'Audio-Visual',
          show: this.$hasFeature('youtube'),
          children: [
            {
              name: 'youtube-browse',
              title: 'YouTube',
              icon: 'fab fa-youtube',
              show: true,
            },
            {
              name: 'tv-shows',
              icon: 'fa fa-tv',
              title: 'TV Shows',
              show: ['zh', 'ja'].includes(this.$l2.code),
            },
            {
              name: 'lesson-videos',
              title: 'Lesson Expansion',
              icon: 'fa fa-chalkboard-teacher',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'youtube-view',
              show: false,
            },
          ],
        },
        {
          name: 'dictionary',
          icon: 'fas fa-book',
          title: 'Dictionary',
          show: this.$hasFeature('dictionary'),
          children: [
            {
              name: 'dictionary',
              icon: 'fas fa-font',
              title: 'Look Up',
              show: this.$hasFeature('dictionary'),
            },
            {
              name: 'compare',
              show: false
            },
            {
              name: 'saved-words',
              icon: 'fas fa-star',
              title: 'Saved',
              show: true
            },
            {
              name: 'phrase',
              icon: 'fas fa-quote-left',
              title: 'Phrase',
              show: true,
            },
            {
              name: 'levels',
              icon: 'fa fa-signal',
              title: 'HSK',
              show: this.$hasFeature('levels'),
            },
            {
              name: 'new-levels',
              icon: 'fa fa-signal',
              title: 'New HSK',
              show: this.$hasFeature('levels'),
            },
            {
              name: 'radicals',
              icon: 'fa fa-code-branch',
              title: 'Radicals',
              show: this.$hasFeature('radicals'),
            },
            {
              name: 'characters',
              icon: 'fa fa-pen-alt',
              title: 'Characters',
              show: this.$hasFeature('characters'),
            },
            {
              name: 'idioms',
              icon: 'fa fa-border-all',
              title: 'Idioms',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'separable',
              icon: 'fa fa-angle-double-right',
              title: 'Separables',
              show: this.$l2.code === 'zh',
            },
            {
              name: 'explore-roots',
              icon: 'fa fa-wrench',
              title: 'Word Builder',
              show: this.$hasFeature('roots'),
            },
            {
              name: 'explore-topics',
              icon: 'fas fa-certificate',
              title: 'Topics',
              show: this.$hasFeature('explore-topics'),
            },
            {
              name: 'explore-related',
              icon: 'fas fa-expand-arrows-alt',
              title: 'Related',
              show: this.$hasFeature('related'),
            },
            {
              name: 'learn',
              icon: 'fa fa-chalkboard',
              title: 'Learn',
              show: this.$hasFeature('learn'),
            },
          ],
        },
        {
          name: 'reader',
          icon: 'fas fa-book-open',
          title: 'Reading',
          show:
            this.$hasFeature('dictionary') ||
            this.$hasFeature('transliteration'),
          children: [
            {
              name: 'reader',
              title: 'Text Reader',
              icon: 'fas fa-file-alt',
              show: true,
            },
            {
              name: 'studysheet',
              title: 'Study Sheet Creator',
              icon: 'fas fa-print',
              show: true,
            },
            {
              name: 'library',
              title: 'Library',
              icon: 'fas fa-book-open',
              show: true,
            },
          ],
        },
        {
          name: 'grammar',
          icon: 'fas fa-list-ul',
          title: 'Grammar',
          show: this.$hasFeature('grammar'),
          children: [
            {
              name: 'grammar',
              icon: 'fas fa-list-ul',
              title: 'Grammar Cheat Sheet',
              show: this.$hasFeature('grammar'),
            },
            {
              name: 'grammar-view',
              show: false,
            },
          ],
        },
        {
          name: 'noun-cases',
          icon: 'fas fa-list-ul',
          title: 'Grammar Tools',
          show: this.$hasFeature('noun-cases'),
          children: [],
        },
        {
          name: 'keyboard',
          icon: 'fas fa-keyboard',
          title: 'Keyboard',
          show: this.$hasFeature('keyboard'),
          children: [],
        },
        {
          name: 'bookmarklet',
          icon: 'fas fa-bookmark',
          title: 'Bookmarklet',
          show: this.$hasFeature('bookmarklet'),
          children: [],
        },
        {
          name: 'resources',
          icon: 'fas fa-gem',
          title: 'Resources',
          show: true,
          children: [
            {
              name: 'resources',
              title: 'Resources',
              icon: 'fas fa-gem',
              show: true,
            },
            {
              name: 'learning-path',
              title: 'Learning Path',
              icon: 'fas fa-road',
              show: true,
            },
            {
              name: 'tutoring',
              title: 'Tutoring Kit',
              icon: 'fas fa-folder',
              show: true,
            },
            {
              name: 'articles-reddit',
              title: 'Reddit Articles',
              icon: 'fab fa-reddit',
              show: true,
            },
            {
              name: 'articles-wiki',
              title: 'Wiki',
              icon: 'fab fa-wikipedia-w',
              show: true,
            },
          ],
        },
        {
          name: 'contact',
          icon: 'fas fa-id-card',
          title: 'Contact',
          show: ['en', 'zh'].includes(this.$l2.code),
          children: [],
        },
        {
          name: 'settings',
          icon: 'fas fa-cog',
          title: 'Settings',
          show: true,
          children: [],
        },
      ],
      history: [],
    }
  },
  methods: {
    last(item) {
      if (item) {
        let historyMatches = this.history.filter((path) => {
          if (path) {
            let r = this.$router.resolve(path)
            if (r && r.route) {
              let childNames = item.children
                ? item.children.map((child) => child.name)
                : []
              return childNames.includes(r.route.name)
            }
          }
        })
        let path = historyMatches.pop()
        return path
      } else {
        return false
      }
    },
    savedWordsCount() {
      let count = this.$store.getters.savedWordCount({ l2: this.$l2.code })
      // eslint-disable-next-line vue/no-parsing-error
      return count < 100 ? count : '99+'
    },
  },
  watch: {
    $route() {
      this.history.push(this.$route.path)
    },
  },
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
  width: 100vw;
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
