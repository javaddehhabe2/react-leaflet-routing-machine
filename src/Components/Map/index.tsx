import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { type LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { MarkersDetail } from "@/Data/Map";

import Header from "./Header/Header";

import { Storage } from "@LocalStorage/Storage";
import { useMapStore } from "@Store/MapStore";
import { useRouteStore } from "@Store/RouteStore";
import { Marker, RouteCoordinate, RouteDetailsLS } from "./Type";
import { BottomLeft, BottomCenter } from "@Map/ControlPanel";
import { Stack } from "@mui/material";
import { RouteDetails } from "./RouteDetails";
import { RoutingMachine } from "./RoutingMachine";
import { ClusterGroup } from "./ClusterGroup";
// const Leaflet = require("leaflet");

function App() {
  const { setMarkers, setShopsMarker } = useMapStore();
  const { Coordinates, setCoordinates } = useRouteStore();
  const DefaultPosition: LatLngExpression = useMemo(() => {
    return MarkersDetail.length > 0
      ? [MarkersDetail[0].Latitude, MarkersDetail[0].Longitude]
      : [35.8, 51.47];
  }, [MarkersDetail]);

  useEffect(() => {
    const LocalRoute: RouteCoordinate[] = JSON.parse(
      Storage.getLocal("LS_Route") ?? "[]"
    );
    const LocalRouteDetail: RouteDetailsLS = JSON.parse(
      Storage.getLocal("LS_Route_Detail") ?? "{}"
    );
    if (LocalRoute.length > 0 && Coordinates.length === 0) {
      setCoordinates(LocalRoute, false);
      // if (
      //   LocalRouteDetail.currentRouteIndex &&
      //   LocalRouteDetail.currentRouteIndex < LocalRoute.length
      // )
      // setCurrentRouteIndex(LocalRouteDetail.currentRouteIndex);
    }
  }, []);

  // useEffect(() => {
  //   Storage.setLocal("LS_Route_Detail", JSON.stringify({ currentRouteIndex }));
  // }, [currentRouteIndex]);

  useEffect(() => {
    setMarkers(MarkersDetail);

    const _Shops: Marker[] = [];

    let index = 1;
    MarkersDetail.forEach((marker) => {
      if (marker.Shops) {
        marker.Shops.forEach((_m) => {
          index++;
          _Shops.push({
            index: index + 100000,
            CustomerID: _m.ShopCode,
            CustomerName: _m.ShopName,
            CustomerAddress: _m.ShopAddress,
            Latitude: _m.Latitude,
            Longitude: _m.Longitude,
            MarkerID: 10,
          });
        });
      }
    });

    const ShopArray = _Shops.filter(
      (shop, index, self) =>
        index ===
        self.findIndex(
          (t) => t.Latitude === shop.Latitude && t.Longitude === shop.Longitude
        )
    );
    if (ShopArray) setShopsMarker([...ShopArray]);
  }, [MarkersDetail]);

  return (
    // <AppContextProvider initialValue={{ ...contextValue, coordinates }}>
    <>
      <Header />
      <MapContainer
        doubleClickZoom={false}
        center={DefaultPosition}
        zoom={10}
        style={{ height: "100vh", zIndex: 0 }}
        zoomControl={false}>
        <TileLayer
          attribution=""
          // url="https://{s}.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png"
        />
        {/* <WMSTileLayer
            url={`http://ows.mundialis.de/services/service?`}
            params={{transparent:true,layers:"TOPO-OSM-WMS"}}
          /> */}
<ClusterGroup/>
        {Coordinates.map((_route, index) => (
            <RoutingMachine
            key={`coor${index}`}
              waypoints={_route.Route.map((object) =>
                [object.Latitude, object.Longitude]
              )}
              _routeColor={_route.RouteColor}
              _index={index}
            />
          ))}

        <Control
          position="bottomleft"
          prepend
          container={{ className: "left-3" }}>
          <BottomLeft />
        </Control>
        <Control position="topright" container={{ className: "CenterControl" }}>
          <BottomCenter />
        </Control>

        <Control position="topleft">
          <Stack style={{ width: "100vw" }}>
            <RouteDetails />
          </Stack>
        </Control>
      </MapContainer>
    </>
  );
}

export default App;
