import {  useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

import { Setting,ColorList } from "@/Data/Map";
import { useRouteStore } from "@Store/RouteStore";

interface BarType {
  title: string;
  width: number;
  color: string;
}
export default function TimeLineBar() {
  const { SelectedRoute } = useRouteStore();
  const [bar, setBar] = useState<BarType[]>([]);

  useEffect(() => {
    if (!SelectedRoute) return;
    let AlltimeDistance = 0;

    SelectedRoute.Route.forEach((_route) => {
      AlltimeDistance +=
        (_route.Distance ? _route.Distance : 0) * Setting.TimeDistance;
    });

    let _bar: BarType[] = SelectedRoute.Route.map((_route, indx) => {
      console.log(AlltimeDistance, _route.Distance ? _route.Distance : 0);
      return {
        title: _route.CustomerName,
        width:
          (((_route.Distance ? _route.Distance : 0) * Setting.TimeDistance) /
            AlltimeDistance) *
          100,
        color: ColorList[indx % ColorList.length],
      };
    });

    setBar(_bar);
  }, [SelectedRoute]);

  return (
    <div className="flex h-4 mb-2 rounded overflow-hidden py-0 border border-solid border-togglecolor my-[10px] mx-0 p-[1px]">
      {bar.map((_bar, indx) => (
        <div
          key={`bar${indx}`}
          id={`bar${indx}`}
          className="my-[2px] mx-[1px] rounded-sm"
          title={_bar.title}
          style={{
            width: `${_bar.width}%`,
            backgroundColor: _bar.color,
          }}>
          <Tooltip anchorSelect={`#bar${indx}`} place="top">
            {_bar.title}
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
