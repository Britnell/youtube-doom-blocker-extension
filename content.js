let messageElement;

window.addEventListener('load', () => {
  feedblocker();
});

document.addEventListener('yt-navigate-finish', () => {
  feedblocker();
});

document.addEventListener('yt-navigate-start', () => {
  feedblocker();
});

function feedblocker() {
  createMessageElement();

  const block = isBlockedpage();
  const grid = document.querySelector('ytd-browse');
  if (grid) {
    grid.style.display = block ? 'none' : 'block';
  }
  const preview = document.querySelector('ytd-video-preview');
  if (preview) {
    preview.style.display = block ? 'none' : 'block';
  }

  messageElement.style.display = block ? 'block' : 'none';
}

function isBlockedpage() {
  return window.location.pathname === '/';
}

function createMessageElement() {
  if (messageElement) return;

  const msg = document.createElement('div');
  msg.innerHTML = `<div style="height:75vh; display:grid; place-items:center;">
  <h1 style="color:white; font-size: 5vw; text-align:center;">This is your detox (light)</h1>
  </div>`;
  msg.style.display = 'none';
  msg.style.width = '100%';

  const parent = document.querySelector('ytd-page-manager');
  if (parent) {
    parent?.appendChild(messageElement);
    messageElement = msg;
  }
}
