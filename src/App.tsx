import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LatLngLiteral,
  type LeafletMouseEvent,
  DivIcon,
} from "leaflet";
import Routing from "./Routing";
import { createTheme, ThemeProvider, Stack } from "@mui/material";

import {
  RouteCoordinate,
  LassoController,
  RouteDetailsLS,
  SettingsType,
  CarType,
  CatalogType,
} from "./LeafletType";
import { Marker as MarkerType } from "./MarkerType";
import {
  DefaultColor,
  MarkersDetail,
  ShopIconColor,
  DriverDetail,
  Setting,
  CatalogValue,
} from "./MapData";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "./Header/Header";
import RouteDetails from "./RouteDetails/RouteDetails";

import { AppContextType, AppContextProvider } from "./context/AppContext";
import MarkerPopup from "./Popup/MarkerPopup";
import BottomCenter from "./Controller/BottomCenter";
import BottomLeft from "./Controller/BottomLeft";
import { Storage } from "./Storage/Storage";
import Icon1 from "./Icon/Icon";
import MarkerShopPopup from "./Popup/MarkerShopPopup";
import { DriverType } from "./DriverType";

const Leaflet = require("leaflet");

const theme = createTheme({
  typography: {
    fontFamily: "IranYekan",
    body2: {
      fontSize: "1rem",
      fontWeight: "bolder",
      color: "#374151",
    },
  },
});

