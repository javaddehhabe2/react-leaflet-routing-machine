import { Marker, RouteCoordinate } from "@Map/Type";


export interface RoutePopupType {
    route:RouteCoordinate;
    onChangeColor:(color: string) => void;
}

export interface PopupType {
    marker:Marker;
   
}