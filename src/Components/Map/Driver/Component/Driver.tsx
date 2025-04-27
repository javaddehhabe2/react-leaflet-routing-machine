import React, { Fragment, useCallback, useState } from "react";

import { DriverType } from "../Type";

export default function Driver({
  DriverName,
  NationalCode,
  DriverTypeTitle,
  Cars,
}: DriverType) {
  return (
    <div className="flex items-center gap-[10px]">
      <i className="fi fi-rr-driver-man profile-image"></i>
      <div className="item-details">
        <h3 className="m-0 text-[16px] ">{DriverName}</h3>
        <span className="text-xs text-textcolor">
          {NationalCode} {DriverTypeTitle}
        </span>

        <p className="m-0 text-gray-400 flex items-center gap-[5px] pt-[5px] text-sm">
          {Cars?.map((_car, _index) => (
            <Fragment key={`driver__${_index}`}>
              <span className="flex flex-row border border-togglecolor border-solid rounded items-center text-textcolor text-xs">
                <span className="border-l border-l-togglecolor border-solid p-[5px] text-textcolor text-xs">
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
  );
}
