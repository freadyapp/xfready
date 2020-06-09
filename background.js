let x = null
let u = null

class xFreadyUser{
  constructor(){
    this.sync()
  }
  sync() {
    log('syncing user')
    $.ajax({
      url: `${FREADY_API}/xapi/user.json`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        table(data)
        this.name = data['name']
        this.email = data['email']
        this.prefs = data['prefs']
        this.api_key = data['key']
        chrome.storage.sync.set({ freadyskey: data }, (e) => {
          log(`api key, ${data}`)
          if (e) table("error in freadys backend", e)
        })
      },
      error: (e) => { 
        table('failed to sync user data', e)
      }
    }).then( () => {
      chrome.storage.sync.set({ freadyslovelyuser: this }, (e) => {
        table('updating', this)
      })
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
  }
  reload(flush){
    u.sync()
    if (flush) this.freadies = {}
  }

  get api_key(){
    return u.api_key
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
  read(doc){
    if (this.saved){
      this.send('read')
    }else{
      this.save(doc, (
        ()=>{
          this.send('read')
        }
      ))
    }
  }
  save(doc, cb=(()=>{ this.send() })){
    this.saved = true
    $.ajax({
      url: `${FREADY_API}/links.json?api_key=${this.api_key}`,
      type: 'POST',
      crossDomain: true,
      dataType: 'text json',
      data: {
        "link":  doc ? {
          "loc": this.url,
          "doc": doc
        }:{
          "loc": this.url
        }
      },
      success: (data) => {
        log('succesfully recieved new frd')
        table(data.link)
        this.id = data.link.id
        cb()
      },
      error: (data) => {
        log('error when recieved new frd')
        table(data)
      }
    })
  }
  unsave(){
    this.saved = false
    $.ajax({
      url: `${FREADY_API}/unsave_link?loc=${this.url}`,
      type: "GET",
      crossDomain: true,
      error: (e) => { log(e) }
    }).then(() => {
      this.send()
    })
  }
  render_badge(txt){
    this.tabs.forEach(tab => {
      chrome.browserAction.enable(this.tab)
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
  send(command=null){
    this.tabs.forEach( (tab)=>{
      chrome.tabs.sendMessage(tab, { frd: this, cmd: command }, (response) => {
        if (response) table(response)
        log('sent to the view')
        table(this)
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
      log('request to save')
      x.freadies[sender.tab.url].save(request.html)
      sendResponse({ 'status': "complete "})
    }
    if (request.request == "read"){
      log('request to read')
      x.freadies[sender.tab.url].read(request.html)
      sendResponse({ 'status': "ok "})
    }
    if (request.request == "unsave"){
      log('request to unsave')
      x.freadies[sender.tab.url].unsave()
      sendResponse({ 'status': "complete "})
    }
    if (request.request == "user"){
      sendResponse({ 'status': "complete "})
    }
});

chrome.browserAction.onClicked.addListener(tab => {
  u.sync()
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { trigger: "click" }, (response) => {
      if (response) table(response)
    })
  })
})


u = new xFreadyUser
x = new xFreadyController
