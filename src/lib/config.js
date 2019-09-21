// const dictionaryServer = 'http://hsk-server.local:8888/'
const dictionaryServer = 'https://server.chinesezerotohero.com/'

// const lrcServer = 'http://lyrics-search.local:8888/'
const lrcServer = 'https://lyrics-search.chinesezerotohero.com/'

export default {
  server: dictionaryServer,
  lrcServer: lrcServer,
  sketchEngineProxy: dictionaryServer + 'sketch-engine-proxy.php',
  proxy: dictionaryServer + 'proxy.php',
  jsonProxy: dictionaryServer + 'json-proxy.php',
  scrape: dictionaryServer + 'scrape.php',
  scrape2: dictionaryServer + 'scrape2.php',
  imageProxy: dictionaryServer + 'image.php',
  listPhotos: dictionaryServer + 'list-photos.php',
  savePhoto: dictionaryServer + 'save-photo.php',
  imageUrl: dictionaryServer + 'img/words/',
  animatedSvgUrl: dictionaryServer + 'data/svgs/',
  lrcSearch: lrcServer + 'lrc/search/',
  wiki: 'https://directus.chinesezerotohero.com/_/',
  wikiAdmin: 'https://directus.chinesezerotohero.com/admin/#/'
}
