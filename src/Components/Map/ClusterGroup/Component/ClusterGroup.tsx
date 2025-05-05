import { memo } from "react";
import MarkerPoints from "./MarkerPoints";
import Groups from "./Groups";

function ClusterGroup() {
  return (
    <>
      <Groups />
      <MarkerPoints />
    </>
  );
}

export default memo(ClusterGroup);
