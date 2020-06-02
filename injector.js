let frd = null
let frame = null
let show = false
let saved = false


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

// front

function showhide(){
  show = !show
  if (show){
    $("#readthisfready").addClass("exit")
    $("#readthisfready").text(`EXIT`)
    console.log('showing')
    $(document.body).prepend(frame)
    $(frame).fadeTo(0, 0.01)
    $(frame).fadeTo(200, 1)
  }else{

    $("#readthisfready").removeClass("exit")
    $("#readthisfready").text(`READ`)
    console.log('hidin')
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


// when loaded run this

$(document.body).prepend(ui)

$("#readthisfready").click(() => {
  showhide()
})

$("#savethisfready").click( () => {
  saveunsave()
})

chrome.runtime.sendMessage({ request: "frd" }, function (response) {
  console.log(response.frd)
  frd = response.frd
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/xapi/read?loc=${frd['url']}" style="position:fixed;z-index:9696969696;" width="100%" height="100%"></iframe>`)
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/lector?art=59" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
  if (frd.saved){
    saveunsave()
  }
})
