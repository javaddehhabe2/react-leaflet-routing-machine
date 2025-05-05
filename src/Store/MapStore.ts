import { create } from "zustand";
import { MapStoreType } from "./Type";

export const useMapStore = create<MapStoreType>((set) => {
  return {
    Markers: [],
    setMarkers: (_Markers) => set(() => ({ Markers: [..._Markers] })),

    ShopsMarker: [],
    setShopsMarker: (_ShopsMarker) =>
      set(() => ({ ShopsMarker: [..._ShopsMarker] })),

    Flying: null,
    setFlying: (_LatLng) => set(() => ({ Flying: _LatLng })),

    Filter: "Disable",
    setFilter: (_Filter) => set(() => ({ Filter: _Filter })),
  };
});
