var minifyy = require('html-minifier-terser').minify
let user = null
let frd = null
let frame = $(`<lector></lector>`)
let reading = false
let screen = ''
let saved = false
let alma = null
let popper = null
let settings = null
let freadable = new Readability(document.cloneNode(true)).parse()
let currently_injecting_lector = false;

function minify(html){
  return minifyy(html.toString(), { collapseWhitespace: true, removeComments: true, useShortDoctype: true, minifyJS: true, minifyCSS: true, removeAttributeQuotes: true })
}
function is_freadable(doc){
  return check_url(window.location.href) && calc_words() > MIN_WORDS_FOR_FREADABLE  && is_readable_(doc) 
}
function is_readable_(doc){
  return isProbablyReaderable(doc)
}
function calc_words(cfreadable=null){
  cfreadable = cfreadable || set_freadable()
  if (cfreadable == null) return 0
  return Math.ceil(((cfreadable.length) / 5))
}
function calc_eta(cfreadable=null){
  cfreadable = cfreadable || set_freadable()
  let wpm_pref = user ? (user.prefs.wpm || 250) : 250
  let eta = Math.floor(calc_words(cfreadable) / wpm_pref) 
  freadable.eta = eta
  return eta
}

function calc_title(){
  set_freadable()
  return freadable.title 
}
function parse_domain(){
  return  window.location.hostname
}

function set_freadable(reload=false){
  if (!reload) return freadable
  log(`${reload ? ">> parsing doc with readability" : ">> returning freadable"}`)
  if (freadable==null) return false
  freadable = new Readability(document.cloneNode(true)).parse()
  freadable.domain = parse_domain()
  freadable.eta = calc_eta(freadable)
  return freadable
}
function slurp_body(){
  return minify(set_freadable().content)
}

// ------------ talking with background ------------ //

function sync_frd() {
  log(`> Syncing FRD - current frd - ${frd}`)
  chrome.runtime.sendMessage({ frd: { eta: calc_words() } }, (response) => {})
}

function request(request_str, options={}){
  
  log(`> Requesting to ${request_str}`)
  let msg = { request: request_str }
  if (!options.skip_slurp) msg.content = { doc: slurp_body(), title: calc_title() }
  if ( options.source ) msg.meta = { trigger: options.source }

  chrome.runtime.sendMessage(msg, (response) => {
    log(`> Response: ${response}`)
  })
}

function update_eta(){
  chrome.runtime.sendMessage( { request: 'eta', eta: calc_words() })
}

function sync_user(){
  chrome.storage.sync.get(['freadyslovelyuser'], (data) => {
    log('>> syncing user')
    user = data.freadyslovelyuser
    table(user)
    if (user.name) {
      $("#loggedinlink").show()
      $("#loggedoutlink").hide()
      $("#username").text(user.name)
    }else{
      $("#loggedinlink").hide()
      $("#loggedoutlink").show()
    }
  })
}

function load_frd(new_frd, cmd=null){
  if (currently_injecting_lector || !(new_frd && new_frd.id && user)) return false

  log(`> Loading new FRD - command: ${cmd}`)
  table(new_frd)
  
  // TODO fix this shit
  frd = new_frd
  $(frame).html(make_frame())
  screen = $('#freadysscreen')
  screen.fadeOut()
  if (cmd == 'read') {
    log('> CMD read - toggling read')
    toggle_read(new_frd)
  }
  saved = new_frd.saved
  visual_pulse_save()

  return new_frd
}


// ------------ front end ------------ //
function make_frame(){
  return `<fready-x>${x_button}</fready-x><div id='screen-bg'> </div><div id='fready-loader'>${loader}</div>
  <div id="freadysscreen"><iframe onload="this.contentWindow.focus();" src="${FREADY_API}/lector?art=${frd.id}&api_key=${user.api_key}" width=100% height=100% style="border: none;"></iframe></div>`
}
function wire_frame(){
  $('fready-x').click( ()=> toggle_exit())
}

