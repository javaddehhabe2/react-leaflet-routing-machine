import { useEffect,useRef ,useState} from "react";
import "leaflet-routing-machine-custom";
import { useMap } from "react-leaflet";
import { RouteCoordinate } from "./LeafletType";
import { Route } from "@mui/icons-material";
const Leaflet = require("leaflet");

Leaflet.Marker.prototype.options.icon = Leaflet.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  shadowSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Routing({
  Coordinates,
}: {
  Coordinates: RouteCoordinate[];
}) {
  const map = useMap();
  const itemEls = useRef([]) ;
  const [routes, setRoutes] = useState<any[]>([]);
  const Color = [
    "blue",
    "aqua",
    "fuchsia",
    "green",
    "lime",
    "maroon",
    "navy",
    "olive",
    "orange",
    "purple",
    "red",
    "silver",
    "teal",
    "yellow",
  ];
  useEffect(() => {
    if (!map) return;
    if(Coordinates.length==0){
      if (map){
        for (let index = 0; index < routes.length; index++) {
          map.removeControl(routes[index]);         
        }
     
      } 
    }
    const tmp_item=routes;
   Coordinates.map((route, index) => {
      const _tmp = route.Route.map((object) => {
        return Leaflet.latLng(object.lat, object.lng);
      });
      const item=Leaflet.Routing.control({
        waypoints: _tmp,
        lineOptions: {
          styles: [
            {
              color: Color[index]?Color[index]:"blue",
              opacity: 0.6,
              weight: 4,
            },
          ],
        },
        routeWhileDragging: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
      }).addTo(map);
tmp_item.push(item);
      setRoutes(tmp_item);
    });
    // return () => {
    //   if (map) map.removeControl(routingControl);
    // };
    console.log(Coordinates);
  }, [Coordinates]);

  return null;
}
