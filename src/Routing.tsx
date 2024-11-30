import { useEffect, useRef, useState } from "react";
import "leaflet-routing-machine-custom";
import { useMap } from "react-leaflet";
import { RouteCoordinate } from "./LeafletType";
const Leaflet = require("leaflet");

Leaflet.Marker.prototype.options.icon = Leaflet.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  shadowSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Routing({
  Coordinates,
  setDistance,
  setTime,
}: {
  Coordinates: RouteCoordinate[];
  setDistance: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const map = useMap();
  const [routes, setRoutes] = useState<any[]>([]);
  const Color = [
    "blue",
    "aqua",
    "fuchsia",
    "green",
    "lime",
    "maroon",
    "navy",
    "olive",
    "orange",
    "purple",
    "red",
    "silver",
    "teal",
    "yellow",
  ];
  useEffect(() => {
    if (!map) return;
    if (Coordinates.length == 0) {
      if (map) {
        try {
          for (let index = 0; index < routes.length; index++) {
            // console.log(routes, index, routes[index]);
            map.removeControl(routes[index]);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    const tmp_item = routes;
    Coordinates.map((route, index) => {
      const _tmp = route.Route.map(object =>  Leaflet.latLng(object.lat, object.lng));
      const item = Leaflet.Routing.control({
        waypoints: _tmp,
        lineOptions: {
          styles: [
            {
              color: Color[index] ? Color[index] : "blue",
              opacity: 1,
              weight: 10,
            },
          ],
        },
        routeWhileDragging: true,
        fitSelectedRoutes: false,
        showAlternatives: false,
        addWaypoints: false, // add marker when route dblClicked
        draggableWaypoints : false,//to set draggable option to false
      })
 .on("click", function (e: any) {
          // var route = e.route;
        
          console.log('click');
        })
        // .on("routesfound", (e: any) => {
        //   // let distance = e.routes[0].summary.totalDistance;
        //   setDistance(e.routes[0].summary.totalDistance);
        //   setTime(e.routes[0].summary.totalTime);
        //   // console.log(distance);
        // })
        .on("routeselected", function (e: any) {
          // var route = e.route;
          setDistance(e.route.summary.totalDistance);
          setTime(e.route.summary.totalTime);
          console.log("routeselected");
        })
        .addTo(map);

      tmp_item.push(item);
      setRoutes(tmp_item);
    });

    // return () => {
    //   if (map) map.removeControl(routingControl);
    // };

  }, [Coordinates]);

  return null;
}
