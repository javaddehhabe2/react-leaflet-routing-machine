// export interface Marker {
//   index:number;
//   IsHide?:boolean;
//   CustomerID: string;
//   CustomerName: string;
//   CustomerAddress: string;
//   Latitude: number;
//   Longitude: number;
//   MarkerID: number;
//   InstallmentEstatment?: number;
//   Products?: (ProductsEntity)[] | null;
//   Shops?: (ShopsEntity)[] | null;
//   Distance?:number;
// }
// export interface ProductsEntity {
//   DossierDetailID: string;
//   ProductTitle: string;
//   ProductCode: string;
//   DossierDetailNumber: string;
//   Quantity: number;
//   EstimationOfDelivery: number;
//   DossierDetailTypeID: number;
//   InPickup: number;
//   ServiceTypeID: number;
//   Volume: number;
// }
// export interface ShopsEntity {
//   ShopCode: string;
//   ShopAddress: string;
//   ShopName: string;
//   Latitude: number;
//   Longitude: number;
// }

import { MarkerEntity } from "../Type";

export type LassoController = "Disable" | "Add" | "Remove";

export interface RouteCoordinate {
  Route: MarkerEntity[];
  RouteColor:string;
}
export interface RoutingType {
  setCurrentRouteIndex: React.Dispatch<React.SetStateAction<number>>;
  ondblclickMarker: (lat: number, lng: number) => void;
  removedMarker: number | undefined;
  setRemovedMarker: React.Dispatch<React.SetStateAction<number | undefined>>;
  DrawIcon: (_marker: MarkerEntity, RouteColor: string, indx: number) => JSX.Element;
  drawLasso: LassoController;
  setDrawLasso: React.Dispatch<React.SetStateAction<LassoController>>;
  _routeColor:string;
  waypoints:any;
  _index:number;
}

export interface RouteDetailsType {
  Point?: MarkerEntity[] | null;
}
export interface RouteDetailsLS {
  currentRouteIndex?: number;
}
export interface SettingsType {
  Threshold:number;
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

export interface DriverType {
  DriverID: string;
  DriverName: string;
  DriverCellPhone: string;
  Cars?: (CarsEntity)[] | null;
  NationalCode: string;
  DriverTypeID: number;
  DriverTypeTitle: string;
}
export interface CarsEntity {
  CarID: string;
  PlaqueNumber: string;
  PlaqueNumberFirst: string;
  PlaqueNumberSecond: string;
  PlaqueNumberThird: string;
  PlaqueNumberFourth: string;
  CarTypeID: number;
}
