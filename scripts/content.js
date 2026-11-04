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
  heading.textContent = 'Do not open unless critical.';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Open Critical';
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

chrome.storage.sync.get('theme').then(({ theme }) => applyTheme(theme));

// Apply theme changes from the popup to this page and its warning.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    applyTheme(changes.theme.newValue);
  }
});
