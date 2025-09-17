window.addEventListener('load', feedblocker);
document.addEventListener('yt-navigate-start', feedblocker);
document.addEventListener('yt-navigate-finish', feedblocker);

let messageElement;
let config = {
  hideShorts: true,
};
const shortsKey = 'hideShorts';
doomStart();

function doomStart() {
  //  storage sync
  chrome.storage.sync.get((res) => {
    config.hideShorts = res.hideShorts ?? true;
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideShorts) {
      const hide = changes.hideShorts.newValue;
      config.hideShorts = hide;
    }
  });
}

function feedblocker() {
  createMessageElement();

  hideHomeFeed();
  hideShorts();
  hideSidebarSuggestions();

  if (messageElement) {
    const block = isBlockedpage();
    messageElement.style.display = block ? 'block' : 'none';
  }
}

function hideSidebarSuggestions() {
  const isVideoPage = window.location.pathname.startsWith('/watch');

  const el = document.querySelector('ytd-watch-next-secondary-results-renderer');
  if (el) {
    el.style.display = isVideoPage ? 'none' : 'block';
  }
}

function hideShorts() {
  if (!config.hideShorts) return;
  const isShort = window.location.pathname.startsWith('/shorts');

  const el = document.querySelector('ytd-shorts');

  const hide = config.hideShorts && isShort;
  if (el) {
    el.style.display = hide ? 'none' : 'block';
  }
  if (hide) {
    document.querySelectorAll('video').forEach((el) => {
      el.pause();
    });
  }
}

function hideHomeFeed() {
  const block = window.location.pathname === '/';
  const grid = document.querySelector('ytd-browse');
  if (grid) {
    // grid.innerHTML = '';
    grid.style.display = block ? 'none' : 'block';
  }
  const preview = document.querySelector('ytd-video-preview');
  if (preview) {
    preview.style.display = block ? 'none' : 'block';
  }
}

function isBlockedpage() {
  const ishome = window.location.pathname === '/';
  const isShort = window.location.pathname.startsWith('/shorts');
  return ishome || (config.hideShorts && isShort);
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
    parent?.appendChild(msg);
    messageElement = msg;
  }
}
