import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useAppContext } from "../context/AppContext";
import { Storage } from "../Storage/Storage";
import { SettingsType } from "../LeafletType";

export default function SettingModal({
  setShowSetting,
}: {
  setShowSetting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleClose = useCallback(
    () => setShowSetting(false),
    [setShowSetting]
  );
  const {
    timeDistance,
    fixedWorkingHours,
    vanVolume,
    isuzuVolume,
    saveToLocal,
    setTimeDistance,
    setFixedWorkingHours,
    setVanVolume,
    setIsuzuVolume,
    setSaveToLocal,
  } = useAppContext();

  const AcceptModal = useCallback(() => {
    if (saveToLocal) {
      const _setting: SettingsType = {
        TimeDistance: timeDistance ?? 0,
        FixedWorkingHours: fixedWorkingHours ?? 0,
        VanVolume: vanVolume ?? 0,
        IsuzuVolume: isuzuVolume ?? 0,
        SaveToLocal: saveToLocal ?? false,
      };
      Storage.setLocal("LS_Settings", JSON.stringify(_setting));
    }
    handleClose();
  }, [
    handleClose,
    timeDistance,
    fixedWorkingHours,
    vanVolume,
    isuzuVolume,
    saveToLocal,
  ]);
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
          <div className="p-5 flex-1 text-white overflow-y-auto relative flex flex-col gap-y-3">
            <div className="text-textcolor mb-7 flex justify-between">
              <h2>عمومی</h2>
              <span
                className="cursor-pointer text-close text-[28px] font-bold float-right hover:text-black"
                onClick={handleClose}
              >
                ×
              </span>
            </div>
            <div className="flex flex-col gap-5 flex-grow">
              <div className="text-textcolor">
                <div className="setting-item">
                  <label>مدت زمان به ازای هر یک کیلومتر</label>
                  <input
                    type="number"
                    min="0"
                    value={timeDistance}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTimeDistance(Number(e.currentTarget.value))
                    }
                  />
                  <span>در دقیقه</span>
                </div>
                <div className="setting-item">
                  <label>مدت زمان روز کاری</label>
                  <input
                    type="number"
                    min="0"
                    value={fixedWorkingHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFixedWorkingHours(Number(e.currentTarget.value))
                    }
                  />
                  <span>دقیقه در روز</span>
                </div>
                <div className="setting-item">
                  <label>حجم ماشین سبک</label>
                  <input
                    type="number"
                    min="0"
                    value={vanVolume}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVanVolume(Number(e.currentTarget.value))
                    }
                  />
                  <span>متر مکعب</span>
                </div>
                <div className="setting-item">
                  <label>حجم ماشین سنگین</label>
                  <input
                    type="number"
                    min="0"
                    value={isuzuVolume}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setIsuzuVolume(Number(e.currentTarget.value))
                    }
                  />
                  <span>متر مکعب</span>
                </div>
                <div className="setting-item">
                  <label>ذخیره در لوکال</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      defaultChecked={saveToLocal}
                      onChange={(e) => setSaveToLocal(e.target.checked)}
                    />
                    <span className="switch-slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="text-right flex gap-[5px] justify-end">
              <button
                type="button"
                className=" bg-primarycolor text-sidebarcolor px-5 py-[6px] ml-[10px] border border-primarycolor rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none"
                onClick={AcceptModal}
              >
                ذخیره
              </button>

              <button
                type="button"
                className="bg-sidebarcolor text-primarycolor px-5 py-[6px] ml-[10px] border border-primarycolor rounded cursor-pointer  text-center w-[106px] hover:opacity-90 active:border-none"
                onClick={handleClose}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
