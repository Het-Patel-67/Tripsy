export const getBestPlaceImage = (place) => {

  if (place.optimizedImage) {
    return place.optimizedImage;
  }

  if (place.images?.length) {
    return place.images[0];
  }

  return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200";
};