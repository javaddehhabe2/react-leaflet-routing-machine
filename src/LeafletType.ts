import { type LatLngLiteral } from "leaflet";

export interface RouteCoordinate {
  Route: LatLngLiteral[];
}
export interface RouteDeteilType{
  index:number;
  Distance?:string;
  Time?:string;
}
