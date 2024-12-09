import React, { useState, useEffect } from "react";
import { BottomCenterType, filterCustomer } from "./Type/ControllerType";
import { Tooltip } from "react-tooltip";
import { PiTruckTrailerBold } from "react-icons/pi";
import { MarkersDetail } from "../MapData";
import { TbMapPlus, TbMapMinus, TbRefresh, TbEye } from "react-icons/tb";
import { LiaTruckPickupSolid } from "react-icons/lia";
import { useAppContext } from "../context/AppContext";
export default function BottomCenter({
  drawLasso,
  DrawLasso,
}: BottomCenterType) {
  const [filterCustomer, setfilterCustomer] =
    useState<filterCustomer>("Disable");
  const { setAllMarkers,  hideRoute, setHideRoute } =
    useAppContext();
    // useEffect(() => {
    //   console.log(drawLasso);
    // },[drawLasso])
  useEffect(() => {
    switch (filterCustomer) {
      case "Heavy":
        const heavyMarker = MarkersDetail.filter(
          (marker) => marker.MarkerID === 1 || marker.MarkerID === 3
        );
        setAllMarkers([...heavyMarker]);
        break;
      case "Light":
        const lightMarker = MarkersDetail.filter(
          (marker) => marker.MarkerID === 2 || marker.MarkerID === 4
        );
        setAllMarkers([...lightMarker]);
        break;
      case "Disable":
        setAllMarkers([...MarkersDetail]);
        break;
    }
  }, [filterCustomer]);
  return (
    <>
      <div className="flex flex-row text-gray-950 py-2">
        <div
          id="AddLasso-tooltip"
          className={`p-3 cursor-pointer  rounded-md  mx-1 ${
            drawLasso === "Add" ? "active" : "hover:bg-gray-200"
          }`}
        >
          <TbMapPlus size={25} onClick={() => DrawLasso("Add")} />
        </div>
        <Tooltip anchorSelect="#AddLasso-tooltip">رسم روت</Tooltip>
        <div
          id="RemoveLasso-tooltip"
          className={`p-3 cursor-pointer   rounded-md  mx-1 ${
            drawLasso === "Remove" ? "active" : "hover:bg-gray-200"
          }`}
        >
          <TbMapMinus size={25} onClick={() => DrawLasso("Remove")} />
        </div>
        <Tooltip anchorSelect="#RemoveLasso-tooltip">حذف روت</Tooltip>
        <div
          id="weight-tooltip"
          className={`p-3 cursor-pointer rounded-md  mx-1 ${
            filterCustomer === "Light" ? "active" : "hover:bg-gray-200"
          }`}
        >
          <LiaTruckPickupSolid
            size={25}
            onClick={() =>
              setfilterCustomer((prev) =>
                prev === "Light" ? "Disable" : "Light"
              )
            }
          />
        </div>
        <Tooltip anchorSelect="#weight-tooltip">نمایش مشتری با بار سبک</Tooltip>
        <div
          id="heavyweight-tooltip"
          className={`p-3 cursor-pointer rounded-md mx-1 ${
            filterCustomer === "Heavy" ? "active" : "hover:bg-gray-200"
          }`}
        >
          <PiTruckTrailerBold
            size={25}
            onClick={() =>
              setfilterCustomer((prev) =>
                prev === "Heavy" ? "Disable" : "Heavy"
              )
            }
          />
        </div>
        <Tooltip anchorSelect="#heavyweight-tooltip">
          نمایش مشتری با بار سنگین
        </Tooltip>
        <div className=" border-r inline-block border-gray-500"></div>
        <div
          id="hide-tooltip"
          className={`p-3 cursor-pointer rounded-md  mx-1 ${
            hideRoute ? "active" : "hover:bg-gray-200"
          }`}
        >
          <TbEye size={25} onClick={() => setHideRoute((prev) => !prev)} />
        </div>
        <Tooltip anchorSelect="#hide-tooltip">
          مخفی کردن مسیر های جدید رسم شده
        </Tooltip>
        <div
          id="guid-tooltip"
          className="p-3 cursor-pointer hover:bg-gray-200 rounded-md  mx-1"
        >
          <TbRefresh size={25} />
        </div>
        <Tooltip anchorSelect="#guid-tooltip">راهنما</Tooltip>
      </div>
    </>
  );
}
