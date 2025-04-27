import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function AlertModal({
  confirmFunc,
  setShowAlert,
}: {
  confirmFunc: () => void;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleClose = useCallback(() => setShowAlert(false), [setShowAlert]);
  const RemoveRouteFromLocal = useCallback(() => {
    confirmFunc();
    handleClose();
  }, [confirmFunc, handleClose]);
  return (
    <Modal
      open={true}
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
        <div className="flex flex-col gap-y-3 w-[450px]  bg-white rounded overflow-hidden">
          <div className=" flex ">
            <h2 className="close settings-modal-title">هشدار</h2>
          </div>
          <div className=" flex ">
            <span className="">
              آیا مطمئن هستید که می‌خواهید همه مسیرهای ذخیره‌شده در حافظه مرورگر
              خود را پاک کنید؟
            </span>
          </div>
          <div className="text-right mt-5 flex gap-[5px] justify-end ">
            <button
              type="button"
              className="bg-primarycolor  text-white px-5 py-[6px] ml-[10px] border  rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none"
              onClick={RemoveRouteFromLocal}
            >
              ثبت
            </button>
            <button
              type="button"
              className="bg-sidebarcolor text-black px-5 py-[6px] ml-[10px] border  rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none"
              onClick={handleClose}
            >
              بستن
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
