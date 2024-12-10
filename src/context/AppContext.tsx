import { RouteCoordinate,RouteDetailType } from "../LeafletType";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Marker } from "../MarkerType";
import {
  type LatLngLiteral,
} from "leaflet";
const initialValue = {
  allMarkers: [],
  coordinates: [],
  currentRouteIndex: 0,
  hideRoute: false,
  routeDetail:[],
  flying:undefined,
  setFlying:()=>{},
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
  routeDetail:RouteDetailType[];
  flying:LatLngLiteral|undefined;
  setFlying:Dispatch<SetStateAction<LatLngLiteral|undefined>>;
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
