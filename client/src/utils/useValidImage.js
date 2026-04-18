import { useState, useEffect } from "react";

export const useValidImage = (src, fallback) => {
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    if (!src) {
      setImgSrc(fallback);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src); 
    };

    img.onerror = () => {
      setImgSrc(fallback);
    };
  }, [src, fallback]);

  return imgSrc;
};