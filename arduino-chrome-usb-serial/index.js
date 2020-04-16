const decoder = new TextDecoder('utf-8');
const baudrate = 115200;
let port = null;
let writer = null;

document.getElementById('select-port-btn').addEventListener('click', async ()=>{
    document.getElementById('alerts').innerText = '';
    // check https
    if(window.location.protocol !== 'https:'){
        document.getElementById('alerts').innerText = 'you should use the https connection';
        return 0;
    }
    // check usb serial protocol support
    if(!"serial" in navigator){
        document.getElementById('alerts').innerHTML = 'you should enable Serial API. open <a href="chrome://flags/#enable-experimental-web-platform-features">chrome://flags/#enable-experimental-web-platform-features</a> and turn this option on.';
        return 0;
    }

    // try to connect to arduino
    // choose a port from native dialog
    port = await navigator.serial.requestPort();
    await port.open({ baudrate: baudrate });
    const reader = port.readable.getReader();
    writer = port.writable.getWriter();

    reader.read().then(function processText({ done, value }) {
        document.getElementById('received').innerText = decoder.decode(value);
        return reader.read().then(processText);
    }).catch((reason)=>{
        console.error(reason);
        document.getElementById('alerts').innerText = 'reading alert. open the console to see details';
    });

    document.getElementById('data-transmission').classList.remove('hidden');
    document.getElementById('select-port').classList.add('hidden');

});

document.getElementById('led').addEventListener('click', async ()=>{
    writer.write( Uint8Array.from('switch', s => s.charCodeAt(0)) );
});

document.getElementById('send').addEventListener('click', async ()=>{
    let textToSend = document.getElementById('text-to-send').value;
    writer.write( Uint8Array.from(textToSend, s => s.charCodeAt(0)) );
});
