import { SmallBoxType } from "../Type";
import { memo, useEffect, useMemo, useState } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useBoxStore } from "@/Store/BoxStore";

const SmallBox = ({
  title,
  position,
  color,
  size,
  customerId,
  index,
}: SmallBoxType) => {
  const [fontSize, setFontSize] = useState(0.5);

  const { showBoxes } = useBoxStore();
  const visible = useMemo(() => {
    const findID = showBoxes.find(
      (_id) => _id._box == index && _id._container == customerId,
    );
    console.log(findID);
    return findID ? true : false;
  }, [showBoxes, customerId, index]);

  useEffect(() => {
    const minSize = Math.min(...size); // Get the smallest dimension
    setFontSize(minSize * 0.3); // Scale font size (adjust as needed)
  }, [size]);


  useEffect(() => {
console.log(showBoxes);
  }, [showBoxes]);
  useEffect(() => {
    console.log(visible);
      }, [visible]);
  return (
    <mesh position={position} visible={true}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        depthWrite={false}
      />

      <Billboard follow position={[0, 0, 1]}>
        <Text fontSize={fontSize} color="black">
          {title}
        </Text>
      </Billboard>
    </mesh>
  );
};

export default memo(SmallBox);
