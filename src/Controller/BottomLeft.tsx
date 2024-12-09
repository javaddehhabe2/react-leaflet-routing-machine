import * as React from "react";
import { BottomLeftType } from "./Type/ControllerType";

export default function BottomLeft({
  routeCount,
  htmlOrder,
  distanceInKilometers,
  timeInsight,
}: BottomLeftType) {
  return (
    <div className="bg-white p-4 rounded-md border border-solid border-gray-500 w-52 h-44">
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-500">
        <span className="text-gray-600">مسیر</span>
        <span>{routeCount}</span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-500">
        <span className="text-gray-600">سفارش</span>
        <span>{htmlOrder} </span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-500">
        <span className="text-gray-600">کیلومتر</span>
        <span>{distanceInKilometers}</span>
      </div>
      <div className="flex mb-2 gap-2 justify-between p-1 text-[14px] font-medium text-black border-b-[1px] border-b-gray-500">
        <span className="text-gray-600">ساعت</span>
        <span>{timeInsight}</span>
      </div>
    </div>
  );
}
