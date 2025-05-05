import { Marker } from "@Map/Type";
import L from "leaflet";
export interface CustomMarkerType {
  Index: number;
  MarkerID: number;
  Latitude: number;
  Longitude: number;
  Text: string;
  Draggable?: boolean;
  BubblingMouseEvents?: boolean;
  EventHandlers?: L.LeafletEventHandlerFnMap;
  MarkerDetail?: Marker;
  Hide?:boolean;
}
export interface MarkerIconType {
  MarkerID: number;
  Text: string;
  Index: number;
  Latitude: number;
  Longitude: number;
  Hide?: boolean;
}
