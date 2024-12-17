import React, { Fragment, useCallback, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { DriverType } from "../DriverType";

export default function Driver() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverType>();

  return (
    <>
      {selectedDriver ? (
        <div>
          <div className="">
            <div
              onClick={() => {
                setShowMenu((prev) => !prev);
              }}
              className="flex items-center p-[10px] border border-modalside rounded bg-white m-[5px] cursor-pointer relative justify-between"
            >
              <div className="flex items-center gap-[10px]">
                <i className="fi fi-rr-driver-man profile-image"></i>
                <div className="item-details">
                  <h3 className="m-0 text-[16px] ">
                    {selectedDriver.DriverName}
                  </h3>
                  <span className="text-xs text-textcolor">
                    {selectedDriver.NationalCode}{" "}
                    {selectedDriver.DriverTypeTitle}
                  </span>

                  <p className="m-0 text-gray-400 flex items-center gap-[5px] pt-[5px] text-sm">
                    {selectedDriver.Cars?.map((_car,_index) => (
                      <Fragment   key={`driver__${_index}`}>
                        <span className="flex flex-row border border-togglecolor rounded items-center text-textcolor text-xs">
                          <span className="border-l border-l-togglecolor p-[5px] text-textcolor text-xs">
                            {_car.PlaqueNumberFourth}
                          </span>
                          <span className="p-[5px] text-textcolor text-xs">
                            {_car.PlaqueNumberFirst}
                            {_car.PlaqueNumberSecond}
                            {_car.PlaqueNumberThird}
                          </span>
                        </span>
                        {_car.CarTypeID === 2 ? (
                          <i className="fi fi-rr-truck-moving w-[21px] h-[21px] inline-block p-[3px] rounded font-bold heavy" />
                        ) : (
                          <i className="fi fi-rr-truck-pickup w-[21px] h-[21px] inline-block p-[3px] rounded font-bold light" />
                        )}
                      </Fragment>
                    ))}
                  </p>
                </div>
              </div>
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
            <span className="font-bold text-lg">انتخاب راننده</span>
            <i className="fi fi-rr-angle-small-left font-bold text-lg"></i>
          </div>
        </div>
      )}

      {showMenu ? (
        <AllDrivers
          setSelectedDriver={setSelectedDriver}
          setShowMenu={setShowMenu}
        />
      ) : null}
    </>
  );
}

function AllDrivers({
  setSelectedDriver,
  setShowMenu,
}: {
  setSelectedDriver: React.Dispatch<
    React.SetStateAction<DriverType | undefined>
  >;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { allDrivers } = useAppContext();
  const [drivers, SetDrivers] = useState(allDrivers);
  const [searchValue, SetSearchValue] = useState("");
  const Filter = useCallback(
    (str: string) => {
      const result: DriverType[] = [];
      SetSearchValue(str);
      allDrivers.forEach((_driver) => {
        if (_driver.DriverName.includes(str)) result.push(_driver);
      });
      SetDrivers(result);
    },
    [SetDrivers, allDrivers]
  );
  return (
    <>
      <div className="drivers">
        <div className="flex items-center mb-3">
          <input
            type="search"
            className="w-full p-2 m-2 border border-modalside rounded pr-7"
            placeholder="جستجو..."
            value={searchValue}
            onChange={(e) => {
              Filter(e.currentTarget.value);
            }}
          />
          <button
            type="button"
            className="p-2 bg-transparent border-none cursor-pointer absolute right-2 top-3"
          >
            <i className="fi fi-rr-search"></i>
          </button>
        </div>
        <div className="h-full overflow-auto">
          <div
            className="overflow-auto"
            style={{ height: "calc(100% - 135px)" }}
          >
            {drivers.map((_driver, ind) => (
              <div
                onClick={() => {
                  setSelectedDriver(_driver);
                  setShowMenu(false);
                }}
                key={`driver_${ind}`}
                className="flex items-center p-[10px] border border-modalside rounded bg-white m-[5px] cursor-pointer relative"
              >
                <div className="flex items-center gap-[10px]">
                  <i className="fi fi-rr-driver-man profile-image"></i>
                  <div className="item-details">
                    <h3 className="m-0 text-[16px] ">{_driver.DriverName}</h3>
                    <span className="text-xs text-textcolor">
                      {_driver.NationalCode} {_driver.DriverTypeTitle}
                    </span>

                    <p className="m-0 text-gray-400 flex items-center gap-[5px] pt-[5px] text-sm">
                      {_driver.Cars?.map((_car, indx) => (
                        <Fragment key={`car_${indx}_${ind}`}>
                          <span className="flex flex-row border border-togglecolor rounded items-center text-textcolor text-xs">
                            <span className="border-l border-l-togglecolor p-[5px] text-textcolor text-xs">
                              {_car.PlaqueNumberFourth}
                            </span>
                            <span className="p-[5px] text-textcolor text-xs">
                              {_car.PlaqueNumberFirst}
                              {_car.PlaqueNumberSecond}
                              {_car.PlaqueNumberThird}
                            </span>
                          </span>
                          {_car.CarTypeID === 2 ? (
                            <i className="fi fi-rr-truck-moving w-[21px] h-[21px] inline-block p-[3px] rounded font-bold heavy" />
                          ) : (
                            <i className="fi fi-rr-truck-pickup w-[21px] h-[21px] inline-block p-[3px] rounded font-bold light" />
                          )}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
