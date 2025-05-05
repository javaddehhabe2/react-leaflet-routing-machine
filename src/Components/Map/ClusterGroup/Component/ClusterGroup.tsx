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
import { Marker as MarkerType } from "@Map/Type";

import convexHull from "convex-hull";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import distance from '@turf/distance'; // optional

import MarkerPoints from "./MarkerPoints";
import Groups from "./Groups";
// function createReactDivIcon({
//   MarkerID,
//   text,
//   Latitude,
//   Longitude,
//   index,
//   Hide,
// }: MarkerIconType) {
//   const div = document.createElement("div");
//   const root = createRoot(div);

//   root.render(
//     <MarkerIcon
//       MarkerID={MarkerID}
//       text={text}
//       index={index}
//       Latitude={Latitude}
//       Longitude={Longitude}
//       Hide={Hide}
//     />
//   );

//   return new DivIcon({
//     html: div, // << here's the real DOM, not static markup
//     iconSize: [40, 40],
//     className: "",
//   });
// }

function ClusterGroup() {
  const { Markers, ShopsMarker, Filter, setMarkers } = useMapStore();

  const { Coordinates, setCoordinates, SelectedRoute, setSelectedRoute } =
    useRouteStore();

  const { GroupMarker, AddMarkerToGroup } = useGroupMarkerStore();

  const [tmpMarker, setTmpMarker] = useState(Markers);
  const [currentClusterIndex, setCurrentClusterIndex] = useState<number>();
  const [currentCluster, setCurrentCluster] = useState<MarkerType[]>([]);

  // const polygonPositions = useMemo(() => {
  //   let Positions: LatLngTuple[] = [];

  //   const filteredMarkers = tmpMarker.filter((_tmp) => !_tmp.IsHide);
  //   if (filteredMarkers.length > 2) {
  //     const points = filteredMarkers.map((marker) => [
  //       marker.Longitude, // Longitude (X)
  //       marker.Latitude, // Latitude (Y)
  //     ]);

  //     const hull = convexHull(points);

  //     Positions = hull.map(([a, b]) => {
  //       const [lng, lat] = points[a];
  //       return [lat, lng] as LatLngTuple;
  //     });

  //     if (Positions.length > 0) {
  //       Positions.push(Positions[0]); // to close polygon nicely
  //     }
  //   }

  //   return Positions;
  // }, [tmpMarker]);

//   const ondblclickMarker = useCallback(
//     (lat: number, lng: number) => {
//       const _tmp = [...Coordinates];
//       const result = _tmp.map((object, index) => {
//         let _route = object.Route.filter(
//           (el) => el.Latitude !== lat && el.Longitude !== lng
//         );
//         if (_route.length < object.Route.length) {
//           const lk = _route.map((_r, indx) => {
//             let Distance = 0;
//             if (indx > 0) {
//               let fromLatLng = L.latLng({
//                 lat: _r.Latitude,
//                 lng: _r.Longitude,
//               });
//               let toLatLng = L.latLng({
//                 lat: _route[indx - 1].Latitude,
//                 lng: _route[indx - 1].Longitude,
//               });

//               Distance = fromLatLng.distanceTo(toLatLng);
//             }
//             return { ..._r, Distance };
//           });

//           object.Route = [...lk];
//         } else object.Route = [..._route];
//         return object;
//       });

//       setCoordinates(result);
//     },
//     [Coordinates, setCoordinates]
//   );

//   const onClickMarker = useCallback(
//     (e: LeafletMouseEvent) => {
//       let NewCoordinate = SelectedRoute
//         ? SelectedRoute
//         : {
//             Route: [],
//             RouteColor: RouteColor[
//               Coordinates.length ? Coordinates.length - 1 : 0
//             ]
//               ? RouteColor[Coordinates?.length ?? 0]
//               : DefaultColor,
//           };

//       const lat = e.latlng.lat,
//         lng = e.latlng.lng;

//       const ExistInCoordination = Coordinates.find((el) => {
//         const _Route = el.Route.find(
//           (_route) => _route.Latitude === lat && _route.Longitude === lng
//         );
//         return _Route ? true : false;
//       });

//       if (!ExistInCoordination) {
//         let _Marker = Markers.find(
//           (el) => el.Latitude === lat && el.Longitude === lng
//         );

//         if (_Marker) {
//           /// find index of current Route
//           const _CurrentRouteIndex = SelectedRoute
//             ? Coordinates.findIndex((el) => {
//                 let find = false;
//                 el.Route.every((_route) => {
//                   find = !!SelectedRoute.Route.find(
//                     (_selectedRoute) =>
//                       _route.Latitude === _selectedRoute.Latitude &&
//                       _route.Longitude === _selectedRoute.Longitude
//                   );
//                   return find;
//                 });

//                 return find;
//               })
//             : 0;

//           if (_Marker?.Shops) {
//             _Marker?.Shops.forEach((_mrk) => {
//               const HasShopInRoute = NewCoordinate
//                 ? !!NewCoordinate.Route.find(
//                     (el) =>
//                       el.Latitude === _mrk.Latitude &&
//                       el.Longitude === _mrk.Longitude
//                   )
//                 : false;

//               if (!HasShopInRoute) {
//                 const _ShopsMarker = ShopsMarker.find(
//                   (_shop) =>
//                     _shop.Latitude === _mrk.Latitude &&
//                     _shop.Longitude === _mrk.Longitude
//                 );
//                 if (_ShopsMarker) {
//                   let Distance = 0;
//                   if (NewCoordinate.Route.length > 0) {
//                     let fromLatLng = L.latLng({
//                       lat: _ShopsMarker.Latitude,
//                       lng: _ShopsMarker.Longitude,
//                     });
//                     let toLatLng = L.latLng({
//                       lat: NewCoordinate.Route[NewCoordinate.Route.length - 1]
//                         .Latitude,
//                       lng: NewCoordinate.Route[NewCoordinate.Route.length - 1]
//                         .Longitude,
//                     });
//                     Distance = fromLatLng.distanceTo(toLatLng);
//                   }

//                   NewCoordinate = {
//                     ...NewCoordinate,
//                     Route: [
//                       ...NewCoordinate.Route,
//                       {
//                         ..._ShopsMarker,
//                         Distance,
//                       },
//                     ],
//                   };
//                 }
//               }
//             });
//           }
//           let Distance = 0;
//           if (NewCoordinate.Route.length > 0) {
//             let fromLatLng = L.latLng({
//               lat: _Marker.Latitude,
//               lng: _Marker.Longitude,
//             });
//             let toLatLng = L.latLng({
//               lat: NewCoordinate.Route[NewCoordinate.Route.length - 1].Latitude,
//               lng: NewCoordinate.Route[NewCoordinate.Route.length - 1]
//                 .Longitude,
//             });
//             Distance = fromLatLng.distanceTo(toLatLng);
//           }

//           NewCoordinate = {
//             ...NewCoordinate,
//             Route: [...NewCoordinate.Route, { ..._Marker, Distance }],
//           };

//           const _Coordinates = SelectedRoute
//             ? Coordinates.map((_c, i) =>
//                 _CurrentRouteIndex === i ? NewCoordinate : _c
//               )
//             : [...Coordinates, NewCoordinate];

//           setCoordinates(_Coordinates);
//           setSelectedRoute(NewCoordinate);
//         }
//       }
//     },
//     [
//       Coordinates,
//       SelectedRoute,
//       setCoordinates,
//       Markers,
//       setSelectedRoute,
//       ShopsMarker,
//     ]
//   );

//   const handleDragEnd = useCallback(
//     (event: LeafletEvent, marker: MarkerType) => {
//       const { lat, lng } = (event.target as LeafletMarker).getLatLng();

//       // Check which group the drop location is inside
//       const markerPoint = point([lng, lat]);
//       let NewGroupIndex = -1;
//       GroupMarker.forEach((group, index) => {
       
//         const _group = group.map((_group) => [
//           _group.Longitude,
//           _group.Latitude,
//         ]);
//         _group.push(_group[0]);

// //  console.log(_group)

//         if (_group.length>3) {
//         const poly = polygon([_group]);
//         if (booleanPointInPolygon(markerPoint, poly)) {
//           NewGroupIndex = index;
//         }

//       }else {
//         // Group has no polygon: check by distance to each marker
//         console.log({_group,GroupMarker,index});

//         for (const marker of _group) {
//           const currentMarkerPoint = point([marker[0], marker[1]]);
//           const dist = distance(markerPoint, currentMarkerPoint, { units: 'meters' });
//           console.log({dist,currentMarkerPoint});
//           if (dist < 1000) { // Threshold: 100 meters
//             NewGroupIndex = index;
//           }
//         }
//       }
  
//       });
    
//       console.log({NewGroupIndex});



//       if (NewGroupIndex > -1) {
//         const newGroup = AddMarkerToGroup(NewGroupIndex, marker);
//         setCurrentCluster(newGroup);
//         setCurrentClusterIndex(NewGroupIndex);
//       }else{
//         setCurrentCluster([...currentCluster]);
//         setCurrentClusterIndex(NewGroupIndex);
//       }
//     },
//     [GroupMarker, AddMarkerToGroup, setCurrentCluster, setCurrentClusterIndex]
//   );





  return (
    <>
    <Groups/>
    <MarkerPoints/>
      {/* {polygonPositions.length > 3 ? (
        <Polygon positions={polygonPositions} pathOptions={{ color: "blue" }} />
      ) : null}
      {GroupMarker.map((group, index) => {
        if (group.length === 1) {
          // Render single marker
          return (
            <Marker
              key={index}
              position={[group[0].Latitude, group[0].Longitude]}
              icon={createReactDivIcon({
                MarkerID: 15,
                text: "1",
                Latitude: group[0].Latitude,
                Longitude: group[0].Longitude,
                index: 1,
                Hide: currentClusterIndex === index,
              })}
              eventHandlers={{
                click: () => {
                  setCurrentCluster(group);
                  setCurrentClusterIndex(index);
                },
              }}
            />
          );
        } else {
          // Render a custom group marker
          const centerLat =
            group.reduce((sum, m) => sum + m.Latitude, 0) / group.length;
          const centerLng =
            group.reduce((sum, m) => sum + m.Longitude, 0) / group.length;

          return (
            <Marker
              key={index}
              position={[centerLat, centerLng]}
              icon={createReactDivIcon({
                MarkerID: 15,
                text: `${group.length}`,
                Latitude: centerLat,
                Longitude: centerLng,
                index: group.length,
                Hide: currentClusterIndex === index,
              })}
              eventHandlers={{
                click: () => {
                  setCurrentCluster(group);
                  setCurrentClusterIndex(index);
                },
              }}
            />
          );
        }
      })}
      {tmpMarker.map((_marker, index) => {
        return _marker.IsHide ? null : (
          <Marker
            key={`markers${index}`}
            position={[_marker.Latitude, _marker.Longitude]}
            draggable={true}
            bubblingMouseEvents={false}
            eventHandlers={{
              click: (e) => onClickMarker(e),
              dblclick: (e) => ondblclickMarker(e.latlng.lat, e.latlng.lng),
              mouseover: (event) => event.target.openPopup(),
              mouseout: (event) => event.target.closePopup(),
              dragend: (e) => handleDragEnd(e, _marker),
            }}
            icon={createReactDivIcon({
              MarkerID: _marker.MarkerID,
              text: _marker.CustomerName,
              Latitude: _marker.Latitude,
              Longitude: _marker.Longitude,
              index: 0,
            })}>
            <Popup closeButton={false} minWidth={281}>
              <MarkerPopup marker={_marker} />
            </Popup>
          </Marker>
        );
      })} */}
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

export default memo(ClusterGroup);
