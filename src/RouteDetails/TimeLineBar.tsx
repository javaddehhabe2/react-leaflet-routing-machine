import { useCallback, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

import { useAppContext } from "../context/AppContext";

import { ColorList } from "../MapData";

interface BarType {
  title: string;
  width: number;
  color: string;
}
export default function TimeLineBar() {
  const { coordinates, currentRouteIndex, timeDistance } = useAppContext();

  const [bar, setBar] = useState<BarType[]>([]);

  useEffect(() => {
    if (!coordinates[currentRouteIndex]) return;
    let AlltimeDistance = 0;

    coordinates[currentRouteIndex].Route.forEach((_route) => {
      AlltimeDistance += (_route.Distance ? _route.Distance : 0) * timeDistance;
    });

    let _bar: BarType[] = coordinates[currentRouteIndex].Route.map(
      (_route, indx) => {
        console.log(AlltimeDistance,(_route.Distance ? _route.Distance : 0));
        return {
          title: _route.CustomerName,
          width:
            (((_route.Distance ? _route.Distance : 0) * timeDistance) / AlltimeDistance) * 100,
          color: ColorList[indx % ColorList.length],
        };
      }
    );

    setBar(_bar);
  }, [coordinates, currentRouteIndex, timeDistance]);

  return (
    <div className="flex h-4 mb-2 rounded overflow-hidden py-0 border border-togglecolor my-[10px] mx-0 p-[1px]">
      {bar.map((_bar, indx) => (
        <div
          key={`bar${indx}`}
          id={`bar${indx}`}
          className="my-[2px] mx-[1px] rounded-sm"
          title={_bar.title}
          style={{
            width: `${_bar.width}%`,
            backgroundColor: _bar.color,
          }}
        >
          <Tooltip anchorSelect={`#bar${indx}`} place="top">
            {_bar.title}
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
