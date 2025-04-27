import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, Divider, Button } from "@mui/material";

import { RouteDetailsType } from "./Type/RouteDetailsType";
import AddIcon from "@mui/icons-material/Add";
import CustomizedTimeLine from "../TimeLine/CustomizedTimeLine";
import { useAppContext } from "../context/AppContext";
import { PiTruckTrailerBold } from "react-icons/pi";
import { GetDistance, GetTime } from "../Utility";
import Driver from "../Driver/Driver";
// import TimeLineBar from "./TimeLineBar";

export default function RouteDetails({ Points }: RouteDetailsType) {
  const {
    NewRoute,
    coordinates,
    currentRouteIndex,
    showDriver,
    timeDistance,
    fixedWorkingHours,
  } = useAppContext();
  const [distanceInKilometers, setDistanceInKilometers] = useState(0);
  const [timeInsight, setTimeInsight] = useState(`00:00:00`);
  const [productCount, setProductCount] = useState(0);
  const [unloadingCount, setUnloadingCount] = useState(0);

  useEffect(() => {
    if (
      coordinates[currentRouteIndex] &&
      coordinates[currentRouteIndex].Route.length
    ) {
      setProductCount(coordinates[currentRouteIndex].Route.length);
      let _count = 0;
      coordinates[currentRouteIndex].Route.forEach((_route) => {
        _count += _route.Products ? _route.Products.length : 0;
      });
      setProductCount(_count);

      setUnloadingCount(coordinates[currentRouteIndex].Route.length);

      let Distance = 0;
      coordinates[currentRouteIndex].Route.forEach(
        (_r) => (Distance += _r?.Distance ? _r?.Distance : 0)
      );

      setDistanceInKilometers(GetDistance(Distance));
      setTimeInsight(GetTime(Distance, timeDistance));
    } else {
      setProductCount(0);
      setUnloadingCount(0);
      setDistanceInKilometers(GetDistance(0));
      setTimeInsight(GetTime(0, timeDistance));
    }
  }, [coordinates, currentRouteIndex, timeDistance]);

  const EstimationOfDeliveryPercent = useCallback(() => {
    return (
      ((distanceInKilometers * timeDistance) / (fixedWorkingHours * 60)) *
      100
    ).toFixed(2); // ظرفیت زمانی
  }, [timeDistance, fixedWorkingHours, distanceInKilometers]);
  return (
    <div className="font-display absolute z-10 w-[320px] h-[100vh] bg-white text-sm font-medium flex flex-col">
      <div
        className="flex mb-4 h-16 bg-primarycolor text-white justify-between p-4"
      >
        <div className="text-base font-bold flex items-center gap-[6px]">
          <div className="flex items-center">
            <div className="flex items-center justify-center gap-[5px]">
              <img
                src="./Dorna.png"
                alt="Profile"
                className="w-9 h-full object-cover"
              />
              <span className="text-[22px] font-bold text-white">درنا</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 flex-row-reverse bg-white text-setting p-1 rounded text-xs font-bold">
            <i className="fi fi-rr-check text-sm flex items-center"></i>
            <span> برنامه ریزی شده</span>
          </div>
          {/* <div className="route-status not-planned" style="display: flex;">
                برنامه ریزی نشده
            </div>
            <div className="route-status planning" style="display:none">
                در حال برنامه ریزی
            </div> */}
        </div>
      </div>

      <div className="flex flex-col px-3">
        {showDriver ? (
          <Driver />
        ) : (
          <div className="text-[16px] gap-[13px] flex  w-full h-10 bg-setting text-white items-center cursor-pointer rounded justify-center bg-center "  onClick={NewRoute}>
            <i className="fi fi-rr-plus flex items-center"></i>
            <span>جدید</span>
        </div>
        
        )}
      </div>

      <div className="flex flex-col py-2 px-3 mt-3 border-y border-y-togglecolor border-solid">
        <div className="flex flex-row align-baseline">
          <div className="flex  flex-1 ">
            <span className="text-gray-700 text-sm font-bold">جدول زمانی</span>
          </div>
          <div className="flex  flex-1 items-end">
            <div className="flex w-full justify-around">
              <span className="text-gray-700 text-sm font-bold" dir={"ltr"}>
                {`${distanceInKilometers.toFixed(2)} KM`}
              </span>
              <div className="w-[1px] bg-gray-300  mx-1 "></div>
              <span className="text-gray-700 text-sm font-bold">
                {timeInsight}
              </span>
            </div>
          </div>
        </div>
        {/* <TimeLineBar /> */}
      </div>

      <div className="flex p-3 flex-col border-b border-b-togglecolor border-solid">
        <div className="flex  w-full my-1">
          <div className="flex flex-1 items-center">
            <span className="text-gray-500">
              تعداد کالا:
            </span>
            <span className="text-gray-700 ">
              {productCount} عدد
            </span>
          </div>
          <div className="flex flex-1">
            <span className="text-gray-500">
              تعداد تخلیه:
            </span>
            <span className="text-gray-700">
              {unloadingCount} مرتبه
            </span>
          </div>
        </div>
        <div className="flex w-full  my-1 ">
          <div className="flex flex-1 items-center">
            <span className="text-gray-500">
              ظرفیت زمانی :
            </span>
            <span className="text-gray-700 ">
              {EstimationOfDeliveryPercent()}%
            </span>
          </div>
          <div className="flex flex-1">
            <span className="text-gray-500">
              ظرفیت حجمی:
            </span>
            <span className="text-gray-700">46.5%</span>
          </div>
        </div>
      </div>

      <div className=" mr-3 overflow-y-auto h-full max-h-full flex-1 ">
        {Points && Points.Route.length > 0 ? (
          <CustomizedTimeLine Points={Points} />
        ) : (
          <div className="flex flex-col justify-center items-center mt-8">
            <div>
              <PiTruckTrailerBold size={40} />
            </div>
            <p className="text-md text-gray-700 font-bold">
              هنوز مسیری ایجاد نشده
            </p>
          </div>
        )}
      </div>

      {/* <div className="flex flex-row my-2 justify-around sticky bottom-1 bg-white">
        <div className="flex">
          <label
            htmlFor="Toggle3"
            className="inline-flex items-center p-2 my-2 rounded-md cursor-pointer"
          >
            <input id="Toggle3" type="checkbox" className="hidden peer" />
            <span className="px-4 py-2 rounded-r-md bg-violet-600 text-gray-200">
              سنگین
            </span>
            <span className="px-4 py-2 rounded-l-md bg-gray-200 text-gray-700">
              سبک
            </span>
          </label>
        </div>
        <div className="flex">
          <Button
            variant="contained"
            size="small"
            style={{
              marginTop: "1.5em",
              marginBottom: "1.5em",
              backgroundColor: "rgb(107 114 128)",
            }}
            className="w-full text-sm "
          >
            ثبت مسیر
          </Button>
        </div>
      </div> */}


      <div className="flex p-4 items-center bg-white m-0 border-y border-y-togglecolor border-solid">

        <div className="text-sm flex flex-row justify-between flex-1 items-center">
            <div>
                
                <div className="flex bg-gray-200 p-2 rounded w-40 justify-between items-center border border-solid border-togglecolor">
                    <div className="flex flex-row-reverse cursor-pointer bg-indigo-500 p-2 rounded text-white w-24 justify-center gap-[12px]">
                    <i className="fi fi-rr-truck-moving"></i>
                    <span>سنگین</span>
                    </div>
                    <div className="flex flex-row-reverse cursor-pointer gap-[3px]">
                <i className="fi fi-rr-truck-pickup hidden"></i>
                <span>سبک</span>
              </div>
                </div>
            </div>
            <span className="cursor-pointer bg-gray-500 text-white rounded-sm text-base font-medium w-24 h-10 text-center flex justify-center items-center">
            ثبت مسیر
          </span>
        </div>
    </div>



    </div>
  );
}
