export async function getCurrentUrl() {
  const currentTab = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  return new URL(currentTab.at(0).url);
}