function visual_pulse_save(inverse){
  if (popper){
    popper.do_save(inverse)
  }
  if (alma){
    alma.do_save(inverse)
  }
}

function remove_lector(){
  $(frame).fadeOut(100)
}

function inject_lector(){
  currently_injecting_lector = true 
  screen.fadeIn()
  $(frame).insertAfter(document.body)
  wire_frame()
  $(frame).fadeTo(0, 0.01)
  $(frame).fadeTo(400, 1)
  $(frame).find("#screen-bg").fadeTo(200, .7)
  //setTimeout( () => { screen.fadeIn(); }, 150)
  setTimeout( () => { $(frame).find("#screen-bg").fadeTo(400, .99);currently_injecting_lector = false }, 1200)
}

function go_dashboard(){
  log('going to dashbaord')
}

function get_save_text(inverse=false){
  return (inverse ? !saved : saved) ? `Saved` : `Save`
}

function get_heart(inverse=false){
  return (inverse ? !saved : saved) ? filled_love : outlined_love 
}

function toggle_read(injecting_frd, options={}){
  if (currently_injecting_lector || reading) return false;

  if (injecting_frd!=null){    
    log('> Injecting lector & starting to read.. Have fun reading!')     
    reading = true
    inject_lector()
    if (popper){
      popper.change_state('reading') 
      setTimeout( () => popper.toggle_hide(), 920)
    } 
  }else{
    log('> Reloading FRD - requesting read')
    request('read', options) 
  }
  
}
function toggle_exit(){
  log('> Removing lector')
  remove_lector()
  reading = false
  if (popper){
    popper.change_state('default') 
  }
}


function saveunsave(){
  saved = !saved
  visual_pulse_save()
  if (saved){
    request('save')
  }else{
    request('unsave', {skip_slurp: true})
  }
}

function cleanup(){
  log('🧹 cleaning up other fready instances')
  let freadys_trash = ['fready-alma', 'lector', 'fready-popper']
  freadys_trash.forEach( trash => $(trash).remove() ) 
}

// ------------ listeners ------------ //

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.trigger == "click") popper.toggle()
  if (request.user){
    sync_user(request.user)
  }
  if (request.frd){
    load_frd(request.frd, request.cmd)
  }
  if (request.eta){
    log('sending eta to background script')
    return sendResponse(10)
  }
  return sendResponse('ok')
})

function locate_art(){

  log("> attempting to locate art") 
  let first_p = $(slurp_body()).find('p').text()
  let text_identifier = first_p.slice(0, Math.min(first_p.length, ART_LOCATOR_LEN))
  log(text_identifier)
  let art_locator = null
  let search_these =   [ 'p', 'article', 'h1', 'h2', 'h3', 'h5', 'h6' ]
  search_these.some( el => {
    art_locator = $(`${el}:contains("${text_identifier}")`)
    log(`${el}:contains("${text_identifier}")`)
    if (art_locator != null && art_locator.text().length > 1 ){
      art_locator = $(art_locator[art_locator.length-1])
      return true
    }
  })
  art_locator = art_locator || $(document).find('p')
  log(art_locator)
  return art_locator
}

function load_fready(){
  sync_user()   // sync up with local user before triggering any functions
  sync_frd()    // sync frd with backend
  cleanup()
}
// TODO make menu like this

