let user = null
let frd = null
let frame = $(`<lector></lector>`)
let read = false
let saved = false
let show = POPUP_DEFAULT
var minifyy = require('html-minifier-terser').minify

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
function w_body(){
  
}

// ------------ talking with background ------------ //
function request_new_frd() {
  log('requesting new frd')
  chrome.runtime.sendMessage({ frd: { eta: calc_words() } }, (response) => {
  })
}

function request(request_str){
  log('sending the request for new frd')
  chrome.runtime.sendMessage({ request: request_str, html: slurp_body()}, (response) => {
  })
}
function request_read() {
  log('requesting read frd')
  request("read")
}

function update_eta(){
  chrome.runtime.sendMessage( { request: 'eta', eta: calc_words() })
}

function perform_save() {
  log("saving")
  table(slurp_body())
  request("save")
}

function perform_unsave() {
  chrome.runtime.sendMessage({ request: "unsave" }, (response) => {
  })
}

function sync_up_user(){
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

// ------------ front ------------ //
function visual_save(){
  $("#savethisfready").addClass("x-fready-inactive")
  $("#savethisfready").html(`SAVED`)
}
function visual_unsave(){
  $("#savethisfready").removeClass("x-fready-inactive")
  $("#savethisfready").html(`SAVE`)
}

function load_frd(local_frd, cmd=null){
  log(`loading FRD [ ${local_frd != null ? "niada" : local_frd} ] - [ ${cmd} ]`)
  table(frd)

  if (local_frd != null && user != null){
    frd = local_frd
    $(frame).html(`<iframe id="freadysscreen" onload="this.contentWindow.focus();" src="${FREADY_API}/lector?art=${local_frd.id}&api_key=${user.api_key}" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
    // $(frame)[0].contentWindow.focus()
    if (cmd != null && cmd == 'read') {
      log('i need to read')
      $(document.body).fadeTo(200, 1)
      read = false
      readexit(true)
      setTimeout(() => {
        showhide()
      }, 1000)
    }else{
      read = true
      readexit(false)
    }

    if (local_frd.saved){
      visual_save()
      saved = true
    }else{
      visual_unsave()
      saved = false
    }
    return local_frd
  }else{
    return null
  }
}

function readexit(pop=false){
  read = !read
  if (frd !=null && read){
    table(frd)
    if (pop){
      $("#readthisfready").addClass("x-fready-exit")
      $("#readthisfready").text(`EXIT`)
      $(frame).insertAfter(document.body)
      $(document.body).fadeOut()
      $(frame).fadeTo(0, 0.01)
      $(frame).fadeTo(200, 1)
    }else{
      request_read()
      $("#readthisfready").addClass("x-fready-exit")
      $("#readthisfready").text(`EXIT`)

      $(document.body).fadeTo(200, 0.5)
    }
    
    setTimeout(() => {
      $("fready-x").fadeIn()
    }, 4000)
  }else{
    $("#readthisfready").removeClass("x-fready-exit")
    $("#readthisfready").text(`READ`)
    $(document.body).fadeIn()
    $(frame).fadeTo(200, 0.01, () => { $(frame).remove() })
    $("fready-x").fadeOut()
  }
}

function saveunsave(){
  saved = !saved
  if (saved){
    visual_save()
    perform_save()
  }else{
    perform_unsave()
    visual_unsave()
  }
}

function showhide(){
  show = !show
  if (show){
    $('#fready_ui')
      .css({'filter': 'saturate(1)'})
      .slideDown(70)
      .fadeTo(10, 1)
  }else{
    $("#fready_ui")
      .css({ 'filter': 'saturate(0)' })
      .fadeTo(200, 0.5)
      .slideUp(100)
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
    sync_up_user(request.user)
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

// ------------ onload ------------ //


cleanup() // clean up before starting a new instance
sync_up_user() // sync up with local user before triggering any functions

$(ui).insertAfter(document.body)
request_new_frd()
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

if (is_readable_(document)){
  log(`this is actually ${ is_readable_(document) ? "" : "not"} readable`)
  // let text_identifier = $(slurp_body()).text().slice(0, ART_LOCATOR_LEN)
  let text_identifier = $(slurp_body()).find('p').text().slice(0, ART_LOCATOR_LEN)
  log(text_identifier)
  let art_locator = null
  let search_these =   [ 'p', 'span', 'article', 'div', 'h1', 'h2', 'h3', 'h5', 'h6', '' ]
  search_these.some( el => {
    art_locator = $(`${el}:contains("${text_identifier}")`)
    log(`${el}:contains("${text_identifier}")`)
    if (art_locator != null && art_locator.text().length > 1 ){
      art_locator = $(art_locator[art_locator.length-1])
      return true
    }
  })
  log(art_locator)
  art_locator.addClass('fready-art-locator')
  tippy( ".fready-art-locator", {
    content: 'Press space to read with Fready!',
    placement: 'top-start',
    showOnCreate: true
  })
}

