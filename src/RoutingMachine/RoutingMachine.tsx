import { useCallback, useEffect, useState, useRef, memo } from "react";
import "leaflet-routing-machine-custom";
// import { type LassoControl } from "leaflet-lasso";
import { useMap } from "react-leaflet";
// import { RouteColor,Color, DefaultColor } from "../MapData";

// import { Marker } from "../MarkerType";
import { useAppContext } from "../context/AppContext";
import { RoutingMachineType } from "./type";
import L from 'leaflet';

const Leaflet = require("leaflet");


function RoutingMachine({
  setCurrentRouteIndex,
  _index,
  _routeColor,
  waypoints
}: RoutingMachineType) {
  const map = useMap();
  const routingRef = useRef<any>(null);
  // const [routes, setRoutes] = useState<any[]>([]);
  const {
    hideRoute,
    flying,
    setFlying,
    setShowDriver,
    setCoordinates
  } = useAppContext();

  useEffect(() => {
    console.log(waypoints,_routeColor);
    if (!map) return;
    // setCoordinates([])
    // const tmp_item = [...routes];
    if (!routingRef.current) {
      routingRef.current = Leaflet.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        addWaypoints: false, // add marker when route dblClicked
        draggableWaypoints: false, //to set draggable option to false
        router: Leaflet.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
          timeout: 30 * 1000,
          routingOptions: {
            //alternatives: true,
            steps: true,
          },
        }),
        routeLine: function (route: any) {
          var line = Leaflet.Routing.line(route, {
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
          line.eachLayer(function (l: any) {
            l.on("click", function (e: any) {
              RouteClicked(_index);
            });
          });
          return line;
        },
        createMarker: () => null,
      }).addTo(map);
    }else{
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

   
 console.log({waypoints,map,_routeColor})
  }, [ waypoints,map,_routeColor]);


  const RouteClicked = useCallback(
    (index: number) => {
      setFlying(undefined);
      setCurrentRouteIndex(index);
      setShowDriver(true);
    },
    [setCurrentRouteIndex, setFlying, setShowDriver]
  );
  return null;
}

export default memo(RoutingMachine)