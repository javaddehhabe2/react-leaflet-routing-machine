import { useCallback, useEffect, useState, useRef, memo } from "react";
import "leaflet-routing-machine-custom";
import "leaflet-routing-machine";
// import { type LassoControl } from "leaflet-lasso";
import { useMap } from "react-leaflet";
// import { RouteColor,Color, DefaultColor } from "../MapData";

// import { Marker } from "../MarkerType";
import { useAppContext } from "../context/AppContext";
import { RoutingMachineType } from "./type";
import L from "leaflet";
import { useRouteStore } from "@Store/RouteStore";
// const Leaflet = require("leaflet");

function RoutingMachine({
  _index,
  _routeColor,
  waypoints,
}: RoutingMachineType) {
  const map = useMap();
  const routingRef = useRef<any>(null);
  const { setSelectedRoute, setShowDriver, Coordinates } = useRouteStore();

  useEffect(() => {
    if (!map) return;

    const currentWaypoints = routingRef.current?.getWaypoints?.();
    const hasChanged =
      JSON.stringify(
        currentWaypoints?.map((w: any) => [w.latLng.lat, w.latLng.lng])
      ) !== JSON.stringify(waypoints);

    // setCoordinates([])
    // const tmp_item = [...routes];
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
          line.on("click", function (e: any) {
            RouteClicked(_index);
          });


          return line;
        },
        createMarker: () => null,
      }).addTo(map);
    } else if (hasChanged) {
      // Only update waypoints, don't recreate control
      routingRef.current.setWaypoints(
        waypoints.map(([lat, lng]) => L.latLng(lat, lng))
      );
    }
    // return () =>{
    //   if(map) map.removeControl(routingControl);
    // }
    // tmp_item.push(item);
    // setRoutes(tmp_item);
    // });

    console.log({ waypoints, map, _routeColor });
  }, [waypoints]);

  const RouteClicked = useCallback(
    (index: number) => {
      // setFlying(undefined);
      // setCurrentRouteIndex(index);
      setSelectedRoute(Coordinates[index]);

      setShowDriver(true);
    },
    [ setShowDriver]
  );
  return null;
}

export default memo(RoutingMachine);
