import { RouteCoordinate } from "../LeafletType";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Marker } from "../MarkerType";

const initialValue = {
  allMarkers: [],
  coordinates: [],
  currentRouteIndex: 0,
  hideRoute: false,
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
