var minifyy = require('html-minifier-terser').minify

let user = null
let frd = null
let frame = $(`<lector></lector>`)
let reading = false
let screen = ''
let saved = false
let show = POPUP_DEFAULT
let alma = null

function minify(html){
  return minifyy(html.toString(), { collapseWhitespace: true, removeComments: true, useShortDoctype: true, minifyJS: true, minifyCSS: true, removeAttributeQuotes: true })
}
function is_readable_(doc){
  return isProbablyReaderable(doc)
}
function calc_words(){
  // todo check if readability document parse is a null and dont get len
  return Math.round(((new Readability(document.cloneNode(true)).parse().length) / 5))
}

function slurp_body(){
  return minify(new Readability(document.cloneNode(true)).parse().content)
}

// ------------ talking with background ------------ //

function sync_frd() {
  log(`> Syncing FRD - current frd - ${frd}`)
  chrome.runtime.sendMessage({ frd: { eta: calc_words() } }, (response) => {
  })
}

function request(request_str, options={}){
  
  log(`> Requesting to ${request_str}`)
  let msg = { request: request_str }
  if (options.skip_slurp) msg.html = slurp_body() 

  chrome.runtime.sendMessage(msg, (response) => {
    log(`> Response: ${response}`)
  })
}

function update_eta(){
  chrome.runtime.sendMessage( { request: 'eta', eta: calc_words() })
}

function calc_eta(){
  if (user == null) return -1 
  return Math.floor(calc_words() / (JSON.parse(user.prefs).wpm || 250)) 
}

function sync_user(){
  chrome.storage.sync.get(['freadyslovelyuser'], (data) => {
    user = data.freadyslovelyuser
    if (user.name) {
      $("#loggedinlink").show()
      $("#loggedoutlink").hide()
      $("#username").text(user.name)
    }else{
      $("#loggedinlink").hide()
      $("#loggedoutlink").show()
    }
  })
}

function load_frd(new_frd, cmd=null){
  if (!(new_frd && new_frd.id && user)) return false

  log(`> Loading new FRD - command: ${cmd}`)
  table(new_frd)
  
  // TODO fix this shit
  frd = new_frd
  $(frame).html(make_frame())
  screen = $('#freadysscreen')
  screen.fadeOut()
  if (cmd == 'read') {
    log('> CMD read - toggling read')
    toggle_read()
  }else{
    reading = true
    readexit(false)
  }

  if (new_frd.saved){
    visual_save()
    saved = true
  }else{
    visual_unsave()
    saved = false
  }

  return new_frd
}


// ------------ front end ------------ //
function make_frame(){
  return `<div id='screen-bg'></div>
<div id="freadysscreen"><iframe onload="this.contentWindow.focus();" src="${FREADY_API}/lector?art=${frd.id}&api_key=${user.api_key}" width=100% height=100% style="border: none;"></iframe></div>`
}

function visual_save(){
  $("#savethisfready").addClass("x-fready-inactive")
  $("#savethisfready").html(`SAVED`)
}
function visual_unsave(){
  $("#savethisfready").removeClass("x-fready-inactive")
  $("#savethisfready").html(`SAVE`)
}

function inject_lector(){
  $("#readthisfready").addClass("x-fready-exit")
  $("#readthisfready").text(`EXIT`)
  //$(document.body).fadeOut(210)
  $(frame).insertAfter(document.body)
  $(frame).fadeTo(0, 0.01)
  $(frame).fadeTo(1200, 1)
}

function toggle_read(){
  if (reading) return false;
  if (frd!=null){
    log('> Injecting lector & starting to read.. Have fun reading!')     
    reading = true
  
    inject_lector()
  }else{
    log('> FRD not ready. Requesting read')
    request('read')
  }
}

function readexit(pop=false){
  reading = !reading
  if (frd !=null && reading){
    table(frd)
    if (pop){
      $("#readthisfready").addClass("x-fready-exit")
      $("#readthisfready").text(`EXIT`)
      //$(document.body).fadeOut(210)
      $(frame).insertAfter(document.body)
      //$(frame).find('iframe').fadeTo(0, 0.01)
      //$(frame).find('iframe').fadeTo(200, 1)
    }else{
      request('read')
      $("#readthisfready").addClass("x-fready-exit")
      $("#readthisfready").text(`EXIT`)
      //$(document.body).fadeTo(200, 0.5)
    }
    
    setTimeout(() => {
      $("fready-x").fadeIn()
    }, 4000)
  }else{
    $("#readthisfready").removeClass("x-fready-exit")
    $("#readthisfready").text(`READ`)
    $(document.body).fadeIn()
    //$(frame).fadeTo(200, 0.01, () => { $(frame).remove() })
    $("fready-x").fadeOut()
  }
}

