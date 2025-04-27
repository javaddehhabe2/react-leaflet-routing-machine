import React from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { GetDistance, GetTime } from "@Utility/Map";
import { useRouteStore } from "@Store/RouteStore";
import { PiTruckTrailerBold } from "react-icons/pi";
import { Setting } from "@/Data/Map";
import { useMapStore } from "@Store/MapStore";
export default function CustomizedTimeline() {
  // const { setFlying, timeDistance } = useAppContext();
  const { SelectedRoute } = useRouteStore();
  const { setFlying } = useMapStore();
  return SelectedRoute ? (
    <ol className="relative border-s border-dashed border-gray-400 my-4 mr-4  ">
      {SelectedRoute.Route.map((point, index) => (
        <li key={index} className="mb-10 ms-6">
          <span className="absolute flex items-end justify-center w-8 h-8 bg-White rounded -start-3 bg-white border-modalside border-[2px] border-solid -right-4">
            <i className="fi fi-rr-arrow-small-down text-modalside text-[16px]"></i>
          </span>
          <div className="flex w-full items-center mb-1">
            <div className="flex  flex-1 ">
              <span
                className="bg-bodycolor text-primarycolor text-[15px]  py-1 px-2 rounded cursor-pointer "
                onClick={() =>
                  setFlying({ lat: point.Latitude, lng: point.Longitude })
                }>
                {point.CustomerName.slice(0, 10) +
                  (point.CustomerName.length > 10 ? "..." : "")}
              </span>
            </div>
            <div className="flex  flex-1 ">
              <div className="flex w-full justify-around text-[16px] items-center">
                <span className="">
                  {GetDistance(point?.Distance ? point.Distance : 0).toFixed(2)}{" "}
                  KM
                </span>
                <span className="border-r-togglecolor border-r-[1px] border-solid pr-1">
                  {GetTime(
                    point?.Distance ? point.Distance : 0,
                    Setting.TimeDistance
                  )}
                </span>
              </div>
            </div>
          </div>

          <p className="flex items-center mb-4 text-[13px] text-black ">
            <span className="w-full" style={{ display: "ruby" }}>
              <HiOutlineLocationMarker />
              {point.CustomerAddress}
            </span>
          </p>
        </li>
      ))}
    </ol>
  ) : (
    <div className="flex flex-col justify-center items-center mt-8">
      <div>
        <PiTruckTrailerBold size={40} />
      </div>
      <p className="text-md text-gray-700 font-bold">هنوز مسیری ایجاد نشده</p>
    </div>
  );
}
