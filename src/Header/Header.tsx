import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SearchInput from "./SearchInput";
export default function Header() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="header flex justify-between items-center px-5 py-3 absolute top-0 left-0 h-16 z-10 bg-sidebarcolor">
        <SearchInput/>
        {/* <div className="relative mr-[10px]">
          <i className="fi fi-rr-search text-base text-textcolor cursor-pointer absolute right-2 top-1 "></i>
          <input className="h-8 border-none rounded bg-inputcolor w-[450px] pr-8" />
        </div> */}
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
            <i className="fi fi-rr-file-excel text-base text-setting">
              <Tooltip anchorSelect="#exportExcell" place="bottom">
                تنظیمات
              </Tooltip>
            </i>
          </div>
          <div className=" border-right" id="setting">
            <i className="fi fi-rr-settings text-base" onClick={handleOpen} ></i>
          </div>
         

          <div className=" border-right flex gap-x-1">
            <i className="fi fi-rr-users text-base"></i>
            <span>محمد شهریاری</span>
            <i className="fi fi-rr-angle-small-down"></i>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box
          style={{ transform: "translate(-50%, -50%)" }}
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          padding={"20px"}
          bgcolor={"#fefefe"}
          border={1}
          borderColor={"#888"}
          borderRadius={3}
          margin={0}
          boxSizing={"border-box"}

        >
          <div className="flex w-[850px] h-[550px] bg-white rounded overflow-hidden">
            <div className="w-[220px] bg-bodycolor py-5 flex flex-col">
              <h2 className="close settings-modal-title">تنظیمات</h2>
              <ul className="list-none p-0 m-0">
                <li className="py-4 px-5 cursor-pointer flex gap-[10px] text-modalside settingLI active_li">
                  <i className="fi fi-rr-settings mr-[10px]" id=""></i>
                  <span className="">عمومی</span>
                </li>
              </ul>
            </div>
            <form className="p-5 flex-1 text-white overflow-y-auto relative">
              <div className="text-textcolor mb-7 flex justify-between">
                <h2>عمومی</h2>
                <span className="cursor-pointer text-close text-[28px] font-bold float-right hover:text-black"  onClick={handleClose}>×</span>
              </div>
              <div className="flex flex-col gap-5">
                <div className="text-textcolor">
                  <div className="setting-item">
                    <label>مدت زمان به ازای هر یک کیلومتر</label>
                    <input type="number" min="0" id="timeDistance" />
                    <span>در دقیقه</span>
                  </div>
                  <div className="setting-item">
                    <label>مدت زمان روز کاری</label>
                    <input type="number" min="0" id="fixedWorkingHours" />
                    <span>دقیقه در روز</span>
                  </div>
                  <div className="setting-item">
                    <label>حجم ماشین سبک</label>
                    <input type="number" min="0" id="vanVolume" />
                    <span>متر مکعب</span>
                  </div>
                  <div className="setting-item">
                    <label>حجم ماشین سنگین</label>
                    <input type="number" min="0" id="isuzuVolume" />
                    <span>متر مکعب</span>
                  </div>
                  <div className="setting-item">
                    <label>ذخیره در لوکال</label>
                    <label className="switch">
                      <input type="checkbox" id="saveToLocal" />
                      <span className="switch-slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-right mt-5 absolute bottom-3 left-0 flex gap-[5px] justify-center ml-[10px]">
                <input type="submit" className="px-5 py-[6px] bg-primarycolor text-sidebarcolor rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none" value="ذخیره" />
                <button type="button" className="bg-sidebarcolor text-primarycolor px-5 py-[6px] ml-[10px] border border-primarycolor rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none">
                  بستن
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}
