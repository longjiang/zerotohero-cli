export default {
  dictionaries: [],
  languages: [],
  translations: [],
  features: [],
  l1s: [],
  locales: [],
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
    this.dictionaries = await this.loadFile('/data/languages/dictionaries.csv')
  },
  async loadLanguages() {
    this.languages = await this.loadFile('/data/languages/languages.csv')
  },
  async loadTranslations() {
    this.translations = await this.loadFile('/data/languages/translations.csv')
  },
  async loadFeatures() {
    this.features = await this.loadFile('/data/languages/features.csv')
  },
  async loadLocales() {
    this.locales = await this.loadFile('/data/languages/locales.csv')
  },
  get(iso639_2t) {
    return this.l1s.find(language => language['iso639-2t'] === iso639_2t)
  },
  getSmart(code) {
    return this.l1s.find(
      language =>
        language['iso639-2t'] === code || language['iso639-1'] === code
    )
  },
  constructL1Data() {
    let l1s = []
    /*
     Goal:
    {
      "code": "af",
      "iso639-1": "afr",
      "iso639-2t": "afr",
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
      }
    },
     */
    for (let language of this.languages) {
      l1s.push({
        code: language['iso639-1'] || language['iso639-2t'],
        'iso639-1': language['iso639-1'],
        'iso639-2t': language['iso639-2t'],
        name: language.name,
        direction: language.direction || 'ltr',
        published: true
      })
    }
    for (let translation of this.translations) {
      let l1 = l1s.find(
        language => language['iso639-2t'] === translation['iso639-2t']
      )
      if (l1) {
        l1.translations = translation
      }
    }
    for (let dictionary of this.dictionaries) {
      let l1 = l1s.find(language => language['iso639-2t'] === dictionary.l1)
      l1.dictionaries = l1.dictionaries || {}
      l1.dictionaries[dictionary.l2] = l1.dictionaries[dictionary.l2] || []
      l1.dictionaries[dictionary.l2].push(dictionary.dictionary) // "freedict"
    }
    for (let features of this.features) {
      let l1 = l1s.find(language => language['iso639-2t'] === features.l1)
      l1.features = l1.features || {}
      l1.features[features.l2] = l1.features[features.l2] || []
      for (let key in features) {
        // key = 'home'
        if (key !== 'l1' && key !== 'l2' && features[key] === 'TRUE') {
          l1.features[features.l2].push(key) // key = 'home'
        }
      }
    }
    for (let locale of this.locales) {
      let l1 = l1s.find(language => language['iso639-1'] === locale['iso639-1'])
      if(l1) {
        l1.locales = l1.locales || []
        l1.locales.push(locale.locale)
      }
    }
    return l1s
  },
  getFeatures(options) {
    return options.l1.features && options.l1.features[options.l2['iso639-2t']]
      ? options.l1.features[options.l2['iso639-2t']]
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