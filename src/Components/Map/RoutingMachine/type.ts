import { ContextMenuStateType } from "@Map/ContextMenu";
import { Dispatch, SetStateAction } from "react";

export interface RoutingMachineType {
  _routeColor:string;
  waypoints:number[][];
  _index:number;
  setContextMenu: Dispatch<SetStateAction<ContextMenuStateType>>;
}