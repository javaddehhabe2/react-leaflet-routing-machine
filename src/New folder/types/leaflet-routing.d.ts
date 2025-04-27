import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    interface LineOptions extends L.PolylineOptions {
      extendToWaypoints?: boolean;
      missingRouteTolerance?: number;
      waypointIndices?: number[];
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      useZoomParameter?: boolean;
      routeWhileDragging?: boolean;
      autoRoute?: boolean;
      styles?: L.PathOptions[];
    }

    class Control extends L.Control {
      constructor(options?: any);
      addTo(map: L.Map): this;
      getPlan(): any;
      setWaypoints(waypoints: L.LatLng[]): void;
    }

    class Itinerary extends L.Class {}
    class Line extends L.Polyline {
      constructor(route: any, options?: LineOptions);
    }

    function control(options?: any): Control;

    function osrmv1(options?: OSRMOptions): OSRMv1;

    interface OSRMOptions {
      serviceUrl?: string;
      profile?: string;
      timeout?: number;
      useHints?: boolean;
      suppressDemoServerWarning?: boolean;
      requestParameters?: Record<string, string>;
    }

    interface OSRMv1 {
      route(
        waypoints: L.LatLng[],
        callback: Function,
        context?: any,
        options?: any
      ): void;
    }
  }
}
