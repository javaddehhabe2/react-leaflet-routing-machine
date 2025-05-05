import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    class Control extends L.Control {
      constructor(options?: any);
      getPlan(): any;
      setWaypoints(waypoints: L.LatLng[]): void;
      getWaypoints(): { latLng: L.LatLng }[];
    }

    function control(options?: any): Control;

    class OSRMv1 {
      constructor(options?: any);
    }

    function osrmv1(options?: any): OSRMv1;

    class Line extends L.FeatureGroup {
      constructor(route: any, options?: any);
    }
  }
}
