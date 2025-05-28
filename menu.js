//Modules
const {Menu, shell} = require('electron')

// Module function to create main app menu
module.exports = appWin => {
  // Menu template
  let template = [
    {
      label: "Items",
      submenu: [
        {
            label: 'Add New',
            accelerator: "CmdOrCtrl+o",
            click: () => {
              appWin.send('menu-show-modal');
            }
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWin.send("menu-open-item");
          },
        },
        {
            label: 'Delete Item',
            accelerator: "CmdOrCtrl+Backspace",
            click: () => {
              appWin.send('menu-delete-item');
            }
        },
        {
            label: " Open in Browser",
            accelerator: "CmdOrCtrl+Shift+Enter",
            click: () => {
              appWin.send("menu-open-item-native");
            }
        },
        {
            label: "Search Items",
            accelerator: "CmdOrCtrl+s",
            click: () => {
              appWin.send("menu-focus-search");
            }
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+q",
          role: "quit",
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            shell.openExternal(
              "https://github.com/stackacademytv/master-electron"
            );
          },
        },
      ],
    },
  ];

  /*
    The capitalization of the key in the accelerator string (e.g., "CmdOrCtrl+s" vs "CmdOrCtrl+S") does not make a difference in Electron. 
    Both "CmdOrCtrl+s" and "CmdOrCtrl+S" will trigger the shortcut when you press Ctrl+S (or Cmd+S on macOS).

    Electron's accelerator parser is case-insensitive for the key portion, so you can use either lowercase or uppercase letters for 
    single-character keys. The shortcut will work the same way.
  */

  /* 
    On macOS (`darwin`), Electron provides a special menu role called `'appMenu'`, which is unique to macOS. 
    This role automatically creates a standard macOS application menu with items like "About", "Services", 
    "Hide", and "Quit", following macOS user interface conventions.

    On Windows and Linux, there is no equivalent `'appMenu'` role. Instead, you must manually define a menu 
    with items such as "About" and "Quit" using standard roles (e.g., `{ role: 'about' }`, `{ role: 'quit' }`). 
    These roles are not grouped into a special application menu as on macOS, so you create a custom menu labeled 
    "App" or similar.

    **Summary:**  
    - `'appMenu'` is a macOS-only shortcut for the standard app menu.
    - On other platforms, you must manually define the menu structure and roles.
    - This difference ensures your app follows the native menu conventions of each operating system.
  */

  //create mac app menu
  //win32 or win64 for windows, linux, and darwin for macOS
  if (process.platform === "darwin") {
    template.unshift({ role: "appMenu" });
  }

  // Add a custom app menu for Windows 64-bit
  if (process.platform === "win32" && process.arch === "x64") {
    template.unshift({
      label: "App",
      submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
    });
  }
  // Add a custom app menu for Windows 32-bit
  if (process.platform === "win32" && process.arch === "ia32") {
    template.unshift({
      label: "App",
      submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
    });
  }
  // Add a custom app menu for Linux
  if (process.platform === "linux") {
    template.unshift({
      label: "App",
      submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
    });
  }

  //Build menu
  let menu = Menu.buildFromTemplate(template);

  //Set the menu
  Menu.setApplicationMenu(menu);
  console.log("Menu created");
}