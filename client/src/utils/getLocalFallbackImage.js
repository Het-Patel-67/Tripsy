import { fallbackImages } from "./fallbackImage.js";
import { getCategoryKey } from "./getCategorykey.js";


export const getLocalFallbackImage = (place, index = 0) => {
  const key = getCategoryKey(place);
  const images = fallbackImages[key] || fallbackImages.default;
  const safeIndex = Number.isFinite(index) ? Math.abs(index) : 0;

  if (!images || images.length === 0) {
    return "/assets/default/default1.avif";
  }

  return images[safeIndex % images.length];
};