import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import { MarkerPopup } from "@Map/Popup";
import { CustomMarkerType } from "../Type";
import { useLeafletDivIcon } from "./useLeafletDivIcon";
function CustomMarker({
  Index,
  MarkerID,
  Latitude,
  Longitude,
  Text,
  Draggable,
  BubblingMouseEvents,
  EventHandlers,
  MarkerDetail,
  Hide,
}: CustomMarkerType) {

  const icon = useLeafletDivIcon({
    Index,
    MarkerID,
    Latitude,
    Longitude,
    Text,
    Hide,
  });
  if (!icon) return null; // Don’t render until icon is ready
  return (
    <Marker
      position={[Latitude, Longitude]}
      draggable={Draggable}
      bubblingMouseEvents={BubblingMouseEvents}
      eventHandlers={EventHandlers}
      icon={icon}>
      {MarkerDetail ? (
        <Popup closeButton={false} minWidth={281}>
          <MarkerPopup marker={MarkerDetail} />
        </Popup>
      ) : null}
    </Marker>
  );
}

export default memo(CustomMarker);
