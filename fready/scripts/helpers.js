const blacklisted_urls = [
  'google', 'youtube', 'instagram', 'facebook', 'tiktok', 'reddit', 'netflix', 'shopify', 'webflow',
  'duckduckgo', 'chrome:', 'fready'
]
const blacklisted_subs = [ "", null, 'home', 'contact', 'splash', "dashboard" ]

function check_url(url){
  let ary = url.replace("https://", "").replace("http://", "").split("/")
  let host = ary[0].replace("www.", "")
  let sub = (ary[1].split("?"))[0]
  log(host)
  log(sub)
  return !(blacklisted_urls.some(voo => { 
    if (host.includes(voo)){
      log('BLACKLIST domain')
      return true
    }
  })) && !(blacklisted_subs.some(voo => { 
    if (sub == voo){
      log('BLACKLIST subsdomain')
      return true
    }
  }))
}

function jdig(json, key){
  // digs a key from a json
  return JSON.parse(json)[key] || null
}
function get_pref(pref, def){
  return JSON.parse(u.prefs)[pref] ? JSON.parse(u.prefs)[pref] : def
}

function idleTimer(options) {
  options = options || {};
  var callback = options.callback || function () { };
  var activeCallback = options.activeCallback || function () { };
  var idleTime = options.idleTime || 60000;
  var isActive = true;
  var timer;

  addOrRemoveEvents('addEventListener');
  activate();

  function addOrRemoveEvents(addOrRemove) {
    window[addOrRemove]('load', activate);
    document[addOrRemove]('mousemove', activate);
    document[addOrRemove]('scroll', activate);
    document[addOrRemove]('keypress', activate);
  }

  function activate() {
    if (!isActive) {
      isActive = true;
      activeCallback();
    }
    clearTimeout(timer);
    timer = setTimeout(idle, idleTime);
  }

  function idle() {
    if (!isActive) return;
    isActive = false;
    callback();
  }

  function destroy() {
    clearTimeout(timer);
    addOrRemoveEvents('removeEventListener');
  }

  return {
    activate: activate,
    destroy: destroy,
    idle: idle
  };
}



function qtippy(element, content){
  return tippy(element[0], {
    content: content,
    arrow: false,
    appendTo: 'parent'
  })
}
function is_in_view(elem){
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function calc_eta_from_chars(chars=50, wpm=250){
  return Math.ceil((chars / 4.7) / wpm)
}

