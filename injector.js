// import { $ } from 
// const $ = require('./third_party/jquery.min')
// document.querySelector("#read").addEventListener("click",
//   (e) => {
//     // console.log('dicks brub')
    
//   })

let frd = null
let frame = null
chrome.runtime.sendMessage({ request: "frd" }, function (response) {
  console.log(response.frd)
  frd = response.frd
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/xapi/read?loc=${frd['url']}" style="position:fixed;z-index:9696969696;" width="100%" height="100%"></iframe>`)
  frame = $(`<iframe id="freadysscreen" src="http://localhost:3000/lector?art=59" style="position:fixed;z-index:9696969696;border:none" width="100%" height="100%"></iframe>`)
})

// document.body.appendChild = " dicks "

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

// var fragment = create();
// $('<iframe id="freadysscreen" src="http://localhost:3000/lector?art=59" style="position:fixed;z-index:999999999999999999;" width="100%" height="100%"></iframe>').appendTo(document.body)
// $(document.body).prepend(frame)
// $(frame).remove()

// $(te).appendTo('body')
// $('#freadysscreen').fadeTo(0, 0.001)
// $('#freadysscreen').fadeTo(0, 0.001)

let show = false
function showhide(){
  show = !show
  if (show){
    console.log('showing')
    $(document.body).prepend(frame)
    $(frame).fadeTo(0, 0.01)
    $(frame).fadeTo(200, 1)
  }else{
    console.log('hidin')
    $(frame).fadeTo(200, 0.01, () => { $(frame).remove()})
    
  }
}

let ui = `
<div class='fready_div' id='fready_ui'> 
  <div class='fready_button inline' id='savethisfready'>SAVE</div>
  <div class='fready_button inline' id='readthisfready'>READ</div>
</div>
`

// document.getElementById("someImage").src = imgURL
// $(document.body).prepend(ui)
// $("#heartthis").attr("src", imgURL)
$("#readthisfready").click(()=>{
  showhide()
})
// You can use native DOM methods to insert the fragment:
// document.write('dicks')
// document.body.insertBefore(fragment, document.body.childNodes[0]);

// addEventListener('keydown', ()=>{
//   showhide()
// })

// setTimeout(() => { $('#freadysscreen').fadeOut()}, 10000)
// chrome.browserAction.onClicked.addListener(tab => {
//   showhide()
// })