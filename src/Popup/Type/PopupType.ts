import { RouteCoordinate } from "../../LeafletType";
import { Marker  } from "../../MarkerType";

export interface RoutePopupType {
    route:RouteCoordinate;
    onChangeColor:(color: string) => void;
}

export interface PopupType {
    marker:Marker;
   
}