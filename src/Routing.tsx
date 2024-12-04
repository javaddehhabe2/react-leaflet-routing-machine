import { useCallback, useEffect, useState, useRef } from "react";
import "leaflet-routing-machine-custom";
import {
  type LassoControl,
  type LassoHandlerFinishedEvent,
} from "leaflet-lasso";
import { useMap } from "react-leaflet";
import { RoutingType } from "./LeafletType";
import { Color } from "./MapData";
import { useAppContext } from "./context/AppContext";

import { type LeafletEvent } from "leaflet";

// import * as Leaflet  from 'leaflet';
require("leaflet-lasso");
const Leaflet = require("leaflet");

export default function Routing({
  UpdateRouteDetail,
  setCurrentRouteIndex,
  ondblclickMarker,
  removedMarker,
  setRemovedMarker,
  Icon,
  drawLasso,
  setDrawLasso,
}: RoutingType) {
  const map = useMap();

  const [routes, setRoutes] = useState<any[]>([]);
  const { coordinates } = useAppContext();
  const lassoRef = useRef<LassoControl>();

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

  const CreateRouteLasso = useCallback(() => {}, [coordinates]);

  const DeleteRouteLasso = useCallback(() => {}, [coordinates]);

  useEffect(() => {
    if (!map) return;

    if (coordinates.length === 0) ClearAll();

    if (removedMarker !== undefined) {
      ClearAll();
      setRemovedMarker(undefined);
    }
    const tmp_item = [...routes];
    //  const  gg= Leaflet.control.lasso().addTo(map);

    // L.control.lasso().addTo(map);
    // ref.current=Leaflet.lassoSelect().addTo(map);

    coordinates.map((route, index) => {
      const _routeColor = Color[index] ? Color[index] : "blue";
      const _tmp = route.Route.map((object) =>
        Leaflet.latLng(object.Latitude, object.Longitude)
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
                color: _routeColor,
                opacity: 1,
                weight: 4,
              },
            ],
          });
          line.eachLayer(function (l: any) {
            l.on("click", function (e: any) {
              console.log("line clicked");
              RouteClicked(index);
            });
          });
          return line;
        },
        createMarker: function (i: any, wp: any, nWps: any) {
          let _type = 1;
          route.Route.map((object) => {
            if (
              wp.latLng.lat === object.Latitude &&
              wp.latLng.lng === object.Longitude
            )
              _type = object.MarkerID;
          });
          return (
            Leaflet.marker(wp.latLng, {
              keyboard: true,
              icon: Icon({
                type: _type,
                text: i + 1,
                color: _routeColor,
                isSelected: true,
              }),
            })
              .bindPopup("<p>You are here </p>")
              // .on("click", function (e: any) {
              //   console.log("there be dragons start!!", e);
              // })
              .on("dblclick", function (e: any) {
                ondblclickMarker(e.latlng.lat, e.latlng.lng);
              })
          );
        },
      })
        .on("routeselected", function (e: any) {
          console.log(e);
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
  }, [coordinates]);

  useEffect(() => {
    if (!map) return;

    
    const RouteLasso = (event: LeafletEvent) => {
      console.log(event, drawLasso);
    };

    const ToggleLasso = () => {
      if (lassoRef.current) {
        if (!lassoRef.current.enabled()) lassoRef.current.enable();
      }
    };

    if (!lassoRef.current) {
      lassoRef.current = Leaflet.control.lasso().addTo(map);
      map.on("lasso.finished", (event: LeafletEvent) => {
        RouteLasso(event);

        setDrawLasso("Disable");
      });
    }
    console.log(drawLasso);
    if (drawLasso === "Disable") {
      if (lassoRef.current) lassoRef.current.disable();
      return;
    }


    if (["Add", "Remove"].includes(drawLasso)) ToggleLasso();
  }, [drawLasso]);

  const RouteClicked = useCallback(
    (index: number) => setCurrentRouteIndex(index),
    [setCurrentRouteIndex]
  );
  return null;
}
