const fready_api = "http://localhost:3000"
let tab_cache = {} // tab_id & data
let active_tab = null

class Fready {
  constructor(url, tab){
    this.url = url
    this.tab = tab
    this.fetched = false
    this.load()
  }
  load(){
    if (check_url(this.url)){
      this.fetch()
    }else{
      this.fetched = true
      this.data = { 'eta': 0 }
      if (this.active) { this.activate() }
    }
  }
  get active(){
    return this.tab == active_tab
  }
  update(url){
    this.url = url
    this.load()
  }
  activate(){
    active_tab = this.tab
    this.render_badge('.')
    if (this.fetched) {
      if (this.data['eta'] > 0){
        this.render_badge(`${this.data['eta']}'`)
      }
      else{
        this.render_badge('')
      }
    }
  }
  fetch(){
    // chrome.browserAction.setBadgeText({ text: '...' })
    // this.render_badge('...')
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
        // console.log("failed to fetch url")
        this.render_badge('')
        this.data = {'eta': 0}
        // this.activate()
      }
    })
  }
  render(){

  }
  render_badge(txt){
    if (this.active){
      if (txt==''){
        chrome.browserAction.setBadgeText({ text: "", tabId: this.tab})
        chrome.browserAction.disable(this.tab)
      }else{
        chrome.browserAction.enable(this.tab)
        chrome.browserAction.setBadgeText({ text: txt, tabId: this.tab})
      }
    }
  }
}

function new_view(tab_id, url){
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  console.table("URL", url, check_url(url))
  if (tab_id in tab_cache){
    let fready = tab_cache[tab_id]
    if (url == fready.url){
      console.log('fready exists')
    }else{
      console.log('fready exists, but was outdated, reloading')
      fready.update(url)
    }
  }else{
    console.log('fready didnt exist, creating new, fetching')
    tab_cache[tab_id] = new Fready(url, tab_id)
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
  console.log(changeInfo)
  tab_cache[tabId].activate()
  if (changeInfo.url) {
    // console.log('changed url')
    console.table("URL", changeInfo.url, check_url(changeInfo.url))
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      let url = tabs[0].url
      // console.log(url)
      // user switched his view
      new_view(tabId, url)
    })
  }
})

chrome.tabs.onActivated.addListener( (info) => {
  // read changeInfo data and do something with it (like read the url)
  // console.log(tabId)
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  let tabId = info['tabId']
  // console.log(tabId)
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url
    // console.log(url)
    // user switched his view
    // tab_cache[tabId] = new Fready(url, tabId)
    new_view(tabId, url)
    tab_cache[tabId].activate()
  })
})

chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  // read changeInfo data and do something with it (like read the url)
  // console.log(tabId)
  // console.log(tabId in tab_cache ? tab_cache[tabId] : "nilllllllll")
  remove_view(tabId)
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(sender.tab.id)
    console.log(tab_cache[sender.tab.id])
    if (request.request == "frd")
      sendResponse({ frd: tab_cache[sender.tab.id]});
  });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type == "worktimer-notification")
//     chrome.notifications.create('worktimer-notification', request.options, function () { });

//   sendResponse();
// });


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

