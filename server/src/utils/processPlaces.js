export const processPlaces = (places) => {
  return places.map((place) => {
    const image = getHighQualityImage(place.images);

    return {
      ...place,
      image:
        image ||
        `https://source.unsplash.com/400x300/?${place.name.split(" ")[0]},${place.category}`,
    };
  });
};