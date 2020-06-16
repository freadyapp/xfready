const DEVELOPMENT = false
const FREADY_API = DEVELOPMENT ? "http://localhost:3000" : "https://www.fready.co"

function log(txt) {
  if (!DEVELOPMENT) return true
  console.log(txt)
}
function table(txt) {
  if (!DEVELOPMENT) return true
  console.table(txt)
}
