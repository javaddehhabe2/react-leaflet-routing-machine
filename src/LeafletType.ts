import { DivIcon } from "leaflet";
import { Marker } from "./MarkerType";

export type LassoController='Disable'|'Add'|'Remove';
export interface RouteCoordinate {
  Route: Marker[];
}
export interface RouteDetailType {
  index: number;
  Distance?: string;
  Time?: string;
}
export interface RoutingType {
  UpdateRouteDetail: (index: number, Distance: string, Time: string) => void;
  setCurrentRouteIndex: React.Dispatch<React.SetStateAction<number>>;
  ondblclickMarker: (lat: number, lng: number) => void;
  removedMarker: number | undefined;
  setRemovedMarker: React.Dispatch<React.SetStateAction<number | undefined>>;
  Icon: ({ type, text, color, isSelected }: IconType) => DivIcon;
  drawLasso:LassoController;
  setDrawLasso:React.Dispatch<React.SetStateAction<LassoController>>;
}

export interface IconType {
  type: number;
  text?: string;
  color?: string;
  isSelected: boolean;
}

export interface RouteDetailsType {
  Point?: Marker[] | null;
}
