const fready_api = "http://localhost:3000"
let tab_cache = {} // tab_id & data
let active_tab = null
let api_key = get_api()
// let username = get_user()

function get_api(){
  chrome.storage.sync.get(['freadyskey'], (result) => {
    api_key = result.freadyskey
  })
}
function sync_api(){
  $.ajax({
    url: `${fready_api}/myprofile/mykey`,
    type: 'GET',
    crossDomain: true,
    success: (data) => {
      chrome.storage.sync.set({ freadyskey: data }, function () {
        api_key = data
      })
      // chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
    },
    error: (data) => { console.log('failed to sync api key') }
  })
}
function sync_user(){
  $.ajax({
    url: `${fready_api}/xapi/user`,
    type: 'GET',
    crossDomain: true,
    success: (data) => {
      chrome.storage.sync.set({ freadysusername: data['name'] }, function () {
        username = data['name']
      })
      // chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
    },
    error: (data) => { console.log('failed to sync api key') }
  })
}

class Fready {
  constructor(url, tab){
    this.url = decodeURIComponent(url)
    this.tab = tab
    this.fetched = false
    this.saved = false
    this.load()
    sync_api()
  }

  load(){
    this.check_if_saved()
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

  get api_key(){
    return api_key
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
  save(){
    sync_api()
    console.log(`${fready_api}/save_link?api_key=${api_key}`)
    $.ajax({
      url: `${fready_api}/save_link?api_key=${api_key}`,
      type: "POST",
      crossDomain: true,
      data: { "loc": this.url },
      success: ()=>{ console.log('successfuly saved')},
      error: (e)=> { console.log(e)},
      dataType: "application/json"
    })
  }
  unsave(){
    $.ajax({
      url: `${fready_api}/unsave_link?loc=${this.url}`,
      type: "GET",
      crossDomain: true,
      success: ()=>{ console.log('successfuly unsaved')},
      error: (e)=> { console.log(e)}
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

  check_if_saved(){
    $.ajax({
      url: `${fready_api}/save_link?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        console.table('success', data)
        this.saved = data
        // chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
      },
      error: (data) => {
        console.table('error', data)
        this.saved = false
      }
    })
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
  // console.log(changeInfo)
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
    if (request.request == "save")
      tab_cache[sender.tab.id].save()
      sendResponse({ 'status': "complete "});
    if (request.request == "unsave")
      tab_cache[sender.tab.id].unsave()
      sendResponse({ 'status': "complete "});
    if (request.request == "user")
      tab_cache[sender.tab.id].unsave()
      sendResponse({ 'status': "complete "});
  });



// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type == "worktimer-notification")
//     chrome.notifications.create('worktimer-notification', request.options, function () { });

//   sendResponse();
// });


chrome.browserAction.onClicked.addListener(tab => {
  // chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  //   let url = tabs[0].url
  //   console.log(url)
  //   console.log(`${fready_api}/article_prev?loc=${url}`)
  //   chrome.browserAction.setBadgeText({ text: '...' })
  //   $.ajax({
  //     url: `${fready_api}/article_prev?loc=${url}`,
  //     type: 'GET',
  //     crossDomain: true,
  //     success: (data) => {
  //       console.log(data)
  //       chrome.browserAction.setBadgeText({ text: `${data['eta']} min.` })
  //      },
  //     error: (data) => { console.log("failed to fetch url") }
  //   })
  // })
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { trigger: "click" }, function (response) {
    });
  });
})

sync_api()
sync_user()