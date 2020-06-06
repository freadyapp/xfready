let x = null
let u = null

class xFreadyUser{
  constructor(){
    this.sync()
  }
  sync() {
    $.ajax({
      url: `${FREADY_API}/xapi/user`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.name = data['name']
        this.email = data['email']
        this.prefs = JSON.parse(data['prefs'])
        chrome.storage.sync.set({ freadyslovelyuser: this }, (e) => {
          table('updating', this)
        })
      },
      error: (e) => { table('failed to sync user data', e) }
    }).then(()=>{
      this.sync_tabs()
    })
  }
  sync_tabs(){
    Object.entries(x.freadies).forEach(([url, fready]) => {
      fready.tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab, { user: this }, (response) => {
          if (response) table(response)
        })
      })
    })
  }
}

class xFreadyController{
  constructor(){
    this.freadies = {}
    this.sync_api()
  }
  reload(flush){
    u.sync()
    this.sync_api()
    if (flush) this.freadies = {}
  }
  sync_api() {
    table("x", `syncing with api`)
    chrome.storage.sync.get(['freadyskey'], (result) => {
      this.api_key_value = result.freadyskey
    })
    $.ajax({
      url: `${FREADY_API}/myprofile/mykey`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        chrome.storage.sync.set({ freadyskey: data }, (e) => {
          this.api_key_value = data
          table('api key', data)
          if (e) table("error in freadys backend", e)
        })
      },
      error: (data) => { table('failed to sync api key', data) }
    })
  }
  get api_key(){
    return this.api_key_value
  }
  
  serve_view(tab_id, url){
    log(`serving view for tab #${tab_id} and url -> ${url}`)
    if (url in this.freadies) { this.freadies[url].add_tab(tab_id); return this.freadies[url] }
    this.freadies[url] = new Fready(url, tab_id)
    table(this.freadies)
    return this.freadies[url]
  }

  remove_view(tab_id) {
    table(`request to remove ${tab_id}`, this.freadies)
    Object.entries(this.freadies).forEach(([url, fready]) => {
      if (fready.tabs.includes(tab_id)) {
        table('tab is on fready:', fready)
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
    this.render_badge('.')
    if (this.fetched) {
      if (this.data['eta'] > 0) {
        this.render_badge(`${this.data['eta']}'`)
        this.send()
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
      this.activate()
    }
  }
  fetch() {
    this.fetched = false
    $.ajax({
      url: `${FREADY_API}/xapi/preview?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.data = data
      },
      error: (data) => {
        this.data = { 'eta': 0 }
      }
    }).then(() => {
      this.fetched = true
      this.activate()
    })
  }
  update(url){
    this.url = url
    this.load()
  }
  save(doc){
    x.sync_api()
    if (doc) {
      $.ajax({
        url: `${FREADY_API}/links.json?api_key=${this.api_key}`,
        type: 'POST',
        crossDomain: true,
        data: {
          "link": {
            "loc": this.url,
            "doc": doc
          }
        },
        dataType: 'application/json',
        success: (data) => {
          this.id = data['id']
        },
        error: (data) => {
          table(data)
        }
      })
    }else{
      $.ajax({
        url: `${FREADY_API}/links.json?api_key=${this.api_key}`,
        type: "POST",
        crossDomain: true,
        data: { "link": { "loc": this.url } },
        error: (e) => { log(e) },
        dataType: "application/json"
      })
    }
  }
  unsave(){
    this.saved = false
    $.ajax({
      url: `${FREADY_API}/unsave_link?loc=${this.url}`,
      type: "GET",
      crossDomain: true,
      error: (e) => { log(e) }
    })
  }
  render_badge(txt){
    this.tabs.forEach(tab => {
      chrome.browserAction.enable(this.tab)
      log(txt)
      chrome.browserAction.setBadgeText({ text: txt, tabId: tab })
    })
  }
  check_if_saved(){
    $.ajax({
      url: `${FREADY_API}/save_link?loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.saved = data != null
        this.id = this.saved ? data['id'] : 0
        log(`this id is ${this.id}`)
      },
      error: (data) => {
        table('error checking if the article is loaded', data)
        this.saved = false
      }
    }).then(()=>{
      this.send()

    })
  }
  send(){
    this.tabs.forEach( (tab)=>{
      chrome.tabs.sendMessage(tab, { frd: this }, (response) => {
        if (response) table(response)
        log('sent to the view')
      })
    })
  }
}

chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  x.remove_view(tabId)
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    table(request)
    if (request.request == "frd"){
      frd = x.serve_view(sender.tab.id, sender.tab.url)
      frd.activate()
      sendResponse({ msg: "ok" })
    }
    if (request.request == "save"){
      table(request)
      x.freadies[sender.tab.url].save(request.html)
      sendResponse({ 'status': "complete "})
    }
    if (request.request == "unsave"){
      table(request)
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
      if (response) table(response)
    })
  })
})


u = new xFreadyUser
x = new xFreadyController
