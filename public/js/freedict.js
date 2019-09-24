const Dictionary = {
  name: 'freedict',
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
          pronunciation: pronunciation,
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
  dictionaryFile(options) {
    let filename = `/data/freedict/${options.l2}-${options.l1}.dict.txt`
    return filename
  },
  load(options) {
    console.log('Loading FreeDict...')
    this.l1 = options.l1
    // let server = 'http://hsk-server.local:8888/'
    // let server = 'https://server.chinesezerotohero.com/'
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
