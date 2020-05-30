const fready_api = "http://localhost:3000"
let tab_cache = {} // tab_id & data
let active_tab = null
class Fready {
  constructor(url, tab){
    this.url = url
    this.tab = tab
    this.fetched = false
  }
  set url(n){
    this.url_val = n
    this.update()
  }
  get url(){
    return this.url_val
  }
  get active(){
    return this.tab == active_tab
  }
  update(){
    this.fetch()
  }
  activate(){
    active_tab = this.tab
    this.render_badge('..')
    if (this.fetched) {
      console.log(`should change text to ${this.data['eta']}`)
      this.render_badge(`${this.data['eta']} mins`)
    }
  }
  fetch(){
    // chrome.browserAction.setBadgeText({ text: '...' })
    this.render_badge('...')
    console.log('fetching')
    this.fetched = false
    $.ajax({
      url: `${fready_api}/article_prev?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        // console.log(data)
        this.fetched = true
        this.data = data
        // this.activate()
        if (this.active){
          // console.log('im done fetching and im still the fucking active tab what the fuck is up')
          this.activate()
        }
        // chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
      },
      error: (data) => { 
        this.fetched = true
        console.log("failed to fetch url")
        // this.activate()
      }
    })
  }
  render(){

  }
  render_badge(txt){
    if (this.active){
      chrome.browserAction.setBadgeText({ text: txt })
    }
  }
}

function new_view(tab_id, url){
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  if (tab_id in tab_cache){
    let fready = tab_cache[tab_id]
    if (url == fready.url){
      console.log('fready exists, displaying')
      fready.activate()
    }else{
      console.log('fready exists, but was outdated, reloading and displaying')
      fready.update()
      fready.activate()

    }
  }else{
    console.log('fready didnt exist, loading and displaying')
    tab_cache[tab_id] = new Fready(url, tab_id)
    tab_cache[tab_id].activate()
  }
}
function remove_view(tab_id){
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  if (tab_id in tab_cache){
    console.log('deleting')
    delete tab_cache[tab_id]
  }
}

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  // read changeInfo data and do something with it (like read the url)
  // console.log(changeInfo)
  if (changeInfo.url) {
    // console.log('changed url')
    console.log(tabId)
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      let url = tabs[0].url
      // console.log(url)
      // user switched his view
      new_view(tabId, url)
    })
  }
})

chrome.tabs.onActiveChanged.addListener( (tabId, changeInfo, tab) => {
  // read changeInfo data and do something with it (like read the url)
  // console.log(tabId)
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url
    // console.log(url)
    // user switched his view
    // tab_cache[tabId] = new Fready(url, tabId)
    new_view(tabId, url)
  })
})

chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  // read changeInfo data and do something with it (like read the url)
  // console.log(tabId)
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  remove_view(tabId)
})

// chrome.browserAction.onClicked.addListener(tab => {
//   chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
//     let url = tabs[0].url
//     console.log(url)
//     console.log(`${fready_api}/article_prev?loc=${url}`)
//     chrome.browserAction.setBadgeText({ text: '...' })
//     $.ajax({
//       url: `${fready_api}/article_prev?loc=${url}`,
//       type: 'GET',
//       crossDomain: true,
//       success: (data) => {
//         console.log(data)
//         chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
//        },
//       error: (data) => { console.log("failed to fetch url") }
//     })
//   })
// })

