import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home-redirect',
      redirect: `/zh` // defaulting to /zh if no language is set
    },
    {
      path: '/:lang',
      name: 'home',
      props: true,
      component: () => import('./views/Home.vue'),
      meta: {
        title: 'English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Learn English from Zero and progress to Fluency.'
          }
        ]
      }
    },
    {
      path: '/:lang/about-english-online-courses',
      name: 'courses',
      component: () => import('./views/Courses.vue'),
      props: true,
      meta: {
        title: 'Online Courses | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Achieve fluent communication and outstanding HSK results. Engaging, comprehensive and structured English courses at all CEFR levels. Learning is hard work, but it should never be boring, so we designed our courses to be concise yet fun and engaging.'
          }
        ]
      }
    },
    {
      path: '/:lang/transfer',
      name: 'transfer',
      component: () => import('./views/Transfer.vue'),
      props: true,
      meta: {
        title: 'Transfer Purchases | English Zero to Hero',
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
      path: '/:lang/video-count',
      name: 'video-count',
      component: () => import('./views/VideoCount.vue'),
      props: true,
      meta: {
        title: 'Video Count | English Zero To Hero',
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
      path: '/:lang/pricing/:args?',
      name: 'pricing',
      component: () => import('./views/Pricing.vue'),
      props: true,
      meta: {
        title: 'Pricing | English Zero To Hero',
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
      path: '/:lang/course-release-schedule',
      name: 'course-release-schedule',
      component: () => import('./views/ReleaseSchedule.vue'),
      props: true,
      meta: {
        title: 'Course Release Schedule | English Zero To Hero',
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
      path: '/:lang/textbooks-workbooks',
      name: 'textbooks-workbooks',
      component: () => import('./views/Textbooks.vue'),
      props: true,
      meta: {
        title:
          'English Course Textbooks and Workbooks | English Zero To Hero',
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
      path: '/:lang/faq',
      name: 'faq',
      component: () => import('./views/FAQ.vue'),
      props: true,
      meta: {
        title: 'Frequently Asked Questions | English Zero To Hero',
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
      path: '/:lang/dictionary/:method?/:args?',
      name: 'dictionary',
      props: true,
      component: () => import('./views/Dictionary.vue'),
      meta: {
        title: 'Dictionary | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Look up and learn English words.'
          }
        ]
      }
    },
    {
      path: '/:lang/phrase/:method?/:args?',
      name: 'phrase',
      component: () => import('./views/Phrase.vue'),
      props: true,
      meta: {
        title: 'Phrase | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'See how English phrases are used in real context..'
          }
        ]
      }
    },
    {
      path: '/:lang/saved-words',
      name: 'saved-words',
      component: () => import('./views/SavedWords.vue'),
      meta: {
        title: 'Saved Words | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Study, manage, import, export the words you saved.'
          }
        ]
      }
    },
    {
      path: '/:lang/library',
      name: 'library',
      component: () => import('./views/Library.vue'),
      props: true,
      meta: {
        title: 'Library | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open English books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:lang/reader/:method?/:arg?',
      name: 'reader',
      component: () => import('./views/Reader.vue'),
      meta: {
        title: 'Reader | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read English text with annotation and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:lang/book/chapter/:args?',
      name: 'book-chapter',
      component: () => import('./views/BookChapter.vue'),
      props: true,
      meta: {
        title: 'Book Chapter | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open English books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:lang/book/index/:args?',
      name: 'book-index',
      component: () => import('./views/BookIndex.vue'),
      props: true,
      meta: {
        title: 'Book | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open English books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:lang/book/list/:args?',
      name: 'book-list',
      component: () => import('./views/BookList.vue'),
      props: true,
      meta: {
        title: 'Books | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Read free, open English books with hover dictionary and save new words for review.'
          }
        ]
      }
    },
    {
      path: '/:lang/youtube/search/:args?',
      name: 'youtube-search',
      component: () => import('./views/YouTubeSearch.vue'),
      props: true,
      meta: {
        title: 'YouTube Reader | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch English YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:lang/youtube/view/:args?',
      name: 'youtube-view',
      component: () => import('./views/YouTubeView.vue'),
      props: true,
      meta: {
        title: 'YouTube Reader | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch English YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:lang/youtube/browse/:args?',
      name: 'youtube-browse',
      component: () => import('./views/YouTubeBrowse.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch English YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:lang/youtube/channel/:args?',
      name: 'youtube-channel',
      component: () => import('./views/YouTubeChannel.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch English YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:lang/youtube/playlist/:args?',
      name: 'youtube-playlist',
      component: () => import('./views/YouTubePlaylist.vue'),
      props: true,
      meta: {
        title: 'Study YouTube Subtitles | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Watch English YouTube videos and study the subtitles.'
          }
        ]
      }
    },
    {
      path: '/:lang/contact-us',
      name: 'contact',
      component: () => import('./views/Contact.vue'),
      props: true,
      meta: {
        title: 'Contact Us | English Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Get in touch with us.'
          }
        ]
      }
    },
    {
      path: '/:lang/faq',
      name: 'faq',
      component: () => import('./views/FAQ.vue'),
      props: true,
      meta: {
        title: 'Frequently Asked Questions | English Zero To Hero',
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
      path: '/:lang/affiliate-program',
      name: 'affiliate-program',
      component: () => import('./views/Affiliate.vue'),
      props: true,
      meta: {
        title: 'Affiliate Program | English Zero To Hero',
        metaTags: [
          {
            name: 'description',
            content: 'Help us get the word out!'
          }
        ]
      }
    },
    {
      path: '/:lang/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
      meta: {
        title: 'Settings | English Zero to Hero',
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
