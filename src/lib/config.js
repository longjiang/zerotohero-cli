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
  youtubeVideo: dictionaryServer + 'youtube-video.php',
  youtubePlaylist: dictionaryServer + 'youtube-playlist.php',
  imageUrl: dictionaryServer + 'img/words/',
  animatedSvgUrl: dictionaryServer + 'data/svgs/',
  lrcSearch: lrcServer + 'lrc/search/',
  wiki: 'https://directus.chinesezerotohero.com/_/',
  wikiAdmin: 'https://directus.chinesezerotohero.com/admin/#/',
  approvedChannels: {
    zh: [
      'UCUhpu5MJQ_bjPkXO00jyxsw', // iQiyi
      'UCYQPTeY3HOk0BprrGuCWCaA', // YouKu
      'UCiu3bj4rR8KOYcUA4KNkOAA', // WeTV
      'UCQatgKoA7lylp_UzvsLCgcw', // Tencent Video
      'UCmalSiRq25rjrpycAsS5ocA', // MangoTV
      'UCTulSfEm1c14WWRbSN-CNAQ', // MGTV Drama
      'UCW22wyIZecX1xgY4BkdRcbQ', // VSO Movie Channel
      'UCLsMbqJe_Oeqm6r9tvP1Nkg', // Clip Box
      'UCcLK3j-XWdGBnt5bR9NJHaQ', // CCTV
      'UCjnJ4buqbnpRVaT3IDUQPZQ', // CCTV chun wan
      'UCU5qmd5NvJljDBeM1sD-D1A', // Q1Q2
      'UC7ACqIQiy1SkjglQQ6bWDRg', // 捷成华视 Idol & Romance
      'UCKn4SloJmZYNYNq6RgzgrHw', // NewTV
      'UCPh1aKtroMioOCPHTGPwUBQ', // Classic
      'UChqXUTNBOnIaBEU7K6Le6FA', // 邓小平
      'UCShvs7P4CMTGzHTmEwZRcHQ', // 茶馆
      'UCIZwFGOBwV1wOvCaRMIgNRQ', // 地道战
      'UCEWBSXNFMVBc7p79dtIh3HA', // 刘罗锅
      'UC8a4CRn6S5Yq2wEJ07B70OA', // 刘罗锅
      'UC7Vl0YiY0rDlovqcCFN4yTA', // CCTV 电视剧
      'UCdpiId0eJGnnIvfhpbJIM1w', // 腾讯动漫
      'UC2B9maQhihZed6ovrnK1cBA', // MZTV Exclusive Chinese Drama
      'UCNORTw_uosRNGgdEjwdHvuw', // 大劇獨播MZTV
      'UC0jYsshDZfOBZC9nIJn94Cg', // China Zone
      'UCteBLoijWzlVFSR5BBtS_2Q', // 优优独播剧场 YoYo Television Series Exclusive
      'UCLsrDKheyHv7GYsTkMaw2bw', // 优优青春剧场 YoYo fun station
      'UC5-YbNL-MUy1_tC9KSkEShw', // Caravan中文剧场
      'UCPIRD4yr1hlAEovBCSNlAKg', // Croton MEGA HIT
      'UC7VY0GWLswq_Z48nkETL-yA', // Chinese Drama
      'UC3cbVxXQ-p-auBRVhGCmUmQ', // 华录百納熱播劇場
      'UCVm75cj78njo38Izz_suQQA',
      'UCWiS6QxFGFK-LKwwHzSsmHQ',
      'UCAMrnDQlsPnrScHun5PgrXw'
    ]
  }
}
