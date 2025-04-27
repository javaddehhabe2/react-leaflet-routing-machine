import { useCallback, useEffect, useState, useRef, memo } from "react";
import "leaflet-routing-machine-custom";
import 'leaflet-routing-machine';
import { Marker, Popup, useMap } from "react-leaflet";
import { useAppContext } from "../context/AppContext";
import { RoutingMachineType } from "./type";
import L, { DivIcon } from 'leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import { renderToStaticMarkup } from "react-dom/server";
import MarkerPopup from "@/Popup/MarkerPopup";
import MarkerShopPopup from "@/Popup/MarkerShopPopup";
// const Leaflet = require("leaflet");


function ClusterGroup({
  setCurrentRouteIndex,
  _index,
  _routeColor,
  waypoints
}: RoutingMachineType) {
   const [clusterLayer, setClusterLayer] = useState<any>(null);
 const DrawIcon = useCallback(
    (_marker: MarkerType) => {
      let RouteColor = "";
      let Shadow = false;

      coordinates.forEach((_route, indx) => {
        let existCoor = coordinates[indx].Route.find(
          (el) =>
            el.index === _marker.index
        );
        if (existCoor) RouteColor = coordinates[indx].RouteColor;
      });

      let color = RouteColor
        ? RouteColor
        : _marker.MarkerID === 10
        ? ShopIconColor
        : DefaultColor;
      if (flying)
        Shadow =
          flying.lat === _marker.Latitude && flying.lng === _marker.Longitude;

      return (
        <Icon1
          type={_marker.MarkerID}
          text={_marker.CustomerName}
          index={0}
          Shadow={Shadow}
          isSelected={!!RouteColor}
          routeColor={color}
        />
      );
    },
    [coordinates, flying]
  );

     const ondblclickMarker = useCallback(
       (lat: number, lng: number) => {
         // setFlying(undefined);
         const _tmp = [...coordinates];
         const result = _tmp.map((object, index) => {
           let _route = object.Route.filter(
             (el) => el.Latitude !== lat && el.Longitude !== lng
           );
           if (_route.length < coordinates[index].Route.length) {
             setRemovedMarker(index);
   
             const lk = _route.map((_r, indx) => {
               let Distance = 0;
               if (indx > 0) {
                 let fromLatLng = Leaflet.latLng({
                   lat: _r.Latitude,
                   lng: _r.Longitude,
                 });
                 let toLatLng = Leaflet.latLng({
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
       [coordinates, setCoordinates, setRemovedMarker, setFlying]
     );
   
     const onClickMarker = useCallback(
       (e: LeafletMouseEvent) => {
         // setFlying(undefined);
         if (!coordinates[currentRouteIndex])
           coordinates[currentRouteIndex] = {
             Route: [],
             RouteColor: RouteColor[currentRouteIndex]
               ? RouteColor[currentRouteIndex]
               : DefaultColor,
           };
   
         const lat = e.latlng.lat,
           lng = e.latlng.lng;
   
         let existCoor = coordinates[currentRouteIndex].Route.find(
           (el) => el.Latitude === lat && el.Longitude === lng
         );
         if (!existCoor) {
           let _Marker = allMarkers.find(
             (el) => el.Latitude === lat && el.Longitude === lng
           );
           if (_Marker) {
             const _m: MarkerType = _Marker;
   
             const nextRoute = coordinates.map((_route, index) => {
               if (index === currentRouteIndex) {
                 const tmp = { ..._route };
   
                 if (_Marker?.Shops) {
                   _Marker?.Shops.forEach((_mrk) => {
                     let __mrk = _route.Route.find(
                       (el) =>
                         el.Latitude === _mrk.Latitude &&
                         el.Longitude === _mrk.Longitude
                     );
   
                     if (!__mrk) {
                       let _MarkerShops = shops.find(
                         (el) =>
                           el.Latitude === _mrk.Latitude &&
                           el.Longitude === _mrk.Longitude
                       );
                       if (_MarkerShops) {
                         let Distance = 0;
                         if (tmp.Route.length > 0) {
                           let fromLatLng = Leaflet.latLng({
                             lat: _MarkerShops.Latitude,
                             lng: _MarkerShops.Longitude,
                           });
                           let toLatLng = Leaflet.latLng({
                             lat: tmp.Route[tmp.Route.length - 1].Latitude,
                             lng: tmp.Route[tmp.Route.length - 1].Longitude,
                           });
                           Distance = fromLatLng.distanceTo(toLatLng);
                         }
                         tmp.Route.push({ ..._MarkerShops, Distance });
                       }
                     }
                   });
                 }
   
                 let Distance = 0;
                 if (tmp.Route.length > 0) {
                   let fromLatLng = Leaflet.latLng({
                     lat: _m.Latitude,
                     lng: _m.Longitude,
                   });
                   let toLatLng = Leaflet.latLng({
                     lat: tmp.Route[tmp.Route.length - 1].Latitude,
                     lng: tmp.Route[tmp.Route.length - 1].Longitude,
                   });
   
                   Distance = fromLatLng.distanceTo(toLatLng);
                 }
                 tmp.Route.push({ ..._m, Distance });
                 return tmp;
               } else return _route;
             });
   
             setCoordinates(nextRoute);
           }
         }
       },
       [
         coordinates,
         currentRouteIndex,
         setCoordinates,
         allMarkers,
         // setFlying,
         shops,
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

  return   (  <MarkerClusterGroup  ref={handleClusterReady}
  >
  {allMarkers.map((_marker, index) => {
    return (
      <Marker
        key={`markers${index}`}
        position={[_marker.Latitude, _marker.Longitude]}
        draggable={false}
        bubblingMouseEvents={false}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick:(e)=>ondblclickMarker(e.latlng.lat,e.latlng.lng),
          mouseover: (event) => event.target.openPopup(),
          mouseout: (event) => event.target.closePopup(),
        }}
        icon={
          new DivIcon({
            html: renderToStaticMarkup(DrawIcon(_marker)),
            iconSize: [10, 10],
            className: "",
          })
        }>
        <Popup closeButton={false} minWidth={281}>
          <MarkerPopup marker={_marker} />
        </Popup>
      </Marker>
    );
  })}

  {shops.map((_marker, index) => {
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
        icon={
          new DivIcon({
            html: renderToStaticMarkup(DrawIcon(_marker)),
            iconSize: [10, 10],
            className: "",
          })
        }>
        <Popup closeButton={false} minWidth={281} className={"bg-red"}>
          <MarkerShopPopup marker={_marker} />
        </Popup>
      </Marker>
    );
  })}
 
</MarkerClusterGroup>)
}

export default memo(ClusterGroup)