function saveunsave(){
  saved = !saved
  if (saved){
    visual_save()
    request('save')
  }else{
    visual_unsave()
    request('unsave', {skip_slurp: true})
  }
}

function toggle_show(){
  show = true
  $('#fready_ui')
    .css({'filter': 'saturate(1)'})
    .slideDown(70)
    .fadeTo(10, 1)
}
function toggle_hide(){
  show = false
  $("#fready_ui")
    .css({ 'filter': 'saturate(0)' })
    .fadeTo(200, 0.5)
    .slideUp(100)
}
  
function showhide(){
  show = !show
  if (show){
    toggle_show()
  }else{
    toggle_hide()
  }
}

function cleanup(){
  $('fready').remove()
  $('lector').remove()
  $(document.body).fadeIn()
}

// ------------ listeners ------------ //

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.trigger == "click") showhide()
  if (request.user){
    sync_user(request.user)
  }
  if (request.frd){
    load_frd(request.frd, request.cmd)
  }
  if (request.eta){
    log('sending eta to background script')
    return sendResponse(10)
  }
  return sendResponse('ok')
})

function locate_art(){
  // TODO improve this
  let text_identifier = $(slurp_body()).find('p').text().slice(ART_LOCATOR_SHIFT, ART_LOCATOR_LEN+ART_LOCATOR_SHIFT)
  log(text_identifier)
  let art_locator = null
  let search_these =   [ 'p', 'span', 'div', 'article', 'table', 'h1', 'h2', 'h3', 'h5', 'h6', '' ]
  search_these.some( el => {
    art_locator = $(`${el}:contains("${text_identifier}")`)
    log(`${el}:contains("${text_identifier}")`)
    if (art_locator != null && art_locator.text().length > 1 ){
      art_locator = $(art_locator[art_locator.length-1])
      return true
    }
  })
  art_locator = art_locator || $(document.body)
  log(art_locator)
  return art_locator
}

function load_fready(){
  // cleanup() // clean up before starting a new instance
  sync_user()   // sync up with local user before triggering any functions
  sync_frd()    // sync frd with backend
  $(ui).insertAfter(document.body)
  // update_eta()

  if (!show){
    $("#fready_ui")
    .fadeTo(0, 0.5)
    .css({ 'filter': 'saturate(0)' })
    .slideUp(0)
  }

  $("#readthisfready").click(() => {
    readexit()
  })
  $("#savethisfready").click(() => {
    saveunsave()
  })
  $(".freadyhide").click(() => {
    showhide()
  })

  $("fready-x").click(() => {
    readexit(true)
  })
}
// TODO make menu like this
class Alma {
  constructor(art_locator){
    log('> Creating & Injecting Alma')
    this.dom = this.make_alma()
    inject_alma(this.dom, art_locator)
    this.dom.fadeTo(0, .01)
    // declaring some shortcuts
    this.space_to_read = this.dom.find('#fready-alma-space')
    this.logo = this.dom.find('#fready-alma-logo')
    this.eta = this.dom.find('#fready-alma-eta')
    this.appear()
  }
  appear(){
    log('> Fading Alma in')
    let final_width = this.dom.width()
    this.dom.css({'width': this.dom.height()})
    this.space_to_read.fadeOut(0)
    this.eta.fadeOut(0)

    this.dom.fadeTo(450, 1, 'swing')
    setTimeout( () => {
      this.eta.fadeIn(100)
      setTimeout(() => this.space_to_read.fadeIn(100), 300)
      setTimeout(() => this.space_to_read.fadeTo(350, .3), 600)
      setTimeout(() => this.space_to_read.fadeTo(400, 1), 1000)
      this.logo.fadeOut(100)
      this.dom.animate({
        width: final_width 
      }, {duration: 450})
    }, 1200)
  }
  disappear(){
    
  }
  hover(){
    
  }
  make_alma(){
    return $(`
    <fready-alma>
      <div class='fready-alma-left' id='fready-alma-logo'>${fready_logo}</div>
      <div class='fready-alma-left' id='fready-alma-eta'>${calc_eta()}'</div>

      <div class='fready-alma-right' id='fready-alma-space'>${space_to_read}</div>
    </fready-alma>`)
  }
}
// ------------ onload ------------ //
log(`this is actually ${ is_readable_(document) ? "" : "not"} readable`)
if (is_readable_(document)){
  load_fready()
  setTimeout( () => {
    let art_locator = locate_art()
    log(art_locator)
    art_locator.addClass('fready-art-locator')
    alma = new Alma(art_locator)
    Mousetrap.bind('space', () => {toggle_read(); return false})
  }, CHILL_OUT_TIME)
}

