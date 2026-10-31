// Runs in every page at document_start (see manifest.json).
// Puts the saved theme on <html> so styles/grayscale.css can pick the filter.

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme && theme !== 'gray') {
    root.setAttribute('data-halal-web-theme', theme);
  } else {
    root.removeAttribute('data-halal-web-theme');
  }
}

chrome.storage.sync.get('theme').then(({ theme }) => applyTheme(theme));

// When the popup saves a new theme, update this page right away.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    applyTheme(changes.theme.newValue);
  }
});
