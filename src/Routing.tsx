import { useCallback, useEffect, useState } from "react";
import "leaflet-routing-machine-custom";
import { useMap } from "react-leaflet";
import { RoutingType } from "./LeafletType";
import { Color } from "./MapData";
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
  UpdateRouteDetail,
  setSelectedRouteDetail,
  ondblclickMarker,
  removedMarker,
  setRemovedMarker,
}: RoutingType) {
  const map = useMap();
  const [routes, setRoutes] = useState<any[]>([]);

  const ClearAll = useCallback(() => {
    if (map) {
      try {
        for (let index = 0; index < routes.length; index++) {
          map.removeControl(routes[index]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [map, routes]);

  useEffect(() => {
    if (!map) return;

    if (Coordinates.length == 0) ClearAll();

    if (removedMarker !== undefined) {
      ClearAll();
      setRemovedMarker(undefined);
    }
    const tmp_item = [...routes];
    Coordinates.map((route, index) => {
      const _tmp = route.Route.map((object) =>
        Leaflet.latLng(object.lat, object.lng)
      );
      const item = Leaflet.Routing.control({
        waypoints: _tmp,
        routeWhileDragging: true,
        fitSelectedRoutes: false,
        showAlternatives: false,
        addWaypoints: false, // add marker when route dblClicked
        draggableWaypoints: false, //to set draggable option to false
        routeLine: function (route: any) {
          var line = Leaflet.Routing.line(route, {
            extendToWaypoints: false,
            routeWhileDragging: false,
            autoRoute: true,
            useZoomParameter: false,
            draggableWaypoints: false,
            addWaypoints: false,
            styles: [
              {
                color: Color[index] ? Color[index] : "blue",
                opacity: 1,
                weight: 10,
              },
            ],
          });
          line.eachLayer(function (l: any) {
            l.on("click", function (e: any) {
              RouteClicked(index);
            });
          });
          return line;
        },
        createMarker: function (i: any, wp: any, nWps: any) {
          return Leaflet.marker(wp.latLng, {
            keyboard: true,
          })
            .on("click", function (e: any) {
              console.log("there be dragons start!!", e);
            })
            .on("dblclick", function (e: any) {
              ondblclickMarker(e.latlng.lat, e.latlng.lng);
            });
        },
      })
        .on("routeselected", function (e: any) {
          UpdateRouteDetail(
            index,
            e.route.summary.totalDistance,
            e.route.summary.totalTime
          );
        })
        .addTo(map);

      tmp_item.push(item);
      setRoutes(tmp_item);
    });

    return () => ClearAll();
  }, [Coordinates]);

  const RouteClicked = useCallback(
    (index: number) => setSelectedRouteDetail(index),
    [setSelectedRouteDetail]
  );
  return null;
}
