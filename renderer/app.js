const { ipcRenderer } = require('electron');

//dom nodes
let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");

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
showModal.addEventListener("click", () => {
  modal.style.display = 'flex'
  itemUrl.focus();
});

//Hide modal
closeModal.addEventListener("click", () => {
  modal.style.display = 'none'
});

//Handle new item
addItem.addEventListener("click", () => {
  
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