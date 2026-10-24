document.getElementById('toggleBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleGrayscale
  });

  document.documentElement.style.filter = 'grayscale(100%)';

});

function toggleGrayscale() {
  console.log('Toggling grayscale mode...');
  const currentFilter = document.documentElement.style.filter;
  if (currentFilter.includes('grayscale(100%)')) {
    document.documentElement.style.filter = '';
  } else {
    document.documentElement.style.filter = 'grayscale(100%)';
  }

  console.log('Grayscale mode toggled.');
}

console.log("This is a popup!")
