export function nl2br (str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
      return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

export function getYoutubeId (url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  var match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  } else {
    return 'error'
  }
}

export function checkUrl (url) {
  const link = url.split('://')
  if (link[0] !== 'https'){
    return process.env.cdnUrl + url
  } else {
    return url
  }
}

export function getSerieObj (serie) {
  const tmp = {
    uuid: serie.uuid,
    nid: serie.nid,
    title: serie.title,
    poster: serie.field_poster[0].uri.url,
    path: serie.path.alias,
    score: 0
  }
  return tmp
}

export function getUserObj (auth) {
  const user = {}
  switch (auth.$state.strategy) {
    case 'facebook':
      user.sub_id = auth.$state.strategy + '|' + auth.$state.user.id
      user.name = auth.$state.user.name
      user.picture = auth.$state.user.picture.data.url
      user.email = auth.$state.user.email
      break
    case 'google':
      user.sub_id = auth.$state.strategy + '|' + auth.$state.user.sub
      user.name = auth.$state.user.name
      user.picture = auth.$state.user.picture
      user.email = auth.$state.user.email
      break
  }
  return user
}
