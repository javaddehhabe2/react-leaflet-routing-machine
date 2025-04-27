import React,{useEffect, useState} from "react";
import { RoutePopupType } from "../Type";
// import RoutePopup from "./RoutePopup";

export default function RoutePopup1({ route ,onChangeColor}: RoutePopupType) {
  const [changeColor,setChangeColor]=useState(route.RouteColor);
 

  return (
    <>
    {/* <RoutePopup  route={route} onChangeColor={onChangeColor} /> */}
    </>
  );
}