function App() {
  const position: LatLngExpression = [
    MarkersDetail[0].Latitude,
    MarkersDetail[0].Longitude,
  ];
  const [allMarkers, setAllMarkers] = useState<MarkerType[]>(MarkersDetail);
  const [allDrivers, setAllDrivers] = useState<DriverType[]>(DriverDetail);

  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);
  const [removedMarker, setRemovedMarker] = useState<number>();
  const [drawLasso, setDrawLasso] = useState<LassoController>("Disable");
  const [hideRoute, setHideRoute] = useState(false);

  const [shops, setShops] = useState<MarkerType[]>([]);

  const [flying, setFlying] = useState<LatLngLiteral>();

  const [showDriver, setShowDriver] = useState(false);

  // setting state
  const [timeDistance, setTimeDistance] = useState<number>(2);
  const [carTypes, setCarTypes] = useState<CarType[]>(Setting.carTypes);
  const [catalogValues, setCatalogValues] =
    useState<CatalogType[]>(CatalogValue);
  const [fixedWorkingHours, setFixedWorkingHours] = useState<number>(540);
  const [vanVolume, setVanVolume] = useState<number>(6);
  const [isuzuVolume, setIsuzuVolume] = useState<number>(9);
  const [isHeavy, setIsHeavy] = useState<boolean>(false);
  const [saveToLocal, setSaveToLocal] = useState<boolean>(true);

  useEffect(() => {
    const _Settings: SettingsType = JSON.parse(
      Storage.getLocal("LS_Settings") ?? "[]"
    );
    if (_Settings) {
      setTimeDistance(_Settings.TimeDistance);
      setFixedWorkingHours(_Settings.FixedWorkingHours);
      setIsuzuVolume(_Settings.IsuzuVolume);
      setVanVolume(_Settings.VanVolume);
      setSaveToLocal(_Settings.SaveToLocal);
    }

    const LocalRoute: RouteCoordinate[] = JSON.parse(
      Storage.getLocal("LS_Route") ?? "[]"
    );
    const LocalRouteDetail: RouteDetailsLS = JSON.parse(
      Storage.getLocal("LS_Route_Detail") ?? "{}"
    );
    if (LocalRoute.length > 0 && coordinates.length === 0) {
      setCoordinates(LocalRoute);
      if (
        LocalRouteDetail.currentRouteIndex &&
        LocalRouteDetail.currentRouteIndex < LocalRoute.length
      )
        setCurrentRouteIndex(LocalRouteDetail.currentRouteIndex);
    }
  }, []);

  useEffect(() => {
    setFlying(undefined);
    console.log(coordinates);
    Storage.setLocal("LS_Route", JSON.stringify(coordinates));
  }, [coordinates]);

  useEffect(() => {
    Storage.setLocal("LS_Route_Detail", JSON.stringify({ currentRouteIndex }));
  }, [currentRouteIndex]);

  useEffect(() => {
    if (shops.length > 0) return;
    const _Shops: MarkerType[] = [];

    MarkersDetail.forEach((marker) => {
      if (marker.Shops) {
        marker.Shops.forEach((_m) => {
          _Shops.push({
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
    if (ShopArray) setShops([...ShopArray]);
  }, [MarkersDetail]);

  const ondblclickMarker = useCallback(
    (lat: number, lng: number) => {
      setFlying(undefined);
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
      setFlying(undefined);
      if (!coordinates[currentRouteIndex])
        coordinates[currentRouteIndex] = { Route: [] };

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
                        console.log(toLatLng, fromLatLng);
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
    [coordinates, currentRouteIndex, setCoordinates, allMarkers, setFlying]
  );

  const NewRoute = useCallback(() => {
    setCurrentRouteIndex(coordinates.length);
  }, [coordinates, setCurrentRouteIndex]);

  const DrawLasso = useCallback(
    (Action: LassoController) => {
      if (drawLasso === Action) {
        setDrawLasso("Disable");
        return;
      }

      switch (Action) {
        case "Add":
          setDrawLasso("Add");
          break;
        case "Remove":
          setDrawLasso("Remove");
          break;
      }
    },
    [drawLasso]
  );

  const contextValue: AppContextType = {
    allMarkers,
    coordinates,
    currentRouteIndex,
    hideRoute,
    flying,
    timeDistance,
    fixedWorkingHours,
    vanVolume,
    isuzuVolume,
    isHeavy,
    saveToLocal,
    shops,
    showDriver,
    allDrivers,
    carTypes,
    catalogValues,
    setCatalogValues,
    setCarTypes,
    setAllDrivers,
    setShowDriver,
    setTimeDistance,
    setFixedWorkingHours,
    setVanVolume,
    setIsuzuVolume,
    setIsHeavy,
    setSaveToLocal,
    setFlying,
    setHideRoute,
    setCoordinates,
    NewRoute,
    setAllMarkers,
  };
  const DrawIcon = useCallback(
    (_marker: MarkerType, RouteColor: string, indx: number) => {
      let exist = false;
      let Shadow = false;

      coordinates.forEach((_route, indx) => {
        let existCoor = coordinates[indx].Route.find(
          (el) =>
            el.Latitude === _marker.Latitude &&
            el.Longitude === _marker.Longitude
        );
        if (existCoor) exist = true;
      });

      let color = RouteColor
        ? RouteColor
        : exist
        ? "transparent"
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
          index={indx}
          Shadow={Shadow}
          isSelected={exist}
          routeColor={color}
        />
      );
    },
    [coordinates, flying]
  );
  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider initialValue={{ ...contextValue, coordinates }}>
        <Header />
        <MapContainer
          doubleClickZoom={false}
          center={position}
          zoom={11}
          style={{ height: "100vh", zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Routing
            setCurrentRouteIndex={setCurrentRouteIndex}
            ondblclickMarker={ondblclickMarker}
            removedMarker={removedMarker}
            setRemovedMarker={setRemovedMarker}
            DrawIcon={DrawIcon}
            drawLasso={drawLasso}
            setDrawLasso={setDrawLasso}
          />
          {allMarkers.map((_marker, index) => {
            return (
              <Marker
                key={index}
                position={[_marker.Latitude, _marker.Longitude]}
                draggable={false}
                bubblingMouseEvents={false}
                eventHandlers={{
                  click: (e) => onClickMarker(e),
                  mouseover: (event) => event.target.openPopup(),
                  mouseout: (event) => event.target.closePopup(),
                }}
                icon={
                  new DivIcon({
                    html: renderToStaticMarkup(DrawIcon(_marker, "", 0)),
                    iconSize: [10, 10],
                    className: "",
                  })
                }
              >
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
                    html: renderToStaticMarkup(DrawIcon(_marker, "", 0)),
                    iconSize: [10, 10],
                    className: "",
                  })
                }
              >
                <Popup closeButton={false} minWidth={281} className={"bg-red"}>
                  <MarkerShopPopup marker={_marker} />
                </Popup>
              </Marker>
            );
          })}

          <Control
            position="bottomleft"
            prepend
            container={{ className: "left-3" }}
          >
            <BottomLeft />
          </Control>
          <Control
            position="topright"
            container={{ className: "CenterControl" }}
          >
            <BottomCenter drawLasso={drawLasso} DrawLasso={DrawLasso} />
          </Control>

          <Control position="topleft">
            <Stack style={{ width: "100vw" }}>
              <RouteDetails Points={coordinates[currentRouteIndex]} />
            </Stack>
          </Control>
        </MapContainer>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
