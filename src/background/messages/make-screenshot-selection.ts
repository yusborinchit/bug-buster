import type { PlasmoMessaging } from "@plasmohq/messaging";
import { getDatabase } from "~/database";
import { cropScreenshot } from "~/utils/crop-screenshot";
import { createNotificationBadge } from "~/utils/notification-badge";

export default async function (
  req: PlasmoMessaging.Request,
  res: PlasmoMessaging.Response
) {
  const { body } = req;
  if (!body || typeof body !== "object") return res.send({ status: "error" });

  const { x, y, width, height, sessionId } = body;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  )
    return res.send({ status: "error" });

  getDatabase().then(async (db) => {
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

    await db.add("screenshots", {
      id: crypto.randomUUID(),
      sessionId,
      url: croppedScreenshot,
      width,
      height,
      createdAt: new Date().toISOString()
    });

    createNotificationBadge("!");
  });

  return res.send({ status: "ok" });
}
