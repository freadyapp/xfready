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
  check_if_fready_(tab_id, url){
    return this.freadies[url] != null && this.freadies[url].tabs.includes(tab_id)
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

  update(url){
    this.url = url
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
    let mins = (Math.round( chars / get_pref('wpm', DEF_PREF.wpm ) ))
    this.render_badge(Math.round(mins).toString() + "'")
    return mins
  }

  reload(){
    $.ajax({
      url: `${FREADY_API}/find_link?api_key=${this.api_key}&loc=${this.url}`,
      type: 'GET',
      crossDomain: true,
      success: (data) => {
        if (data != null){
          this.saved = data.saved
          this.id = data.id
          log(`[ ${this.url} ] -> ${this.saved ? `is saved by the user` : `is NOT saved by the user`} [ ID => ${this.id} ]`)
        }else{
          this.saved = false
          this.id = null
          log(`[ article got yeeted, reseting ] - [ ID => ${this.id} ]`)
        }
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
        table(this)
        log('sent to the view')
      })
    })
  }
}


function inject(tab){
  chrome.tabs.insertCSS(tab.id, {
    file: "injector.css"
  })
  let scripts = [
    "third_party/jquery.min.js",
    "third_party/minihtml.min.js",
    "third_party/readability.js",
    "dev.js",
    "assets/ui.js",
    "helpers.js",
    "injector.js"
  ]
  scripts.forEach((script) => {
    chrome.tabs.executeScript(tab.id, {
      file: script
    })
  })
}


// ------------ listeners ------------ //
chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  x.remove_view(tabId)
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    table(request)
    if (request.frd){
      log(`request to create/update ${sender.tab.url}`)
      frd = x.serve_fready(sender.tab.id, sender.tab.url)
      frd.update_eta(request.frd.eta)
      frd.reload()
      sendResponse({ msg: "recieved frd" })
    }
    if (request.request == "save"){
      log(`request to save ${sender.tab.url}`)
      x.freadies[sender.tab.url].save(request.html)
      sendResponse({ msg: "saved article"})
    }
    if (request.request == "read"){
      log(`request to read ${sender.tab.url}`)
      x.freadies[sender.tab.url].read(request.html)
      sendResponse({ msg: "reading article.."})
    }
    if (request.request == "unsave"){
      log(`request to unsave ${sender.tab.url}`)
      x.freadies[sender.tab.url].unsave()
      sendResponse({ msg: "unsaved article "})
    }
    if (request.request == 'eta'){
      log('updating the badge for tab')
      x.freadies[sender.tab.url].update_eta(request.eta)
      sendResponse({ msg: 'thanks'})
    }
})

chrome.browserAction.onClicked.addListener(tab => {
  log(`xfready icon was clicked on ${tab.id} (${tab.url}), syncing user`)
  u.sync()

  chrome.tabs.query({ active: true, currentWindow: true }, () => {
    chrome.tabs.sendMessage(tab.id, { trigger: "click" }, (response) => {
      if (response) {
        log(`we're good, js has already been ejected --{ ${tab.id} }--`)
        let fr = x.serve_fready(tab.id, tab.url)
        fr.reload()
      } else {
        log(`we're NOT good, should be INJECTING JS 💉 -{ ${tab.id} }-`)
        inject(tab)
      }
    })
  })
})

// ------------ one time things ------------ //
chrome.runtime.onInstalled.addListener(() => {
  log('!FREADY-HAS-BEEN-INSTALLED!')
  chrome.tabs.create({
    url: `${FREADY_API}/welcome`
  })
})

// ------------ start the script ------------ //
u = new xFreadyUser
x = new xFreadyController