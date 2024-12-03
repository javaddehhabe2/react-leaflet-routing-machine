import * as React from "react";
import { Card, CardContent, Typography, Divider, Button } from "@mui/material";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { RouteDetailsType } from "./Type/RouteDetailsType";
import AddIcon from "@mui/icons-material/Add";
import CustomizedTimeLine from "../TimeLine/CustomizedTimeLine";

export default function RouteDetails({ Points, Detail }: RouteDetailsType) {
  return (
    <Card sx={{ maxWidth: 250 }} className="font-display">
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
       <div className="overflow-y-auto w-full h-[50vh] no-scrollbar"> <CustomizedTimeLine Points={Points} /></div>
      </CardContent>
    </Card>
  );
}
