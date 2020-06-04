const fready_api = "http://localhost:3000"
let x = null
let active_fready = null 

class xFreadyController{
  constructor(){
    this.freadies = {}
    this.reload()
  }
  reload(flush){
    this.sync_user()
    this.sync_api()
    if (flush) this.freadies = {}
  }
  sync_api() {
    console.table("x", `syncing with api`)
    chrome.storage.sync.get(['freadyskey'], (result) => {
      this.api_key_value = result.freadyskey
    })
    $.ajax({
      url: `${fready_api}/myprofile/mykey`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        chrome.storage.sync.set({ freadyskey: data }, (e) => {
          this.api_key_value = data
          if (e) console.table("error in freadys backend", e)
        })
      },
      error: (data) => { console.table('failed to sync api key', data) }
    })
  }
  sync_user() {
    $.ajax({
      url: `${fready_api}/xapi/user`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        chrome.storage.sync.set({ freadysusername: data['name'] }, (e) => {
          if (e) console.table("error in freadys backend", e)
        })
      },
      error: (e) => { console.table('failed to sync user data', e) }
    })
  }
  get api_key(){
    return this.api_key_value
  }
  
  serve_view(tab_id, url){
    console.log(`serving view for tab #${tab_id} and url -> ${url}`)
    if (url in this.freadies) { this.freadies[url].add_tab(tab_id); return this.freadies[url] }
    this.freadies[url] = new Fready(url, tab_id)
    console.table(this.freadies)
    return this.freadies[url]
  }

  remove_view(tab_id) {
    console.table(`request to remove ${tab_id}`, this.freadies)
    Object.entries(this.freadies).forEach(([url, fready]) => {
      if (fready.tabs.includes(tab_id)) {
        console.table('tab is on fready:', fready)
        fready.remove_tab(tab_id)
      }
    })
  }

  remove_fready(url){
    if (url in this.freadies) delete this.freadies[url]
  }
}

class Fready {
  constructor(url, tab){
    this.url = decodeURIComponent(url)
    this.tabs = [tab]
    this.fetched = false
    this.load()
  }
  get active() {
    return this == active_fready
  }
  get api_key() {
    return x.api_key
  }
  self_destruct(){
    x.remove_fready(this.url)
  }
  add_tab(tab) {
    this.check_if_saved()
    if (!(tab in this.tabs)) this.tabs.push(tab)
  }
  remove_tab(tab){
    if (this.tabs.indexOf(tab) > -1) this.tabs.splice(this.tabs.indexOf(tab), 1)
    if (this.tabs.length == 0) this.self_destruct()
  }
  activate() {
    active_fready = this
    this.render_badge('.')
    if (this.fetched) {
      if (this.data['eta'] > 0) {
        this.render_badge(`${this.data['eta']}'`)
      }
      else {
        this.render_badge('')
      }
    }
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
  fetch() {
    this.fetched = false
    $.ajax({
      url: `${fready_api}/article_prev?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.data = data
      },
      error: (data) => {
        this.data = { 'eta': 0 }
      }
    }).then(() => {
      if (this.active) {
        this.fetched = true
        this.activate()
      }
    })
  }
  update(url){
    this.url = url
    this.load()
  }
  save(){
    x.sync_api()
    $.ajax({
      url: `${fready_api}/save_link?api_key=${this.api_key}`,
      type: "POST",
      crossDomain: true,
      data: { "loc": this.url },
      error: (e) => { console.log(e) },
      dataType: "application/json"
    })
  }
  unsave(){
    this.saved = false
    $.ajax({
      url: `${fready_api}/unsave_link?loc=${this.url}`,
      type: "GET",
      crossDomain: true,
      error: (e) => { console.log(e) }
    })
  }
  render_badge(txt){
    if (this.active){
      if (txt==''){
        this.tabs.forEach(tab => {
          chrome.browserAction.setBadgeText({ text: "", tabId: tab })
        })
      }else{
        this.tabs.forEach( tab => {
          chrome.browserAction.enable(this.tab)
          chrome.browserAction.setBadgeText({ text: txt, tabId: this.tab })
        })
      }
    }
  }
  check_if_saved(){
    $.ajax({
      url: `${fready_api}/save_link?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.saved = data
      },
      error: (data) => {
        console.table('error checking if the article is loaded', data)
        this.saved = false
      }
    }).then( () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { reload: this }, (response) => {
          if (response) console.table('error', response)
        })
      })
    })
  }
}

chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  x.remove_view(tabId)
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.request == "frd"){
      frd = x.serve_view(sender.tab.id, sender.tab.url)
      frd.activate()
      sendResponse({ frd: frd })
    }
    if (request.request == "save"){
      x.freadies[sender.tab.url].save()
      sendResponse({ 'status': "complete "})
    }
    if (request.request == "unsave"){
      x.freadies[sender.tab.url].unsave()
      sendResponse({ 'status': "complete "})
    }
    if (request.request == "user"){
      sendResponse({ 'status': "complete "})
    }
});

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { trigger: "click" }, (response) => {
      if (response) console.table('error', response)
    })
  })
})


x = new xFreadyController
x.sync_api()
x.sync_user()
