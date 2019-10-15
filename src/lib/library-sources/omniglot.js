import Helper from '@/lib/helper'

export default {
  host: /.+\.omniglot\.com.*/,
  name: 'Omniglot',
  example(l1) {
    return `https://www.omniglot.com/writing/(language name).htm`
  },
  logo(l1) {
    return 'http://www.omniglot.com/images/logos/logo_omniglot_round1.jpg'
  },
  async getChapter(url, l1) {
    let $chapterHTML = await Helper.scrape2(url, 0)
    let chapters = []
    for (let a of $chapterHTML.find('.info a')) {
      chapters.push({
        title: $(a).text().trim(),
        url: Helper.absoluteURL(url, $(a).attr('href'))
      })
    }
    let title = $chapterHTML.find('#body h1').text().trim()
    $chapterHTML.find('#body table').addClass('table').addClass('table-bordered')
    $chapterHTML.find('#body h1').remove()
    let chapter = {
      title,
      content: $chapterHTML.find('#body').html(),
      book: {
        title: chapters[0].title,
        chapters
      }
    }
    if(!url.includes('babel')) {
      chapter.lang = 'en'
    }
    return chapter
  },
  async getBook(url, l1) {
    let $bookHTML = await Helper.scrape2(url)
    let chapters = $bookHTML.find('.info a').map((index, a) => {
      return {
        title: $(a).text().trim(),
        url: $(a).attr('href') ? Helper.absoluteURL(url, $(a).attr('href')) : ''
      }
    }) || []
    return {
      url: url,
      title: chapters[0].title,
      chapters,
      lang: 'en'
    }
  },
  async getBooklist(url, l1) {
    let $html = await Helper.scrape2(url)
    let list = []
    for (let a of $html.find('#list2 a')) {
      list.push({
        url: Helper.absoluteURL(url, $(a).attr('href')),
        lang: 'en',
        title: $(a)
          .text()
          .trim()
      })
    }
    return list
  },
  booklists(l1) {
    return [[
      {
        url: `https://www.omniglot.com/writing/${l1}.htm`,
        title: `${l1} on Omniglot`
      }
    ]]
  }
}
