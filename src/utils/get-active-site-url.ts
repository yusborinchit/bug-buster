export async function getActiveSiteUrl() {
  const activeTabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  return new URL(activeTabs.at(0).url);
}
