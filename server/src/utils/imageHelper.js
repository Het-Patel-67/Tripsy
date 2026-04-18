const upgradeResolution = (url) => {
  if (!url) return null;

  if (url.includes("w") && url.includes("h")) {
    return url.replace(/w\d+-h\d+/g, "w800-h600");
  }

  return url;
};

export const getHighQualityImage = (images) => {
  if (!images) return null;

  if (Array.isArray(images)) {
    const img = images.find(
      (i) => typeof i === "string" && i.startsWith("http")
    );
    return upgradeResolution(img);
  }

  if (Array.isArray(images)) {
    const img = images.find(
      (i) => typeof i?.url === "string" && i.url.startsWith("http")
    );
    return upgradeResolution(img?.url);
  }

  if (typeof images === "object") {
    const values = Object.values(images);

    const img = values.find(
      (i) =>
        (typeof i === "string" && i.startsWith("http")) ||
        (typeof i?.url === "string" && i.url.startsWith("http"))
    );

    return upgradeResolution(typeof img === "string" ? img : img?.url);
  }

  return null;
};