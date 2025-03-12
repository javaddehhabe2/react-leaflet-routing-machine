import React,{useEffect, useState} from "react";
import { RoutePopupType } from "./Type/PopupType";

export default function RoutePopup({ route ,onChangeColor}: RoutePopupType) {
  const [changeColor,setChangeColor]=useState(route.RouteColor);
  // useEffect(()=>{
  //   alert(1);
  //   console.log(changeColor);
  //   if ( document.getElementById("hs-color-input")) {
  //   console.log( document.getElementById("hs-color-input"));
  //   }
  // },[changeColor])
// function _changecolor(){
//   onChangeColor
// }

  return (
    <>
      <div className="flex justify-between items-center text-sm bg-popupTitle rounded-t p-1 gap-1 m-0 w-full flex-row  flex-wrap">
        <span className="p-1 text-bold ">مسیر شماره {changeColor}</span>
        <div className={`title-icon-container border-[${changeColor}]`}>
          <span className="title-icon-num ">{0}</span>
        </div>
      </div>

      <div className="popup-detail popup-detail-custome">
        <div className="flex items-center justify-around ">
          <label
            htmlFor="hs-color-input"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            رنگ مسیر
          </label>
          <input
            type="color"
            className="p-1 h-10 w-14 block bg-white border border-solid border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
            id="hs-color-input"
            value={changeColor}
            onChange={(e)=>onChangeColor(e.currentTarget.value)}
            title="لطفا رنگ مسیر را مشخص کنید"
          />
        </div>
      </div>
    </>
  );
}
