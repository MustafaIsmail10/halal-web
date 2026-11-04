// Content scripts can't see their own tab id, so they ask here whether the popup turned the warning off for their tab.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const key = `warningOff:${sender.tab.id}`;
  chrome.storage.session.get(key).then((items) => sendResponse(Boolean(items[key])));
  return true; // Keeps the message open until sendResponse runs.
});
