import React, { useCallback, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  type LatLngExpression,
  type LatLngLiteral,
  type LeafletMouseEvent,
} from "leaflet";
import Routing from "./Routing";

function App() {
  const position: LatLngExpression = [36.2097222, 58.7988889];
  const [coordinates, setCoordinates] = useState<LatLngLiteral[]>([]);

  const ondblclickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      console.log(e);
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const _tmp = coordinates.map((object) => ({ ...object }));
      const result = _tmp.filter((el) => el.lat !== lat && el.lng !== lng);
      setCoordinates(result);
    },
    [coordinates, setCoordinates]
  );

  const onClickMarker = useCallback(
    (e: LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      let existCoor = coordinates.find(
        (el) => el.lat === lat && el.lng === lng
      );
      console.log(existCoor);
      if (!existCoor) {
        const _tmp = coordinates.map((object) => ({ ...object }));

        const markerlatlng: LatLngLiteral = { lat, lng };
        _tmp.push(markerlatlng);
        setCoordinates(_tmp);
      }
    },
    [coordinates, setCoordinates]
  );
  return (
    <MapContainer doubleClickZoom={false} center={position} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Routing Coordinates={coordinates} />
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
    </MapContainer>
  );
}

export default App;
