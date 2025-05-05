import React, { memo, useEffect } from "react";
import { ContextMenuProps } from "../type";
import { createPortal } from "react-dom";



const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, visible, onClose, children }) => {
  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);
  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "8px",
        zIndex: 9999,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        minWidth: "120px",
      }}
      onClick={(e) => e.stopPropagation()} // prevent close on menu click
    >
      {children}
    </div>, document.body
  );
};
export default memo(ContextMenu);