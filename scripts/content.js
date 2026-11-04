// Runs in every page at document_start (see manifest.json).

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme && theme !== 'gray') {
    root.setAttribute('data-halal-web-theme', theme);
  } else {
    root.removeAttribute('data-halal-web-theme');
  }
}

function showWarning() {
  const dialog = document.createElement('dialog');
  dialog.id = 'halal-web-warning';
  dialog.setAttribute('aria-labelledby', 'halal-web-warning-title');

  const heading = document.createElement('h1');
  heading.id = 'halal-web-warning-title';
  heading.textContent = 'CALM DOWN!';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Open';
  button.autofocus = true;

  dialog.append(heading, button);

  // Chrome ignores preventDefault() on 'cancel' until the user clicks the page, so block the Escape key itself.
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') event.preventDefault();
  });

  // Stop videos and sounds that start playing behind the warning.
  document.addEventListener('play', (event) => {
    if (dialog.isConnected) event.target.pause();
  }, true);

  button.addEventListener('click', () => dialog.remove());

  document.documentElement.append(dialog);
  dialog.showModal();
}

showWarning();

// Ask scripts/background.js whether the popup turned the warning off for this tab.
// The warning is already up, so the page never shows before the answer arrives.
chrome.runtime.sendMessage('isWarningOff').then((off) => {
  if (off) document.getElementById('halal-web-warning')?.remove();
});

chrome.storage.sync.get('theme').then(({ theme }) => applyTheme(theme));

// Apply theme changes from the popup to this page and its warning.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    applyTheme(changes.theme.newValue);
  }
});

