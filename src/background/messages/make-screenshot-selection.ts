import { type PlasmoMessaging } from "@plasmohq/messaging";
import { cropScreenshot } from "~/utils/crop-screenshot";
import { promiseDb } from "~/utils/database";
import { createNotificationBadge } from "~/utils/notification-badge";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { body } = req;
  if (!body || typeof body !== "object") return res.send({ status: "error" });

  const { x, y, width, height } = body;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  )
    return res.send({ status: "error" });

  const screenshot = await chrome.tabs.captureVisibleTab(null, {
    format: "jpeg",
    quality: 100
  });

  const croppedScreenshot = await cropScreenshot(
    screenshot,
    x,
    y,
    width,
    height
  );

  promiseDb.then((db) => {
    db.add("screenshots", {
      id: crypto.randomUUID(),
      url: croppedScreenshot,
      createdAt: new Date().toISOString()
    });
  });

  createNotificationBadge("!");

  return res.send({ status: "ok" });
};

export default handler;
