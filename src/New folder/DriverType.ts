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
