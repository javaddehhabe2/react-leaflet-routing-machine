import React, { useCallback, useState } from "react";
import { Tooltip } from "react-tooltip";
import SearchInput from "./SearchInput";
import { Storage } from "../Storage/Storage";
import AlertModal from "./AlertModal";
import SettingModal from "./SettingModal";

import GetCSV from "./GetCSV";

export default function Header() {
  const [showSettingMenu, setShowSettingMenu] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const RemoveRouteFromLocal = useCallback(() => {
    Storage.removeLocal("LS_Route");
    Storage.removeLocal("LS_Route_Detail");
  }, []);

  return (
    <>
      <div className="header flex justify-between items-center px-5 py-3 absolute top-0 left-0 h-16 z-10 bg-sidebarcolor">
        <SearchInput />
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
                onChange={() => {}}
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
              onClick={() => setShowAlert(true)}
            >
              <Tooltip
                anchorSelect="#removeRouteFromLocalStorage"
                place="bottom"
              >
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
            <GetCSV />
              <Tooltip anchorSelect="#exportExcell" place="bottom">
                خروجی اکسل
              </Tooltip>
          </div>
          <div
            className=" border-right flex gap-x-1"
            onClick={() => setShowSettingMenu((prev) => !prev)}
          >
            <i className="fi fi-rr-users text-base"></i>
            <span>محمد شهریاری</span>
            <i className="fi fi-rr-angle-small-down"></i>

            {showSettingMenu ? (
              <div className="block absolute top-10 left-0 bg-white shadow-sm shadow-black rounded z-50 w-[150px]  ">
                <ul>
                  <li
                    className="border-b border-b-modalside flex pr-2 py-2 items-center"
                    onClick={() => setShowSetting(true)}
                  >
                    <i className="fi fi-rr-settings mr-2"></i>
                    <span className="text-sm font-medium pb-1 pr-1">
                      تنظیمات
                    </span>
                  </li>
                  <li className="border-b border-b-modalside flex pr-2 items-center py-2 ">
                    <i className="fi fi-rr-exit  mr-2" title="خروج"></i>
                    <a
                      href="/Account/LogOut"
                      className="text-sm font-medium  pb-1 pr-1"
                    >
                      خروج
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {showAlert ? (
        <AlertModal
          confirmFunc={RemoveRouteFromLocal}
          setShowAlert={setShowAlert}
        />
      ) : null}
      {showSetting ? <SettingModal setShowSetting={setShowSetting} /> : null}
    </>
  );
}
