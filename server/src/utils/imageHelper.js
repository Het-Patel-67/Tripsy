const upgradeResolution = (url) => {
  if (!url) return null;

  // 🔥 Properly replace FULL pattern
  return url.replace(
    /=w\d+-h\d+(-k-no)?/,
    "=w1200-h900-k-no"
  );
};
export const getHighQualityImage = (images) => {
  if (!Array.isArray(images)) return null;

  const googleImg = images.find(
    (url) =>
      typeof url === "string" &&
      url.includes("googleusercontent")
  );

  if (!googleImg) return null;

  return upgradeResolution(googleImg);
};