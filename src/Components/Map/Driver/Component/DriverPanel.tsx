import React, { useEffect, useCallback, useState } from "react";
import Driver from "./Driver";
import { DriverPanelType } from "../Type";
import { useDriversStore } from "@Store/DriverStore";

export default function DriverPanel() {
  const { Drivers } = useDriversStore();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverPanelType>();
  const [drivers, SetDrivers] = useState<DriverPanelType[]>([]);
  const [searchValue, SetSearchValue] = useState("");

  const Filter = useCallback(
    (str: string) => {
      const result: DriverPanelType[] = [];
      SetSearchValue(str);
      Drivers.forEach((_driver) => {
        if (_driver.DriverName.includes(str)) result.push(_driver);
      });
      SetDrivers(result);
    },
    [SetDrivers, Drivers]
  );

  useEffect(() => {
    SetDrivers(Drivers);
  }, [Drivers]);
  return (
    <>
      {selectedDriver ? (
        <div>
          <div className="">
            <div
              onClick={() => {
                setShowMenu((prev) => !prev);
              }}
              className="flex items-center p-[10px] border border-modalside border-solid rounded bg-white m-[5px] cursor-pointer relative justify-between">
              <Driver
                DriverName={selectedDriver.DriverName}
                NationalCode={selectedDriver.NationalCode}
                DriverTypeTitle={selectedDriver.DriverTypeTitle}
                Cars={selectedDriver.Cars}
              />
              <i className="fi fi-rr-angle-small-left font-bold text-lg"></i>
            </div>
          </div>
          <div className="bg-setting w-[96%] m-[6px] inline-block cursor-pointer text-white rounded text-sm font-medium text-center px-4 py-3">
            تخصیص راننده
          </div>
        </div>
      ) : (
        <div className="bg-white block">
          <div className="notDriverSelect" onClick={() => setShowMenu(true)}>
            <span>انتخاب راننده</span>
            <i className="fi fi-rr-angle-small-left font-bold text-lg"></i>
          </div>
        </div>
      )}

      {showMenu ? (
        <div className="drivers">
          <div className="flex items-center mb-3">
            <input
              type="search"
              className="w-full p-2 m-2 border border-modalside border-solid rounded pr-7"
              placeholder="جستجو..."
              value={searchValue}
              onChange={(e) => {
                Filter(e.currentTarget.value);
              }}
            />
            <button
              type="button"
              className="p-2 bg-transparent border-none cursor-pointer absolute right-2 top-3">
              <i className="fi fi-rr-search"></i>
            </button>
          </div>
          <div className="h-full overflow-auto">
            <div
              className="overflow-auto"
              style={{ height: "calc(100% - 135px)" }}>
              {drivers.map((_driver, ind) => (
                <div
                  onClick={() => {
                    setSelectedDriver(_driver);
                    setShowMenu(false);
                  }}
                  key={`driver_${ind}`}
                  className="flex items-center p-[10px] border border-modalside border-solid rounded bg-white m-[5px] cursor-pointer relative">
                  <Driver
                    DriverName={_driver.DriverName}
                    NationalCode={_driver.NationalCode}
                    DriverTypeTitle={_driver.DriverTypeTitle}
                    Cars={_driver.Cars}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
