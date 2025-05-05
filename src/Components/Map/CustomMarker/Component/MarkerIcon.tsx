import { memo, useEffect, useState, useMemo } from "react";
import { MarkerIconType } from "../Type";
import { useRouteStore } from "@Store/RouteStore";
import { DefaultColor, GroupIconColor, ShopIconColor } from "@/Data/Map";
import { useMapStore } from "@Store/MapStore";

function MarkerIcon({
  MarkerID,
  Text,
  Index,
  Latitude,
  Longitude,
  Hide,
}: MarkerIconType) {
  const { Coordinates } = useRouteStore();
  const { Flying } = useMapStore();
  const [shadow, setShadow] = useState(false);
  const [color, setColor] = useState(DefaultColor);
  const [isSelected, setIsSelected] = useState(false);
  // console.log({Flying,isSelected,MarkerID,color});
  const MarkerType = useMemo(() => {
    switch (MarkerID) {
      case 1:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
      case 2:
        return `fi-${isSelected ? "s" : "r"}s-land-layer-location`;
      case 3:
        return `fi-${isSelected ? "s" : "r"}s-location-alt`;
      case 4:
        return `fi-${isSelected ? "s" : "r"}s-marker-time`;
      case 10: // Shop icon
        return `fi-${isSelected ? "ss" : "rr"}-shop`;
      case 15:
        return `fi-rs-map-marker`;
      default:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
    }
  }, [isSelected, MarkerID]);
  useEffect(() => {
    if (Flying) setShadow(Flying.lat === Latitude && Flying.lng === Longitude);
  }, [Flying]);

  useEffect(() => {
    let RouteColor = "";
    Coordinates.forEach((_route, indx) => {
      let existCoor = _route.Route.find(
        (el) => el.Latitude === Latitude && el.Longitude === Longitude
      );
      if (existCoor) RouteColor = _route.RouteColor;
    });
    setIsSelected(!!RouteColor);
    setColor(
      MarkerID === 15
        ? GroupIconColor
        : RouteColor
        ? RouteColor
        : MarkerID === 10
        ? ShopIconColor
        : DefaultColor
    );
  }, [Coordinates, MarkerID]);

  return (
    <div
      className={`absolute ${
        shadow
          ? "-left-[0.35rem] -top-[1.9rem] animate-pulse "
          : "left-1 -top-1 "
      } ${Hide ? " hidden" : ""}`}>
      {
        <i
          className={`fi ${MarkerType} ${shadow ? "shadowMarker" : ""}`}
          style={{
            fontSize: shadow ? "2.3rem" : "1.6rem",
            color: color,
          }}></i>
      }

      {[10,15].includes(MarkerID) ? (
        <div
          className="absolute left-[50%] p-1  translate-x-[-50%] -bottom-3 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: color }}>
          <span className="whitespace-nowrap"> {Text}</span>
          {Index ? (
            <span className="p-1 rounded-sm bg-togglecolor text-black">
              {Index.toString()}
            </span>
          ) : null}
        </div>
      ) : Index ? (
        <span
          className="absolute w-[70%]  left-[50%]  translate-x-[-50%] bottom-0 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: color }}>
          {Index}
        </span>
      ) : null}
    </div>
  );
}

export default memo(MarkerIcon);
