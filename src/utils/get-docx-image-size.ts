import { MAX_DOC_IMAGE_HEIGHT, MAX_DOC_IMAGE_WIDTH } from "../const";

export function getDocxImageSize(width: number, height: number) {
  const widthRatio = MAX_DOC_IMAGE_WIDTH / width;
  const heightRatio = MAX_DOC_IMAGE_HEIGHT / height;

  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  };
}
