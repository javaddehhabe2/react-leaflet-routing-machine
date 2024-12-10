import { LassoController } from "../../LeafletType";
export interface BottomCenterType {
  drawLasso: LassoController;
  DrawLasso: (drawLasso: LassoController) => void;
}


export type filterCustomer = "Disable" | "Heavy" | "Light";
