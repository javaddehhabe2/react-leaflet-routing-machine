import { ContainerBoxesType } from "@/Store/Type";
import * as THREE from "three";
export interface SmallBoxType {
  title: string;
  position: BoxPositionType;
  color: string;
  size: BoxSizeType;
  customerId: number;
  index: number;
}
export interface MainBoxType {
  containerBox: ContainerBoxesType;
  position: [x: number, y: number, z: number];
}
export interface BoxContainerType {
  color: string;
  size: BoxSizeType;
}

export type BoxPositionType =
  | THREE.Vector3
  | [x: number, y: number, z: number]
  | Readonly<number | THREE.Vector3 | [x: number, y: number, z: number]>;
export type BoxSizeType = [number, number, number];

export interface ContainerPropType {
  typeOfShow: "all" | "one";
  containerNumber: number;
}
