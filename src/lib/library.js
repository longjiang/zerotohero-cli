import Wikisource from '@/lib/library-sources/wikisource'
import Wikipedia from '@/lib/library-sources/wikipedia'
import WOL from '@/lib/library-sources/wol'
import Litnet from '@/lib/library-sources/litnet'

export default {
  universalSources: [Wikipedia, Wikisource, WOL, Litnet],
  langSources: [],
  async setLangSources(sources) {
    for (let source of sources) {
      this.langSources.push(
        (await import(`@/lib/library-sources/${source}.js`)).default
      )
    }
  },
  sources() {
    return this.langSources.concat(this.universalSources)
  },
  source(url) {
    const host = url.replace(/.*\/\/([^/]*).*/, '$1')
    const source = this.sources().find(source => host.match(source.host))
    return source
  },
  getBook(url) {
    return this.source(url) ? this.source(url).getBook(url) : false
  },
  getChapter(url) {
    return this.source(url) ? this.source(url).getChapter(url) : false
  },
  getBooklist(url, lang) {
    
    return this.source(url) ? this.source(url).getBooklist(url, lang) : false
  }
}
