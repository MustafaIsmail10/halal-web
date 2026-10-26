document.getElementById('toggleBtn').addEventListener('click', async () => {
  
  const button = document.getElementById('toggleBtn');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleGrayscale
    });   
  } catch (error) {
    button.textContent = 'Error toggling grayscale';
    button.disabled = true;
  }
});

function toggleGrayscale() {
  const root = document.documentElement;
  if (root.hasAttribute('data-halal-web-color')) {
    root.removeAttribute('data-halal-web-color');
  } else {
    root.setAttribute('data-halal-web-color', '');
  }
}
