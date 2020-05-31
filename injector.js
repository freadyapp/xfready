console.log("im fucken loadddded bitch, sending message")
// import { $ } from 
// const $ = require('./third_party/jquery.min')
// document.querySelector("#read").addEventListener("click",
//   (e) => {
//     // console.log('dicks brub')
    
//   })

let frd = null
chrome.runtime.sendMessage({ request: "frd" }, function (response) {
  console.log(response.frd)
  frd = response.frd
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
let frame = $('<iframe id="freadysscreen" src="http://localhost:3000/lector?art=59" style="position:fixed;z-index:999999999999999999;" width="100%" height="100%"></iframe>')
// $(document.body).prepend(frame)
// $(frame).remove()

// $(te).appendTo('body')
// $('#freadysscreen').fadeTo(0, 0.001)
// $('#freadysscreen').fadeTo(0, 0.001)

let show = true
function showhide(){
  show = !show
  if (show){
    console.log('showing')

    $(document.body).prepend(frame)
  }else{
    console.log('hidin')

    $(frame).remove()

  }
}
// You can use native DOM methods to insert the fragment:
// document.write('dicks')
// document.body.insertBefore(fragment, document.body.childNodes[0]);

addEventListener('keydown', ()=>{
  showhide()
})
// setTimeout(() => { $('#freadysscreen').fadeOut()}, 10000)
