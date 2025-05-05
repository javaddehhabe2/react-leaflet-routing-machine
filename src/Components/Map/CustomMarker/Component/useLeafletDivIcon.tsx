import { useEffect, useRef, useState } from "react";
import { DivIcon } from "leaflet";
import { createRoot } from "react-dom/client";
import MarkerIcon from "./MarkerIcon";
import { MarkerIconType } from "../Type";

export const useLeafletDivIcon = (props: MarkerIconType) => {
  const [icon, setIcon] = useState<DivIcon | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<MarkerIcon {...props} />);
    containerRef.current = div;

    const leafletIcon = new DivIcon({
      html: div,
      iconSize: [40, 40],
      className: "",
    });

    setIcon(leafletIcon);

    return () => {
      queueMicrotask(() => {
        root.unmount();
      });
    };
  }, [JSON.stringify(props)]); // re-render if props change deeply

  return icon;
};