const Dictionary = {
  name: 'wiktionary',
  file: undefined,
  dictionary: undefined,
  words: [],
  index: {},
  cache: {},
  tables: [],
  l1: undefined,
  l2: undefined,
  loadWords() {
    return new Promise(resolve => {
      console.log('Wiktionary: Loading words')
      let xhttp = new XMLHttpRequest()
      let that = this
      xhttp.onload = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status < 400)) {
          that.words = that.parseDictionary(this.responseText)
          resolve()
        }
      }
      xhttp.open('GET', this.file, true)
      xhttp.send()
    })
  },
  parseDictionary(json) {
    this.dictionary = JSON.parse(json)
    let words = []
    for(let item of this.dictionary) {
      if (item.word) {
        let definitions = []
        if (item.senses && item.senses[0]) {
          for (let sense of item.senses) {
            if (sense.glosses) {
              if (sense.complex_inflection_of) {
                for (let inflection of sense.complex_inflection_of) {
                  definitions.push(`${inflection['3']} ${inflection['4']} ${inflection['5']} inflection of <a href="https://en.wiktionary.org/wiki/${inflection['2']}" target="_blank">${inflection['2']}</a>`)
                }
              } else {
                definitions.push(sense.glosses[0])
              }
            }
          }
        }
        if (definitions.length === 0) {
          definitions.push(`(inflected form, see <a href="https://en.wiktionary.org/wiki/${item.word}" target="_blank">Wiktionary</a> for details)`)
        }
        words.push(Object.assign(item, {
          bare: item.word,
          head: item.word,
          accented: item.word,
          pronunciation: item.pronunciations && item.pronunciations[0].ipa ? item.pronunciations[0].ipa[0][1].replace(/\//g, '') : undefined,
          definitions: definitions,
          pos: item.pos
        }))
      }
    }
    words = words.sort((a, b) => {
      if (a.head && b.head) {
        return a.head.length - b.head.length
      }
    })
    words = words.map((word, index) => {
      word.id = index
      return word
    })
    return words
  },
  dictionaryFile(options) {
    let filename = `/data/wiktionary/${options.l2}-${options.l1}.json.txt`
    return filename
  },
  load(options) {
    console.log('Loading Wiktionary...')
    this.l1 = options.l1
    this.l2 = options.l2
    this.file = this.dictionaryFile(options)
    return new Promise(async resolve => {
      let promises = [this.loadWords()]
      await Promise.all(promises)
      resolve(this)
    })
  },
  get(id) {
    return this.words[id]
  },
  lookup(text) {
    let word = this.words.find(word => word && word.bare.toLowerCase() === text.toLowerCase())
    return word
  },
  formTable() {
    return this.tables
  },
  stylize(name) {
    return name
  },
  wordForms(word) {
    let forms = [{
      table: 'head',
      field: 'head',
      form: word.bare
    }]
    return forms
  },
  lookupByDef(text, limit = 30) {
    text = text.toLowerCase()
    let words = this.words
      .filter(word => word.definitions && word.definitions.join(', ').includes(text))
      .slice(0, limit)
    return words
  },
  lookupFuzzy(text, limit = 30) {
    text = text.toLowerCase()
    let words = this.words
      .filter(word => word.head && word.head.startsWith(text))
      .slice(0, limit)
    if (words.length === 0) {
      words = this.words
        .filter(word => text.includes(word.head))
        .sort((a, b) => b.head.length - a.head.length)
        .slice(0, limit)
    }
    return words
  },
  randomArrayItem(array, start = 0, length = false) {
    length = length || array.length
    array = array.slice(start, length)
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  },
  //https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
  randomProperty(obj) {
    var keys = Object.keys(obj)
    return obj[keys[(keys.length * Math.random()) << 0]]
  },
  random() {
    return this.randomProperty(this.words)
  },
  accent(text) {
    return text.replace(/'/g, '́')
  }
}
  