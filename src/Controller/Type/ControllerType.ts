import { LassoController } from "../../LeafletType";

export interface BottomCenterType {
  drawLasso: LassoController;
  DrawLasso: ( drawLasso: LassoController) => void;
}

export interface BottomLeftType {routeCount:string;htmlOrder:string;distanceInKilometers:string;timeInsight:string;}

export type filterCustomer= 'Disable'|'Heavy'|'Light';