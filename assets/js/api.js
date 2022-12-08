import apiClient from '~/assets/js/apiClient'
import jsonapiParse from 'jsonapi-parse'
const prefix = '/jsonapi'
const findRouterPath = '/router/translate-path?path='

export async function voteUpdate (nid, point) {
  await apiClient.post('/entity/vote?_format=json',
  {
    "type": "serie_review",
    "entity_type": ["node"],
    "entity_id": [nid],
    "value": [point],
    "value_type": ["points"]
  })
}

export async function getSeriesArticlesById (id) {
  let res = null
  console.log('id', id)
  try {
    const { data } = await apiClient.get(prefix + '/articles?filter[field_series_main.id]=' + id + '&include=field_thumbnail_article')
    console.log('data in api ', data)
    res = data
  }
  catch (err) {
    console.log('err', err.response.status)
    res = err.response.status
  }

  if (res == 404) {
    return res
  } else {
    return jsonapiParse.parse(res).data
  }
}

export async function getSeriesArticles () {
  const { data } = await apiClient.get(prefix + '/articles?page[limit]=6&include=field_thumbnail_article&sort=-nid')
  return jsonapiParse.parse(data).data
}

export async function getArticleById (id) {
  const { data } = await apiClient.get(prefix + '/articles?filter[nid]=' + id)
  return jsonapiParse.parse(data).data
}

export async function voteResult (nid) {
  const { data } = await apiClient.get('/vote/serie/result/' + nid)
  return data
  //return jsonapiParse.parse(data).data
}

export async function searchSeries (query) {
  const { data } = await apiClient.get(prefix + '/series?filter[status][value]=1&filter[title][operator]=CONTAINS&filter[title][value]=' + query + '&include=field_poster')
  return jsonapiParse.parse(data).data
}

export async function getSeriesSticky () {
  const { data } = await apiClient.get(prefix + '/series?filter[sticky][condition][path]=sticky&filter[sticky][condition][operator]=%3D&filter[sticky][condition][value]=1&page[limit]=5&include=field_poster,field_celeb,field_celeb.field_celeb_profile')
  return jsonapiParse.parse(data).data
}

export async function getSerieById_minimal (nid) {
  const { data } = await apiClient.get(prefix + '/series?filter[nid]=' + nid + '&include=field_poster')
  return jsonapiParse.parse(data).data
}

export async function getSerieById (id) {
  const { data } = await apiClient.get(prefix + '/series?filter[nid]=' + id + '&include=field_poster,field_celeb,field_celeb.field_celeb_profile,field_episode_series,field_episode_series.field_thumbnail,field_serie_year,field_series_type')
  return jsonapiParse.parse(data).data
}

export async function getSerieByUuid (uuid, include = '') {
  const { data } = await apiClient.get(prefix + '/series/' + uuid + include)
  return jsonapiParse.parse(data).data
}

export async function getSerieCelebByUuid (uuid) {
  const { data } = await apiClient.get(prefix + '/series/' + uuid + '?include=field_poster,field_celeb,field_celeb.field_celeb_profile')
  return jsonapiParse.parse(data).data
}

export async function getCelebById (id) {
  const { data } = await apiClient.get(prefix + '/celebs?filter[nid]=' + id + '&include=field_celeb_profile,field_series_actors,field_series_actors.field_poster')
  return jsonapiParse.parse(data).data
}

export async function getUuidByPath (path) {
  const uri = findRouterPath + path
  const router = await apiClient.get(uri)
  return router.data.entity.uuid
}

export async function getArticleByPath (path) {
  console.log(path)
  const uri = findRouterPath + '/articles/' + path
  const { data } = await apiClient.post('/subrequests?_format=json',
    [
      {
        'requestId': 'router',
        'action': 'view',
        'uri': uri,
        'headers': { 'Accept': 'application/vnd.application+json' }
      },
      {
        'requestId': 'node',
        'action': 'view',
        'uri': '/jsonapi/articles?filter[id]={{router.body@$.entity.uuid}}',
        'Accept': 'application/json',
        'waitFor': ['router']
      }
    ], { auth: { username: process.env.userDrupal, password: process.env.passDrupal } })
  return jsonapiParse.parse(JSON.parse(data['node#uri{0}'].body)).data
}

export async function getSerieByPath (path, env) {
  const uri = findRouterPath + '/series/' + path
  const { data } = await apiClient.post('/subrequests?_format=json',
    [
      {
        'requestId': 'router',
        'action': 'view',
        'uri': uri,
        'headers': { 'Accept': 'application/vnd.application+json' }
      },
      {
        'requestId': 'node',
        'action': 'view',
        'uri': '/jsonapi/series/{{router.body@$.entity.uuid}}?include=field_poster,field_celeb,field_celeb.field_celeb_profile,field_series_type,field_serie_year,field_channel',
        'Accept': 'application/json',
        'waitFor': ['router']
      }
    ], { auth: { username: env.userDrupal, password: env.passDrupal } })
  return jsonapiParse.parse(JSON.parse(data['node#uri{0}'].body)).data
}


export async function getSmallSerieByPath (path) {
  const uri = findRouterPath + '/series/' + path
  const { data } = await apiClient.post('/subrequests?_format=json',
    [
      {
        'requestId': 'router',
        'action': 'view',
        'uri': uri,
        'headers': { 'Accept': 'application/vnd.application+json' }
      },
      {
        'requestId': 'node',
        'action': 'view',
        'uri': '/jsonapi/series/{{router.body@$.entity.uuid}}?sort=-nid',
        'Accept': 'application/json',
        'waitFor': ['router']
      }
    ], { auth: { username: process.env.userDrupal, password: process.env.passDrupal } })
  return jsonapiParse.parse(JSON.parse(data['node#uri{0}'].body)).data
}

