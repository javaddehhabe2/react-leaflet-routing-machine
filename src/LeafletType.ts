import { DivIcon } from "leaflet";

export interface RouteCoordinate {
  Route: Markers[];
}
export interface RouteDetailType {
  index: number;
  Distance?: string;
  Time?: string;
}
export interface RoutingType {
  Coordinates: RouteCoordinate[];
  UpdateRouteDetail: (index: number, Distance: string, Time: string) => void;
  setCurrentRouteIndex: React.Dispatch<
    React.SetStateAction<number>
  >;
  ondblclickMarker: (lat: number, lng: number) => void;
  removedMarker: number | undefined;
  setRemovedMarker: React.Dispatch<React.SetStateAction<number | undefined>>;
  Icon: ({ Marker, text, color }: IconType) => DivIcon;
}

export interface IconType {
  Marker?:Markers;
  text?: string;
  color?: string;
}

export interface ProductsEntity {
  ProductTitle: string;
  ProductCode: string;
  DossierDetailNumber: string;
  Quantity: number;
  ServiceTypeID: number;
  Volume: number;
}

export interface Markers {
  InstallmentEstatment: number;
  CustomerName: string;
  CustomerAddress: string;
  Latitude: number;
  Longitude: number;
  MarkerID: number;
  Products?: (ProductsEntity)[] | null;
}


export interface RouteDetailsType{
  Point?: Markers[] | null;
}