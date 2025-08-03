import css from "data-text:~/global.css";

import { sendToBackground } from "@plasmohq/messaging";
import { useMessage } from "@plasmohq/messaging/hook";
import type { PlasmoGetStyle } from "plasmo";
import { useCallback, useEffect, useState } from "react";
import { ABSURD_HIGH_Z_INDEX } from "~/const";

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = css;
  return style;
};

interface Coords {
  x: number;
  y: number;
}

interface ScreenshotData {
  sessionId: string;
  type: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ScreenshotSelector() {
  const [isActive, setIsActive] = useState(false);
  const [pendingCapture, setPendingCapture] = useState<Rect | null>(null);
  const [startPoint, setStartPoint] = useState<Coords | null>(null);
  const [screenshotData, setScreenshotData] = useState<ScreenshotData | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);

  useMessage<ScreenshotData, unknown>(async (req, res) => {
    if (req.name === "start-screenshot-selection") {
      const { sessionId, type } = req.body;

      if (
        !sessionId ||
        typeof sessionId !== "string" ||
        !type ||
        typeof type !== "string"
      )
        return res.send({ status: "error" });

      setIsActive(true);
      setScreenshotData({ sessionId, type });

      document.body.style.overflow = "hidden";
      document.documentElement.style.cursor = "crosshair";

      res.send({ status: "ok" });
    }
  });

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!isActive) return;

      event.preventDefault();

      setStartPoint({ x: event.clientX, y: event.clientY });
      setCurrentRect({
        x: event.clientX,
        y: event.clientY,
        width: 0,
        height: 0
      });
    },
    [isActive]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isActive || !startPoint) return;

      const x = Math.min(event.clientX, startPoint.x);
      const y = Math.min(event.clientY, startPoint.y);
      const width = Math.abs(event.clientX - startPoint.x);
      const height = Math.abs(event.clientY - startPoint.y);

      setCurrentRect({ x, y, width, height });
    },
    [isActive, startPoint]
  );

  const handleMouseUp = useCallback(async () => {
    if (!isActive || !startPoint || !currentRect) return;

    setIsActive(false);
    setStartPoint(null);
    setCurrentRect(null);

    document.body.style.overflow = "auto";
    document.documentElement.style.cursor = "auto";

    const finalRect = {
      x: currentRect.x,
      y: currentRect.y,
      width: currentRect.width,
      height: currentRect.height
    };

    if (finalRect.width < 5 || finalRect.height < 5) return;
    setPendingCapture(finalRect);
  }, [isActive, startPoint, currentRect]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isActive, handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!isActive && pendingCapture) {
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          await sendToBackground({
            name: "make-screenshot-selection",
            body: { ...pendingCapture, ...screenshotData }
          });
          setPendingCapture(null);
          setScreenshotData(null);
        });
      });
    }
  }, [isActive, pendingCapture]);

  return (
    isActive && (
      <div
        style={{ "--z-index": ABSURD_HIGH_Z_INDEX } as React.CSSProperties}
        className="pointer-events-auto fixed inset-0 z-[var(--z-index)] box-border h-screen w-screen border-[3px] border-red-600">
        {currentRect && (
          <div
            style={
              {
                "--x": `${currentRect.x}px`,
                "--y": `${currentRect.y}px`,
                "--width": `${currentRect.width}px`,
                "--height": `${currentRect.height}px`
              } as React.CSSProperties
            }
            className="pointer-events-auto absolute left-[var(--x)] top-[var(--y)] z-[var(--z-index)] h-[var(--height)] w-[var(--width)] border-2 border-dashed border-blue-500 bg-blue-500/30 opacity-30"
          />
        )}
      </div>
    )
  );
}
