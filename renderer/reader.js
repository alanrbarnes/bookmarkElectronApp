// Create button in remote content to mark item as "Done"
let readItClose = document.createElement('div');
readItClose.innerText = 'Done';

readItClose.style.position = 'fixed';
readItClose.style.bottom = '15px';
readItClose.style.right = '15px';
readItClose.style.padding = '5pox 10px';
readItClose.style.fontSize = '20px';
readItClose.style.fontWeight = 'bold';
readItClose.style.background = 'dodgerblue';
readItClose.style.color = 'white';
readItClose.style.borderRadius = '5px';
readItClose.style.cursor = 'pointer';
readItClose.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.2)';
readItClose.style.zIndex = '9999';

// Attach click handler
readItClose.onclick = e => {
    alert('Item marked as done!');
    
    // Message parent (opener) window
    // window.opener.postMessage('item-done', '*');
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: '{{index}}'
    }, '*');
};



// Append the button to the body of the remote content
// appendChild creates an html node object, This cannot be cloned because it is html and not javascript that can be serialized
//this creates an internal ipc serialization error
// document.getElementsByTagName('body')[0].appendChild(readItClose);

// append does not create an html node object, This can be cloned because it is javascript and can be serialized
document.getElementsByTagName('body')[0].append(readItClose);