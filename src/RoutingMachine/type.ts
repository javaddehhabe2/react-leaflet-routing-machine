export interface RoutingMachineType {
  setCurrentRouteIndex: React.Dispatch<React.SetStateAction<number>>;
  _routeColor:string;
  waypoints:number[][];
  _index:number;
}