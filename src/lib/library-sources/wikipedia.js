import Helper from '@/lib/helper'

export default {
  host: /.+\.wikipedia\.org/,
  name: 'Wikipedia',
  example(lang) {
    return `https://${lang}.wikipedia.org/wiki/(Article Title)`
  },
  logo(lang) {
    return `https://${lang}.wikipedia.org/static/images/project-logos/${lang}wiki.png`
  },
  async getChapter(url, lang) {
    let $chapterHTML = await Helper.scrape2(url, 0)
    $chapterHTML.find('.mw-parser-output > table:first-of-type').remove()
    $chapterHTML.find('.mw-editsection').remove()
    $chapterHTML.find('#headerContainer').remove()
    $chapterHTML.find('#toc').remove()
    $chapterHTML
      .find('*')
      .contents()
      .each(function() {
        if (this.nodeType === Node.COMMENT_NODE) {
          $(this).remove()
        }
      })
    let langs = []
    for (let a of $chapterHTML.find('#p-lang li a')) {
      langs.push({
        title: `${$(a).attr('title')} (${$(a).text()})`,
        url: $(a).attr('href')
      })
    }
    let title = $chapterHTML
      .find('#firstHeading')
      .text()
      .trim()
    for (let a of $chapterHTML.find('.mw-parser-output a')) {
      $(a).attr(
        'href',
        Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
      )
    }
    let chapter = {
      title: title,
      content: $chapterHTML.find('.mw-parser-output').html(),
      book: {
        title: title,
        chapters: langs
      }
    }
    return chapter
  },
  async getBook(url, lang) {
    let $bookHTML = await Helper.scrape2(url)
    let chapters = []
    for (let a of $bookHTML.find('#mw-pages li a')) {
      chapters.push({
        title: $(a).attr('title'),
        url: Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
      })
    }
    return {
      url: url,
      title: $bookHTML.find('#firstHeading').text(),
      chapters
    }
  },
  async getBooklist(url, lang) {
    let $html = await Helper.scrape2(url)
    let list = []
    for (let a of $html.find('#mw-content-text a')) {
      list.push({
        url: `https://${lang}.wikipedia.org${$(a).attr('href')}`,
        title: $(a)
          .text()
          .trim()
      })
    }
    return list
  },
  booklists(lang) {
    return []
  }
}
