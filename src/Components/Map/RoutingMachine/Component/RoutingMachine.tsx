import { useCallback, useEffect, useState, useRef, memo } from "react";
import "leaflet-routing-machine-custom";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import { RoutingMachineType } from "../type";
import L from "leaflet";
import { useRouteStore } from "@Store/RouteStore";

function RoutingMachine({
  _index,
  _routeColor,
  waypoints, setContextMenu
}: RoutingMachineType) {
  const map = useMap();
  const routingRef = useRef<any>(null);
  const { setSelectedRoute, setShowDriver, Coordinates } = useRouteStore();

  useEffect(() => {
    if (!map) return;

    const currentWaypoints = routingRef.current?.getWaypoints?.();
    const hasChanged =
    JSON.stringify(
      (currentWaypoints || [])
        .filter((w: any) => w && w.latLng)   // 🛡️ PROTECTION
        .map((w: any) => [w.latLng.lat, w.latLng.lng])
    ) !== JSON.stringify(waypoints);
    if (!routingRef.current) {
      routingRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        addWaypoints: false, // add marker when route dblClicked
        draggableWaypoints: false, //to set draggable option to false
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
          timeout: 30 * 1000,
          // routingOptions: {
          //   //alternatives: true,
          //   steps: true,
          // },
        }),
        routeLine: function (route: any) {
          const line = new L.Routing.Line(route, {
            extendToWaypoints: false,
            routeWhileDragging: false,
            autoRoute: true,
            useZoomParameter: false,
            draggableWaypoints: false,
            addWaypoints: false,

            styles: [
              { color: _routeColor, opacity: 0.2, weight: 14 },
              { color: _routeColor, opacity: 0.8, weight: 6 },
              { color: "white", opacity: 1, weight: 1, dashArray: "5, 5" },
            ],
          });

          line.once("add", function () {
            Object.values((line as any)._layers).forEach((layer: any) => {
              layer.on("click", (e: any) => {
                console.log(e);
                RouteClicked(_index);
              });
              layer.on("contextmenu", (e: any) => {
                const { clientX, clientY } = e.originalEvent;
                console.log(e);
                setContextMenu({
                  x: clientX,
                  y: clientY,
                  visible: true,
                  Index: _index,
                });
              });
            });
          });

        //   line.on("click", function (e: any) {
        //     console.log(e);
        //     RouteClicked(_index);
        //   });
        //   line.on("contextmenu", function (e: any) {
        //     // e.originalEvent contains the DOM mouse event
        //     const { clientX, clientY } = e.originalEvent;
        // console.log(e);
        //     setContextMenu({
        //       x: clientX,
        //       y: clientY,
        //       visible: true,
        //       Index: _index, // optional if you want to pass this info
        //     });
        //   });
          return line;
        },
        createMarker: () => null,
      }).on("routingerror", function(e:any) {
        console.error("Routing error:", e.error);
      }).addTo(map);
    } else if (hasChanged && routingRef.current && routingRef.current.setWaypoints){
      // Only update waypoints, don't recreate control
      routingRef.current.setWaypoints(
        waypoints.map(([lat, lng]) => L.latLng(lat, lng))
      );
    }
return ()=>{
  if (routingRef.current) {
    try {
      map.removeControl(routingRef.current);
      routingRef.current.remove(); // this may internally call `_clearLines`
    } catch (error) {
      console.error("Failed to remove routing control:", error);
    } finally {
      routingRef.current = null;
    }
  }

}
  }, [waypoints, _routeColor]);
  const RouteClicked = useCallback(
    (index: number) => {
      // setFlying(undefined);
      // setCurrentRouteIndex(index);
      setSelectedRoute(Coordinates[index]);

      setShowDriver(true);
    },
    [setSelectedRoute, setShowDriver, Coordinates]
  );
  return null;
}

export default memo(RoutingMachine);
