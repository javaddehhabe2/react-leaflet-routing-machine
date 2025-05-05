import {  RouteCoordinate } from "@Map/Type";
import { BoxType, ContainerType } from "@Container/Type";

import { LatLngLiteral, LatLngTuple } from "leaflet";
import { DriverPanelType } from "@Map/Driver";
import { MarkerEntity } from "@/Components/Type";
type Filter = "Disable" | "Heavy" | "Light";
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
  _container: string;
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
  Markers: MarkerEntity[];
  setMarkers: (_Markers: MarkerEntity[]) => void;

  ShopsMarker: MarkerEntity[];
  setShopsMarker: (_ShopsMarker: MarkerEntity[]) => void;

  Flying: LatLngLiteral | null;
  setFlying: (_LatLng: LatLngLiteral | null) => void;

  Filter: Filter;
  setFilter: (_Filter: Filter) => void;
}

export interface RouteStoreType {
  HideRoute: boolean;
  setHideRoute: (_HideRoute: boolean) => void;

  Routes:{
    Index:number;
    Coordinates: RouteCoordinate[];
  }[];
  setRoutes: (
    Index:number,
    _Coordinates: RouteCoordinate[],
    SaveToLocal?: boolean
  ) => void;


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
  setDrivers: (_Drivers: DriverPanelType[]) => void;
}

export interface GroupType {
  Index:number;
  Position?: LatLngTuple;
  Markers: MarkerEntity[];
}
export interface GroupMarkerType {
  GroupMarker: GroupType[];
  setGroupMarker: (_GroupMarker: GroupType[]) => void;
  AddMarkerToGroup: (NewGroupIndex: number, marker: MarkerEntity) => GroupType;

  CurrentGroup?: GroupType;
  setCurrentGroup: (_Group: GroupType, Filter?: Filter) => void;
  showCurrentGroupMarker: (MarkerID: number[]) => void;

  CurrentGroupIndex: number;
  setCurrentGroupIndex: (_CurrentGroupIndex: number) => void;
}
