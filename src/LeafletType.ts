import { Marker } from "./MarkerType";

export type LassoController = "Disable" | "Add" | "Remove";
export interface RouteCoordinate {
  Route: Marker[];
  RouteColor:string;
}
export interface RoutingType {
  setCurrentRouteIndex: React.Dispatch<React.SetStateAction<number>>;
  ondblclickMarker: (lat: number, lng: number) => void;
  removedMarker: number | undefined;
  setRemovedMarker: React.Dispatch<React.SetStateAction<number | undefined>>;
  DrawIcon: (_marker: Marker, RouteColor: string, indx: number) => JSX.Element;
  drawLasso: LassoController;
  setDrawLasso: React.Dispatch<React.SetStateAction<LassoController>>;
}

export interface RouteDetailsType {
  Point?: Marker[] | null;
}
export interface RouteDetailsLS {
  currentRouteIndex?: number;
}
export interface SettingsType {
  TimeDistance: number;
  FixedWorkingHours: number;
  IsHeavy?: boolean;
  SaveToLocal: boolean;
  carTypes: CarType[];
}
export interface  CarType{ CarTypeID: number; Value: number };

export interface CatalogType {
  CatalogValueID: string;
  ParentID: string;
  CatalogValueCode: string;
  TextField: string;
  ValueField: number;
  AditionalInfo?: null;
  CatalogOrder: number;
  TextField_01: string;
  TextField_02: string;
  ParentTitle?: null;
  DisableCatalogValueCode: boolean;
  Title?: null;
  IsDirty: boolean;
  EntityID?: null;
  EntityState: number;
  IsActive: boolean;
  Owner: string;
  BusinessUnitID: string;
  CreatedOn: string;
  Version: string;
  EntityStringKey: string;
}
