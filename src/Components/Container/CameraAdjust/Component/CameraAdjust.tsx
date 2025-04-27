import { memo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const CameraAdjust = ({
  boxSize,
}: {
  boxSize: { x: number; y: number; z: number };
}) => {
  const { camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
    const fov = perspectiveCamera.fov * (Math.PI / 80);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));

    perspectiveCamera.position.set(20, cameraDistance, cameraDistance);
    perspectiveCamera.lookAt(0, 0, 0);
    perspectiveCamera.updateProjectionMatrix();
  }, [boxSize, camera]);

  return null;
};
export default memo(CameraAdjust);
