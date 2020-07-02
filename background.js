// ------------ lets vars consts ------------ //

let x = null
let u = null

// ------------ classes ------------ //

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
      },
      error: (e) => { 
        table('failed to sync user data', e)
      }
    }).then( () => {
      chrome.storage.sync.set({ freadyslovelyuser: this }, (e) => {
        table('syncing local user with live user', this)
      })
      this.sync_tabs()
    })
  }
  sync_tabs(){
    // TODO deprecate
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
  serve_fready(tab_id, url){
    log(`serving view for tab #${tab_id} and url -> ${url}`)
    if (this.freadies[url]) { 
      this.freadies[url].add_tab(tab_id)
      return this.freadies[url]
    }
    log(`fready for ${url} didnt exist so creating a new one`)
    this.freadies[url] = new Fready(url, tab_id)
    return this.freadies[url]
  }
  remove_view(tab_id) {
    Object.entries(this.freadies).forEach(([url, fready]) => {
      if (fready.tabs.includes(tab_id)) {
        log(`removing tab(${tab_id}) from fready with this url: ${url}`)
        fready.remove_tab(tab_id)
        return true
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
    this.load()
  }
  get api_key() {
    return x.api_key
  }
  self_destruct(){
    x.remove_fready(this.url)
  }
  add_tab(tab) {

    if (!(this.tabs.includes(tab))){
      log(`adding new tab [${tab}] in ${this.url}`)
      this.tabs.push(tab)
      log(`[${this.url}] -> ${this.tabs}`)
    }else{
      log(`tab ${tab} is already linked with ${this.url}`)
    }
  }
  remove_tab(tab){
    if (this.tabs.indexOf(tab) > -1) this.tabs.splice(this.tabs.indexOf(tab), 1)
    if (this.tabs.length == 0) this.self_destruct()
  }

  load(){
    // TODO deprecate
    this.check_if_saved()
    if (check_url(this.url)){
    }else{
      this.data = { 'eta': 0 }
    }
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
      ), false)
    }
  }
  save(doc, cb = (() => { this.send() }), hard_save = true){
    this.saved = hard_save
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
        },
        "save": hard_save,
        "api_key": this.api_key
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
      url: `${FREADY_API}/unsave_link?loc=${this.url}&api_key=${this.api_key}`,
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
      chrome.browserAction.setBadgeText({ text: txt.toString(), tabId: tab })
    })
  }

  update_eta(chars){
    log(`updating eta badge for tab with url ${this.url}, with ${chars} characters.`)
    let mins = (Math.round(chars / JSON.parse(u.prefs)['wpm']))
    this.render_badge(Math.round(mins).toString() + "'")
    return mins
  }

  check_if_saved(){
    log(`checking if url is saved [ ${this.url} ]`)
    $.ajax({
      url: `${FREADY_API}/save_link?loc=${this.url}&api_key=${this.api_key}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        this.saved = data != null
        log(this.saved ? 'it is saved :>' : 'its not :c')
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


// ------------ listeners ------------ //
chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  x.remove_view(tabId)
})

// chrome.tabs.onActivated.addListener( (tab) =>{
//   table(tab)
//   chrome.tabs.get(tab.tabId, (data)=>{
//     log(data.url)
//     x.serve_fready(tab.tabId, data.url)
//   })
// })

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    table(request)
    if (request.frd){
      frd = x.serve_fready(sender.tab.id, sender.tab.url)
      frd.update_eta(request.frd.eta)
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
    if (request.request == 'eta'){
      log('updating the badge for tab')
      x.freadies[sender.tab.url].update_eta(request.eta)
      sendResponse({ 'msg': 'thanks'})
    }
    if (request.request == "user"){
      sendResponse({ 'status': "complete "})
    }
})

chrome.browserAction.onClicked.addListener(tab => {
  log(`xfready icon was clicked on ${tab.id} (${tab.url}), syncing user`)
  u.sync()
  // TODO check if current tab has been processed before
  let fr = x.serve_fready(tab.id, tab.url)
  fr.check_if_saved()
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tab.id, { trigger: "click" }, (response) => {
      if (response) table(response)
    })
  })
})


// ------------ one time things ------------ //

chrome.runtime.onInstalled.addListener(() => {
  log('FREADY-HAS-BEEN-INSTALLED!')
  chrome.tabs.create({
    url: `${FREADY_API}/welcome`
  })
})


// ------------ start the script ------------ //
u = new xFreadyUser
x = new xFreadyController