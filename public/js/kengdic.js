const Dictionary = {
  file: '../data/kengdic/kengdic_2011.tsv.txt',
  words: [],
  name: 'kengdic',
  load() {
    return new Promise(resolve => {
      Papa.parse(this.file, {
        download: true,
        header: true,
        complete: results => {
          let sorted = results.data.sort((a, b) =>
            a.hangul && b.hangul ? a.hangul.length - b.hangul.length : 0
          )
          let data = []
          for(let row of sorted) {
            let word = Object.assign(row, {
              bare: row.hangul,
              accented: row.hangul,
              definitions: [row.english],
              cjk: {
                canonical: row.hanja,
              }
            })
            data.push(word)
          }
          this.words = data
          resolve(this)
        }
      })
    })
  },
  unique(array) {
    var uniqueArray = []
    for (let i in array) {
      if (!uniqueArray.includes(array[i])) uniqueArray.push(array[i])
    }
    return uniqueArray
  },
  get(id) {
    return this.words.find(row => row.id === id)
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
  randomArrayItem(array, start = 0, length = false) {
    length = length || array.length
    array = array.slice(start, length)
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  },
  wordForms(word) {
    let forms = [{
      table: 'head',
      field: 'head',
      form: word.bare
    }]
    return forms
  },
  stylize(name) {
    return name
  },
  lookupByDef(text) {
    let results = this.words.filter(row => row.english && row.english.includes(text))
    return results
  },
  random() {
    return this.randomArrayItem(this.words)
  },
  lookupByCharacter(char) {
    return this.words.filter(row => row.hanja && row.hanja.includes(char))
  },
  lookupHangul(hangul) {
    const candidates = this.words.filter(row => {
      return row.hangul === hangul
    })
    return candidates
  },
  accent(text) {
    return text
  },
  lookupByPattern(pattern) {
    // pattern like '～体'
    var results = []
    if (pattern.includes('～')) {
      const regexPattern = '^' + pattern.replace(/～/gi, '.+') + '$'
      const regex = new RegExp(regexPattern)
      results = this.words.filter(word => regex.test(word.hangul))
    } else {
      results = this.words.filter(word => word.hangul.includes(pattern))
    }
    return results
  },
  lookupFuzzy(text, limit = false) {
    text = text.toLowerCase().trim()
    let results = []
    if (this.isChinese(text)) {
      results = this.words.filter(row => row.hanja && row.hanja.includes(text))
    } else {
      let words = this.words
        .filter(word => word.bare && word.bare.startsWith(text))
      if (words.length === 0) {
        words = this.words
          .filter(word => text.includes(word.bare))
          .sort((a, b) => b.bare.length - a.bare.length)
      }
      results = words
    }
    if (results) {
      if (limit) {
        results = results.slice(0, limit)
      }
      return results
    }
  }
}
