import { create } from "zustand";
import { RouteStoreType } from "./Type";
import { Storage } from "@LocalStorage/Storage";

export const useRouteStore = create<RouteStoreType>((set,get) => {
  return {
    HideRoute: false,
    setHideRoute: (_HideRoute) => set(() => ({ HideRoute: _HideRoute })),

      Routes:[],
      setRoutes: (
        Index,
        _Coordinates,
        SaveToLocal
      ) => {
        let Routes=get().Routes;
       const SelectedRoutes= Routes.find((_route)=>_route.Index===Index);
       if(SelectedRoutes) Routes=Routes.map((_route)=>_route.Index===Index?{..._route,Coordinates: [..._Coordinates]}:_route)
        else Routes.push({ Index,
          Coordinates: _Coordinates})
        set(() => ({ Routes: [...Routes] }));
      },

    Coordinates: [],
    setCoordinates: (_Coordinates, SaveToLocal) => {
      set(() => ({ Coordinates: [..._Coordinates] }));
      if (SaveToLocal)
        Storage.setLocal("LS_Route", JSON.stringify(_Coordinates));
    },

    SelectedRoute:null,
    setSelectedRoute:(_SelectedRoute)=>set(() => ({ SelectedRoute: _SelectedRoute })),
    
    ShowDriver:false,
    setShowDriver:(_ShowDriver)=>set(() => ({ ShowDriver: _ShowDriver })),
  };
});
