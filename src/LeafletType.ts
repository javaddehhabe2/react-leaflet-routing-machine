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
  Icon: ({ on, text, color }: IconType) => DivIcon;
}

export interface IconType {
  on?: boolean;
  text?: string;
  color?: string;
}


export interface Markers {
  CustomerCode: string;
  Latitude: number;
  Longitude: number;
  CustomerAddressInfoID?: null;
  CustomerProvinceID?: null;
  CustomerID: string;
  CustomerCityTitle: string;
  CustomerFullName: string;
  CustomerTypeID: number;
  IsHeavy: boolean;
  DossierDetailTypeID: number;
  ShopCode?: string | null;
  Goods?: GoodsEntity[] | null;
  FreightValue: number;
  DossierDetailID: string;
  CarTypeID?: null;
  CustomerAddress: string;
  StatusCode: string;
  StatusTitle: string;
  Shop?: Shop | null;
  SumEstimationOfDelivery: number;
  SumVolume: number;
  IsPickup: boolean;
  ContactNumber?: string | null;
  PostalCode?: null;
  CustomerProvinceTitle: string;
  EmployerAddress: string;
  EmployerFullName: string;
  DeliveryTimeID: number;
  DeliveryTimeTitle: string;
  DossierTypeID: number;
}
export interface GoodsEntity {
  GoodsTitle: string;
  GoodsSystemCode: string;
  Quantity: number;
  ServiceTypeID: number;
  ServiceType: string;
  IsHeavy: boolean;
  GoodCode?: null;
  CustomerFullName?: null;
  CustomerID?: null;
  CustomerAddress?: null;
  CustomerCellPhone?: null;
  Customer?: null;
  ShippingDetailID: string;
  IsPickup: boolean;
  EstimationOfDelivery: number;
  Volume: number;
  CustomerAddressInfoID: string;
  EmployerAddressInfoID: string;
  DossierDetailTypeID: number;
  DossierDetailTypeTitle: string;
  FreightValue: number;
  SaleAreaID: number;
  SaleAreaTitle: string;
}
export interface Shop {
  ShopName?: null;
  ShopCode: string;
  ShopAddress: string;
  ShopContactNumber?: null;
  ShopFullName: string;
  ShopID: string;
  Latitude: number;
  Longitude: number;
}


export interface RouteDetailsType{
  Point?: GoodsEntity[] | null;
}