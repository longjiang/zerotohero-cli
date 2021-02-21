const Dictionary = {
  name: 'ecdict',
  lang: undefined,
  file: undefined,
  frequencyFile: undefined,
  words: [],
  frequency: [],
  index: {},
  cache: {},
  tables: [],
  levels: {
    1: 'Pre-A1',
    2: 'A1',
    3: 'A2',
    4: 'B1',
    5: 'B2',
    6: 'C1',
    7: 'C2'
  },
  credit() {
    return '英汉词典由<a href="https://github.com/skywind3000/ECDICT">ECDICT</a>提供, 开源并以<a href="https://github.com/skywind3000/ECDICT/blob/master/LICENSE">MIT License</a>发行。'
  },
  loadWords() {
    console.log('Loading words...')
    return new Promise(resolve => {
      Papa.parse(this.file, {
        download: true,
        header: true,
        complete: results => {
          for (let index in results.data) {
            let row = results.data[index]
            this.words.push(this.augment(row))
          }
          console.log('Words loaded.')
          resolve()
        }
      })
    })
  },
  loadTouchstone() {
    console.log('Loading Touchtone...')
    return new Promise(resolve => {
      Papa.parse(this.touchstoneFile, {
        download: true,
        header: true,
        complete: results => {
          for (let index in results.data) {
            let row = results.data[index]
            this.words.push(this.augment(row))
          }
          console.log('Touchtone loaded.')
          resolve()
        }
      })
    })
  },
  loadFrequency() {
    console.log('Loading word frequency list...')
    return new Promise(resolve => {
      Papa.parse(this.frequencyFile, {
        download: true,
        header: true,
        complete: results => {
          this.frequency = results.data.map(row => row.word)
          resolve()
        }
      })
    })
  },
  augment(row, id) {
    let word = {
      id: id,
      bare: row.word,
      accented: row.word,
      head: row.word,
      pronunciation: row.phonetic,
      definitions: row.translation.split('\\n'),
      pos: row.pos,
      extra: row
    }
    if (row.level) {
      word.book = parseInt(row.level)
      word.level = this.levels[parseInt(row.level)]
    }
    return Object.assign(row, word)
  },
  addIdToWords() {
    for (let index in this.words) {
      let word = this.words[index]
      word.id = index
    }
  },
  addFrequencyToWords() {
    for (let word of this.words) {
      let rank = this.frequency.indexOf(word.word.toLowerCase())
      word.rank = rank !== -1 ? rank : this.frequency.length
      word.level = this.levels[7]
      if (word.rank < 8000) {
        word.level = this.levels[6]
      }
      if (word.rank < 4000) {
        word.level = this.levels[5]
      }
      if (word.rank < 2000) {
        word.level = this.levels[4]
      }
      if (word.rank < 1000) {
        word.level = this.levels[3]
      }
      if (word.rank < 500) {
        word.level = this.levels[2]
      }
      if (word.rank < 250) {
        word.level = this.levels[1]
      }
    }
  },
  load(lang) {
    console.log('Loading ECDICT...')
    this.lang = lang
    let server = '/'
    this.file = `${server}data/ecdict/ecdict-simplified.csv.txt`
    this.touchstoneFile = `${server}data/ecdict/touchstone.csv.txt`
    this.frequencyFile = `${server}data/ecdict/frequency.csv.txt`
    return new Promise(async resolve => {
      let promises = [this.loadWords(), this.loadFrequency()]
      await Promise.all(promises)
      this.addIdToWords()
      this.addFrequencyToWords()
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
  lookupMultiple(text) {
    let word = this.words.filter(word => word && word.bare.toLowerCase() === text.toLowerCase())
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
      .filter(word => word.definitions.join(', ').toLowerCase().includes(text))
      .slice(0, limit)
    return words
  },
  lookupFuzzy(text, limit = 30) { // text = 'abcde'
    text = text.toLowerCase()
    let words = []
    let subtexts = []
    for (let i = 1; text.length - i > 3; i++) {
      subtexts.push(text.substring(0, text.length - i))
    }
    for (let word of this.words) {
      let head = word.head ? word.head.toLowerCase() : undefined
      if (head && head.startsWith(text)) {
        words.push(
          Object.assign(
            { score: text.length - (head.length - text.length)},
            word
          )
        ) // matches 'abcde', 'abcde...'
      }
      if (head && text.includes(head)) {
        words.push(Object.assign({ score: head.length - text.length - 4}, word)) // matches 'cde', 'abc'
      }
      if (head && head.includes(text)) {
        words.push(Object.assign({ score: text.length - (head.length - text.length) - 4 }, word)) // matches 'XXXabcdeWWW'
      }
      for (let subtext of subtexts) {
        if (head && head.includes(subtext)) {
          words.push(
            Object.assign(
              { score: subtext.length - (head.length - subtext.length) },
              word
            )
          ) // matches 'abcxyz...'
        }
      }
    }
    for (let word of words) {
      if (word.book) {
        word.score = word.score + 7 - word.book
      }
    }
    return this.uniqueByValue(words, 'id').sort((a,b) => b.score - a.score).slice(0, limit)
  },
  uniqueByValue(array, key) {
    let flags = []
    let unique = []
    let l = array.length
    for(let i = 0; i<l; i++) {
      if( flags[array[i][key]]) continue
      flags[array[i][key]] = true
      unique.push(array[i])
    }
    return unique
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
