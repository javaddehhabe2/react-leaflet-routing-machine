import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LeafletMouseEvent,
  DivIcon,
} from "leaflet";
import Routing from "./Routing";
import { Button, Stack, Divider } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";


import {
  RouteCoordinate,
  RouteDetailType,
  IconType,
  Markers,
} from "./LeafletType";
import { MarkersDetail, MARKERS } from "./MapData";
import { renderToStaticMarkup } from "react-dom/server";

import RouteDetails from "./RouteDetails/RouteDetails";

import { createTheme, ThemeProvider } from "@mui/material";

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

  const MarkerType= useCallback((Marker:Markers|undefined)=>{

  return 'fi-ts-marker-time';
  
  },[]);
  const Icon = useCallback(
    ({ Marker , text, color }: IconType) =>
      new DivIcon({
        html: renderToStaticMarkup(
          <div className="absolute left-0 -top-6">
            { 
              <i
                className={`fi ${MarkerType(Marker)}`} style={{ fontSize:'1.75rem', color: color }}
              ></i>
            }
            {/* {text ? (
              <span
                className="absolute w-[50%] h-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] badge"
                style={{ color: "white", backgroundColor: color }}
              >
                {text}
              </span>
            ) : null} */}
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
          const _m: Markers = _Marker;
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

  const DeleteRoutes = useCallback(() => {
    setCurrentRouteIndex(0);
    setCoordinates([]);
  }, [setCurrentRouteIndex, setCoordinates]);

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

  return (
    <ThemeProvider theme={theme}>
      <MapContainer
        doubleClickZoom={false}
        center={position}
        zoom={11}
        style={{ height: "100vh" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing
          Coordinates={coordinates}
          UpdateRouteDetail={UpdateRouteDetail}
          setCurrentRouteIndex={setCurrentRouteIndex}
          ondblclickMarker={ondblclickMarker}
          removedMarker={removedMarker}
          setRemovedMarker={setRemovedMarker}
          Icon={Icon}
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
            icon={Icon({Marker:_marker, text: "", color: "blue" })}
          />
        ))}

        <Control position="bottomleft" prepend>
          <Stack
            direction="column"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Button color="inherit" onClick={NewRoute}>
              <AddIcon />
            </Button>
            <Button color="inherit" onClick={DeleteRoutes}>
              <DeleteIcon />
            </Button>
          </Stack>
        </Control>

        <Control position="topright">
          {coordinates && coordinates[currentRouteIndex] ? (
            <RouteDetails
              Points={coordinates[currentRouteIndex]}
              Detail={routeDetail[currentRouteIndex]}
            />
          ) : null}
        </Control>
        <Control position="topright">
          <RouteDetails
            Points={MARKERS}
            Detail={routeDetail[currentRouteIndex]}
          />
        </Control>
      </MapContainer>
    </ThemeProvider>
  );
}

export default App;
