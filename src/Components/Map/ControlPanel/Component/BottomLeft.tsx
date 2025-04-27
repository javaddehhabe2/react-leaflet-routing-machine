import React, { useEffect, useState } from "react";
// import { useAppContext } from "../context/AppContext";
import { GetDistance, GetTime } from "@Utility/Map";
import { useMapStore } from "@Store/MapStore";
import { useRouteStore } from "@Store/RouteStore";
import { Setting } from "@/Data/Map";
export default function BottomLeft() {
  const { Markers } = useMapStore();
  const { Coordinates } = useRouteStore();

  // const { coordinates, allMarkers, timeDistance } = useAppContext();
  const [selectedMarkers, setSelectedMarkers] = useState(0);
  const [distanceInKilometers, setDistanceInKilometers] = useState(0);
  const [timeInsight, setTimeInsight] = useState(`00:00`);

  useEffect(() => {
    let _selectedMarker = 0;
    Coordinates.forEach((route) => {
      _selectedMarker += route.Route.length;
    });
    setSelectedMarkers(_selectedMarker);
  }, [Coordinates]);

  useEffect(() => {
    let Distance = 0;
    Coordinates.forEach((route) =>
      route.Route.forEach((_r) => (Distance += _r?.Distance ? _r?.Distance : 0))
    );

    setDistanceInKilometers(GetDistance(Distance));
    setTimeInsight(GetTime(Distance, Setting.TimeDistance));
  }, [Coordinates]);

  return (
    <div className="bg-white p-4 rounded w-52 h-44">
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-500">مسیر</span>
        <span>{Coordinates.length}</span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-600">سفارش</span>
        <span>{`${selectedMarkers} از ${Markers.length}`} </span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-600">کیلومتر</span>
        <span>{distanceInKilometers.toFixed(2)}</span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-600">ساعت</span>
        <span>{timeInsight}</span>
      </div>
    </div>
  );
}
