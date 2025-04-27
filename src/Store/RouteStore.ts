import { create } from "zustand";
import { RouteStoreType } from "./Type";
import { Storage } from "@LocalStorage/Storage";

export const useRouteStore = create<RouteStoreType>((set) => {
  return {
    HideRoute: false,
    setHideRoute: (_HideRoute) => set(() => ({ HideRoute: _HideRoute })),

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
