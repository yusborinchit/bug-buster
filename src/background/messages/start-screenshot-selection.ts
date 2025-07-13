import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (_req, res) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  if (!tab?.id) return res.send({ status: "error" })

  sendToContentScript({
    tabId: tab.id,
    name: "start-screenshot-selection"
  })

  return res.send({ status: "ok" })
}

export default handler
