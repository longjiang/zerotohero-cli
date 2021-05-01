import Config from '@/lib/config'
import Helper from '@/lib/helper'

export default {
  limit: location.hash.replace('#', ''), // #perpage/page
  getLrcsWithoutYouTube(youtubeVue) {
    let url = Config.lrcServer + 'lrc/listnoyoutube/'
    if (this.limit) {
      url = url + this.limit
    }
    $.getJSON(url, function (result) {
      youtubeVue.lrcs = result
    })
  },
  thumbnail(id) {
    return `//img.youtube.com/vi/${id}/hqdefault.jpg`
  },
  searchYouTubeByProxy(searchTerm, callback) {
    $.ajax(
      Config.lrcServer +
      'proxy.php?' +
      'https://www.youtube.com/results?search_query=' +
      searchTerm.replace(/ /g, '+')
    ).done(function (response) {
      var videoIds = []
      // We use 'ownerDocument' so we don't load the images and scripts!
      // https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
      var ownerDocument = document.implementation.createHTMLDocument('virtual')
      let $html = $(response, ownerDocument)
      $html.find('.item-section li .yt-uix-tile-link').each(function () {
        if (
          !$(this)
            .attr('href')
            .includes('/channel/') &&
          !$(this)
            .attr('href')
            .includes('/user/')
        ) {
          videoIds.push(
            $(this)
              .attr('href')
              .replace('/watch?v=', '')
              .replace(/&list=.*/, '')
          )
        }
      })
      callback(videoIds)
    })
  },
  search(text, callback, options) {
    options = Object.assign({ l2: 'en', subs: false, cacheLife: -1 }, options)
    let subsQueryVar = options.subs ? '&sp=EgIoAQ%253D%253D' : ''
    Helper.scrape2(
      `https://www.youtube.com/results?search_query=${text.replace(
        / /g,
        '+'
      )}+lang%3A${options.l2}${subsQueryVar}`,
      options.cacheLife
    ).then($html => {
      let videos = []
      if ($html.find('.yt-lockup-content').length > 0) {
        for (let item of $html.find('.yt-lockup-content')) {
          if (
            !$(item)
              .find('.yt-uix-sessionlink')
              .attr('href')
              .includes('/channel/') &&
            !$(item)
              .find('.yt-uix-sessionlink')
              .attr('href')
              .includes('/user/')
          ) {
            let badge = $(item).find('.yt-badge')[0]
            let id = $(item)
              .find('.yt-uix-sessionlink')
              .attr('href')
              .replace('/watch?v=', '')
            let youtube = {
              id: id,
              cc: false,
              title: $(item)
                .find('.yt-uix-sessionlink')
                .attr('title'),
              thumbnail: this.thumbnail(id),
              url: 'https://www.youtube.com/watch?v=' + id
            }
            if (badge && ['CC', 'Untertitel'].includes(badge.innerText)) {
              youtube.cc = true
            }
            videos.push(youtube)
          }
        }
      }
      callback(videos)
    })
  },
  async searchByGoogle(options) {
    options = Object.assign({
      lang: 'en',
      captions: true,
      start: 0
    }, options)
    let $html = await Helper.scrape2(`https://www.google.com/search?q=${options.term ? options.term.replace(
      / /g,
      '+'
    ) : ''}&start=${options.start}&lr=lang_${options.lang}&safe=active&tbs=srcf:H4sIAAAAAAAAANOuzC8tKU1K1UvOz1VLS0xOTcrPz4ZwMnNyy1OT9Apy1ErKM0tKUovAwpl5QFZmIki4ID-nOLEkL7W8GMQDAIqXaqNKAAAA${options.captions ? ',cc:1' : ''}&tbm=vid`)
    let videos = []
    let main = $html.toArray().find(element => element.id === 'main')
    for (let a of $(main).find('a[href^="/url?q=https://www.youtube.com/watch"]')) {
      let url = $(a).attr('href').replace(/\/url\?q=([^&]+).*/, '$1')
      let title = $(a).find('div:first-child').text().replace(' - YouTube', '')
      let id = url.replace('https://www.youtube.com/watch%3Fv%3D', '')
      if (url && title && title !== '') {
        videos.push({
          id: id,
          cc: options.captions ? true : undefined,
          title: title,
          thumbnail: `//img.youtube.com/vi/${id}/hqdefault.jpg`
        })
      }
    }
    return videos
  },
  videoByApi(id, cacheLife = -1) {
    return new Promise(resolve => {
      $.getJSON(
        `${Config.youtubeVideo}?id=${id}&cache_life=${cacheLife}`
      ).then(response => {
        let video = false
        if (response.data.items && response.data.items.length > 0) {
          video = response.data.items.map(item => {
            return {
              id: id,
              title: item.snippet.title,
              channel: {
                title: item.snippet.channelTitle,
                id: item.snippet.channelId
              }
            }
          })[0]
        }
        resolve(video)
      })
    })
  },
  mapChannelPlaylistsData(item) {
    return {
      id: item.id,
      title: item.snippet ? item.snippet.title : false,
      thumbnail: item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.standard ? item.snippet.thumbnails.standard.url : false,
      count: item.contentDetails ? item.contentDetails.itemCount : false,
      data: item
    }
  },
  channelPlayListsByAPI(channelID, cacheLife = -1) {

    return new Promise(resolve => {
      $.getJSON(
        `${Config.youtubeChannelPlaylists}?channel=${channelID}&cache_life=${cacheLife}`
      ).then(response => {
        let playlists = []
        if (response.data.items) {
          playlists = response.data.items.map(this.mapChannelPlaylistsData)
        }

        let nextPageToken = response.data.nextPageToken
        if (nextPageToken) {
          $.getJSON(
            `${Config.youtubeChannelPlaylists}?channel=${channelID}&page_token=${nextPageToken}&cache_life=${cacheLife}`
          ).then(response => {
            if (response.data.items) {
              playlists = playlists.concat(
                response.data.items.map(this.mapChannelPlaylistsData)
              )
              resolve(playlists)
            }
          })
        } else {
          resolve(playlists)
        }
      })
    })
  },
  async playlistByApi(id, pageToken = false, cacheLife = -1) {
    let pageTokenQS = pageToken ? `&page_token=${pageToken}` : ''
    let response = await $.getJSON(
      `${Config.youtubePlaylist}?playlist_id=${id}${pageTokenQS}&cache_life=${cacheLife}`
    )
    let playlistItems = []
    if (response.data) {
      if (response.data.items) {
        playlistItems = response.data.items.map(item => {
          return {
            youtube_id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            channel_id: item.snippet.channelId
          }
        })
      }
      let nextPageToken = response.data.nextPageToken
      if (nextPageToken) {
        let moreItems = await this.playlistByApi(id, nextPageToken)
        return playlistItems.concat(moreItems)
      }
    }
    return playlistItems
  },
  playlist(playlistID, callback, cacheLife = -1) {
    Helper.scrape2(
      `https://www.youtube.com/playlist?list=${playlistID}`,
      cacheLife
    ).then($html => {
      let playlist = {
        id: playlistID,
        title: $html
          .find('.pl-header-title')
          .text()
          .trim(),
        videos: []
      }
      for (let item of $html.find('.pl-video.yt-uix-tile')) {
        let id = $(item).attr('data-video-id')
        let video = {
          title: $(item).attr('data-title'),
          id: id,
          thumbnail: this.thumbnail(id)
        }
        playlist.videos.push(video)
      }
      callback(playlist)
    })
  },
  channel(channelID, callback, cacheLife = -1) {
    // channelURL: https://www.youtube.com/user/TEDxTaipei https://www.youtube.com/channel/UCKFB_rVEFEF3l-onQGvGx1A
    Helper.scrape2(
      `https://www.youtube.com/channel/${channelID}/videos`,
      cacheLife
    ).then($html => {
      let channel = {
        id: channelID,
        title: $html.find('.branded-page-header-title-link').attr('title'),
        videos: [],
        avatar: $html.find('.channel-header-profile-image').eq(0).attr('src')
      }
      for (let item of $html.find('.yt-lockup-content')) {
        let badge = $(item).find('.yt-badge')[0]
        let id = $(item)
          .find('.yt-uix-sessionlink')
          .attr('href')
          .replace('/watch?v=', '')
        let youtube = {
          id: id,
          cc: false,
          title: $(item)
            .find('.yt-uix-sessionlink')
            .attr('title'),
          thumbnail: this.thumbnail(id),
          url: 'https://www.youtube.com/watch?v=' + id
        }
        if (badge && badge.innerText === 'CC') {
          youtube.cc = true
        }
        channel.videos.push(youtube)
      }
      callback(channel)
    })
  },
  channelPlaylists(channelID, callback, cacheLife = -1) {
    // channelURL: https://www.youtube.com/user/TEDxTaipei https://www.youtube.com/channel/UCKFB_rVEFEF3l-onQGvGx1A
    Helper.scrape2(
      `https://www.youtube.com/channel/${channelID}/playlists`,
      cacheLife
    ).then($html => {
      let playlists = []
      for (let item of $html.find('.yt-shelf-grid-item')) {
        if (
          item &&
          $(item)
            .find('.yt-uix-tile-link')
            .attr('href')
        ) {
          let playlist = {
            id: $(item)
              .find('.yt-uix-tile-link')
              .attr('href')
              .replace(/.*list=(.*)/, '$1'),
            title: $(item)
              .find('.yt-uix-tile-link')
              .text()
              .trim(),
            thumbnail:
              $(item)
                .find('[data-ytimg]')
                .attr('data-thumb') ||
              $(item)
                .find('[data-ytimg]')
                .attr('src'),
            count: $(item)
              .find('.formatted-video-count-label b')
              .text()
          }
          playlists.push(playlist)
        }
      }
      callback(playlists)
    })
  },
  async searchSubs(terms, excludeTerms, lang = 'en', langId = 1824, adminMode) {
    let videos = []
    let channelFilter = ''
    let approvedChannels = Config.approvedChannels[lang]
    if (approvedChannels) {
      channelFilter = `&filter[channel_id][in]=${approvedChannels.join(',')}`
    }
    let promises = []
    for (let term of terms) {
      promises.push(
        $.getJSON(
          `${Config.wiki}items/youtube_videos?filter[subs_l2][rlike]=${
            '%' + term.replace(/\*/g, '%') + '%'
          }${channelFilter}&filter[l2][eq]=${
            langId
          }&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${
            adminMode ? Date.now() : 0
          }`
        ).then((response) => {
          if (response && response.data && response.data.length > 0) {
            videos = videos.concat(response.data)
          }
        })
      )
    }
    await Promise.all(promises)
    if (approvedChannels && videos.length < 3) {
      promises = []
      channelFilter = `&filter[channel_id][in]=${Config.talkChannels[
        lang
      ].join(',')}`
      for (let term of terms) {
        promises.push(
          $.getJSON(
            `${Config.wiki}items/youtube_videos?filter[subs_l2][rlike]=${
              '%' + term.replace(/\*/g, '%') + '%'
            }${channelFilter}&filter[l2][eq]=${
              langId
            }&fields=id,youtube_id,l2,title,level,topic,lesson,subs_l2&timestamp=${
              adminMode ? Date.now() : 0
            }`
          ).then((response) => {
            if (response && response.data && response.data.length > 0) {
              videos = videos.concat(response.data)
            }
          })
        )
      }
      await Promise.all(promises)
    }
    return this.getHits(videos, terms, excludeTerms)
  },
  getHits(videos, terms, excludeTerms) {
    let seenYouTubeIds = []
    let hits = []
    for (let video of videos) {
      if (!seenYouTubeIds.includes(video.youtube_id)) {
        seenYouTubeIds.push(video.youtube_id)
        video.subs_l2 = JSON.parse(video.subs_l2).filter(
          (line) => line.starttime
        )
        for (let index in video.subs_l2) {
          if (
            new RegExp(
              terms.join('|').replace(/[*]/g, '.+').replace(/[_]/g, '.')
            ).test(
              video.subs_l2[index].line +
                (terms[0].replace('*', '').includes('*') &&
                video.subs_l2[Number(index) + 1]
                  ? ' ' + video.subs_l2[Number(index) + 1].line
                  : '')
            ) &&
            (excludeTerms.length === 0 ||
              !new RegExp(excludeTerms.join('|')).test(
                video.subs_l2[index].line
              ))
          ) {
            hits.push({
              video: video,
              lineIndex: index,
            })
          }
        }
      }
    }
    for (let hit of hits) {
      if (!hit.leftContext) {
        let line =
          (hit.lineIndex > 0
            ? hit.video.subs_l2[hit.lineIndex - 1].line
            : '') + hit.video.subs_l2[hit.lineIndex].line
        let regex = new RegExp(
          `(${terms
            .join('|')
            .replace(/[*]/g, '.+')
            .replace(/[_]/g, '.')}).*`
        )
        hit.leftContext = line.replace(regex, '').split('').reverse().join('')
      }
      if (!hit.rightContext) {
        let line = hit.video.subs_l2[hit.lineIndex].line
        let regex = new RegExp(
          `.*(${terms
            .join('|')
            .replace(/[*]/g, '.+')
            .replace(/[_]/g, '.')})`
        )
        hit.rightContext = line.replace(regex, '')
      }
    }
    return hits.sort((a, b) =>
      a.rightContext.localeCompare(b.rightContext, 'zh-CN')
    )
  },
}
