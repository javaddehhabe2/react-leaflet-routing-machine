import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { GetDistance, GetTime } from "../Utility";
export default function BottomLeft() {
  const { coordinates, allMarkers, timeDistance } = useAppContext();
  const [htmlOrder, setHtmlOrder] = useState(`0 از ${allMarkers.length}`);
  const [distanceInKilometers, setDistanceInKilometers] = useState(0);
  const [timeInsight, setTimeInsight] = useState(`00:00`);
  useEffect(() => {
    let selectedMarker = 0;
    coordinates.forEach((route) => {
      selectedMarker += route.Route.length;
    });
    setHtmlOrder(`${selectedMarker} از ${allMarkers.length}`);
  }, [coordinates, allMarkers]);
  useEffect(() => {
    let Distance = 0;
    coordinates.map((route) =>
      route.Route.map((_r) => (Distance += _r?.Distance ? _r?.Distance : 0))
    );

    setDistanceInKilometers(GetDistance(Distance));
    setTimeInsight(GetTime(Distance, timeDistance));
  }, [coordinates,timeDistance]);

  return (
    <div className="bg-white p-4 rounded w-52 h-44">
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-500">مسیر</span>
        <span>{coordinates.length}</span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-300 border-solid">
        <span className="text-gray-600">سفارش</span>
        <span>{htmlOrder} </span>
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
