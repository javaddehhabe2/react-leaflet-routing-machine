import { type LatLngLiteral } from "leaflet";

export interface RouteCoordinate {
  Route: LatLngLiteral[];
}
export interface RouteDeteilType {
  index: number;
  Distance?: string;
  Time?: string;
}
export interface RoutingType {
  Coordinates: RouteCoordinate[];
  UpdateRouteDetail: (index: number, Distance: string, Time: string) => void;
  setSelectedRouteDetail: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  ondblclickMarker: (lat: number, lng: number) => void;
  removedMarker: number | undefined;
  setRemovedMarker: React.Dispatch<React.SetStateAction<number | undefined>>;
}
