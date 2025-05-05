import { memo, useEffect, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { MarkerPopup } from "@Map/Popup";
import { CustomMarkerType } from "../Type";
import CreateReactDivIcon from "./ReactDivIcon";

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
  const Icon = useMemo(() => {
    
    return CreateReactDivIcon({
      MarkerID,
      Text,
      Latitude,
      Longitude,
      Index,
      Hide
    });
  }, [MarkerID, Text, Latitude, Longitude, Index,Hide]);
// useEffect(()=>{
//   console.log(Text);
// },[Text])
  return (
    <Marker
      position={[Latitude, Longitude]}
      draggable={Draggable}
      bubblingMouseEvents={BubblingMouseEvents}
      eventHandlers={EventHandlers}
      icon={Icon}>
      {MarkerDetail ? (
        <Popup closeButton={false} minWidth={281}>
          <MarkerPopup marker={MarkerDetail} />
        </Popup>
      ) : null}
    </Marker>
  );
}

export default memo(CustomMarker);
