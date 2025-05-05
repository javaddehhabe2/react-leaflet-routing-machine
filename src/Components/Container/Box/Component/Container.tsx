import { Canvas } from "@react-three/fiber";
import { memo, useCallback, useMemo } from "react";
import { ContainerPropType, MainBox } from "@Container/Box";
// import { ContainerData } from "@/Data/Box";
import { useContainerStore } from "@Store/ContainerStore";
import { AccumulativeShadows, Grid, RandomizedLight } from "@react-three/drei";
import { ContainerBoxesType } from "@/Store/Type";

const Container = ({ typeOfShow, containerNumber }: ContainerPropType) => {
  const { ContainerBox } = useContainerStore();
  const containerheight = useMemo(() => {
    let H = 0;
    ContainerBox.forEach((_container) => {
      if (_container.container.height > H) H = _container.container.height;
    });
    return H;
  }, [ContainerBox]);

  const ContainerBoxPosition = useCallback(
    (
      _containerBox: ContainerBoxesType[],
      index: number,
    ): [x: number, y: number, z: number] => {
      let X = 0;
      for (let i = 0; i < index; i++) X += _containerBox[i].container.width + 1;

      return [X, 0, 0];
    },
    [],
  );

  return (
    <Canvas shadows={true}>
      <color attach="background" args={["#E0FBE2"]} />

      {typeOfShow == "all" ? (
        ContainerBox.map((_containerBox, index) => (
          <MainBox
            key={index}
            containerBox={_containerBox}
            position={ContainerBoxPosition(ContainerBox, index)}
          />
        ))
      ) : (
        <MainBox
          containerBox={ContainerBox[containerNumber - 1]}
          position={[0, 0, 0]}
        />
      )}
      {/** Soft shadows */}
      <AccumulativeShadows
        temporal
        frames={100}
        colorBlend={12}
        opacity={0.1}
        scale={20}
        position={[
          0,
          containerheight ? -(containerheight - containerheight / 3) : 0,
          0,
        ]}
      >
        <RandomizedLight
          amount={10}
          radius={5}
          ambient={10}
          intensity={4}
          position={[0, 0, 0]}
        />
      </AccumulativeShadows>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        infiniteGrid
        cellThickness={0}
        position={[
          0,
          containerheight ? -(containerheight - containerheight / 3) : 0,
          0,
        ]}
        sectionColor="gray"
      />
    </Canvas>
  );
};

export default memo(Container);
