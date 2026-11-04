const toggle = document.getElementById('grayscaleToggle');
const message = document.getElementById('message');
const themeInputs = document.querySelectorAll('input[name="theme"]');
const warningToggle = document.getElementById('warningToggle');

init();
initTheme();
initWarning();

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    // Ask the page whether grayscale is on, so the switch matches it.
    const [{ result: isGray }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: isGrayscaleOn
    });
    toggle.checked = isGray;
  } catch (error) {
    // chrome:// pages and the Chrome Web Store don't allow extension scripts.
    showError("Grayscale can't be changed on this page.");
    return;
  }

  toggle.addEventListener('change', async () => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: setGrayscale,
        args: [toggle.checked]
      });
    } catch (error) {
      toggle.checked = !toggle.checked;
      showError('Could not change grayscale on this page.');
    }
  });
}

async function initTheme() {
  // Select the saved theme, or gray if nothing is saved yet.
  const { theme = 'gray' } = await chrome.storage.sync.get('theme');

  for (const input of themeInputs) {
    input.checked = input.value === theme;

    // Saving is enough: scripts/content.js in every open page sees the change.
    input.addEventListener('change', () => {
      chrome.storage.sync.set({ theme: input.value });
    });
  }
}

async function initWarning() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Same key as scripts/background.js. storage.session lives in memory and is cleared when Chrome closes.
  const key = `warningOff:${tab.id}`;
  const items = await chrome.storage.session.get(key);
  warningToggle.checked = !items[key];

  warningToggle.addEventListener('change', () => {
    if (warningToggle.checked) {
      // Takes effect on the next page load in this tab.
      chrome.storage.session.remove(key);
    } else {
      chrome.storage.session.set({ [key]: true });
      // Also close the warning on screen now. chrome:// pages have no warning and refuse scripts.
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.getElementById('halal-web-warning')?.remove()
      }).catch(() => {});
    }
  });
}


function showError(text) {
  toggle.disabled = true;
  message.textContent = text;
  message.hidden = false;
}

// Runs inside the page. Grayscale is on when the color attribute is missing.
function isGrayscaleOn() {
  return !document.documentElement.hasAttribute('data-halal-web-color');
}

// Runs inside the page. Adds or removes the attribute that styles/grayscale.css checks.
function setGrayscale(on) {
  const root = document.documentElement;
  if (on) {
    root.removeAttribute('data-halal-web-color');
  } else {
    root.setAttribute('data-halal-web-color', '');
  }
}