class Settings {
  constructor(){
  }
  wire(setting, parent, def, ident=null){
    log(`wiring ${setting} to ${parent.dom}`)
    let on = parent.dom.find(`#fd-set-${setting}-1`)
    let off = parent.dom.find(`#fd-set-${setting}-0`)
    let elements = {ident: ident, on: on, off: off}
    on.click( ()=> { settings.set(setting, "on", elements )}) 
    off.click( ()=> { settings.set(setting, "off", elements )}) 
    this.set(setting, def, elements)
  }
  send_bg(setting, val){
    let req = {}
    req[setting] = val
    log(`sending to background`)
    table(req)
    chrome.runtime.sendMessage({ set: req } , (response) => {log(response)})
  }
  set(setting, val, elements={}){
    log(`⚙️  Setting ${setting} to ${val}`)
    //sendMesage blah bl;ah
    if (val!="off"){
      elements.on.addClass('fd-util-select')
      elements.off.removeClass('fd-util-select')
      elements.ident && $(elements.ident).fadeIn()
    }else{
      elements.off.addClass('fd-util-select')
      elements.on.removeClass('fd-util-select')
      elements.ident && $(elements.ident).fadeOut()
    }
    this.send_bg(setting, val)
  }
}
class Popper {
  constructor(dom){
    this.dom = this.make_popper()
    this.dom.fadeOut(0)
    this.dom.insertAfter(document.body)
    this.showing = false
    this.hovered = false

    this.title = this.dom.find("#fready-popper-art-title")
    this.domain = this.dom.find("#fready-popper-art-domain")
    this.eta = this.dom.find("#fready-popper-art-eta")
    this.menu = this.dom.find("#fready-popper-menu")
    this.exit = this.dom.find("#fready-popper-exit")
    
    this.read_btn = this.dom.find("#fready-popper-read-btn")
    this.save_btn = this.dom.find("#fready-popper-save-btn")
    this.home_btn = this.dom.find("#fready-popper-home-btn")
    
    this.wire_popper()
    this.change_state('default')
    this.wire_settings()
  }

  make_popper(){
   return $(`
     <fready-popper>
      <fready-element id='fready-popper-art'>
        <fready-element class='fready-circle-btn' id='fready-popper-art-eta'>${calc_eta()}'</fready-element>
        <fready-element id='fready-popper-art-info'>
          <fready-text class='fready-title' id='fready-popper-art-title'>${calc_title()}</fready-text>
          <fready-text class='fready-meta' id='fready-popper-art-domain'>${parse_domain()}</fready-text>
            <fready-element-l id='fready-popper-menu'>
              <fready-icon class='fready-circle-btn fd-util-l fd-util-darker' id='fready-popper-save-btn'>${get_heart()}</fready-icon>
              <fready-icon class='fready-circle-btn fd-util-l fd-util-darker' id='fready-popper-read-btn'>${read}</fready-icon>
              <fready-vd></fready-vd>
              <a id='fready-popper-home-btn' href='${FREADY_API}' target="_blank"><fready-icon class='fready-circle-btn fd-util-lc fd-util-darker'>${dashboard}</fready-icon></a>
            </fready-element-l>
            <fready-element-l id='fready-popper-exit'>
              <fready-element class='fready-rec-btn'>Exit Freading Mode</fready-element>
            </fready-element-l>    
        </fready-element>
      </fready-element>
      <fready-sector id='fready-popper-bottom-sector'>
        <fready-element id='fready-popper-logo'>
          <a href='${FREADY_API}' target="_blank"><fready-icon>${fready_full_logo}</fready-icon></a>
        </fready-element>
        <fready-element id='fready-popper-settings' class='fd-util-setting'>
          Show on websites: <span id='fd-set-alma-1' class='fd-util-option fd-util-select'>On</span> <span id='fd-set-alma-0' class='fd-util-option'>Off</span>
        </fready-element>
      </fready-sector>
    </fready-popper>
    `) 
  }

  wire_settings(){
    settings.wire('alma', this, user.settings.alma, 'fready-alma')
  }
  wire_popper(){
   if (!this.showing){
     this.dom 
      .fadeTo(0, 0.5)
      .css({ 'filter': 'saturate(0)' })
      .slideUp(0)
    }
    this.read_btn.click(() => {
      toggle_read(null, { source: "popper" } )
    })
    this.save_btn.click(() => {
      popper.press_save()
    })
    this.exit.click(() => {
      toggle_exit()
      popper.change_state('default')
    })
    $(".freadyhide").click(() => {
      popper.toggle()
    })
    $(window).click(()=> { if (this.showing && !this.hovered) { this.toggle_hide() }})
    this.dom.hover( () => this.hover(), () => this.not_hover() )
    this.save_btn.tippy = qtippy(this.save_btn, 'Save')
    this.home_btn.tippy = qtippy(this.home_btn, 'Go to Dashboard')
    this.read_btn.tippy = qtippy(this.read_btn, 'Read')
  }

