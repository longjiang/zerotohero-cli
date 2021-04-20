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
      'UCTF6rwqpN-QgtNK1ROAXu6g', // Q1Q2
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
      'UCAMrnDQlsPnrScHun5PgrXw',
      'UCCxMNXfmWlukwNRRxPO-P9A',
      'UCR3JG231i5rbq8NnM9Gp02Q',
      'UCRhpQlky8kT9ZtJ7WnH_3Wg',
      'UCYRLiAiyyRc-fRqdm2MaXzg',
      'UCfPmFrdqNLD-HFJpfjBs1Cg',
      'UCFSdTm2FE4BDThV3omA4UIA',
      'UC9M9sV3sGmutY26H4LNBTww',
      'UCQFyMGc6h30NMCd6HCk0ZPA',
      'UCE2UHXGOlqotRJgEWl_tiMw',
      'UCm6MXIlUFRv9-CBBGMNVf5w',
      'UCzc59v10qvwWRPrYoWUKEvQ',
      'UC9z0EFa_NEPdxIFIsm7_qzQ',
      'UC6KKrL5yrRBkUoHsFxVQlVg',
      'UCnHYtTFmgGodIWiRlc-mIGQ',
      'UCw1JmgFeYe9fDnjM05E2FQg',
      'UCcaKuPzlS9MXgMjHqtlZlDA',
      'UCUuZe7OB0yHSYAfu8annGKQ',
      'UCstdo3fo9H04nFVyaj2Bkew'
    ]
  },
  talkChannels: {
    zh: [
      'UCKFB_rVEFEF3l-onQGvGx1A', // 一席
      'UC1pGI-x2n70SuOIIykOlT9A', // 食谱
      'UCQEF54z0aOwpV2EtRsh6t_Q', // 易学族
      'UCulFhrW_YCwkq_BP16C82mA', // 一条
      'UCXWW8rllT5OQwSmeqaLcKYg', // 装修攻略
      'UCSs4A6HYKmHA2MG_0z-F0xw', // 李永乐老师
      'UC2Zqo6npCEH079SjnZ84v4g', // 课程
      'UCJsq4QYu9BaxXDk0qR8Ms3w', // 食谱
      'UCENJEn-rZ9VUrXw4krJwFsQ', // 大山
      'UCM33VtveeEmfA6LC7tH30Xw', // 袁腾飞
      'UCbi-ZrTUyuReTqPpqVGJ8pg', // 锵锵三人行
      'UCLROLAN8kmU7tGQDs6KH-bQ', // 妈咪说
      'UCg0m_Ah8P_MQbnn77-vYnYw', // 厨师长
    ]
  }
}
