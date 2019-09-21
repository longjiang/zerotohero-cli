const Dictionary = {
  dictionaries: {
    af: {
      filename: 'eng-afr',
      parser: 'regular'
    },
    ar:  {
      filename: 'eng-ara',
      parser: 'regular'
    },
    el:  {
      filename: 'eng-ell',
      parser: 'regular'
    },
    fi:  {
      filename: 'eng-fin',
      parser: 'regular'
    },
    fr:  {
      filename: 'eng-fra',
      parser: 'regular'
    },
    ga:  {
      filename: 'eng-gle',
      parser: 'regular'
    },
    hi:  {
      filename: 'eng-hin',
      parser: 'regular'
    },
    hr:  {
      filename: 'eng-hrv',
      parser: 'regular'
    },
    hu:  {
      filename: 'eng-hun',
      parser: 'regular'
    },
    it:  {
      filename: 'eng-ita',
      parser: 'regular'
    },
    ja:  {
      filename: 'eng-jpn',
      parser: 'regular'
    },
    la:  {
      filename: 'eng-lat',
      parser: 'regular'
    },
    lt:  {
      filename: 'eng-lit',
      parser: 'regular'
    },
    nl:  {
      filename: 'eng-nld',
      parser: 'regular'
    },
    pl:  {
      filename: 'eng-pol',
      parser: 'regular'
    },
    pt:  {
      filename: 'eng-por',
      parser: 'regular'
    },
    ro:  {
      filename: 'eng-rom',
      parser: 'regular'
    },
    ru:  {
      filename: 'eng-rus',
      parser: 'regular'
    },
    es:  {
      filename: 'eng-spa',
      parser: 'regular'
    },
    sr:  {
      filename: 'eng-srp',
      parser: 'regular'
    },
    sv:  {
      filename: 'eng-swe',
      parser: 'regular'
    },
    sw:  {
      filename: 'eng-swh',
      parser: 'regular'
    },
    tr:  {
      filename: 'eng-tur',
      parser: 'regular'
    },
  },
  lang: undefined,
  file: undefined,
  words: [],
  index: {},
  cache: {},
  tables: [],
  loadWords() {
    return new Promise(resolve => {
      console.log('FreeDict: Loading words')
      let xhttp = new XMLHttpRequest()
      let that = this
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.words = that.parseDictionary(this.responseText)
          resolve()
        }
      }
      xhttp.open('GET', this.file, true)
      xhttp.send()
    })
  },
  parseLines(lines) {
    let words = []
    for (let index in lines) {
      index = parseInt(index)
      let english = lines[index]
      let matches = english.match(/(.*) \/(.*)\//)
      if (matches) {
        let matches2 = english.match(/<(.*)>/)
        // Parse definitions (sometimes it's one line, other times it's multiple lines with numeric headings)
        let i = 1
        let isDef = !lines[index + i].match(/(.*) \/(.*)\//)
        let definitions = []
        while (isDef) {
          let def = lines[index + i].replace(/^\d+\./, '').trim()
          if (def !== '') {
            definitions.push(def)
          }
          i = i + 1
          if (lines[index + i]) {
            isDef = !lines[index + i].match(/(.*) \/(.*)\//)
          } else {
            isDef = false
          }
        }
        let pronunciation = matches ? matches[2] : undefined
        let word = {
          bare: matches ? matches[1] : undefined,
          head: matches
            ? matches[1].replace(/\(.*\)\/ /, '').toLowerCase()
            : undefined,
          pronunciation: ['fi', 'lt', 'cy', 'ku'].includes(this.lang)? undefined : pronunciation,
          definitions: definitions,
          pos: matches2 && matches2.length > 1 ? matches2[1] : undefined
        }
        word.accented = word.bare
        words.push(word)
      }
    }
    return words
  },
  parseDictionary(text) {
    text = text.replace(/^[^\n]*\n/m, '') // remove title line
    console.log('Parsing FreeDict Dictionary from ' + this.file)
    let lines = text.split('\n')
    let words = []
    words = this.parseLines(lines)
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
  load(lang) {
    console.log('Loading FreeDict...')
    this.lang = lang
    // let server = 'http://hsk-server.local:8888/'
    // let server = 'https://server.chinesezerotohero.com/'
    let server = '/'
    this.file = `${server}data/freedict/${this.dictionaries[this.lang].filename}.dict.txt`
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
  wordForms(word) {
    let forms = [{
      table: 'head',
      field: 'head',
      form: word.bare
    }]
    if (word) {
      for (let table of this.formTable()) {
        for (let field of table.fields) {
          if (word[table.name] && word[table.name][field]) {
            for (let form of word[table.name][field].split(',')) {
              forms.push({
                table: table.name,
                field: field,
                form: form.trim()
              })
            }
          }
        }
      }
    }
    return forms
  },
  lookupByDef(text, limit = 30) {
    text = text.toLowerCase()
    let words = this.words
      .filter(word => word.definitions.join(', ').includes(text))
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
  },
  stylize(name) {
    const stylize = {
      adjectives: 'adjective',
      incomparable: 'incomparable',
      short_f: 'short (fem.)',
      short_m: 'short (masc.)',
      short_n: 'short (neut.)',
      short_pl: 'short plural',
      superlative: 'superlative',
      conjugations: 'conjugation',
      pl1: 'мы',
      pl2: 'вы',
      pl3: 'они',
      sg1: 'я',
      sg2: 'ты',
      sg3: 'он/она',
      declensions: 'declension',
      decl_sg: 'singular',
      decl_pl: 'plural',
      decl_f: 'feminine',
      decl_m: 'masculine',
      decl_n: 'neuter',
      acc: 'accusative',
      dat: 'dative',
      gen: 'genitive',
      inst: 'instrumental',
      nom: 'nominative',
      prep: 'prepositional',
      verbs: '',
      aspect: 'aspect',
      imperative_pl: 'imperative plural',
      imperative_sg: 'imperative singular',
      partner: 'partner',
      past_f: 'past tense (feminine)',
      past_m: 'past tense (masculine)',
      past_n: 'past tense (neuter)',
      past_pl: 'past tense (plural)'
    }
    return stylize[name]
  }
}
