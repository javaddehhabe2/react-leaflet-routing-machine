import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Divider, Button } from "@mui/material";

import { RouteDetailsType } from "./Type/RouteDetailsType";
import AddIcon from "@mui/icons-material/Add";
import CustomizedTimeLine from "../TimeLine/CustomizedTimeLine";
import { useAppContext } from "../context/AppContext";
import { PiTruckTrailerBold } from "react-icons/pi";
import { GetDistance, GetTime } from "../Utility";
import Driver from "../Driver/Driver";

export default function RouteDetails({ Points, Detail }: RouteDetailsType) {
  const { NewRoute, coordinates, currentRouteIndex, routeDetail } =
    useAppContext();
  const [distanceInKilometers, setDistanceInKilometers] = useState(`0`);
  const [timeInsight, setTimeInsight] = useState(`00:00:00`);
  const [productCount, setProductCount] = useState(0);
  const [unloadingCount, setUnloadingCount] = useState(0);

  useEffect(() => {
    if (routeDetail[currentRouteIndex]) {
      setDistanceInKilometers(
        GetDistance(
          routeDetail[currentRouteIndex]?.Distance
            ? Number(routeDetail[currentRouteIndex].Distance)
            : 0
        )
      );
      setTimeInsight(
        GetTime(
          routeDetail[currentRouteIndex]?.Time
            ? Number(routeDetail[currentRouteIndex].Time)
            : 0
        ) + ":00"
      );
    } else {
      setDistanceInKilometers(`0`);
      setTimeInsight(`00:00:00`);
    }
  }, [routeDetail, currentRouteIndex]);

  useEffect(() => {
    if (
      coordinates[currentRouteIndex] &&
      coordinates[currentRouteIndex].Route.length
    ) {
      setProductCount(coordinates[currentRouteIndex].Route.length);
      let _count = 0;
      coordinates[currentRouteIndex].Route.map((_route) => {
        _count += _route.Products ? _route.Products.length : 0;
      });
      setProductCount(_count);

      setUnloadingCount(coordinates[currentRouteIndex].Route.length);
    } else {
      setProductCount(0);
      setUnloadingCount(0);
    }
  }, [coordinates, currentRouteIndex]);
  return (
    <Card
      sx={{ width: "320px", height: "100vh" }}
      className="font-display absolute z-10"
    >
      <div
        className="flex rounded mb-5 h-16 bg-primarycolor text-white justify-between p-4"
        style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
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
          <div className="flex items-center gap-2 flex-row-reverse bg-white text-setting p-2 rounded text-xs font-bold">
            <i className="fi fi-rr-check text-sm"></i>
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

      <Divider />
      <CardContent>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon className="ml-1" />}
          style={{ marginBottom: "1em", alignItems: "end" }}
          className="w-full text-sm !bg-setting !text-white"
          onClick={NewRoute}
        >
          جدید
        </Button>
        <Driver/>
        <Divider />
        <div className="flex flex-col py-4">
          <div className="flex flex-row align-baseline">
            <div className="flex  flex-1 ">
              <span className="text-gray-700 text-sm font-bold">
                جدول زمانی
              </span>
            </div>
            <div className="flex  flex-1 items-end">
              <div className="flex w-full justify-around">
                <span className="text-gray-700 text-sm font-bold" dir={"ltr"}>
                  {`${distanceInKilometers} KM`}
                </span>
                <div className="w-[1px] bg-gray-300  mx-1 "></div>
                <span className="text-gray-700 text-sm font-bold">
                  {timeInsight}
                </span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <Divider />
        <div className="flex my-4 flex-col">
          <div className="flex  w-full my-1">
            <div className="flex flex-1 items-center">
              <span className="text-gray-500 text-sm font-normal">
                تعداد کالا:
              </span>
              <span className="text-gray-700 text-sm font-bold">
                {productCount} عدد
              </span>
            </div>
            <div className="flex flex-1">
              <span className="text-gray-500 text-sm font-normal">
                تعداد تخلیه:
              </span>
              <span className="text-gray-700 text-sm font-bold">
                {" "}
                {unloadingCount} مرتبه
              </span>
            </div>
          </div>
          <div className="flex w-full  my-1 ">
            <div className="flex flex-1 items-center">
              <span className="text-gray-500 text-sm font-normal">
                ظرفیت زمانی :
              </span>
              <span className="text-gray-700 text-sm font-bold">38.4%</span>
            </div>
            <div className="flex flex-1">
              <span className="text-gray-500 text-sm font-normal">
                ظرفیت حجمی:
              </span>
              <span className="text-gray-700 text-sm font-bold">46.5%</span>
            </div>
          </div>
        </div>
        <Divider />
        <div className="overflow-y-auto w-full h-[60vh] no-scrollbar">
          {Points && Points.Route.length > 0 ? (
            <CustomizedTimeLine Points={Points} />
          ) : (
            <div className="flex flex-col justify-center items-center mt-8">
              {" "}
              <div>
                <PiTruckTrailerBold size={40} />{" "}
              </div>{" "}
              <p className="text-md text-gray-700 font-bold">
                هنوز مسیری ایجاد نشده{" "}
              </p>{" "}
            </div>
          )}
        </div>
        <Divider />
        <div className="flex flex-row my-2 justify-around sticky bottom-1 bg-white">
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
        </div>
      </CardContent>
    </Card>
  );
}
