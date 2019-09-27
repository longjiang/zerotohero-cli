export default {
  dictionaries: [],
  languages: [],
  translations: [],
  features: [],
  l1s: [],
  locales: [],
  googleLangs: [
    'af',
    'ar',
    'hy',
    'be',
    'bg',
    'ca',
    'zh',
    'hr',
    'cs',
    'da',
    'nl',
    'en',
    'eo',
    'et',
    'tl',
    'fi',
    'fr',
    'de',
    'el',
    'iw',
    'hi',
    'hu',
    'is',
    'id',
    'it',
    'ja',
    'ko',
    'lv',
    'lt',
    'no',
    'fa',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sk',
    'sl',
    'es',
    'sw',
    'sv',
    'th',
    'tr',
    'uk',
    'vi'
  ],
  googleTranslateLangs: [
    'af',
    'sq',
    'am',
    'ar',
    'hy',
    'az',
    'eu',
    'be',
    'bn',
    'bs',
    'bg',
    'ca',
    'ceb',
    'ny',
    'zh',
    'zh',
    'co',
    'hr',
    'cs',
    'da',
    'nl',
    'en',
    'eo',
    'et',
    'tl',
    'fi',
    'fr',
    'fy',
    'gl',
    'ka',
    'de',
    'el',
    'gu',
    'ht',
    'ha',
    'haw',
    'iw',
    'hi',
    'hmn',
    'hu',
    'is',
    'ig',
    'id',
    'ga',
    'it',
    'ja',
    'jw',
    'kn',
    'kk',
    'km',
    'ko',
    'ku',
    'ky',
    'lo',
    'la',
    'lv',
    'lt',
    'lb',
    'mk',
    'mg',
    'ms',
    'ml',
    'mt',
    'mi',
    'mr',
    'mn',
    'my',
    'ne',
    'no',
    'ps',
    'fa',
    'pl',
    'pt',
    'pa',
    'ro',
    'ru',
    'sm',
    'gd',
    'sr',
    'st',
    'sn',
    'sd',
    'si',
    'sk',
    'sl',
    'so',
    'es',
    'su',
    'sw',
    'sv',
    'tg',
    'ta',
    'te',
    'th',
    'tr',
    'uk',
    'ur',
    'uz',
    'vi',
    'cy',
    'xh',
    'yi',
    'yo',
    'zu'
  ],
  loadFile(file) {
    return new Promise(resolve => {
      Papa.parse(file, {
        download: true,
        header: true,
        complete: results => {
          resolve(results.data)
        }
      })
    })
  },
  async loadDictionaries() {
    this.dictionaries = await this.loadFile('/data/languages/dictionaries.csv.txt')
  },
  async loadLanguages() {
    this.languages = await this.loadFile('/data/languages/languages.csv.txt')
  },
  async loadTranslations() {
    this.translations = await this.loadFile('/data/languages/translations.csv.txt')
  },
  async loadFeatures() {
    this.features = await this.loadFile('/data/languages/features.csv.txt')
  },
  async loadLocales() {
    this.locales = await this.loadFile('/data/languages/locales.csv.txt')
  },
  get(iso639_2t) {
    return this.l1s.find(language => language['iso639-3'] === iso639_2t)
  },
  getSmart(code) {
    return this.l1s.find(
      language =>
        language['iso639-3'] === code || language['iso639-1'] === code
    )
  },
  hasYouTube(l1, l2) {
    // l1.code = 'ceb', l2.code = 'en' -> yes, becuase we can find English YouTube videos, with sub translated in cebuano 
    // l1.code = 'en', l2.code = 'ceb' -> no, because we can't FIND cebuano subtitlted YouTube videos
    return this.googleTranslateLangs.includes(this.code(l1)) && this.googleLangs.includes(this.code(l2))
  },
  code(language) {
    return language['iso639-1'] || language['iso639-3']
  },
  loadL1Features(l1s) {
    /*
     Goal:
    {
      "code": "af",
      ...
      "features": {
        "eng": [ "home", "courses" ] // means we have the "home" feature if you are studing English through Afrikaans
      }
    },
     */
    console.log('Loading language features.')
    for (let features of this.features) {
      let l1 = l1s.find(language => language['iso639-3'] === features.l1)
      l1.features = l1.features || {}
      l1.features[features.l2] = l1.features[features.l2] || []
      for (let key in features) {
        // key = 'home'
        if (key !== 'l1' && key !== 'l2' && features[key] === 'TRUE') {
          l1.features[features.l2].push(key) // key = 'home'
        }
      }
    }
    console.log('Features loaded.')
  },
  constructL1Data() {
    let l1s = []
    /*
     Goal:
    {
      "code": "af",
      "iso639-1": "afr",
      "iso639-3": "afr",
      "name": "Afrikaans",
      "direction": 'ltr',
      "dictionaries": {
        "eng": ["freedict"] // means we have a English-Afrikaans dictionary
      },
      "locales": ['zh-CN', 'zh-HK']
      "published": true,
      "translations": {
        "english": "Engels",
        "zerotohero": "Nul tot held"
      },
      "features": {
        "eng": [ "home", "courses" ] // means we have the "home" feature if you are studing English through Afrikaans
      }
    },
     */
    for (let language of this.languages) {
      let l1 = {
        code: this.code(language),
        id: language.id,
        'iso639-1': language['iso639-1'],
        'iso639-2t': language['iso639-2t'],
        'iso639-3': language['iso639-3'],
        name: language.name,
        type: language.type,
        direction: language.direction || 'ltr',
        published: true
      }
      l1s.push(l1)
    }
    for (let translation of this.translations) {
      let l1 = l1s.find(
        language => language['iso639-3'] === translation['iso639-3']
      )
      if (l1) {
        l1.translations = translation
      }
    }
    for (let dictionary of this.dictionaries) {
      let l1 = l1s.find(language => language['iso639-3'] === dictionary.l1)
      l1.dictionaries = l1.dictionaries || {}
      l1.dictionaries[dictionary.l2] = l1.dictionaries[dictionary.l2] || []
      l1.dictionaries[dictionary.l2].push(dictionary.dictionary) // "freedict"
    }
    this.loadL1Features(l1s)
    for (let locale of this.locales) {
      let l1 = l1s.find(language => language['iso639-1'] === locale['iso639-1'])
      if (l1) {
        l1.locales = l1.locales || []
        l1.locales.push(locale.locale)
      }
    }
    return l1s
  },
  getFeatures(options) {
    return options.l1.features && options.l1.features[options.l2['iso639-3']]
      ? options.l1.features[options.l2['iso639-3']]
      : []
  },
  async load() {
    console.log('Loading language data...')
    let promises = [
      this.loadDictionaries(),
      this.loadLanguages(),
      this.loadTranslations(),
      this.loadFeatures(),
      this.loadLocales()
    ]
    return new Promise(async resolve => {
      await Promise.all(promises)
      this.l1s = this.constructL1Data()
      resolve(this)
    })
  }
}
