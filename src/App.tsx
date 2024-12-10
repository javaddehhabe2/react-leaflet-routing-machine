import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";

import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LeafletMouseEvent,
  DivIcon,
} from "leaflet";
import Routing from "./Routing";
import { createTheme, ThemeProvider, Stack } from "@mui/material";

import {
  RouteCoordinate,
  RouteDetailType,
  IconType,
  LassoController,
} from "./LeafletType";
import { Marker as MarkerType } from "./MarkerType";
import { MarkersDetail } from "./MapData";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "./Header/Header";
import RouteDetails from "./RouteDetails/RouteDetails";
import { SetMarkerColor } from "./Utility";

import { AppContextType, AppContextProvider } from "./context/AppContext";
import MarkerPopup from "./Popup/MarkerPopup";
import BottomCenter from "./Controller/BottomCenter";
import BottomLeft from "./Controller/BottomLeft";

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

  const MarkerType = useCallback((Type: number = 1, isSelected = false) => {
    switch (Type) {
      case 1:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
      case 2:
        return `fi-${isSelected ? "s" : "r"}s-land-layer-location`;
      case 3:
        return `fi-${isSelected ? "s" : "r"}s-location-alt`;
      case 4:
        return `fi-${isSelected ? "s" : "r"}s-marker-time`;
      default:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
    }
  }, []);

  const Icon = useCallback(
    ({ type, text, color, isSelected }: IconType) =>
      new DivIcon({
        html: renderToStaticMarkup(
          <div className="absolute left-0 -top-6 ">
            {
              <i
                className={`fi ${MarkerType(type, isSelected)}`}
                style={{ fontSize: "1.6rem", color: color }}
              ></i>
            }
            {text ? (
              <span
                className="absolute w-[70%]  left-[50%]  translate-x-[-50%] bottom-0 text-center text-xxs font-medium rounded-sm text-white"
                style={{ backgroundColor: color }}
              >
                {text}
              </span>
            ) : null}
          </div>
        ),
        iconSize: [10, 10], // size of the icon
        className: "",
      }),
    [MarkerType]
  );

  const ondblclickMarker = useCallback(
    (lat: number, lng: number) => {
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
    [coordinates, setCoordinates, setRemovedMarker]
  );

  const onClickMarker = useCallback(
    (e: LeafletMouseEvent) => {
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
              tmp.Route.push(_m);
              return tmp;
            } else return _route;
          });

          setCoordinates(nextRoute);
        }
      }
    },
    [coordinates, currentRouteIndex, setCoordinates]
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
    setHideRoute,
    setCoordinates,
    NewRoute,
    setAllMarkers,
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider initialValue={contextValue}>
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
            Icon={Icon}
            drawLasso={drawLasso}
            setDrawLasso={setDrawLasso}
          />
          {allMarkers.map((_marker, index) => (
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
              icon={Icon({
                type: _marker.MarkerID,
                text: "",
                color: SetMarkerColor(
                  coordinates,
                  _marker.Latitude,
                  _marker.Longitude
                )
                  ? "transparent"
                  : "#38f",
                isSelected: false,
              })}
            >
              <Popup closeButton={false} minWidth={281}>
                <MarkerPopup marker={_marker} />
              </Popup>
            </Marker>
          ))}

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
