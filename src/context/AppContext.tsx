
import { RouteCoordinate } from "../LeafletType";
import React, { createContext,ReactNode,useContext } from "react";

const initialValue = { coordinates:[], setCoordinates:() => {},NewRoute:()=>{} };

export interface AppContextType {
    coordinates:RouteCoordinate[]; 
    setCoordinates:React.Dispatch<React.SetStateAction<RouteCoordinate[]>> ;
    NewRoute:() => void;
}
export const AppContext = createContext<AppContextType>(initialValue);

export const AppContextProvider: React.FunctionComponent<{ children: ReactNode; initialValue: AppContextType }> = ({ children, initialValue }) => {
    return <AppContext.Provider value={initialValue}>{children}</AppContext.Provider>;
};


export const useAppContext = () => useContext(AppContext);
