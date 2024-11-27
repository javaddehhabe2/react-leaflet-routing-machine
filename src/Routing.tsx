import { useEffect } from "react";
import L, { type LatLngLiteral } from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
// import "leaflet-routing-machine-custom/dist/leaflet-routing-machine-custom.css";
import "leaflet-routing-machine-custom";
import { useMap } from "react-leaflet";
const Leaflet = require("leaflet");

Leaflet.Marker.prototype.options.icon = Leaflet.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
});

export default function Routing({
  Coordinates,
}: {
  Coordinates: LatLngLiteral[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const _tmp = Coordinates.map((object) => {
      return Leaflet.latLng(object.lat, object.lng);
    });

    const routingControl = Leaflet.Routing.control({
      waypoints: _tmp,
      routeWhileDragging: false,
      autoRoute: true,
      routeDragInterval: 500,
      waypointMode: "connect",
      showAlternatives: false,
      reverseWaypoints: true,
    }).addTo(map);

    return () => {
      if (map) map.removeControl(routingControl);
    };
  }, [Coordinates]);

  return null;
}
