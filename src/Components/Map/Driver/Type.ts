 export interface DriverType{
    DriverName:string;
    NationalCode:string;
    DriverTypeTitle:string;
    Cars?: (CarsEntity)[] | null;
 }

 export interface DriverPanelType {
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
 