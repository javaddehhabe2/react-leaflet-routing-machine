import { Marker } from "./MarkerType";

export type LassoController = "Disable" | "Add" | "Remove";
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
  DrawIcon: (_marker: Marker,RouteColor:string, indx: number) => JSX.Element;
  drawLasso: LassoController;
  setDrawLasso: React.Dispatch<React.SetStateAction<LassoController>>;
}

export interface RouteDetailsType {
  Point?: Marker[] | null;
}
export interface RouteDetailsLS {
  currentRouteIndex?:number;
}
export interface SettingsType {
  TimeDistance: number;
  FixedWorkingHours: number;
  VanVolume: number;
  IsuzuVolume: number;
  IsHeavy?: boolean;
  SaveToLocal: boolean;
}