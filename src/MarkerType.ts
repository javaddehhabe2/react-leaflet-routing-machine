export interface Marker {
  CustomerID: string;
  CustomerName: string;
  CustomerAddress: string;
  Latitude: number;
  Longitude: number;
  MarkerID: number;
  InstallmentEstatment?: number;
  Products?: (ProductsEntity)[] | null;
  Shops?: (ShopsEntity)[] | null;
  Distance?:number;
}
export interface ProductsEntity {
  DossierDetailID: string;
  ProductTitle: string;
  ProductCode: string;
  DossierDetailNumber: string;
  Quantity: number;
  EstimationOfDelivery: number;
  DossierDetailTypeID: number;
  InPickup: number;
  ServiceTypeID: number;
  Volume: number;
}
export interface ShopsEntity {
  ShopCode: string;
  ShopAddress: string;
  ShopName: string;
  Latitude: number;
  Longitude: number;
}
