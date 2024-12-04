import * as React from "react";
import { Card, CardContent, Typography, Divider, Button } from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { RouteDetailsType } from "./Type/RouteDetailsType";
import AddIcon from "@mui/icons-material/Add";
import CustomizedTimeLine from "../TimeLine/CustomizedTimeLine";
import { useAppContext } from "../context/AppContext";
import { PiTruckTrailerBold } from "react-icons/pi";

export default function RouteDetails({ Points, Detail }: RouteDetailsType) {
  const { NewRoute } = useAppContext();
  return (
    <Card
      sx={{ width: "25%", height: "100vh" }}
      className="font-display absolute z-10"
    >
      <div className="flex bg-blue-600 pt-4 pb-4 text-gray-200  ">
        <div className="flex grow mr-4 items-center">
          <WarehouseIcon />
          <span className="p-1 font-bold text-sm">انبار یاقوت</span>
        </div>
        <div className="flex ml-4">
          <span className="p-1 bg-blue-400 font-thin text-xxs rounded-sm">
            برنامه ریزی نشده
          </span>
        </div>
      </div>
      <Divider />
      <CardContent>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<AddIcon className="ml-1" />}
          style={{ marginBottom: "1em", alignItems: "end" }}
          className="w-full text-xs "
          onClick={NewRoute}
        >
          جدید
        </Button>
        <Divider />
        <div className="flex flex-col py-4">
          <div className="flex flex-row align-baseline">
            <div className="flex  flex-1 ">
              {" "}
              <span className="text-gray-700 text-xs font-bold">
                جدول زمانی
              </span>
            </div>
            <div className="flex  flex-1 items-end">
              {" "}
              <div className="flex w-full justify-around">
                <span className="text-gray-700 text-xxs font-bold">0 KM</span>
                <div className="w-[1px] bg-gray-300  mx-1 "></div>
                <span className="text-gray-700 text-xxs font-bold">
                  00:00:00
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
              <span className="text-gray-500 text-xs font-normal">
                تعداد کالا:
              </span>
              <span className="text-gray-700 text-xs font-bold">6 عدد</span>
            </div>
            <div className="flex flex-1">
              <span className="text-gray-500 text-xs font-normal">
                تعداد تخلیه:
              </span>
              <span className="text-gray-700 text-xs font-bold">6 مرتبه</span>
            </div>
          </div>
          <div className="flex w-full  my-1 ">
            <div className="flex flex-1 items-center">
              <span className="text-gray-500 text-xs font-normal">
                ظرفیت زمانی :
              </span>
              <span className="text-gray-700 text-xs font-bold">38.4%</span>
            </div>
            <div className="flex flex-1">
              <span className="text-gray-500 text-xs font-normal">
                ظرفیت حجمی:
              </span>
              <span className="text-gray-700 text-xs font-bold">46.5%</span>
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
              className="w-full text-xs "
            >
              ثبت مسیر
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
