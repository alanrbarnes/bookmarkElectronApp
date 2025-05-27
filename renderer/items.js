//Dom nodes
let items = document.getElementById("items");

///Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

//persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.select = e => {

    //Remove currently selected item class
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

    //Add to clicked item
    e.currentTarget.classList.add('selected');
}

//Move to newly selected item
exports.changeSelection = direction => {

    //Get selected item
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    //Handle up/down
    if(direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected');
        currentItem.previousElementSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected');
        currentItem.nextElementSibling.classList.add('selected');
    }
}

exports.open = () => {

    //Only if we have items (in case of menu open)
    if ( !this.storage.length ) {
        return;
    }   

    //Get selected item
    let selectedItem = document.getElementsByClassName('read-item selected')[0];

    //Get items url
    let contentURL = selectedItem.dataset.url
    console.log('Opening item: ', contentURL);
}

//Add new item
exports.addItem = (item, isNew = false) => {
    // Remove placeholder read-item if it exists
    const placeholder = document.querySelector('#items .read-item');
    if (placeholder && placeholder.querySelector('h2') && placeholder.querySelector('h2').innerText === 'Title of item') {
        placeholder.remove();
    }

    // Create a new DOM node
    let itemNode = document.createElement('div');
    // Remove hardcoded id to avoid duplicates
    // itemNode.setAttribute('id', 'newdiv');

    // Assign "read-item" class
    itemNode.setAttribute('class', 'read-item');

    // Set item url as data attribute
    itemNode.setAttribute('data-url', item.url);
    
    // Add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}" class="thumbnail"><h2>${item.title}</h2>`;

    // Append new node to "items"
    items.appendChild(itemNode);

    // Attach click handler to select (use exports to avoid 'this' issues)
    itemNode.addEventListener('click', exports.select);

    // Attach double click handler to open (use exports to avoid 'this' issues)
    itemNode.addEventListener('dblclick', exports.open);

    // If this is the first item, select it
    if(document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    // Add item to storage
    if(isNew) {
        exports.storage.push(item);
        exports.save();
        console.log(exports.storage);
    }
}

//Add items from storage when app loads
exports.storage.forEach(item => {
    this.addItem(item);
});