//Modules
const {BrowserWindow} = require('electron')

let offscreenWindow

//Exported readItem function
module.exports = (url, callback) => {
  ///////////////////
  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }
  ////////////////////
  // Validate URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch (err) {
    callback({ error: 'Invalid URL', url });
    return;
  }

  //Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    }
  })
  
  ////////////////////////////////
  // Handle load failures
  offscreenWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    callback({ error: `Failed to load URL: ${errorDescription}`, url });
    offscreenWindow.close();
    offscreenWindow = null;
  });

  //Load the item url
  offscreenWindow.loadURL(url)
  
  //Wait for the page to load
  offscreenWindow.webContents.on('did-finish-load', e => {
    //Get the page title
    let title = offscreenWindow.getTitle()
    
    //Get the page content
    console.log('About to capture page');
    offscreenWindow.webContents.capturePage().then(image => {
        console.log('Page captured');
        let screenshot = image.toDataURL()
        //Call the callback with the item object
        callback({title, screenshot, url })
        //Close the window
        offscreenWindow.close()
        offscreenWindow = null
    }).catch(err => {
        callback({ error: 'Failed to capture page', url, details: err.message });
        offscreenWindow.close();
        offscreenWindow = null;
    });
  })
}