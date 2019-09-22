import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
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
      path: '/:l1/:l2/about-english-online-courses',
      name: 'courses',
      component: () => import('./views/Courses.vue'),
      props: true,
      meta: {
        title: 'Online Courses | Zero to Hero',
        metaTags: [
          {
            name: 'description',
            content:
              'Achieve fluent communication and outstanding HSK results. Engaging, comprehensive and structured courses at all CEFR levels. Learning is hard work, but it should never be boring, so we designed our courses to be concise yet fun and engaging.'
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
      path: '/:l1/:l2/pricing/:args?',
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
      path: '/:l1/:l2/book/chapter/:args?',
      name: 'book-chapter',
      component: () => import('./views/BookChapter.vue'),
      props: true,
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
      path: '/:l1/:l2/book/index/:args?',
      name: 'book-index',
      component: () => import('./views/BookIndex.vue'),
      props: true,
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
      path: '/:l1/:l2/book/list/:args?',
      name: 'book-list',
      component: () => import('./views/BookList.vue'),
      props: true,
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
      path: '/:l1/:l2/youtube/search/:args?',
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
      path: '/:l1/:l2/youtube/view/:args?',
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
      path: '/:l1/:l2/youtube/browse/:args?',
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
