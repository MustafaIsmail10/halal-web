document.getElementById('toggleBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleGrayscale
  });
});

function toggleGrayscale() {
  const currentFilter = document.documentElement.style.filter;
  if (currentFilter.includes('grayscale(100%)')) {
    document.documentElement.style.filter = '';
  } else {
    document.documentElement.style.filter = 'grayscale(100%)';
  }
}
