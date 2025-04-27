import { create } from "zustand";
import { BoxStoreType } from "./Type";

export const useBoxStore = create<BoxStoreType>((set) => {
  return {
    showBoxes: [],
    setShowBoxes: (_showBoxes) => {
      set(() => ({ showBoxes: [..._showBoxes] }));
    },
  };
});
