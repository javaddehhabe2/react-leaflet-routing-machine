import { useCallback, memo, useEffect, useState, useMemo } from "react";
import { MarkerIconType } from "../Type";
import { useRouteStore } from "@Store/RouteStore";
import { DefaultColor, ShopIconColor } from "@/Data/Map";
import { useMapStore } from "@Store/MapStore";

function MarkerIcon({
  MarkerID,
  text,
  index,
  Latitude,
  Longitude,
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
      default:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
    }
  }, [isSelected, MarkerID]);

  // useEffect(() => {
  //   console.log({Flying,MarkerType,isSelected,MarkerID,color});
  // }, [color]);

  useEffect(() => {
    if (Flying) setShadow(Flying.lat === Latitude && Flying.lng === Longitude);
  }, [Flying]);

  useEffect(() => {
    let RouteColor = "";
    Coordinates.forEach((_route, indx) => {
      let existCoor = _route.Route.find((el) => el.Latitude === Latitude && el.Longitude === Longitude);
      if (existCoor) RouteColor = _route.RouteColor;
    });
    setIsSelected(!!RouteColor);
    setColor(
      RouteColor ? RouteColor : MarkerID === 10 ? ShopIconColor : DefaultColor
    );
    // console.log( {Coordinates,RouteColor , MarkerID , ShopIconColor , DefaultColor});
  }, [Coordinates, MarkerID]);
  return (
    <div
      className={`absolute ${
        shadow
          ? "-left-[0.35rem] -top-[1.9rem] animate-pulse "
          : "left-0 -top-6 "
      }`}>
      {
        <i
          className={`fi ${MarkerType} ${shadow ? "shadowMarker" : ""}`}
          style={{
            fontSize: shadow ? "2.3rem" : "1.6rem",
            color: color,
          }}></i>
      }

      {MarkerID === 10 ? (
        <div
          className="absolute left-[50%] p-1  translate-x-[-50%] -bottom-3 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: color }}>
          <span className="whitespace-nowrap"> {text}</span>
          {index ? (
            <span className="p-1 rounded-sm bg-togglecolor text-black">
              {index.toString()}
            </span>
          ) : null}
        </div>
      ) : index ? (
        <span
          className="absolute w-[70%]  left-[50%]  translate-x-[-50%] bottom-0 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: color }}>
          {index}
        </span>
      ) : null}
    </div>
  );
}

export default memo(MarkerIcon);
