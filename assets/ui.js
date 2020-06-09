const filled_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`
const outlined_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`
let ui = `
<fready>
  <fready-block class='fready_div' id='fready_ui'>
    <fready-button class='fready_button inline' id='savethisfready'>SAVE</fready-button>
    <fready-button class='fready_button inline' id='readthisfready'>READ</fready-button>
    <a href=${FREADY_API} id='loggedinlink' target="_blank"><fready-p class="meta"> Logged into Fready: <strong id='username'> _ </strong></fready-p></a>
    <fready-a href='${FREADY_API}/users/sign_in' id='loggedoutlink' style='display:none;' target="_blank"><fready-p class="meta"> Not logged in <strong id='username'> LOG IN </strong></fready-p></fready-a>
    <fready-div class='freadyhide' id='freadyhidebutton'> ^ </fready-div>
    <fready-div class='freadyhide' id='freadyhidebigbutton'></fready-div>
  </fready-block>
</fready>
`