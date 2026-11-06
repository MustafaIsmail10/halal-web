// scripts/background.js sends every page load here, with the page's address after the #.
const url = location.hash.slice(1);

setTimeout(async () => {
  // Any website can open this page, so only follow web addresses.
  if (!/^https?:\/\//.test(url)) return;

  // Let this tab's next page load past the redirect rule.
  // scripts/background.js removes this rule once the page has loaded.
  const tab = await chrome.tabs.getCurrent();
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [tab.id],
    addRules: [{
      id: tab.id,
      priority: 2,
      action: { type: 'allow' },
      condition: { tabIds: [tab.id], resourceTypes: ['main_frame'] }
    }]
  });

  // replace() keeps this page out of the Back history.
  location.replace(url);
}, 3000);
