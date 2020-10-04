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

function inject_alma(alma, art_start){
  $(art_start).prepend(alma) 
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
