const { ipcRenderer } = require('electron');
const items = require('./items');

//dom nodes
let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");
let search = document.getElementById("search");

////////////////////////////////////////////////
//New 
//////////////////////////////////////////////
//Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
});
//Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
    items.open();
});
//Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem();
    items.delete(selectedItem.index);
});
//Open selected item in browser from menu
ipcRenderer.on('menu-open-item-native', () => {
    let selectedItem = items.getSelectedItem();
    items.openNative(selectedItem.index);
});
//Focus search input from menu
ipcRenderer.on('menu-focus-search', () => {
    search.focus();
});

////////////////////////////////////////////////
//End New 
//////////////////////////////////////////////

//Filter items with "search"
search.addEventListener('keyup', e => {
    //Loop items
    Array.from( document.getElementsByClassName('read-item') ).forEach( item => {

        //Hide items that dont match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    })
})

//navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
})

//disable and enable modal buttons
const toggleModalButtons = () => {   

    //Check state of buttons
    if(addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

//Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  itemUrl.focus();
});

//Hide modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none'
});

//Handle new item
addItem.addEventListener('click', e => {
  
    //check if url is valid
    if (itemUrl.value)
    {
        console.log(itemUrl.value);
        //send url to main process using ipc messaging
        ipcRenderer.send('new-item', itemUrl.value);  //only thing we need to send

        //Disable buttons
        toggleModalButtons();
    }
});

//Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    console.log(newItem); // prints the url

    console.log('New item received:', newItem);
    
    //Add new item to "items" node
    items.addItem(newItem, true);

    console.log('Item added to DOM');


    //Enable buttons
    toggleModalButtons();

    //Hide modal and clear value
    modal.style.display = 'none';
    itemUrl.value = '';
});

//listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') { addItem.click(); }
})