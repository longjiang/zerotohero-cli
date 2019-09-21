import Helper from '@/lib/helper'

export default {
  host: /.+\.wikisource\.org/,
  name: 'Wikisource',
  example(lang) {
    return `https://${lang}.wikisource.org/wiki/(Article Name)`
  },
  logo(lang) {
    return `https://${lang}.wikisource.org/static/images/project-logos/${lang}wikisource.png`
  },
  async getChapter(url, lang) {
    let $chapterHTML = await Helper.scrape2(url)
    let a = $chapterHTML.find('#ws-author a')
    let bookPath = $(a).attr('href')
    let book = {
      url: bookPath ? `https://${lang}.wikisource.org${bookPath}` : undefined,
      title: $chapterHTML.find('.subpages a').text(),
      author: $(a).text(),
      thumbnail: '',
      chapters: []
    }
    if (book.url) {
      book = await this.getBook(book.url)
    }
    $chapterHTML
      .find('*')
      .contents()
      .each(function() {
        if (this.nodeType === Node.COMMENT_NODE) {
          $(this).remove()
        }
      })
    $chapterHTML.find('.ws-noexport').remove()
    for (let a of $chapterHTML.find('.mw-parser-output a')) {
      $(a).attr(
        'href',
        Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
      )
    }
    let chapter = {
      title: $chapterHTML
        .find('#firstHeading')
        .text()
        .trim(),
      content: $chapterHTML.find('.mw-parser-output').html(),
      book: book
    }
    return chapter
  },
  async getBook(url, lang) {
    let $bookHTML = await Helper.scrape2(url)
    let chapters = []
    if (lang === 'fr') {
      for (let a of $bookHTML.find('.mw-parser-output > ul a')) {
        let title = $(a)
          .text()
          .trim()
        if (title && title !== '') {
          chapters.push({
            title: title,
            url: Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
          })
        }
      }
    } else if (lang === 'de') {
      for (let a of $bookHTML.find('.mw-parser-output b a')) {
        chapters.push({
          title: $(a).text(),
          url: Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
        })
      }
    }
    let thumbnail = undefined
    if (lang === 'de') {
      thumbnail = 'https:' + $bookHTML.find('table img').attr('src')
      links = $bookHTML.find('.mw-parser-output b a')
    } else if (lang === 'fr') {
      thumbnail = 'https:' + $bookHTML.find('img.photo').attr('src')
    }
    return {
      url: url,
      title: $bookHTML.find('#firstHeading').text(),
      thumbnail: thumbnail,
      chapters
    }
  },
  async getBooklist(url, lang) {
    let $html = await Helper.scrape2(url)
    $html
      .find('.mw-parser-output > p:first-child, #toc, .mw-editsection')
      .remove()
    let list = []
    if (lang === 'fr') {
      for (let a of $html.find('.mw-category a')) {
        list.push({
          url: `https://${lang}.wikisource.org${$(a).attr('href')}`,
          title: $(a)
            .text()
            .trim()
            .replace('Auteur:', '')
        })
      }
    } else if (lang === 'de') {
      for (let a of $html.find('.mw-parser-output td:first-child a')) {
        list.push({
          url: `https://${lang}.wikisource.org${$(a).attr('href')}`,
          title: $(a)
            .text()
            .trim()
        })
      }
    }
    return list.filter(item => !item.title.includes('Категория:'))
  },
  booklists(lang) {
    let booklists = []
    if (lang === 'de') {
      booklists = [
        {
          title: 'Browse Authors',
          url: 'https://de.wikisource.org/wiki/Liste_der_Autoren'
        }
      ]
    }
    if (lang === 'fr') {
      for (let letter of [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]) {
        booklists.push({
          title: letter,
          url: 'https://fr.wikisource.org/wiki/Cat%C3%A9gorie:Auteurs-' + letter
        })
      }
    }
    return booklists
  }
}
