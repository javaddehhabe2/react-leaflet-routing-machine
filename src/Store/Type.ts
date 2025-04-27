import { Marker, RouteCoordinate } from "@Map/Type";
import { BoxType, ContainerType } from "@Container/Type";

import { LatLngLiteral } from "leaflet";
import { DriverPanelType } from "@Map/Driver";
export interface NewContainerType {
  containerID: number;
  name: string;
  width: number;
  height: number;
  depth: number;
}
export interface ContainerBoxesType {
  container: ContainerType;
  boxes: BoxType[];
}

export interface ShowBoxesType {
  _container: number;
  _box: number;
}
export interface ContainerStoreType {
  ArrangingBox: boolean;
  SetArrangingBox: (state: boolean) => void;

  allContainers: ContainerType[];
  SetAllContainers: (Containers: ContainerType[]) => void;

  defaultContainer: ContainerType | undefined;
  SetDefaultContainer: (_type: string) => void;

  boxes: BoxType[];
  SetBoxes: (_boxes: BoxType[]) => void;

  ContainerBox: ContainerBoxesType[];
  SetContainerBox: (_container: ContainerBoxesType[]) => void;
  AddContainerBox: (_container: ContainerType, _boxes: BoxType[]) => void;
  ClearContainerBox: () => void;

  BoxLargeThanContainer: BoxType[];

  ReArrange: () => boolean;
}

export interface BoxStoreType {
  showBoxes: ShowBoxesType[];
  setShowBoxes: (_showBoxes: ShowBoxesType[]) => void;
}

export interface MapStoreType {
  Markers: Marker[];
  setMarkers: (_Markers: Marker[]) => void;

  ShopsMarker:Marker[],
  setShopsMarker :(_ShopsMarker:Marker[])=> void;

  Flying: LatLngLiteral | null;
  setFlying: (_LatLng: LatLngLiteral | null) => void;
}

export interface RouteStoreType {
  HideRoute: boolean;
  setHideRoute: (_HideRoute: boolean) => void;

  Coordinates: RouteCoordinate[];
  setCoordinates: (
    _Coordinates: RouteCoordinate[],
    SaveToLocal?: boolean
  ) => void;

  SelectedRoute: RouteCoordinate | null;
  setSelectedRoute: (_SelectedRoute: RouteCoordinate | null) => void;

  ShowDriver: boolean;
  setShowDriver: (_ShowDriver: boolean) => void;
}

export interface DriversStoreType {
    Drivers: DriverPanelType[];
     setDrivers: (_Drivers:DriverPanelType[]) => void;
}