export async function getAllEpisodesBySeriesPath (path) {
  const uri = findRouterPath + '/series/' + path
  const { data } = await apiClient.post('/subrequests?_format=json',
    [
      {
        'requestId': 'router',
        'action': 'view',
        'uri': uri,
        'headers': { 'Accept': 'application/vnd.application+json' }
      },
      {
        'requestId': 'node',
        'action': 'view',
        'uri': '/jsonapi/episodes?filter[field_series_episode.id]={{router.body@$.entity.uuid}}&sort=-nid&include=field_thumbnail,field_img_streaming',
        'Accept': 'application/json',
        'waitFor': ['router']
      }
    ], { auth: { username: process.env.userDrupal, password: process.env.passDrupal } })

  return jsonapiParse.parse(JSON.parse(data['node#uri{0}'].body)).data
}

export async function getCelebByPath (path, env) {
  const uri = findRouterPath + '/celebs/' + path
  //console.log(path)
  const { data } = await apiClient.post('/subrequests?_format=json',
    [
      {
        'requestId': 'router',
        'action': 'view',
        'uri': uri,
        'headers': { 'Accept': 'application/vnd.application+json' }
      },
      {
        'requestId': 'node',
        'action': 'view',
        'uri': '/jsonapi/celebs/{{router.body@$.entity.uuid}}?include=field_celeb_profile,field_other_img,field_series_actors,field_series_actors.field_poster',
        'Accept': 'application/json',
        'waitFor': ['router']
      }
    ], { auth: { username: env.userDrupal, password: env.passDrupal } })
  return jsonapiParse.parse(JSON.parse(data['node#uri{0}'].body)).data
}

export async function getSeriesList (offset = 0, limit = 10) {
  const { data } = await apiClient.get(prefix + '/series?page[offset]=' + offset + '&page[limit]=' + limit + '&sort=-created&include=field_poster,field_series_type,field_serie_year')
  return jsonapiParse.parse(data).data
}

export async function getSeriesListWithYear (offset = 0, limit = 10, year = '2018') {
  const { data } = await apiClient.get(prefix + '/series?filter[field_serie_year][condition][path]=field_serie_year.name&filter[field_serie_year][condition][value]=' + year + '&page[offset]=' + offset + '&page[limit]=' + limit + '&sort=-created&include=field_poster,field_series_type,field_serie_year')
  return jsonapiParse.parse(data).data
}

export async function getSeriesType () {
  const { data } = await apiClient.get(prefix + '/taxonomy_term/praephthsiiriiy')
  return jsonapiParse.parse(data).data
}

export async function getSeriesYear () {
  const { data } = await apiClient.get(prefix + '/taxonomy_term/serie_year')
  return jsonapiParse.parse(data).data
}

export async function getSeriesChannel () {
  const { data } = await apiClient.get(prefix + '/taxonomy_term/chxng')
  return jsonapiParse.parse(data).data
}

export async function getSeriesByType (offset = 0, limit = 10, type) {
  const { data } = await apiClient.get(prefix + '/series?filter[field_series_type][condition][path]=field_series_type.name&filter[field_series_type][condition][value]=' + type + '&page[offset]=' + offset + '&page[limit]=' + limit + '&include=field_poster')
  return jsonapiParse.parse(data).data
}

export async function getSeriesByYear (offset = 0, limit = 10, year) {
  const { data } = await apiClient.get(prefix + '/series?filter[field_serie_year][condition][path]=field_serie_year.name&filter[field_serie_year][condition][value]=' + year + '&page[offset]=' + offset + '&page[limit]=' + limit + '&include=field_poster')
  return jsonapiParse.parse(data).data
}

export async function getSeriesByChannel (offset = 0, limit = 10, channel) {
  const { data } = await apiClient.get(prefix + '/series?filter[field_channel][condition][path]=field_channel.name&filter[field_channel][condition][value]=' + channel + '&page[offset]=' + offset + '&page[limit]=' + limit + '&include=field_poster')
  return jsonapiParse.parse(data).data
}

export async function getEpisodesBySerie (uuid) {
  const url = prefix + '/episodes/?filter[field_series_episode.id]=' + uuid + '&include=field_thumbnail,field_img_streaming,field_series_korea&sort=-nid'
  const { data } = await apiClient.get(url)
  return jsonapiParse.parse(data).data
}

export async function getLatestEpisodes (limit = 5) {
  const { data } = await apiClient.get(prefix + '/episodes?page[limit]=' + limit + '&sort=-nid&include=field_thumbnail,field_series_episode,field_series_episode.field_poster')
  return jsonapiParse.parse(data).data
}

export async function getEpisodesById (nid) {

}

export async function getSeriesOnair () {
  const { data } = await apiClient.get(prefix + '/series?filter[field_on_air][condition][path]=field_on_air&filter[field_on_air][condition][operator]=%3D&filter[field_on_air][condition][value]=1&sort=-nid&include=field_poster,field_celeb,field_celeb.field_celeb_profile')
  return jsonapiParse.parse(data).data
}

export async function getAllEpisodes (offset = 0, limit = 10) {
  const { data } = await apiClient.get(prefix + '/episodes?page[offset]=' + offset + '&page[limit]=' + limit + '&sort=-nid&include=field_thumbnail,field_series_episode,field_series_episode.field_poster')
  return jsonapiParse.parse(data).data
}

export async function getImgStreamingByUuid (uuid) {
  const { data } = await apiClient.get(prefix + '/episodes/' + uuid + '?include=field_img_streaming')
  return jsonapiParse.parse(data).data
}
