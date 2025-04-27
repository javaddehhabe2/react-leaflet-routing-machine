import React from "react";
import { PopupType } from "../Type";

export default function MarkerShopPopup({ marker }: PopupType) {
  return (
    <>
      <div className="popup-row popup-row-title popup-shop">
        <span className="p-1 text-bold">{marker.CustomerName}</span>
        <i className="fi fi-rr-shop"></i>
      </div>
      <div className="popup-detail popup-detail-custome shop-detail">
        <div className="popup-row mt-2 popup-row-custom row-shop">
          <span className="popup-label pupup-lable-custom">
            <span>{marker.CustomerID}</span>
          </span>
        </div>
      </div>
    </>
  );
}
