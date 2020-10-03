const DEVELOPMENT = true
const FREADY_API = DEVELOPMENT ? "http://localhost:3000" : "https://www.fready.co"

const POPUP_DEFAULT = false // if true popup will trigger with one click
const ART_LOCATOR_LEN = 25 // 30 chars icluding spaces to find where the article is located in the dom
const ART_LOCATOR_SHIFT = 10// 30 chars icluding spaces to find where the article is located in the dom
const CHILL_OUT_TIME = 550 // how long to wait before poping the popup in ms
const MIN_WORDS_FOR_FREADABLE = 250 // how many words should the doc have to be a freadable and inject alma
const DEF_PREF = {
  // if the user doesnt have any prefs these will be used to calculate stuff
  "wpm": 250
}
const CONTENT_SCRIPTS = [
  "third_party/jquery.min.js",
  "third_party/minihtml.min.js",
  "third_party/mousetrap.min.js",
  "third_party/readability.js",
  "third_party/readable.js",
  "dev.js",
  "assets/ui.js",
  "helpers.js",
  "injector.js"
]

const CONTENT_CSS = [ 'injector.css' ]

function log(txt) {
  if (!DEVELOPMENT) return true
  console.log(txt)
}
function table(txt) {
  if (!DEVELOPMENT) return true
  console.table(txt)
}
