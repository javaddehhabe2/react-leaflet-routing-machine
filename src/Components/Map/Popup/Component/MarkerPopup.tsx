import * as React from "react";
import { PopupType } from "../Type";

export default function MarkerPopup({ marker }: PopupType) {
  return (
    <>
      <div className="popup-row popup-row-title">
        <span className="p-1 text-bold">{marker.CustomerName}</span>
        <div className="title-icon-container">
          <span className="title-icon-num">
            {marker.InstallmentEstatment || 0}
          </span>
        </div>
      </div>

      <div className="popup-detail popup-detail-custome">
        {marker?.Shops?.map((good, index) => (
          <div
            key={`Shops${index}`}
            className="popup-row mt-2 popup-row-custom">
            <span className="popup-label pupup-lable-custom">
              <span> {good.ShopName}</span>
            </span>
          </div>
        ))}

        {marker?.Products?.map((good, index) => (
          <div
            key={`Products${index}`}
            className="popup-row mt-2 popup-row-custom">
            <span
              className="popup-label pupup-lable-custom"
              style={{ color: good.ServiceTypeID === 2 ? "green" : "" }}>
              <span className="superscript-text">{good.Quantity}</span>
              <span>{good.ProductTitle}</span>
            </span>
            <div className="popup-row-icon-container">
              {good.ServiceTypeID === 2 ? (
                <i
                  className="fi fi-rr-plug-connection block"
                  style={{ color: "green" }}
                />
              ) : (
                <i
                  className="fi fi-rr-truck-side hidden"
                  style={{ color: "green" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
