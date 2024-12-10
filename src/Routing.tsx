import { useCallback, useEffect, useState, useRef } from "react";
import "leaflet-routing-machine-custom";
import { type LassoControl } from "leaflet-lasso";
import { useMap } from "react-leaflet";
import { RoutingType, LassoController } from "./LeafletType";
import { Color } from "./MapData";
import { Marker } from "./MarkerType";
import { useAppContext } from "./context/AppContext";

import { type Layer, type LeafletEvent, type LatLngLiteral } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import MarkerPopup from "./Popup/MarkerPopup";
interface Layer1 extends Layer {
  _latlng?: LatLngLiteral;
}
interface LeafletEvent1 extends LeafletEvent {
  layers?: Layer1[];
}

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
  const {
    allMarkers,
    coordinates,
    currentRouteIndex,
    hideRoute,
    setCoordinates,
  } = useAppContext();
  const lassoRef = useRef<LassoControl>();
  const DrawType = useRef<LassoController>("Disable");
  const CurrentRoute = useRef<number>(0);

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

  const CreateRouteLasso = useCallback(
    (layers: Layer1[]) => {
      if (layers.length) {
        const _tmp = [...coordinates];

        const newLayers: Marker[] = [];
        layers.map((newobject) => {
          let isRemove = false;

          coordinates.map((object) => {
            let _route = [...object.Route];
            _route.map((_object) => {
              if (
                newobject._latlng?.lat === _object.Latitude &&
                newobject._latlng?.lng === _object.Longitude
              )
                isRemove = true;
            });
          });
          if (!isRemove) {
            allMarkers.map((_marker) => {
              if (
                _marker.Latitude === newobject._latlng?.lat &&
                _marker.Longitude === newobject._latlng.lng
              )
                newLayers.push(_marker);
            });
          }
        });
        if (!_tmp[CurrentRoute.current])
          _tmp[CurrentRoute.current] = { Route: [] };

        _tmp[CurrentRoute.current].Route.push(...newLayers);
        setCoordinates(_tmp.filter((val) => val && val.Route.length > 0));
        setRemovedMarker(1);
      }
    },
    [coordinates, setRemovedMarker, setCoordinates, allMarkers]
  );

  const DeleteRouteLasso = useCallback(
    (layers: Layer1[]) => {
      if (layers.length) {
        const _tmp = [...coordinates];

        coordinates.map((object, index) => {
          let _route = [...object.Route];

          const newObj = _route.filter((_object) => {
            let isRemove = false;
            layers.map((newobject) => {
              if (
                newobject._latlng?.lat === _object.Latitude &&
                newobject._latlng?.lng === _object.Longitude
              )
                isRemove = true;
            });
            if (!isRemove) return _object;
          });

          _tmp[index].Route = [...newObj];
        });
        setCoordinates(_tmp.filter((val) => val && val.Route.length > 0));
        setRemovedMarker(1);
      }
    },
    [coordinates, setRemovedMarker, setCoordinates]
  );

  const RouteLasso = useCallback(
    (event: LeafletEvent1) => {
      if (DrawType.current === "Add")
        CreateRouteLasso(event?.layers ? event.layers : []);
      else if (DrawType.current === "Remove")
        DeleteRouteLasso(event?.layers ? event.layers : []);
      setDrawLasso("Disable");
    },
    [DeleteRouteLasso, CreateRouteLasso, setDrawLasso]
  );
  useEffect(() => {
    CurrentRoute.current = currentRouteIndex;
  }, [currentRouteIndex]);
  useEffect(() => {
    if (!map) return;

    if (!lassoRef.current) {
      lassoRef.current = Leaflet.control.lasso().addTo(map);
      map.on("lasso.finished", RouteLasso);
    }

    if (coordinates.length === 0 || hideRoute) {
      ClearAll();
      return;
    }

    if (removedMarker !== undefined) {
      ClearAll();
      setRemovedMarker(undefined);
    }
    const tmp_item = [...routes];

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
              RouteClicked(index);
            });
          });
          return line;
        },
        createMarker: function (i: any, wp: any, nWps: any) {
          let _Marker: Marker = {
            CustomerID: "",
            CustomerName: "",
            CustomerAddress: "",
            Latitude: 1,
            Longitude: 1,
            MarkerID: 1,
            InstallmentEstatment: 1,
          };
          route.Route.map((object) => {
            if (
              wp.latLng.lat === object.Latitude &&
              wp.latLng.lng === object.Longitude
            )
              _Marker = object;
          });
          const popup = Leaflet.popup({closeButton: false})
            .setLatLng(wp.latLng)
            .setContent(renderToStaticMarkup(<MarkerPopup marker={_Marker} />));
          return Leaflet.marker(wp.latLng, {
            keyboard: true,
            icon: Icon({
              type: _Marker?.MarkerID ? _Marker.MarkerID : 1,
              text: i + 1,
              color: _routeColor,
              isSelected: true,
            }),
          })
            .on("dblclick", function (e: any) {
              ondblclickMarker(e.latlng.lat, e.latlng.lng);
            })
            .on("mouseover", function () {
              popup.openOn(map);
            })
            .on("mouseout", function () {
              popup.closePopup();
            });
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

    map.removeEventListener("lasso.finished", RouteLasso);
    map.on("lasso.finished", RouteLasso);
    return () => {
      map.removeEventListener("lasso.finished", RouteLasso);
      ClearAll();
    };
  }, [coordinates, hideRoute]);

  useEffect(() => {
    if (!map) return;

    if (drawLasso === "Disable") {
      if (lassoRef.current) lassoRef.current.disable();
      return;
    }
    DrawType.current = drawLasso;

    if (["Add", "Remove"].includes(drawLasso))
      if (lassoRef.current && !lassoRef.current.enabled())
        lassoRef.current.enable();
  }, [drawLasso]);

  const RouteClicked = useCallback(
    (index: number) => setCurrentRouteIndex(index),
    [setCurrentRouteIndex]
  );
  return null;
}
