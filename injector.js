let frd = null
let frame = null
let read = false
let saved = false
let show = false

let name = ""

// talking with backend
function perform_save() {
  chrome.runtime.sendMessage({ request: "save" }, (response) => {
    console.log(response)
  })
}
function perform_unsave() {
  chrome.runtime.sendMessage({ request: "unsave" }, (response) => {
    console.log(response)
  })
}
function perform_user_data_setup(){
  chrome.storage.sync.get(['freadysusername'], (result) => {
    name = result.freadysusername || ""
    $("#username").text(name)
  })
}

// front
function load_frd(inp){
  console.table('loading new frd', inp)
  frd = inp
  if (frd.saved != inp){
    console.log(`this article is actually ${frd.saved ? 'saved' : 'unsaved'}`)
    saveunsave()
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
    $("#savethisfready").addClass("inactive")
    $("#savethisfready").html(`SAVED`)
    perform_save()
  }else{
    perform_unsave()
    $("#savethisfready").removeClass("inactive")
    $("#savethisfready").html(`SAVE`)
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

$(document.body).prepend(ui)

$("#fready_ui")
  .fadeTo(0, 0.5)
  .css({ 'filter': 'saturate(0)' })
  .slideUp(0)
// showhide()
perform_user_data_setup()

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
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/xapi/read?loc=${frd['url']}" style="position:fixed;z-index:9696969696;" width="100%" height="100%"></iframe>`)
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/lector?art=59" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
  // if (frd.saved) saveunsave()
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.trigger == "click") showhide()
  if (request.reload){
    console.table('updating frd', request.reload)
    load_frd(request.reload)
  }
})
