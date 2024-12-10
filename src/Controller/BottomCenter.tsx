import React, { useState, useEffect } from "react";
import { BottomCenterType, filterCustomer } from "./Type/ControllerType";
import { Tooltip } from "react-tooltip";
import { PiTruckTrailerBold } from "react-icons/pi";
import { MarkersDetail } from "../MapData";
import { TbMapPlus, TbMapMinus, TbRefresh, TbEye } from "react-icons/tb";
import { LiaTruckPickupSolid } from "react-icons/lia";
import { useAppContext } from "../context/AppContext";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function BottomCenter({
  drawLasso,
  DrawLasso,
}: BottomCenterType) {
  const [filterCustomer, setfilterCustomer] =
    useState<filterCustomer>("Disable");
  const { setAllMarkers, hideRoute, setHideRoute, setFlying } = useAppContext();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <TbEye
            size={25}
            onClick={() => {
              setFlying(undefined);
              setHideRoute((prev) => !prev);
            }}
          />
        </div>
        <Tooltip anchorSelect="#hide-tooltip">
          مخفی کردن مسیر های جدید رسم شده
        </Tooltip>
        <div
          id="guid-tooltip"
          className="p-3 cursor-pointer hover:bg-gray-200 rounded-md  mx-1"
        >
          <TbRefresh size={25} onClick={handleOpen} />
        </div>
        <Tooltip anchorSelect="#guid-tooltip">راهنما</Tooltip>
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
          width={"45%"}
          maxWidth={600}
        >
          <div className="flex flex-row-reverse justify-between border-b border-b-togglecolor">
            <h2 className="p-[10px] text-right w-full">راهنما </h2>
          </div>
          <div className=" grid grid-cols-3 gap-y-[5px]">
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-warehouse-alt text-primarycolor"></i>
                <span className="text-sm">انبار</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-marker text-primarycolor"></i>
                <span className="text-sm">مشتری</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-shop text-primarycolor"></i>
                <span className="text-sm">فروشگاه</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-location-alt text-primarycolor"></i>
                <span className="text-sm">مشتری با بارسنگین</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-marker-time text-primarycolor"></i>
                <span className="text-sm">ارسال از فروشگاه</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group guide-item">
                <i className="fi fi-rr-land-layer-location text-primarycolor"></i>
                <span className="text-sm">ارسال از فروشگاه با بارسنگین</span>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
