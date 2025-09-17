const config = {
  hideShorts: true,
};

immediately();
window.addEventListener('load', doomStart);

async function immediately() {
  await initConfig();
  //  immediately hide shorts
  document.querySelectorAll('ytd-shorts').forEach((el) => {
    hideShort(el);
  });
}

async function doomStart() {
  await initConfig();

  const mgr = document.querySelector('ytd-page-manager');

  // run immediately
  for (let i = 0; i < mgr.children.length; i++) {
    elementHandler(mgr.children[i]);
  }

  // run on updates
  observerer(mgr, { childList: true, subtree: false }, (muts) => {
    const el = muts[0]?.addedNodes[0];
    elementHandler(el);
  });
}

function elementHandler(el) {
  if (!el) return;
  const type = el.getAttribute('page-subtype');
  const tag = el.tagName.toLowerCase();

  if (tag === 'ytd-browse') {
    if (type === 'home') {
      el.style.display = 'none';
    }
  }
  if (tag === 'ytd-shorts') {
    hideShort(el);

    observerer(el, { attributes: true, attributeFilter: ['hidden'] }, (muts) => {
      const mut = muts?.[0];
      if (!mut) return;
      if (mut.attributeName === 'hidden') {
        hideShort(el);
      }
    });
  }
}

function hideShort(el) {
  el.style.display = config.hideShorts ? 'none' : 'block';
  if (config.hideShorts) {
    setTimeout(() => {
      document.querySelectorAll('video').forEach((el) => {
        el.pause();
        el.removeEventListener('play', onplay);
        el.addEventListener('play', onplay);
      });
    }, 10);
  }
}
function observerer(el, config, callback) {
  if (!el) return null;

  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });

  observer.observe(el, config);
}

function hideSidebarSuggestions() {
  const isVideoPage = window.location.pathname.startsWith('/watch');

  const el = document.querySelector('ytd-watch-next-secondary-results-renderer');
  if (el) {
    el.style.display = isVideoPage ? 'none' : 'block';
  }
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

function initConfig() {
  const shortsKey = 'hideShorts';

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[shortsKey]) {
      const hide = changes[shortsKey].newValue;
      config[shortsKey] = hide;
    }
  });

  return new Promise((resolve) => {
    //  storage sync
    chrome.storage.sync.get((res) => {
      config.hideShorts = res.hideShorts ?? true;
      resolve();
    });
  });
}

function onplay(ev) {
  ev.target?.pause();
}
