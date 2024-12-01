import React, { useCallback, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LatLngLiteral,
  type LeafletMouseEvent,
} from "leaflet";
import Routing from "./Routing";
import {
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { RouteCoordinate, RouteDeteilType } from "./LeafletType";
import { MARKERS } from "./MapData";

function App() {
  const position: LatLngExpression = [36.2097222, 58.7988889];
  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([]);
  const [newRouteState, setNewRouteState] = useState<number>(0);
  const [removedMarker, setRemovedMarker] = useState<number>();
  const [routeDetail, setRouteDetail] = useState<RouteDeteilType[]>();
  const [selectedRouteDetail, setSelectedRouteDetail] = useState<number>();

  const ondblclickMarker = useCallback(
    (lat: number, lng: number) => {
      const _tmp = [...coordinates];
      const result = _tmp.map((object, index) => {
        let _route = object.Route.filter(
          (el) => el.lat !== lat && el.lng !== lng
        );
        if (_route.length < coordinates[index].Route.length)
          setRemovedMarker(index);
        object.Route = [..._route];
        return object;
      });

      setCoordinates(result);
    },
    [coordinates, newRouteState, setCoordinates, setRemovedMarker]
  );

  const onClickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      if (!coordinates[newRouteState])
        coordinates[newRouteState] = { Route: [] };
      const lat = e.latlng.lat,
        lng = e.latlng.lng;
      let existCoor = coordinates[newRouteState].Route.find(
        (el) => el.lat === lat && el.lng === lng
      );
      if (!existCoor) {
        const markerlatlng: LatLngLiteral = { lat, lng };
        const nextRoute = coordinates.map((_route, index) => {
          if (index == newRouteState) {
            const tmp = { ..._route };
            tmp.Route.push(markerlatlng);
            return tmp;
          } else return _route;
        });

        setCoordinates(nextRoute);
      }
    },
    [coordinates, newRouteState, setCoordinates]
  );

  const NewRoute = useCallback(() => {
    setNewRouteState(coordinates.length);
  }, [coordinates, setNewRouteState]);

  const DeleteRoutes = useCallback(() => {
    setNewRouteState(0);
    setCoordinates([]);
    setRouteDetail([]);
    setSelectedRouteDetail(undefined);
  }, [
    setNewRouteState,
    setRouteDetail,
    setSelectedRouteDetail,
    setCoordinates,
  ]);

  const UpdateRouteDetail = useCallback(
    (index: number, Distance: string, Time: string) => {
      const _routeDetail: RouteDeteilType[] = routeDetail
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
    <MapContainer
      doubleClickZoom={false}
      center={position}
      zoom={14}
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Routing
        Coordinates={coordinates}
        UpdateRouteDetail={UpdateRouteDetail}
        setSelectedRouteDetail={setSelectedRouteDetail}
        ondblclickMarker={ondblclickMarker}
        removedMarker={removedMarker}
        setRemovedMarker={setRemovedMarker}
      />
      {MARKERS.map((_marker, index) => (
        <Marker
          key={index}
          position={[_marker.lat, _marker.lng]}
          draggable={false}
          bubblingMouseEvents={false}
          eventHandlers={{
            click: (e) => onClickMarker(e),
          }}
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
        {selectedRouteDetail !== undefined &&
        routeDetail &&
        routeDetail[selectedRouteDetail] ? (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              {routeDetail[selectedRouteDetail]?.Distance ? (
                <>
                  <Typography variant="h5" component="div">
                    total Distance
                  </Typography>
                  <Typography variant="body2">
                    {routeDetail[selectedRouteDetail]?.Distance}
                  </Typography>
                </>
              ) : null}
              {routeDetail[selectedRouteDetail]?.Time ? (
                <>
                  <Typography variant="h5" component="div">
                    total Time
                  </Typography>
                  <Typography variant="body2">
                    {routeDetail[selectedRouteDetail]?.Time}
                  </Typography>
                </>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </Control>
    </MapContainer>
  );
}

export default App;
