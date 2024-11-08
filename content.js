
const isBlockedpage = ()=> window.location.pathname === '/';

const createMessageElement = () => {
    if (messageElement) return;
    const msg = document.createElement('div');
    msg.innerHTML = `
<div style="height:75vh; display:grid; place-items:center;">
<h1 style="color:white; font-size: 5vw; text-align:center;">This is your Detox (light)</h1>
</div>
    `;
    msg.style.display = 'none';
    msg.style.width = '100%';
    msg.id = 'yt-doom-block-msg'; 
    messageElement = msg;
    const parent = document.querySelector('ytd-page-manager')
    parent.appendChild(messageElement);
};

let messageElement;

document.addEventListener('yt-navigate-finish', () => {
    createMessageElement();
    const grid = document.querySelector('ytd-browse')
    grid.style.display = isBlockedpage() ? 'none' : 'block';
    messageElement.style.display = isBlockedpage() ? 'block' : 'none';
});


document.addEventListener('yt-navigate-start', () => {
    if(!isBlockedpage())
        messageElement.style.display = 'none';
})