const toggle = document.getElementById('grayscaleToggle');
const message = document.getElementById('message');

init();

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
