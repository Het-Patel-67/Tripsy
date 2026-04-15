export const getHighQualityImage = (images) => {
  if (!images || images.length === 0) return null;

  let validImage = images.find(
    (img) => img && img.includes("googleusercontent")
  );

  if (!validImage) return null;

  return validImage
    .replace(/w\d+-h\d+/g, "w800-h600")
    .replace(/=w\d+/g, "=w800");
};