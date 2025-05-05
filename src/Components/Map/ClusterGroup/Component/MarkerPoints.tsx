import { useCallback, useEffect, useState, useRef, memo, useMemo } from "react";
import "leaflet-routing-machine-custom";
import "leaflet-routing-machine";
import { Marker, Popup, Polygon } from "react-leaflet";

import L, {
  DivIcon,
  LatLngTuple,
  LeafletEvent,
  LeafletMouseEvent,
  Marker as LeafletMarker,
} from "leaflet";

import { MarkerPopup, MarkerShopPopup } from "@Map/Popup";

import { useMapStore } from "@Store/MapStore";

import { useRouteStore } from "@Store/RouteStore";
import { DefaultColor, RouteColor } from "@/Data/Map";
import { createRoot } from "react-dom/client";
import { useGroupMarkerStore } from "@Store/GroupMarkerStore";
// import { Marker as MarkerType } from "@Map/Type";

import convexHull from "convex-hull";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import distance from "@turf/distance"; // optional
import { CustomMarker } from "@Map/CustomMarker";
import { MarkerEntity } from "@/Components/Type";

function MarkerPoints() {
  const { Markers, ShopsMarker } = useMapStore();

  const { Coordinates, setCoordinates, SelectedRoute, setSelectedRoute } =
    useRouteStore();

  const { GroupMarker, CurrentGroup,setCurrentGroupIndex, setCurrentGroup, AddMarkerToGroup } =
    useGroupMarkerStore();

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

          const _Coordinates = SelectedRoute
            ? Coordinates.map((_c, i) =>
                _CurrentRouteIndex === i ? NewCoordinate : _c
              )
            : [...Coordinates, NewCoordinate];

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

  const handleDragEnd = useCallback(
    (event: LeafletEvent, marker: MarkerEntity) => {
      const { lat, lng } = (event.target as LeafletMarker).getLatLng();

      // Check which group the drop location is inside
      const markerPoint = point([lng, lat]);
      let NewGroupIndex = -1;

      console.log(GroupMarker);
      GroupMarker.forEach((group, index) => {
        if (group.Markers.length > 2) {
          const _group = group.Markers.map((_group) => [
            _group.Longitude,
            _group.Latitude,
          ]);
          _group.push(_group[0]);
          const poly = polygon([_group]);
          if (booleanPointInPolygon(markerPoint, poly)) NewGroupIndex = index;
        } else {
          // Group has no polygon: check by distance to each marker
          // for (const marker of _group) {

          const Position = group?.Position
            ? [group.Position[1], group.Position[0]]
            : [group.Markers[0].Longitude, group.Markers[1].Latitude];
          const currentMarkerPoint = point(Position);
          const dist = distance(markerPoint, currentMarkerPoint, {
            units: "meters",
          });

          if (dist < 1000) NewGroupIndex = index;

          // }
        }
      });

      if (NewGroupIndex > -1) {
        const newGroup = AddMarkerToGroup(NewGroupIndex, marker);
        setCurrentGroup(newGroup);
        setCurrentGroupIndex(newGroup.Index)
      } else {
        const _CurrentGroup = CurrentGroup ? CurrentGroup : GroupMarker[0];
        setCurrentGroup({ ..._CurrentGroup });
        setCurrentGroupIndex(_CurrentGroup.Index);
      }
    },
    [GroupMarker,CurrentGroup,setCurrentGroup, AddMarkerToGroup]
  );

  // useEffect(() => {
  //   if (currentCluster) {
  //     setTmpMarker((prev) =>
  //       prev.map((_marker) => {
  //         const find = currentCluster.find((_groupMarker) =>
  //           _marker.Latitude === _groupMarker.Latitude &&
  //           _marker.Longitude === _groupMarker.Longitude
  //             ? true
  //             : false
  //         );
  //         return find
  //           ? { ..._marker, IsHide: false }
  //           : { ..._marker, IsHide: true };
  //       })
  //     );
  //   } else {
  //     setTmpMarker((prev) =>
  //       prev.map((_marker) => ({ ..._marker, IsHide: true }))
  //     );
  //   }
  // }, [currentCluster]);

  return (
    <>
      {CurrentGroup?.Markers.map((_marker, index) => {
        // console.log(_marker);
        // console.log(JSON.stringify(_marker, null, 2));
        return _marker.IsHide ? null : (
          <CustomMarker
            key={index}
            Index={0}
            Latitude={_marker.Latitude}
            Longitude={_marker.Longitude}
            MarkerID={_marker.MarkerID}
            Text={_marker.CustomerName}
            BubblingMouseEvents={false}
            Draggable={true}
            MarkerDetail={_marker}
            EventHandlers={{
              click: (e) => onClickMarker(e),
              dblclick: (e) => ondblclickMarker(e.latlng.lat, e.latlng.lng),
              mouseover: (event) => event.target.openPopup(),
              mouseout: (event) => event.target.closePopup(),
              dragend: (e) => handleDragEnd(e, _marker),
            }}
          />
        );
      })}
      {/*
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
      })} */}
    </>
  );
}

export default memo(MarkerPoints);
