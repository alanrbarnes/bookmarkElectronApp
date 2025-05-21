//Modules
const {BrowserWindow} = require('electron')

let offscreenWindow

//Exported readItem function
module.exports = (url, callback) => {
  //Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    }
  })
  
  //Load the item url
  offscreenWindow.loadURL(url)
  
  //Wait for the page to load
  offscreenWindow.webContents.on('did-finish-load', e => {
    //Get the page title
    let title = offscreenWindow.getTitle()
    
    //Get the page content
    offscreenWindow.webContents.capturePage().then(image => {

        let screenshot = image.toDataURL()

        //Call the callback with the item object
        callback({title, screenshot, url })

        //Close the window
        offscreenWindow.close()
        offscreenWindow = null
    })
    
    
    
  })
}