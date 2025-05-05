import { DivIcon } from "leaflet";
import { createRoot } from "react-dom/client";
import { MarkerIconType } from "../Type";
import MarkerIcon from "./MarkerIcon";

const CreateReactDivIcon = ({
  MarkerID,
  Text,
  Latitude,
  Longitude,
  Index,
  Hide,
}: MarkerIconType) => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <MarkerIcon
      MarkerID={MarkerID}
      Text={Text}
      Index={Index}
      Latitude={Latitude}
      Longitude={Longitude}
      Hide={Hide}
    />
  );

  return new DivIcon({
    html: div, 
    iconSize: [40, 40],
    className: "",
  });
};
export default CreateReactDivIcon;
