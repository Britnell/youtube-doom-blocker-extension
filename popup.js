const shortsKey = 'hideShorts';

document.addEventListener('DOMContentLoaded', function () {
  const hideShortsCheckbox = document.getElementById(shortsKey);

  chrome.storage.sync.get([shortsKey], (res) => {
    hideShortsCheckbox.checked = res.hideShorts ?? true;
  });

  hideShortsCheckbox.addEventListener('change', () => {
    const val = hideShortsCheckbox.checked;
    chrome.storage.sync.set({ [shortsKey]: val });
  });
});