  hover(){
    this.hovered = true
  }
  not_hover(){
    this.hovered = false
  }
  toggle_show(){
    if (this.showing) return false
    setTimeout( () => this.showing = true, 50 )
    this.dom 
      .css({'filter': 'saturate(1)'})
      .slideDown(70)
      .fadeTo(10, 1)
  }
  toggle_hide(){
    if (!this.showing) return false
    this.showing = false
    this.dom
      .css({ 'filter': 'saturate(0)' })
      .fadeTo(200, 0.5)
      .slideUp(100)
  } 
  toggle(){
    this.showing ? this.toggle_hide() : this.toggle_show()
  }
  do_save(inverse=false){
    this.save_btn.tippy.setContent(get_save_text(inverse))
    this.save_btn.html(get_heart(inverse))
  }
  press_save(){
    log('Clicked on popper save')
    saveunsave()
  }
  change_state(state){
    log('chaning state to' + state)
    switch (state){
      case "reading":
        this.menu.fadeOut(120) 
        setTimeout( ()=> this.exit.fadeIn(), 120)
        break
      default:
        this.exit.fadeOut(120) 
        setTimeout( ()=> this.menu.fadeIn(), 120)    
        this.exit.fadeOut()
    }
  }
}
class Alma {
  constructor(art_locator){
    log('> Creating & Injecting Alma')
    this.dom = this.make_alma()
    this.art_start = art_locator
    this.inject_alma()
    this.dom.fadeTo(0, .01)
    // declaring some shortcuts
    this.space_to_read = this.dom.find('#fready-alma-space')
    this.logo = this.dom.find('#fready-alma-logo')
    this.eta = this.dom.find('#fready-alma-eta')
    this.menu = this.dom.find('#fready-alma-menu')
    this.x_button = this.dom.find('#fready-alma-x')
    this.save = this.dom.find('#fready-alma-save')
    this.more = this.dom.find('#fready-alma-more')
    this.wire_alma()
    this.appear()
    this.dom.hover( () => this.hover(), () => this.not_hover() )
    this.hovered = false
  }
  appear(){
    let alma = this

    new Promise((resolve, reject) => {
        (function wait_to_scroll_into_view(){
            if (is_in_view(alma.dom)) return resolve();
            setTimeout(wait_to_scroll_into_view, 30);
        })()
    }).then( () => {
      log('> Fading Alma in')
      let final_width = this.dom.width()
      this.dom.css({'width': this.dom.height()})
      this.fade_out_all()
      this.logo.fadeIn(0)
      this.dom.fadeTo(450, 1, 'swing')
      setTimeout( () => {
        this.eta.fadeIn(100)
        setTimeout(() => this.space_to_read.fadeIn(100), 300)
        setTimeout(() => this.space_to_read.fadeTo(350, .3), 600)
        setTimeout(() => this.space_to_read.fadeTo(400, 1), 1000)
        this.logo.fadeOut(100)
        this.state_one()
        this.dom.animate({
          width: final_width 
        }, {duration: 450})
      }, 1200)
    })
  }
  do_save(inverse=false){
    this.save.html(get_heart(inverse))
    this.save.tippy.setContent(get_save_text(inverse))
  }
  press_save(){
    log('Clicked on alma save')
    saveunsave()
  }
  press_more(){
    log('Clicked on alma more')
    popper.toggle()
  }
  press_read(){
    log('Clicked on alma read')
    toggle_read(null, { source: "alma" })
  }
  disappear(){
    log('yeeting alma') 
    this.fade_out_all(90) 
    setTimeout( () => {
      this.dom.animate({
        height: 0 
      }, {duration: 150})
      setTimeout( () => {
        this.dom.fadeOut()
      }, 130)
    }, 90)
  }

