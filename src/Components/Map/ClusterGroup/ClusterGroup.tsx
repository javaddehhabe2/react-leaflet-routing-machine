import { useCallback, useEffect, useState, useRef, memo } from "react";
import "leaflet-routing-machine-custom";
import "leaflet-routing-machine";
import { Marker, Popup, useMap } from "react-leaflet";

import L, { DivIcon, LeafletMouseEvent } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkerPopup, MarkerShopPopup } from "@Map/Popup";

import { useMapStore } from "@Store/MapStore";
import { MarkerIcon, MarkerIconType } from "@Map/MarkerIcon";
import { useRouteStore } from "@Store/RouteStore";
import { DefaultColor, RouteColor } from "@/Data/Map";
import { createRoot } from "react-dom/client";
import { Marker as MarkerType } from "@Map/Type";

function createReactDivIcon(_marker: MarkerType) {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <MarkerIcon
      MarkerID={_marker.MarkerID}
      text={_marker.CustomerName}
      index={0}
      Latitude={_marker.Latitude}
      Longitude={_marker.Longitude}
    />
  );

  return new DivIcon({
    html: div, // << here's the real DOM, not static markup
    iconSize: [40, 40],
    className: "",
  });
}

function ClusterGroup() {
  const { Markers, ShopsMarker } = useMapStore();

  const { Coordinates, setCoordinates, SelectedRoute, setSelectedRoute } =
    useRouteStore();

  const [clusterLayer, setClusterLayer] = useState<any>(null);

  const ondblclickMarker = useCallback(
    (lat: number, lng: number) => {
      const _tmp = [...Coordinates];
      const result = _tmp.map((object, index) => {
        let _route = object.Route.filter(
          (el) => el.Latitude !== lat && el.Longitude !== lng
        );
        if (_route.length < object.Route.length) {
          const lk = _route.map((_r, indx) => {
            let Distance = 0;
            if (indx > 0) {
              let fromLatLng = L.latLng({
                lat: _r.Latitude,
                lng: _r.Longitude,
              });
              let toLatLng = L.latLng({
                lat: _route[indx - 1].Latitude,
                lng: _route[indx - 1].Longitude,
              });

              Distance = fromLatLng.distanceTo(toLatLng);
            }
            return { ..._r, Distance };
          });

          object.Route = [...lk];
        } else object.Route = [..._route];
        return object;
      });

      setCoordinates(result);
    },
    [Coordinates, setCoordinates]
  );

  const onClickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      let NewCoordinate = SelectedRoute
        ? SelectedRoute
        : {
            Route: [],
            RouteColor: RouteColor[
              Coordinates.length ? Coordinates.length - 1 : 0
            ]
              ? RouteColor[Coordinates?.length ?? 0]
              : DefaultColor,
          };

      const lat = e.latlng.lat,
        lng = e.latlng.lng;

      const ExistInCoordination = Coordinates.find((el) => {
        const _Route = el.Route.find(
          (_route) => _route.Latitude === lat && _route.Longitude === lng
        );
        return _Route ? true : false;
      });

      if (!ExistInCoordination) {
        let _Marker = Markers.find(
          (el) => el.Latitude === lat && el.Longitude === lng
        );

        if (_Marker) {
          /// find index of current Route
          const _CurrentRouteIndex = SelectedRoute
            ? Coordinates.findIndex((el) => {
                let find = false;
                el.Route.every((_route) => {
                  find = !!SelectedRoute.Route.find(
                    (_selectedRoute) =>
                      _route.Latitude === _selectedRoute.Latitude &&
                      _route.Longitude === _selectedRoute.Longitude
                  );
                  return find;
                });

                return find;
              })
            : 0;

          if (_Marker?.Shops) {
            _Marker?.Shops.forEach((_mrk) => {
              const HasShopInRoute = NewCoordinate
                ? !!NewCoordinate.Route.find(
                    (el) =>
                      el.Latitude === _mrk.Latitude &&
                      el.Longitude === _mrk.Longitude
                  )
                : false;

              if (!HasShopInRoute) {
                const _ShopsMarker = ShopsMarker.find(
                  (_shop) =>
                    _shop.Latitude === _mrk.Latitude &&
                    _shop.Longitude === _mrk.Longitude
                );
                if (_ShopsMarker) {
                  let Distance = 0;
                  if (NewCoordinate.Route.length > 0) {
                    let fromLatLng = L.latLng({
                      lat: _ShopsMarker.Latitude,
                      lng: _ShopsMarker.Longitude,
                    });
                    let toLatLng = L.latLng({
                      lat: NewCoordinate.Route[NewCoordinate.Route.length - 1]
                        .Latitude,
                      lng: NewCoordinate.Route[NewCoordinate.Route.length - 1]
                        .Longitude,
                    });
                    Distance = fromLatLng.distanceTo(toLatLng);
                  }

                  NewCoordinate = {
                    ...NewCoordinate,
                    Route: [
                      ...NewCoordinate.Route,
                      {
                        ..._ShopsMarker,
                        Distance,
                      },
                    ],
                  };
                }
              }
            });
          }
          let Distance = 0;
          if (NewCoordinate.Route.length > 0) {
            let fromLatLng = L.latLng({
              lat: _Marker.Latitude,
              lng: _Marker.Longitude,
            });
            let toLatLng = L.latLng({
              lat: NewCoordinate.Route[NewCoordinate.Route.length - 1].Latitude,
              lng: NewCoordinate.Route[NewCoordinate.Route.length - 1]
                .Longitude,
            });
            Distance = fromLatLng.distanceTo(toLatLng);
          }

          NewCoordinate = {
            ...NewCoordinate,
            Route: [...NewCoordinate.Route, { ..._Marker, Distance }],
          };

          const _Coordinates =SelectedRoute?Coordinates.map((_c, i) =>  _CurrentRouteIndex === i ? NewCoordinate : _c):[...Coordinates,NewCoordinate];
          
          console.log({_CurrentRouteIndex,SelectedRoute,_Coordinates,NewCoordinate,kk:_Coordinates[0]});

          setCoordinates(_Coordinates);
          setSelectedRoute(NewCoordinate);
        }
      }
    },
    [
      Coordinates,
      SelectedRoute,
      setCoordinates,
      Markers,
      setSelectedRoute,
      ShopsMarker,
    ]
  );

  const handleClusterReady = (node: any) => {
    if (node) {
      const leafletLayer = node.leafletElement || node;
      setClusterLayer(leafletLayer);
    }
  };

  useEffect(() => {
    if (!clusterLayer) return;

    const onClusterAnimationEnd = () => {
      console.log("Clusters changed!");
    };

    clusterLayer.on("animationend", onClusterAnimationEnd);

    return () => {
      clusterLayer.off("animationend", onClusterAnimationEnd);
    };

    // console.log(clusterRef.current);
    // if (!clusterRef.current) return;

    //   const layer = clusterRef.current.leafletElement || clusterRef.current;
    //   layer.on("clusterclick", function (a: any) {
    //     console.log(a);
    //     a.originalEvent.preventDefault();
    //     a.originalEvent.stopPropagation();
    //   });
  }, [clusterLayer]);

    useEffect(() => {
      console.log({Coordinates});
    }, [Coordinates]);
  return (
    <>
      {/* <MarkerClusterGroup ref={handleClusterReady}> */}
      {Markers.map((_marker, index) => {
        return (
          <Marker
            key={`markers${index}`}
            position={[_marker.Latitude, _marker.Longitude]}
            draggable={false}
            bubblingMouseEvents={false}
            eventHandlers={{
              click: (e) => onClickMarker(e),
              dblclick: (e) => ondblclickMarker(e.latlng.lat, e.latlng.lng),
              mouseover: (event) => event.target.openPopup(),
              mouseout: (event) => event.target.closePopup(),
            }}
            icon={createReactDivIcon(_marker)}
            // icon={
            //   new DivIcon({
            //     html: renderToStaticMarkup(
            //       <MarkerIcon
            //         MarkerID={_marker.MarkerID}
            //         text={_marker.CustomerName}
            //         index={0}
            //         Latitude={_marker.Latitude}
            //         Longitude={_marker.Longitude}
            //       />
            //     ),
            //     iconSize: [10, 10],
            //     className: "",
            //   })
            // }
          >
            <Popup closeButton={false} minWidth={281}>
              <MarkerPopup marker={_marker} />
            </Popup>
          </Marker>
        );
      })}

      {ShopsMarker.map((_marker, index) => {
        return (
          <Marker
            key={index}
            position={[_marker.Latitude, _marker.Longitude]}
            draggable={false}
            bubblingMouseEvents={false}
            eventHandlers={{
              mouseover: (event) => event.target.openPopup(),
              mouseout: (event) => event.target.closePopup(),
            }}
            icon={createReactDivIcon(_marker)}
            // icon={
            //   new DivIcon({
            //     html: renderToStaticMarkup(
            //       <MarkerIcon
            //         MarkerID={_marker.MarkerID}
            //         text={_marker.CustomerName}
            //         index={0}
            //         Latitude={_marker.Latitude}
            //         Longitude={_marker.Longitude}
            //       />
            //     ),
            //     iconSize: [10, 10],
            //     className: "",
            //   })
            // }
            >
            <Popup closeButton={false} minWidth={281} className={"bg-red"}>
              <MarkerShopPopup marker={_marker} />
            </Popup>
          </Marker>
        );
      })}
      {/* </MarkerClusterGroup> */}
    </>
  );
}

export default memo(ClusterGroup);
