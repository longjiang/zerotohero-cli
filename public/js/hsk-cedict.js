const Dictionary = {
  file: '../data/hsk-cedict/hsk_cedict.csv.txt',
  words: [],
  _maxWeight: 0,
  load() {
    return new Promise(resolve => {
      Papa.parse(this.file, {
        download: true,
        header: true,
        complete: results => {
          this.words = results.data.map(row => this.augment(row))
          for (let row of this.words) {
            row.rank = row.weight / this._maxWeight
          }
          resolve()
        }
      })
    })
  },
  wordForms(word) {
    let forms = [
      {
        table: 'head',
        field: 'head',
        form: word.bare
      }
    ]
    return forms
  },
  stylize(name) {
    return name
  },
  accent(text) {
    return text
  },
  lookupByDef(text, limit = 30) {
    let results = this.words
      .filter(row => row.search && row.search.includes(text))
      .slice(0, limit)
    return results
  },
  unique(array) {
    var uniqueArray = []
    for (let i in array) {
      if (!uniqueArray.includes(array[i])) uniqueArray.push(array[i])
    }
    return uniqueArray
  },
  getByHSKId(hskId) {
    return this.words.find(row => row.hskId === hskId)
  },
  get(id) {
    return this.words.find(row => row.id === id)
  },
  getByBookLessonDialog(book, lesson, dialog) {
    return this.words.filter(
      row =>
        parseInt(row.book) === parseInt(book) &&
        parseInt(row.lesson) === parseInt(lesson) &&
        row.dialog.toString() === dialog.toString()
    )
  },
  compileBooks() {
    // https://www.consolelog.io/group-by-in-javascript/
    Array.prototype.groupBy = function(prop) {
      return this.reduce(function(groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
      }, {})
    }
    var books = this.words.filter(row => row.book).groupBy('book')
    for (var book in books) {
      books[book] = books[book].groupBy('lesson')
      for (var lesson in books[book]) {
        books[book][lesson] = books[book][lesson].groupBy('dialog')
      }
    }
    return books
  },
  isChinese(text) {
    if (this.matchChinese(text)) return true
  },
  matchChinese(text) {
    return text.match(
      // eslint-disable-next-line no-irregular-whitespace
      /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B‌​\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]+/g
    )
  },
  removeTones(pinyin) {
    return pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  },
  lookupFuzzy(text, limit = false) {
    let results = []
    if (this.isChinese(text)) {
      results = this.words
        .filter(
          row => row.simplified.includes(text) || row.traditional.includes(text)
        )
        .sort((a, b) => b.weight - a.weight)
    } else {
      text = text.toLowerCase().trim()
      results = this.words
        .filter(row =>
          this.removeTones(row.pinyin.replace(/ /g, '')).includes(
            text.replace(/ /g, '')
          )
        )
        .slice(0, 1000)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 100)
        .sort((a, b) => {
          let am = a.search.match(new RegExp('^' + text + '\\b'))
          let bm = b.search.match(new RegExp('^' + text + '\\b'))
          if (!am && bm) {
            return 1
          } else if (am && !bm) {
            return -1
          } else {
            return 0
          }
        })
    }
    if (results) {
      if (limit) {
        results = results.slice(0, limit)
      }
      return results
    }
  },
  lookupByCharacter(char) {
    return this.words.filter(row => row.simplified.includes(char))
  },
  lookupByDefinition(definition) {
    return this.words.filter(row => row.search.split('/').includes(definition))
  },
  lookupPinyinFuzzy(pinyin) {
    return this.words.filter(
      row =>
        this.removeTones(row.pinyin).replace(/ /g, '') ===
        this.removeTones(pinyin).replace(/ /g, '')
    )
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
    let rand = this.randomProperty(this.words)
    console.log(rand)
    return rand
  },
  lookupSimplified(simplified, pinyin = false) {
    const candidates = this.words
      .filter(row => {
        let pinyinMatch = true
        if (pinyin.length > 0) {
          pinyinMatch = row.pinyin === pinyin
        }
        return pinyinMatch && row.simplified === simplified
      })
      .sort((a, b) => {
        return b.weight - a.weight
      })
    return candidates
  },
  lookupByPattern(pattern) {
    // pattern like '～体'
    var results = []
    if (pattern.includes('～')) {
      const regexPattern = '^' + pattern.replace(/～/gi, '.+') + '$'
      const regex = new RegExp(regexPattern)
      results = this.words.filter(
        word =>
          regex.test(word.simplified) &&
          word.oofc === '' &&
          word.hsk != 'outside'
      )
    } else {
      results = this.words.filter(
        word =>
          word.simplified.includes(pattern) &&
          word.oofc === '' &&
          word.hsk != 'outside'
      )
    }
    return results
  },
  augment(row) {
    let hskCEDICT = this
    let augmented = Object.assign(row, {
      id: `${row.traditional},${row.pinyin.replace(/ /g, '_')},${row.index}`,
      bare: row.simplified,
      accented: row.simplified,
      cjk: {
        canonical:
          row.simplified && row.simplified !== 'NULL'
            ? row.simplified
            : undefined,
        phonetics: row.pinyin
      },
      definitions: row.definitions.split('/'),
      search: row.definitions.toLowerCase()
    })
    this._maxWeight = Math.max(augmented.weight, this._maxWeight)
    return augmented
  },
  /* Returns the longest word in the dictionary that is inside `text` */
  longest(text, traditional = false) {
    // Only return the *first* seen word and those the same as it
    let first = false
    const tradOrSimp = traditional ? 'traditional' : 'simplified'
    let matches = this.words
      .filter(row => this.isChinese(row.simplified))
      .filter(function(row) {
        if (first) {
          return row[tradOrSimp] === first
        } else {
          if (text.includes(row[tradOrSimp])) {
            first = row[tradOrSimp]
            return true
          }
        }
      })
      .sort((a, b) => {
        return b.weight - a.weight
      })
    return {
      matches: matches,
      text: matches && matches.length > 0 ? matches[0][tradOrSimp] : ''
    }
  },
  // text = 涎[xian2]
  // text = 協|协[xie2]
  parseWord(text) {
    var m = text.match(/(.*)\[(.*)\]/)
    if (!m) {
      m = [text, text, '']
    }
    const c = m[1].split('|')
    return {
      simplified: c.length > 1 ? c[1] : c[0], // 涎, 协
      traditional: c[0], // 涎, 協
      pinyin: m[2]
    }
  },
  subdict(data) {
    let newDict = Object.assign({}, this)
    return Object.assign(newDict, { words: data })
  },
  isTraditional(text) {
    let matchedSimplified = []
    let matchedTraditional = []
    for (let row of this.words) {
      if (text.includes(row.simplified)) matchedSimplified.push(row.simplified)
      if (text.includes(row.traditional))
        matchedTraditional.push(row.traditional)
    }
    const trad = this.unique(matchedTraditional).length
    const simp = this.unique(matchedSimplified).length
    return trad > simp
  },
  subdictFromText(text) {
    return this.subdict(
      this.words.filter(function(row) {
        return text.includes(row.simplified) || text.includes(row.traditional)
      })
    )
  }
}
