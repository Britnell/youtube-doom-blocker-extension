const config = {
  hideShorts: true,
};

immediately();
window.addEventListener('load', doomStart);

async function immediately() {
  //  hide immediately to avoid flash
  document.querySelectorAll('ytd-shorts').forEach((el) => {
    hideShort(el);
  });
  document.querySelectorAll('ytd-watch-flexy').forEach((el) => {
    hideSidebar(el);
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

  if (tag === 'ytd-watch-flexy') {
    hideSidebar(el);
  }
}

function hideShort(el) {
  el.style.display = config.hideShorts ? 'none' : 'block';

  if (config.hideShorts) {
    document.querySelectorAll('video').forEach((el) => {
      el?.pause();
    });
    setTimeout(() => {
      document.querySelectorAll('video').forEach((el) => {
        el?.pause();
        el.addEventListener('play', onplay);
      });
    }, 10);
  }
}

function hideSidebar(el) {
  const sidebar = el.querySelector('ytd-watch-next-secondary-results-renderer');
  if (sidebar) {
    sidebar.style.display = 'none';
  }
}

function observerer(el, config, callback) {
  if (!el) return null;

  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });

  observer.observe(el, config);
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
      config.hideShorts = res?.hideShorts ?? true;
      resolve();
    });
  });
}

function onplay(ev) {
  ev.target?.pause();
  ev.target?.removeEventListener('play', onplay);
}
