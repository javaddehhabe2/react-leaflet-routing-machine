import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LeafletMouseEvent,
  DivIcon,
} from "leaflet";
import Routing from "./Routing";
import {
  createTheme,
  ThemeProvider,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { PiTruckTrailerBold } from "react-icons/pi";
import { TbMapPlus, TbMapMinus, TbRefresh, TbEye } from "react-icons/tb";
import { LiaTruckPickupSolid } from "react-icons/lia";

import {
  RouteCoordinate,
  RouteDetailType,
  IconType,
  LassoController,
} from "./LeafletType";
import { Marker as MarkerType } from "./MarkerType";
import { MarkersDetail, MARKERS } from "./MapData";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "./Header/Header";
import RouteDetails from "./RouteDetails/RouteDetails";
import { SetMarkerColor } from "./Utility";

import { AppContextType, AppContextProvider } from "./context/AppContext";

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
  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);
  const [removedMarker, setRemovedMarker] = useState<number>();
  const [routeDetail, setRouteDetail] = useState<RouteDetailType[]>([]);
  const [drawLasso, setDrawLasso] = useState<LassoController>("Disable");
  const MarkerType = useCallback((Type: number = 1, isSelected = false) => {
    switch (Type) {
      case 1:
        return `fi-${isSelected ? "s" : "t"}s-marker`;
      case 2:
        return `fi-${isSelected ? "s" : "t"}s-land-layer-location`;
      case 3:
        return `fi-${isSelected ? "s" : "t"}s-location-alt`;
      case 4:
        return `fi-${isSelected ? "s" : "t"}s-marker-time`;
      default:
        return `fi-${isSelected ? "s" : "t"}s-marker`;
    }
  }, []);

  const Icon = useCallback(
    ({ type, text, color, isSelected }: IconType) =>
      new DivIcon({
        html: renderToStaticMarkup(
          <div className="absolute left-0 -top-6">
            {
              <i
                className={`fi ${MarkerType(type, isSelected)}`}
                style={{ fontSize: "1.75rem", color: color }}
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
    [coordinates, currentRouteIndex, setCoordinates, setRemovedMarker]
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
        let _Marker = MarkersDetail.find(
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
      console.log(drawLasso , Action);

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
    coordinates,
    setCoordinates,
    NewRoute,
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider initialValue={contextValue}>
        <MapContainer
          doubleClickZoom={false}
          center={position}
          zoom={11}
          style={{ height: "100vh" }}
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
          {MarkersDetail.map((_marker, index) => (
            <Marker
              key={index}
              position={[_marker.Latitude, _marker.Longitude]}
              draggable={false}
              bubblingMouseEvents={false}
              eventHandlers={{
                click: (e) => onClickMarker(e),
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
                  : "blue",
                isSelected: false,
              })}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}

          <Control position="bottomleft" prepend>
            <div className="w-[15vw]">
              <div className="divide-y divide-gray-300 text-gray-600  ">
                <div className="flex flex-row justify-between px-5 py-2">
                  <div>مسیر</div>
                  <div>12</div>
                </div>
                <div className="flex flex-row  justify-between px-5 py-2">
                  <div>سفارش</div>
                  <div>12</div>
                </div>
                <div className="flex flex-row  justify-between px-5 py-2">
                  <div>کیلومتر</div>
                  <div>12</div>
                </div>
                <div className="flex flex-row justify-between px-5 py-2">
                  <div>ساعت</div>
                  <div>12</div>
                </div>
              </div>
            </div>
          </Control>
          <Control
            position="topright"
            container={{ className: "CenterControl" }}
          >
            <div className="flex flex-row text-gray-600">
              <div className="p-2">
                <TbMapPlus size={20} onClick={() => DrawLasso("Add")} />
              </div>
              <div className="p-2">
                <TbMapMinus size={20} onClick={() => DrawLasso("Remove")} />
              </div>
              <div className="p-2">
                <LiaTruckPickupSolid size={20} />
              </div>
              <div className="p-2">
                <PiTruckTrailerBold size={20} />
              </div>

              <div className=" border-r inline-block  p-2 border-gray-500">
                <TbEye size={20} />
              </div>
              <div className="p-2">
                <TbRefresh size={20} />
              </div>
            </div>
          </Control>

          <Control position="topleft">
            <Stack style={{ width: "100vw" }}>
              <Header />
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
