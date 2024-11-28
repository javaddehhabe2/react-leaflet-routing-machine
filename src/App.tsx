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
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { RouteCoordinate } from "./LeafletType";

function App() {
  const position: LatLngExpression = [36.2097222, 58.7988889];
  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([]);
  const [newRouteState, setNewRouteState] = useState<number>(0);

  const [distance, setDistance] = useState<string>();
  const [time, setTime] = useState<string>();

  const ondblclickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      console.log(e);
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const _tmp = coordinates[newRouteState].Route.map((object) => ({
        ...object,
      }));

      let result = _tmp.filter((el) => el.lat !== lat && el.lng !== lng);
      let tmp = coordinates;

      tmp[newRouteState].Route = result;
      setCoordinates(tmp);
    },
    [coordinates, newRouteState, setCoordinates]
  );

  const onClickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      console.log(coordinates[newRouteState], coordinates, newRouteState);
      if (!coordinates[newRouteState])
        coordinates[newRouteState] = { Route: [] };
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
    setDistance("");
    setTime("");
  }, [setNewRouteState,setDistance,setTime, setCoordinates]);
  return (
    <MapContainer
      doubleClickZoom={false}
      center={position}
      zoom={13}
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Routing Coordinates={coordinates} setDistance={setDistance} setTime={setTime} />
      <Marker
        position={[36.2097222, 58.7988889]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2400211, 58.83888879]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2397122, 58.7588849]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2297022, 58.74888]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2197112, 58.85388789]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2496922, 58.7288589]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.2, 58.7188389]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
      <Marker
        position={[36.1996222, 58.8288901]}
        eventHandlers={{
          click: (e) => onClickMarker(e),
          dblclick: (e) => ondblclickMarker(e),
        }}
      />
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
      {distance ? (
        <Control position="topright">
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                total Distance
              </Typography>
              <Typography variant="body2">{distance}</Typography>
              {time?<>
                <Typography variant="h5" component="div">
                total Time
              </Typography>
              <Typography variant="body2">{time}</Typography>
              </>:null}
            </CardContent>
          </Card>
        </Control>
      ) : null}
    </MapContainer>
  );
}

export default App;
