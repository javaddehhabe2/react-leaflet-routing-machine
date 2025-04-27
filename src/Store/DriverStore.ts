import { create } from "zustand";
import { DriversStoreType } from "./Type";


export const useDriversStore = create<DriversStoreType>((set) => {
  return {
    Drivers: [],
    setDrivers: (_Drivers) => set(() => ({ Drivers: [..._Drivers] })),
  };
});
