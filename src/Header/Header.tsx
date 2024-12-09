import * as React from "react";
import { Tooltip } from "react-tooltip";
export default function Header() {
  return (
    <div className="header flex justify-between items-center px-5 py-3 absolute top-0 left-0 h-16 z-10 bg-sidebarcolor">
      <div className="relative mr-[10px]">
        <i className="fi fi-rr-search text-base text-textcolor cursor-pointer absolute right-2 top-1 "></i>
        <input className="h-8 border-none rounded bg-inputcolor w-[450px] pr-8" />
      </div>
      <div className="text-sm text-textcolor cursor-pointer flex gap-3 items-center relative">
        <div>
          <div
            className="rounded p-[6px] w-[117px] h-8 flex justify-around"
            id="calendarIcon"
          >
            <i className="fi fi-rr-calendar-days text-base"></i>
            <input
              type="text"
              id="filterDate"
              name="filterDate"
              className="w-[74px] text-center border-none pointer-events-none"
              onChange={()=>{}}
            />
          </div>
        </div>

        <div className="border-right pb-[2px]">
          <i
            className="fi fi-rr-draw-polygon hover:onhover text-base p-[5px] h-6"
            id="piloteRoute"
          >
            <Tooltip anchorSelect="#piloteRoute" place="bottom">
              گروه بندی مشتری ها
            </Tooltip>
          </i>
        </div>
        <div className=" border-right pb-[2px] block" id="menuIcon">
          <i
            className="fi fi-rr-system-cloud hover:onhover text-base  p-[5px] h-6"
            id="removeRouteFromLocalStorage"
          >
            <Tooltip anchorSelect="#removeRouteFromLocalStorage" place="bottom">
              حذف مسیر از حافظه
            </Tooltip>
          </i>
        </div>
        <div className=" border-right pb-[2px]">
          <i
            id="saveAllRoute"
            className="fi fi-rr-floppy-disks hover:onhover text-base  p-[5px] h-6"
          >
            <Tooltip anchorSelect="#saveAllRoute" place="bottom">
              ذخیره ی همه ی مسیرها
            </Tooltip>
          </i>
        </div>
        <div className=" border-right pb-[2px]">
          <i
            className="fi fi-rr-back-up hover:onhover text-base  p-[5px] h-6"
            id="toggleSavedRoute"
          >
            <Tooltip anchorSelect="#toggleSavedRoute" place="bottom">
              نمایش مسیرهای ذخیره شده
            </Tooltip>
          </i>
        </div>
        <div className=" border-right" id="exportExcell">
          <i className="fi fi-rr-file-excel text-base text-setting">
            <Tooltip anchorSelect="#exportExcell" place="bottom">
              تنظیمات
            </Tooltip>
          </i>
        </div>
        <div className=" border-right" id="setting">
          <i className="fi fi-rr-settings text-base" id=""></i>
        </div>
        <div className="hidden" id="">
          <div className="rounded" style={{ color: "rgb(255, 69, 0)" }}>
            <input
              type="text"
              className="w-[27px] cursor-pointer rounded"
              id="colorPicker"
              value="#FF5733"
              onChange={()=>{}}
            />
          </div>
        </div>

        <div className=" border-right flex gap-x-1">
          <i className="fi fi-rr-users text-base"></i>
          <span>محمد شهریاری</span>
          <i className="fi fi-rr-angle-small-down"></i>
        </div>
      </div>
    </div>
  );
}
