export interface ContainerDataType {
  crossSection: number; // percent
  ContainerType: ContainerType[];
  customer: CustomerType[];
}

export interface ContainerType {
  containerID: number;
  name: string;
  width: number;
  height: number;
  depth: number;
  gap?: {
    Top: number;
    Bottom: number;
    Left: number;
    Right: number;
    Back: number;
    Front: number;
  };
}

export interface BoxType {
  index?: number;
  sortNumber?: number;
  title?: string;
  weight: number;
  color?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
    depth: number;
  };
  rotation?: {
    widthToHeight?: boolean;
    widthToDepth?: boolean;

    HeightToWidth?: boolean;
    HeightToDepth?: boolean;

    DepthToHeight?: boolean;
    DepthToWidth?: boolean;
  };
  customerId?: string;
  orderId?: number;
}
interface CustomerType {
  customerID: string;
  name: string;
  address: string;
  isVIP: boolean;
  order: OrderType[];
}
interface OrderType {
  orderID: number;
  box: ServerBoxType[];
}

interface ServerBoxType extends BoxType {
  count: number;
}

export interface treeDataType {
  title: string;
  value: string;
  key: string;
  checked:boolean;
  children?: treeDataType[];
}