  hover(){
    log('> Alma is hovered')
    this.hovered = true
    this.x_button.fadeIn(80)
  }
  
  not_hover(){
    log('> Alma is unhovered')
    this.state_one(60)
    this.hovered = false
    setTimeout( () =>  { if (!this.hovered) this.x_button.fadeOut(120) }, 1000 )
  } 

  make_alma(){
    return $(`
    <fready-alma>
      <fready-element id='fready-alma-x'>${x_button_dark}</fready-element>
      <fready-element class='fready-alma-sector-left' id='fready-alma-logo'>
        <a href='${FREADY_API}' target="_blank"><fready-icon>${fready_logo}</fready-icon></a>
      </fready-element>
      <fready-element class='fready-circle-btn' id='fready-alma-eta'>${calc_eta()}'</fready-element>
      <fready-element id='fready-alma-space'>${space_to_read}</fready-element>
      <fready-element id='fready-alma-menu'>
        <fready-icon class='fready-circle-btn' id='fready-alma-save'>${get_heart()}</fready-icon>
        <fready-icon class='fready-circle-btn' id='fready-alma-more'>${more}</fready-icon>
      </fready-element>
    </fready-alma>`)
  }
  pos_alma(){
    if ($(this.art_start).offset() == null){
      this.dom.css( {
        'position':'fixed',
        'top': `20px`,
        'right': `50px`
      })  
      return
    }
    let y = Math.max(30, ($(this.art_start).offset().top - 50))
    let x = Math.max(30, $(this.art_start).offset().left)
    this.dom.css( {
      'position':'absolute',
      'top': `${y}px`,
      'left': `${x}px`
    })
  }
  inject_alma(){
    //onDocumnetResize
    this.pos_alma(this.art_start)
    $(document.body).append(this.dom) 
  }

  wire_alma(){
    
    this.space_to_read.click(() => alma.press_read())
    this.save.click(() => alma.press_save())
    this.more.click(() => alma.press_more())
    this.x_button.click(() => alma.disappear())
    this.logo.click(() => go_dashboard())

    this.save.tippy = qtippy(this.save, 'Save')
    this.space_to_read.tippy = qtippy(this.space_to_read, 'Read')
    this.more.tippy = qtippy(this.more, 'More')
    addEventListener( "resize", () => this.pos_alma())
  }
  state_one(animation){
    this.space_to_read.fadeIn(animation)
    this.logo.fadeOut(animation)
    this.eta.fadeIn(animation)
    this.menu.fadeIn(animation)
  }
  fade_out_all(animation=0){
    this.space_to_read.fadeOut(animation)
    this.logo.fadeOut(animation)
    this.eta.fadeOut(animation)
    this.menu.fadeOut(animation)
    this.x_button.fadeOut(animation)
  }
}
// ------------ onload ------------ //
// checking if this is an iframe
if (window != top) {
  log('> got injected in an iframe')
}

let active = null 
let last_active = null

function reload_fready(){
  active = document.location.href
  if (active != last_active) {
    last_active = document.location.href
    
    // sync & wait for user
    sync_user()
    new Promise((resolve, reject) => {
      (function waitForFoo(){
          if (user) return resolve()
          setTimeout(waitForFoo, 30)
          log(user)
      })()

    }).then( ()=> {

      // make new freadable & wait for it to laod
      set_freadable(true)

      new Promise((resolve, reject) => {
        (function waitForFoo(){
            if (freadable) return resolve();
            setTimeout(waitForFoo, 30);
        })()
      }).then( () => {
        if (is_freadable(document)){
          log('> Fready found a readable document')
          load_fready()
          let art_locator = locate_art()
          log(art_locator)
          log(` Freadable details:`)
          table(freadable)
          art_locator.addClass('fready-art-locator')
          settings = new Settings()
          alma = new Alma(art_locator)
          popper = new Popper()
          Mousetrap.bind('space', () => {if (user.settings.alma != "off") {toggle_read(null, { source: "space" }); return false}})
        }
      })
    })
  } 
}


setInterval( reload_fready, 500 ) 

