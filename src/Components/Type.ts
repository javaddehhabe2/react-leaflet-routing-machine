export interface MarkerEntity {
  index: number;
  IsHide?: boolean;
  CustomerID: string;
  CustomerName: string;
  CustomerAddress: string;
  Latitude: number;
  Longitude: number;
  MarkerID: number;
  InstallmentEstatment?: number;
  Order: OrderEntity[];
  Shops?: ShopsEntity[];
  Distance?: number;
  isVIP: boolean;
}

export interface OrderEntity {
  orderID: number;
  Products?: ProductsEntity[];
}

export interface ProductsEntity {
  index?: number;
  sortNumber?: number;
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
  weight: number;
  color?: string;
  Position?: {
    x: number;
    y: number;
    z: number;
  };
  Size: {
    width: number;
    height: number;
    depth: number;
  };
  Rotation?: {
    WidthToHeight?: boolean;
    WidthToDepth?: boolean;

    HeightToWidth?: boolean;
    HeightToDepth?: boolean;

    DepthToHeight?: boolean;
    DepthToWidth?: boolean;
  };
}
export interface ShopsEntity {
  ShopCode: string;
  ShopAddress: string;
  ShopName: string;
  Latitude: number;
  Longitude: number;
}
