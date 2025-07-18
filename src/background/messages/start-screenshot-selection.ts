import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging";
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId || typeof sessionId !== "string")
    return res.send({ status: "error" });

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) return res.send({ status: "error" });

  try {
    await sendToContentScript({
      tabId: tab.id,
      name: "start-screenshot-selection",
      body: { sessionId }
    });
  } catch (e) {
    return res.send({ status: "error" });
  }

  return res.send({ status: "ok" });
};

export default handler;
