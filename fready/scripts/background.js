let controller = null
let user = null

class FreadyConnectable {
  constructor(){
  }

  ajax(url, meth, data, success=(()=>{}), error=(()=>{}), type, ignore_check=false){
    if (ignore_check || !(user && user.api_key)) return false
    log(`AJAXing.. /${url}`)
    table(data)

    data["api_key"] = this.api_key 
    $.ajax({
      url: `${FREADY_API}/${url}`,
      type: meth || 'GET',
      crossDomain: true,
      dataType: type || 'text json',
      data: data,
      success: (data) => {
        table(data)
        success(data)
      },
      error: (data) => {
        table(data)
        error(data)
      }
    }) 
  }
}

class User extends FreadyConnectable{
  constructor(){
    super()
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
        this.prefs = JSON.parse(data['prefs'])
        this.settings = JSON.parse(data['settings'])
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
    Object.entries(controller.freadies).forEach(([url, fready]) => {
      fready.tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab, { user: this }, (response) => {
          if (response) table(response)
        })
      })
    })
  }
  set(req){
    this.ajax(
      'xapi/user', 
      'POST', 
      { "meta": req }, 
      (data) => { 
        this.sync() 
      }
    )
  }
}

class Controller{
  constructor(){
    this.freadies = {}
  }
  reload(flush){
    user.sync()
    if (flush) this.freadies = {}
  }
  get api_key(){
    return user.api_key
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
    this.freadies[url] = new FreadyInstance(url, tab_id)
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

class FreadyInstance extends FreadyConnectable{
  constructor(url, tab){
    super()
    this.url = decodeURIComponent(url)
    this.tabs = [tab]
  }
  get api_key() {
    return controller.api_key
  }
  self_destruct(){
    controller.remove_fready(this.url)
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

  save(content, cb = (() => { this.send() }), hard_save = true){
    this.saved = hard_save
    
    this.ajax(
      'links.json', 
      'POST', 
      { "link":  content ? {
        "loc": this.url,
        "doc": content.doc,
        "title": content.title
      } : { "loc": this.url },
        "save": hard_save
      },
      (data) => { 
        log("successfully recieved new frd")
        table(data.link)
        this.id = data.link.id
        cb()
      }
    ) 
  }
  unsave(){
    this.saved = false
    this.ajax(
      'unsave_link',
      'GET',
      { "loc": this.url },
      (data) => this.send()
    )
  }
  render_badge(txt){
    this.tabs.forEach(tab => {
      chrome.browserAction.enable(this.tab)
      chrome.browserAction.setBadgeText({ text: txt.toString(), tabId: tab })
    })
  }

  update_eta(chars){
    log(`updating eta badge for tab with url ${this.url}, with ${chars} characters.`)
    let mins = (Math.round( chars / (user.prefs.wpm || DEF_PREF.wpm) ))
    this.render_badge(Math.round(mins).toString() + "'")
    return mins
  }

  reload(){
    this.ajax(
      'find_link', 
      'GET', 
      { "loc": this.url },
      (data) => { 
        //success
        if (data != null){
          this.saved = data.saved
          this.id = data.id
          log(`[ ${this.url} ] -> ${this.saved ? `is saved by the user` : `is NOT saved by the user`} [ ID => ${this.id} ]`)
        }else{
          this.saved = false
          this.id = null
          log(`[ article got yeeted, reseting ] - [ ID => ${this.id} ]`)
        }
        this.send()
      },
      (data) => {
        table('error checking if the article is loaded', data)
        this.saved = false
        this.send()
      }
    )
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


function inject_content(tab){
  CONTENT_CSS.forEach((sheet) => {
    chrome.tabs.insertCSS(tab.id, {
      file: sheet
    })
  })
  
  CONTENT_SCRIPTS.forEach((script) => {
    chrome.tabs.executeScript(tab.id, {
      file: script
    })
  })
}


/*
 *      Chrome Listeners
 */

chrome.tabs.onRemoved.addListener( (tabId, changeInfo, tab) => {
  controller.remove_view(tabId)
})

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.frd){
    frd = controller.serve_fready(sender.tab.id, sender.tab.url)
    frd.update_eta(request.frd.eta)
    frd.reload()
    sendResponse({ msg: "recieved frd" })
    return
  }
  if (request.request == "save"){
    controller.freadies[sender.tab.url].save(request.content)
    sendResponse({ msg: "saved article"})
    return
  }
  if (request.request == "read"){
    controller.freadies[sender.tab.url].read(request.content)
    sendResponse({ msg: "reading article.."})
    return
  }
  if (request.request == "unsave"){
    controller.freadies[sender.tab.url].unsave()
    sendResponse({ msg: "unsaved article"})
    return
  }
  if (request.request == 'eta'){
    controller.freadies[sender.tab.url].update_eta(request.eta)
    sendResponse({ msg: 'thanks'})
    return
  }
  if (request.set){
    user.set(request.set) 
    sendResponse({ user: 'updating'})
    return
  }

  sendResponse({ msg: "Invalid Request" })
})

chrome.browserAction.onClicked.addListener(tab => {
  log(`xfready icon was clicked on ${tab.id} (${tab.url}), syncing user`)
  user.sync()

  chrome.tabs.query({ active: true, currentWindow: true }, () => {
    chrome.tabs.sendMessage(tab.id, { trigger: "click" }, (response) => {
      if (response) {
        // Click on Fready icon
      } else {
        log(`INJECTING JS 💉 -{ ${tab.id} }-`)
        inject_content(tab)
      }
    })
  })
})


chrome.runtime.onInstalled.addListener(() => {
  log('!FREADY-HAS-BEEN-INSTALLED!')
  chrome.tabs.create({
    url: `${FREADY_API}/welcome`
  })
})


/*
 *      Start the background script up
 */

user = new User
controller = new Controller
