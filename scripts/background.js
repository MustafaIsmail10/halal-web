// Content scripts can't see their own tab id, so they ask here whether the popup turned the warning off for their tab.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const key = `warningOff:${sender.tab.id}`;
  chrome.storage.session.get(key).then((items) => sendResponse(Boolean(items[key])));
  return true; // Keeps the message open until sendResponse runs.
});


// Slowdown: send every page load to slowdown.html first. It waits 10 seconds, then opens the page.
// Dynamic rules are kept when Chrome restarts, so adding the rule at install and update is enough.
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [{
      id: 1,
      priority: 1,
      action: {
        type: 'redirect',
        // \0 is the page's full address. slowdown.html reads it after the #.
        redirect: { regexSubstitution: chrome.runtime.getURL('slowdown.html') + '#\\0' }
      },
      condition: {
        regexFilter: '^https?://.*',
        resourceTypes: ['main_frame'],
        // Form posts go straight through. Delaying them would lose the data being sent.
        requestMethods: ['get']
      }
    }]
  });
});

// slowdown.html lets its tab through with a session rule whose id is the tab id.
// Remove it once the page has loaded, so the next page in this tab is slowed down again.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [tabId] });
  }
});
