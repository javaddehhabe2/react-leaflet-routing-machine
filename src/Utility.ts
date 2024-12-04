import { RouteCoordinate } from "./LeafletType";

export const SetMarkerColor = (
  coordinates: RouteCoordinate[],
  Latitude: number,
  Longitude: number
) => {
  let exist = false;
  coordinates.forEach((_route, index) => {
    let existCoor = coordinates[index].Route.find(
      (el) => el.Latitude === Latitude && el.Longitude === Longitude
    );
    if (existCoor) exist = true;
  });
  return exist;
};
