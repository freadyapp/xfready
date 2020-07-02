const blacklisted_urls = [
  'google', 'youtube', 'instagram', 'facebook', 'tiktok',
  'duckduckgo', 'chrome:'
]

function check_url(url){
  let ary = url.replace("https://", "").replace("http://", "").split("/")[0].split("www.")
  let host = ary[ary.length - 1]
  return !(blacklisted_urls.some(voo => { 
    if (host.includes(voo)){
      return true
    }
  }))
}

function get_pref(pref, def){
  return JSON.parse(u.prefs)[pref] ? JSON.parse(u.prefs)[pref] : def
}