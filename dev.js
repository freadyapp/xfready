const DEVELOPMENT = true
const FREADY_API = DEVELOPMENT ? "http://localhost:3000" : "https://www.fready.co"

const POPUP_DEFAULT = false // if true popup will trigger with one click
const ART_LOCATOR_LEN = 10// 30 chars icluding spaces to find where the article is located in the dom
const DEF_PREF = {
  // if the user doesnt have any prefs these will be used to calculate stuff
  "wpm": 250
}

function log(txt) {
  if (!DEVELOPMENT) return true
  console.log(txt)
}
function table(txt) {
  if (!DEVELOPMENT) return true
  console.table(txt)
}
