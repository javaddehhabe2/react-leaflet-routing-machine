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

export const GetDistance = (distance: number) => (distance / 1000).toFixed(2).toString();

export const GetTime = (time: number) => {
  var h = Math.floor(time / 3600);
  var m = Math.floor((time % 3600) / 60);
  const _h = h < 10 ? `0${h}` : h.toString();
  const _m = m < 10 ? `0${m}` : m.toString();
  return `${_h}:${_m}`;
};
