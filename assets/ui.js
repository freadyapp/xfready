const filled_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`
const outlined_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`
const home = `<svg xmlns="http://www.w3.org/2000/svg" height="23" viewBox="0 0 24 15" width="21">
  <path d="M0 0h24v24H0V0z" fill="none" />
  <path
    d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
  </svg>`

const expand_less = `
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h24v24H0V0z" fill="none" />
  <path
    d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
</svg>
`
const x_button = `<svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" fill = "white" width = "18px" height = "18px" > <path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>`
const ui = `
<fready-x>
  ${x_button}
</fready-x>
<fready>
  <fready-block class='fready_div' id='fready_ui'>
    <a href='${FREADY_API}' target="_blank"><fready-icon id="fready_home">${home}</fready-icon></a>
    <fready-button class='fready_button inline ghost' id='savethisfready'>SAVE</fready-button>
    <fready-button class='fready_button inline' id='readthisfready'>READ</fready-button>
    <a href='${FREADY_API}' id='loggedinlink' target="_blank"><fready-p class="meta"> Logged into Fready: <strong id='username'> _ </strong></fready-p></a>
    <a href='${FREADY_API}/users/sign_in' id='loggedoutlink' style='display:none;' target="_blank"><br><fready-p class="meta"> <strong id='username'> LOG IN | SIGN UP </strong></fready-p></a>
    <fready-div class='freadyhide' id='freadyhidebutton'> ${expand_less} </fready-div>
    <fready-div class='freadyhide' id='freadyhidebigbutton'></fready-div>
  </fready-block>
</fready>
`