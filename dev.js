const FREADY_API = "http://localhost:3000"
const DEVELOPMENT = true

function log(txt) {
  if (!DEVELOPMENT) return true
  console.log(txt)
}
function table(txt) {
  if (!DEVELOPMENT) return true
  console.table(txt)
}
