import React from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { CustomizedTimeLineType } from "./Type/CustomizedTimeLineType";
import { useAppContext } from "../context/AppContext";
import { GetDistance, GetTime } from "../Utility";

export default function CustomizedTimeline({ Points }: CustomizedTimeLineType) {
  const { setFlying, timeDistance } = useAppContext();
  return (
    <ol className="relative border-s border-dashed border-gray-400 my-4 mr-3">
      {Points.Route.map((point, index) => (
        <li key={index} className="mb-10 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-White rounded-sm -start-3 bg-white border-gray-400 border ">
            <IoMdArrowRoundDown className="text-gray-400" />
          </span>
          <div className="flex w-full items-center mb-1">
            <div className="flex  flex-1 ">
              <span
                className="bg-blue-100 text-blue-400 text-xs font-medium  py-1 px-2 rounded cursor-pointer "
                onClick={() =>
                  setFlying({ lat: point.Latitude, lng: point.Longitude })
                }
              >
                {point.CustomerName.slice(0, 10) +
                  (point.CustomerName.length > 10 ? "..." : "")}
              </span>
            </div>
            <div className="flex  flex-1 ">
              <div className="flex w-full justify-around">
                <span className="text-gray-700 text-xxs font-bold">
                  {GetDistance(point?.Distance ? point.Distance : 0)} KM
                </span>
                <div className="w-[1px] bg-gray-300 mx-1"></div>
                <span className="text-gray-700 text-xxs font-bold">
                  {GetTime(point?.Distance ? point.Distance : 0, timeDistance)}
                </span>
              </div>
            </div>
          </div>

          <p className="flex items-center mb-4 text-xs font-normal text-gray-500 ">
            <span className="w-full" style={{ display: "ruby" }}>
              <HiOutlineLocationMarker />
              {point.CustomerAddress}
            </span>
          </p>
        </li>
      ))}
    </ol>
  );
}
