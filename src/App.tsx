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
  RouteDetailType,
  LassoController,
  RouteDetailsLS,
  SettingsType,
} from "./LeafletType";
import { Marker as MarkerType } from "./MarkerType";
import { DefaultColor, MarkersDetail, ShopIconColor } from "./MapData";
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
  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);
  const [removedMarker, setRemovedMarker] = useState<number>();
  const [routeDetail, setRouteDetail] = useState<RouteDetailType[]>([]);
  const [drawLasso, setDrawLasso] = useState<LassoController>("Disable");
  const [hideRoute, setHideRoute] = useState(false);

  const [shops, setShops] = useState<MarkerType[]>([]);

  const [flying, setFlying] = useState<LatLngLiteral>();

  const [showDriver, setShowDriver] = useState(false);

  // setting state
  const [timeDistance, setTimeDistance] = useState<number>();
  const [fixedWorkingHours, setFixedWorkingHours] = useState<number>();
  const [vanVolume, setVanVolume] = useState<number>();
  const [isuzuVolume, setIsuzuVolume] = useState<number>();
  const [isHeavy, setIsHeavy] = useState<boolean>();
  const [saveToLocal, setSaveToLocal] = useState<boolean>();

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
    // console.log(coordinates);
    Storage.setLocal("LS_Route", JSON.stringify(coordinates));
  }, [coordinates]);

  useEffect(() => {
    Storage.setLocal("LS_Route_Detail", JSON.stringify({ currentRouteIndex }));
  }, [currentRouteIndex]);

  useEffect(() => {
    if (shops.length > 0) return;
    const _Shops: MarkerType[] = [];

    MarkersDetail.map((marker) => {
      if (marker.Shops) {
        marker.Shops.map((_m) => {
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
        if (_route.length < coordinates[index].Route.length)
          setRemovedMarker(index);
        object.Route = [..._route];
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
                _Marker?.Shops.map((_mrk) => {
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
                    if (_MarkerShops) tmp.Route.push(_MarkerShops);
                  }
                });
              }

              tmp.Route.push(_m);
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

  const UpdateRouteDetail = useCallback(
    (index: number, Distance: string, Time: string) => {
      const _routeDetail: RouteDetailType[] = routeDetail
        ? [...routeDetail]
        : [];
      let _exist = _routeDetail.findIndex((el) => el.index === index);
      if (_exist < 0) {
        _routeDetail.push({
          index,
          Distance,
          Time,
        });
      } else {
        _routeDetail[_exist] = { index, Distance, Time };
      }
      setRouteDetail(_routeDetail);
    },
    [routeDetail, setRouteDetail]
  );

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
    routeDetail,
    flying,
    timeDistance,
    fixedWorkingHours,
    vanVolume,
    isuzuVolume,
    isHeavy,
    saveToLocal,
    shops,
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

      console.log(flying);
      if (Shadow) console.log(_marker);

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
            UpdateRouteDetail={UpdateRouteDetail}
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
              <RouteDetails
                Points={coordinates[currentRouteIndex]}
                Detail={routeDetail[currentRouteIndex]}
              />
            </Stack>
          </Control>
        </MapContainer>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
