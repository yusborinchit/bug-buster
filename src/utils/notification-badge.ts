export function createNotificationBadge(text: string) {
  chrome.action.setBadgeText({ text })
  chrome.action.setBadgeTextColor({ color: "white" })
}

export function removeNotificationBadge() {
  chrome.action.setBadgeText({ text: undefined })
}
