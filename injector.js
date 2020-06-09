let user = null
let frd = null
let frame = null
let read = false
let saved = false
let show = false

// talking with backend
function request_new_frd() {
  log('requesting new frd')
  chrome.runtime.sendMessage({ request: "frd" }, (response) => {
    table(response)
  })
}
function request_read() {
  log('requesting read frd')
  chrome.runtime.sendMessage({ request: "read" }, (response) => {
    table(response)
  })
}

function perform_save() {
  chrome.runtime.sendMessage({ request: "save", html: $('html')[0].outerHTML}, (response) => {
    log(response)
  })
}
function perform_unsave() {
  chrome.runtime.sendMessage({ request: "unsave" }, (response) => {
    log(response)
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

// front
function visual_save(){
  $("#savethisfready").addClass("inactive")
  $("#savethisfready").html(`SAVED`)
}
function visual_unsave(){
  $("#savethisfready").removeClass("inactive")
  $("#savethisfready").html(`SAVE`)
}
function load_frd(local_frd, cmd=null){
  frd = local_frd
  table('loading new frd')
  table(frd)
  frame = $(`<iframe id="freadysscreen" src="${FREADY_API}/lector?art=${local_frd.id}" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
  if (local_frd.saved){
    visual_save()
    saved = true
    if (cmd != null && cmd == 'read'){
      console.log('i need to read')
      $(document.body).fadeTo(200, 1)
      read = false
      readexit()
    }
  }else{
    visual_unsave()
    saved = false
  }
}

function readexit(){
  read = !read
  if (frd !=null && read){
    table(frd)
    if (frd.saved){
      $("#readthisfready").addClass("exit")
      $("#readthisfready").text(`EXIT`)
      $(document.body).prepend(frame)
      $(frame).fadeTo(0, 0.01)
      $(frame).fadeTo(200, 1)
    }else{
      request_read()
      $(document.body).fadeTo(200, 0.5)
    }
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


request_new_frd()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.trigger == "click") showhide()
  if (request.user){
    sync_up_user(request.user)
  }
  if (request.frd){
    log('updating frd')
    table(request)
    load_frd(request.frd, request.cmd)
  }
  sendResponse('ok')
})
