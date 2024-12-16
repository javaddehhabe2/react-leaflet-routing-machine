import { CarType, CatalogType, RouteCoordinate } from "../LeafletType";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Marker } from "../MarkerType";
import { type LatLngLiteral } from "leaflet";
import { DriverType } from "../DriverType";
const initialValue = {
  allMarkers: [],
  coordinates: [],
  currentRouteIndex: 0,
  hideRoute: false,
  flying: undefined,
  timeDistance: 0,
  fixedWorkingHours: 0,
  vanVolume: 0,
  isuzuVolume: 0,
  isHeavy: false,
  saveToLocal: false,
  shops: [],
  showDriver: false,
  allDrivers: [],
  carTypes: [],
  catalogValues: [],
  setCatalogValues: () => {},
  setCarTypes: () => {},
  setAllDrivers: () => {},
  setShowDriver: () => {},
  setTimeDistance: () => {},
  setFixedWorkingHours: () => {},
  setVanVolume: () => {},
  setIsuzuVolume: () => {},
  setIsHeavy: () => {},
  setSaveToLocal: () => {},
  setFlying: () => {},
  setHideRoute: () => {},
  setCoordinates: () => {},
  NewRoute: () => {},
  setAllMarkers: () => {},
};

export interface AppContextType {
  allMarkers: Marker[];
  coordinates: RouteCoordinate[];
  currentRouteIndex: number;
  hideRoute: boolean;
  flying: LatLngLiteral | undefined;
  timeDistance: number;
  fixedWorkingHours: number;
  vanVolume: number;
  isuzuVolume: number;
  isHeavy: boolean;
  saveToLocal: boolean;
  shops: Marker[];
  showDriver: boolean;
  allDrivers: DriverType[];
  carTypes: CarType[];
  catalogValues: CatalogType[];
  setCatalogValues: Dispatch<SetStateAction<CatalogType[]>>;
  setCarTypes: Dispatch<SetStateAction<CarType[]>>;
  setAllDrivers: Dispatch<SetStateAction<DriverType[]>>;
  setShowDriver: Dispatch<SetStateAction<boolean>>;
  setTimeDistance: Dispatch<SetStateAction<number>>;
  setFixedWorkingHours: Dispatch<SetStateAction<number>>;
  setVanVolume: Dispatch<SetStateAction<number>>;
  setIsuzuVolume: Dispatch<SetStateAction<number>>;
  setIsHeavy: Dispatch<SetStateAction<boolean>>;
  setSaveToLocal: Dispatch<SetStateAction<boolean>>;

  setFlying: Dispatch<SetStateAction<LatLngLiteral | undefined>>;
  setHideRoute: Dispatch<SetStateAction<boolean>>;
  setCoordinates: Dispatch<SetStateAction<RouteCoordinate[]>>;
  NewRoute: () => void;
  setAllMarkers: Dispatch<SetStateAction<Marker[]>>;
}
export const AppContext = createContext<AppContextType>(initialValue);

export const AppContextProvider: React.FunctionComponent<{
  children: ReactNode;
  initialValue: AppContextType;
}> = ({ children, initialValue }) => {
  return (
    <AppContext.Provider value={initialValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
