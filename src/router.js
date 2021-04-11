import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  mode: 'history',
  routes: [
    {
      path: '/:l1/:l2',
      name: 'home',
      props: true,
      component: () => import('./views/Home.vue'),
      meta: {
        title: 'Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn from Zero and progress to Fluency.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/learning-path',
      name: 'learning-path',
      props: true,
      component: () => import('./views/LearningPath.vue'),
      meta: {
        title: 'Learning Path | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'A visual representation of how you can achive langauge fluency, from zero to hero.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/online-courses',
      name: 'courses',
      component: () => import('./views/Courses.vue'),
      props: true,
      meta: {
        title: 'Online Courses | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Achieve fluent communication and outstanding results. Engaging, comprehensive and structured courses at all CEFR levels. Learning is hard work, but it should never be boring, so we designed our courses to be concise yet fun and engaging.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/transfer',
      name: 'transfer',
      component: () => import('./views/Transfer.vue'),
      props: true,
      meta: {
        title: 'Transfer Purchases | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Transfer your purchases from Teachable to Duanshu.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/video-count',
      name: 'video-count',
      component: () => import('./views/VideoCount.vue'),
      props: true,
      meta: {
        title: 'Video Count | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'See the latest stats on how many videos are there in our courses.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/pricing/:currency?',
      name: 'pricing',
      component: () => import('./views/Pricing.vue'),
      props: true,
      meta: {
        title: 'Pricing | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'No subscription required. Pay once, own the courses forever. Wallet Friendly Pricing.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/course-release-schedule',
      name: 'course-release-schedule',
      component: () => import('./views/ReleaseSchedule.vue'),
      props: true,
      meta: {
        title: 'Course Release Schedule | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'We regularly update our courses. Here’s what we are planning on this year.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/textbooks-workbooks',
      name: 'textbooks-workbooks',
      component: () => import('./views/Textbooks.vue'),
      props: true,
      meta: {
        title:
          'Course Textbooks and Workbooks | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'We regularly update our courses. Here’s what we are planning on this year.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/dictionary/:method?/:args?',
      name: 'dictionary',
      props: true,
      component: () => import('./views/Dictionary.vue'),
      meta: {
        title: 'Dictionary | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Look up and learn words.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/phrase/:method?/:args?',
      name: 'phrase',
      component: () => import('./views/Phrase.vue'),
      props: true,
      meta: {
        title: 'Phrase | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'See how phrases are used in real context..'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/idioms/:method?/:args?',
      name: 'idioms',
      component: () => import('./views/Idioms.vue'),
      props: true,
      meta: {
        title: 'Idioms | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn idioms (成语 chéngyǔ).'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/separable/:method?/:args?',
      name: 'separable',
      component: () => import('./views/Separable.vue'),
      props: true,
      meta: {
        title: 'Separable Words | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'verbs that are separable (离合词 líhécí).'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore',
      name: 'explore',
      redirect: '/:l1/:l2/explore/levels'
    },
    {
      path: '/:l1/:l2/explore/roots/:arg?',
      name: 'explore-roots',
      component: () => import('./views/Roots.vue'),
      meta: {
        title: 'Roots | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Learn some common word-building patterns.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/characters',
      name: 'characters',
      component: () => import('./views/Characters.vue'),
      meta: {
        title: 'Characters | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Chinese characters by HSK level.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/radicals',
      name: 'radicals',
      component: () => import('./views/Radicals.vue'),
      meta: {
        title: 'Radicals | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Chinese character radicals.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore/related/:arg?',
      name: 'explore-related',
      component: () => import('./views/Related.vue'),
      meta: {
        title: 'Related Words | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'For any given word, find words related ot it.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore/topics',
      name: 'explore-topics',
      component: () => import('./views/Topics.vue'),
      meta: {
        title: 'Words by Topic | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Explore new words by topics'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/pinyin-list',
      name: 'pinyin',
      component: () => import('./views/PinyinList.vue'),
      meta: {
        title: 'Pinyin List | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Get a list of pinyin transcriptions for the list of words you provide.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/grammar',
      name: 'grammar',
      component: () => import('./views/Grammar.vue'),
      meta: {
        title: 'Grammar Cheatsheet | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'The succint and comprehensive grammar chart, following the Standard Course textbook.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/grammar/view/:id',
      name: 'grammar-view',
      props: true,
      component: () => import('./views/GrammarView.vue'),
      meta: {
        title: 'Grammar Note | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Check out this grammar point.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore/levels',
      name: 'levels',
      component: () => import('./views/Levels.vue'),
      meta: {
        title: 'Words by Level | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn words by levels (levels 1 to 6).'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore/new-levels',
      name: 'new-levels',
      component: () => import('./views/NewLevels.vue'),
      meta: {
        title: 'Words in the New HSK 3.0 | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'List words in the New HSK 3.0 (starting 2021–2025?) levels.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/explore/new-levels-graphic',
      name: 'new-levels-graphic',
      component: () => import('./views/NewLevelsGraphic.vue'),
      meta: {
        title: 'Words in the New HSK 3.0 Visualized | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'List words in the New HSK 3.0 (starting 2021–2025?) levels.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/compare/:method/:args',
      name: 'compare',
      component: () => import('./views/Compare.vue'),
      meta: {
        title: 'Compare | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Compare two words and see how they are used differently.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/saved-words',
      name: 'saved-words',
      component: () => import('./views/SavedWords.vue'),
      meta: {
        title: 'Saved Words | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Study, manage, import, export the words you saved.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/library',
      name: 'library',
      component: () => import('./views/Library.vue'),
      props: true,
      meta: {
        title: 'Library | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/reader/:method?/:arg?',
      name: 'reader',
      component: () => import('./views/Reader.vue'),
      meta: {
        title: 'Reader | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read text with annotation and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/studysheet/',
      name: 'studysheet',
      component: () => import('./views/StudySheetCreator.vue'),
      meta: {
        title: 'Language Study Sheet Creator | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Generate guided readers for language learning.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/book/chapter',
      name: 'book-chapter',
      component: () => import('./views/BookChapter.vue'),
      props: route => ({ args: route.query.url }),
      meta: {
        title: 'Book Chapter | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/book/index',
      name: 'book-index',
      component: () => import('./views/BookIndex.vue'),
      props: route => ({ args: route.query.url }),
      meta: {
        title: 'Book | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/book/list',
      name: 'book-list',
      component: () => import('./views/BookList.vue'),
      props: route => ({ args: route.query.url }),
      meta: {
        title: 'Books | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/hero-academy',
      name: 'hero-academy',
      component: () => import('./views/HeroAcademy.vue'),
      props: true,
      meta: {
        title: 'Hero Academy | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn by learning subject matters in the target language.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/lesson-videos/:level?/:lesson?',
      name: 'lesson-videos',
      component: () => import('./views/LessonVideos.vue'),
      props: true,
      meta: {
        title: 'Extra Lesson Videos | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Reinforce the vocabulary you learned in an HSK lesson by watching YouTube videos.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/search-subs',
      name: 'subs-search',
      component: () => import('./views/SearchSubs.vue'),
      props: true,
      meta: {
        title: 'Search Subtitles | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Search subtitles across the saved YouTube videos (like YouGlish).'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/assign-lesson-videos/:level/:lesson',
      name: 'assign-lesson-videos',
      component: () => import('./views/AssignLessonVideos.vue'),
      props: true,
      meta: {
        title: 'Lesson Videos | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Assign videos to enforce lesson vocabulary.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/music/:method?/:args?',
      name: 'music',
      component: () => import('./views/Music.vue'),
      props: true,
      meta: {
        title: 'Music | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn through music.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/search/:term?/:start?',
      name: 'youtube-search',
      component: () => import('./views/YouTubeSearch.vue'),
      props: true,
      meta: {
        title: 'YouTube Reader | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/view/:args?/:lesson?',
      name: 'youtube-view',
      component: () => import('./views/YouTubeView.vue'),
      props: true,
      meta: {
        title: 'YouTube Reader | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/browse/:topic?/:level?',
      name: 'youtube-browse',
      component: () => import('./views/YouTubeBrowse.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/channel/:args?',
      name: 'youtube-channel',
      component: () => import('./views/YouTubeChannel.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/youtube/playlist/:args?',
      name: 'youtube-playlist',
      component: () => import('./views/YouTubePlaylist.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/articles',
      name: 'articles',
      redirect: '/:l1/:l2/articles/wiki/list'
    },
    {
      path: '/:l1/:l2/articles/wiki/:method?/:args?',
      name: 'articles-wiki',
      component: () => import('./views/Articles.vue'),
      meta: {
        title: 'Learning Wiki Articles | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read Wiki articles about grammar and language.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/community',
      name: 'community',
      redirect: '/:l1/:l2/community/list'
    },
    {
      path: '/:l1/:l2/community/:method?/:args?',
      name: 'community-reddit',
      component: () => import('./views/Community.vue'),
      props: true,
      meta: {
        title: 'Community | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Connect with various Chinese-learning communities.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/resource/list/:topic/:type',
      name: 'resources',
      component: () => import('./views/Resources.vue'),
      props: true,
      meta: {
        title: 'Resources | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'User voted Chinese-learning resources.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/cases/nouns/:args?',
      name: 'noun-cases',
      props: true,
      component: () => import('./views/NounCases.vue'),
      meta: {
        title: 'Learn Noun Cases | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn how to decline nouns.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/endings',
      name: 'endings',
      props: true,
      component: () => import('./views/Endings.vue'),
      meta: {
        title: 'Lookup Case Endings | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Figure out the dictionary form and case by looking up the ending.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/analyzer',
      name: 'analyzer',
      props: true,
      component: () => import('./views/Analyzer.vue'),
      meta: {
        title: 'Analyze Cases in Text | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Take a piece of text and figure out the case of each adjective + noun combo.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/articles/reddit/:method?/:args?',
      name: 'articles-reddit',
      component: () => import('./views/Reddit.vue'),
      props: true,
      meta: {
        title: 'Reddit Posts | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Read Reddit posts related to language.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/learn/:method?/:args?',
      name: 'learn',
      component: () => import('./views/Learn.vue'),
      meta: {
        title: 'Learn | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn words interactively by seeing how they are used.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/bookmarklet',
      name: 'bookmarklet',
      component: () => import('./views/Bookmarklet.vue'),
      props: true,
      meta: {
        title: 'Keyboard | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Read the target language with phonetic annotations using our bookmarklet.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/keyboard',
      name: 'keyboard',
      component: () => import('./views/Keyboard.vue'),
      props: true,
      meta: {
        title: 'Keyboard | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Type in the target language with this online keyboard.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/contact-us',
      name: 'contact',
      component: () => import('./views/Contact.vue'),
      props: true,
      meta: {
        title: 'Contact Us | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Get in touch with us.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/faq',
      name: 'faq',
      component: () => import('./views/FAQ.vue'),
      props: true,
      meta: {
        title: 'Frequently Asked Questions | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'We often hear these questions. Hopefully this page can answer yours.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/affiliate-program',
      name: 'affiliate-program',
      component: () => import('./views/Affiliate.vue'),
      props: true,
      meta: {
        title: 'Affiliate Program | Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Help us get the word out!'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/hall-of-heroes',
      name: 'hall-of-heroes',
      component: () => import('./views/HallOfHeroes.vue'),
      props: true,
      meta: {
        title: 'Hall of Heroes | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'In this page we showcase some of our students who have successfully passed language exams after taking courses from us! Read their testimonials and reviews.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/tutoring/:level?',
      name: 'tutoring',
      component: () => import('./views/Tutoring.vue'),
      props: true,
      meta: {
        title: 'Tutoring Kit | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Tools to help you get the most out of your online tutoring lessons.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/tutoring/lesson/:id',
      name: 'tutoring-lesson',
      component: () => import('./views/TutoringLesson.vue'),
      props: true,
      meta: {
        title: 'Tutoring Kit | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Tools to help you get the most out of your online tutoring lessons.'
          }
        ]
      }
    },
    {
      path: '/:l1/:l2/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
      meta: {
        title: 'Settings | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Change preferences: choose a different text corpus.'
          }
        ]
      }
    }
  ]
})
