import { memo } from "react";
import { BoxContainer, MainBoxType, SmallBox } from "@Container/Box";

const MainBox = ({ containerBox, position }: MainBoxType) => {
  return (
    <group>
      <mesh position={position}>
        <BoxContainer
          color="cyan"
          size={[
            containerBox.container.width,
            containerBox.container.height,
            containerBox.container.depth,
          ]}
        />

        {containerBox.boxes?.map((box, index) =>
          box.position ? (
            <SmallBox
              key={index}
              title={box.title ?? ""}
              position={[box.position.x, box.position.y, box.position.z]}
              color={box?.color ?? ""}
              size={[box.size.width, box.size.height, box.size.depth]}
              index={box.index ?? 0}
              customerId={box.customerId ?? 0}
            />
          ) : null,
        )}
      </mesh>
    </group>
  );
};
export default memo(MainBox);
