let user = null
let frd = null
let frame = null
let read = false
let saved = false
let show = false


// talking with backend
function perform_save() {
  chrome.runtime.sendMessage({ request: "save", html: $('html')[0].outerHTML}, (response) => {
    console.log(response)
  })
}
function perform_unsave() {
  chrome.runtime.sendMessage({ request: "unsave" }, (response) => {
    console.log(response)
  })
}
function sync_up_user(){
  chrome.storage.sync.get(['freadyslovelyuser'], (data) => {
    user = data.freadyslovelyuser
    $("#username").text(user.name || "")
  })
}

// front
function visual_save(){
  $("#savethisfready").addClass("inactive")
  $("#savethisfready").html(`SAVED`)
}
function visual_unsave(){
  $("#savethisfready").removeClass("inactive")
  $("#savethisfready").html(`SAVE`)
}
function load_frd(inp){
  console.table('loading new frd', inp)
  frd = inp
  if (frd.saved){
    visual_save()
    saved = true
  }else{
    visual_unsave()
    saved = false
  }
}

function readexit(){
  read = !read
  if (read){
    $("#readthisfready").addClass("exit")
    $("#readthisfready").text(`EXIT`)
    $(document.body).prepend(frame)
    $(frame).fadeTo(0, 0.01)
    $(frame).fadeTo(200, 1)
  }else{

    $("#readthisfready").removeClass("exit")
    $("#readthisfready").text(`READ`)
    $(frame).fadeTo(200, 0.01, () => { $(frame).remove()})
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

// when loaded run this
sync_up_user()

$(document.body).prepend(ui)

$("#fready_ui")
  .fadeTo(0, 0.5)
  .css({ 'filter': 'saturate(0)' })
  .slideUp(0)

$("#readthisfready").click(() => {
  readexit()
})

$("#savethisfready").click( () => {
  saveunsave()
})

$(".freadyhide").click( () => {
  showhide()
})

chrome.runtime.sendMessage({ request: "frd" }, (response) => {
  load_frd(response.frd)
  console.log(response.frd)
  // frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/xapi/read?loc=${frd['url']}" style="position:fixed;z-index:9696969696;" width="100%" height="100%"></iframe>`)
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/lector?art=${frd.id}" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.trigger == "click") showhide()
  if (request.reload){
    console.table('updating frd', request.reload)
    load_frd(request.reload)
  }
})
