import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { memo } from "react";
import { BoxContainerType } from "../Type";
import {CameraAdjust} from "@Container/CameraAdjust";

const BoxContainer= ({ color, size }: BoxContainerType) => {
  return (
    <group>
      <mesh castShadow>
        <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <boxGeometry args={size} />
        <meshStandardMaterial
          attach="material-0"
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
        {/* Right Side */}
        <meshStandardMaterial
          attach="material-1"
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
        {/* Left Side */}
        <meshStandardMaterial
          attach="material-2"
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
        {/* Top */}
        <meshStandardMaterial
          attach="material-3"
          color={color}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
        {/* Bottom */}
        <meshStandardMaterial
          attach="material-4"
          color={color}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
        {/* Front */}
        <meshStandardMaterial
          attach="material-5"
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
        {/* Back */}
        <lineSegments>
          <edgesGeometry
            args={[new THREE.BoxGeometry(size[0], size[1], size[2])]}
          />
          <lineBasicMaterial color="#7d9bd4" linewidth={1} />
        </lineSegments>
      </mesh>

      <CameraAdjust
        boxSize={{ x: size[0] ?? 0, y: size[1] ?? 0, z: size[2] ?? 0 }}
      />
    </group>
  );
};

export default memo(BoxContainer);
