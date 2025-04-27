import { create } from "zustand";
import { BoxType, ContainerType } from "@Container/Type";
import { ContainerBoxesType, ContainerStoreType } from "./Type";
import { ArrangeBox } from "@Class/ArrangeBox";

export const useContainerStore = create<ContainerStoreType>((set, get) => {
  const BoxesIntoContainer: ContainerBoxesType[] = [];
  const LargeBox: BoxType[] = [];
  const GetBoxSize = (ContainerSize: number, BoxSize: number) =>
    ContainerSize - BoxSize / 2;

  const GetSize = (
    containerWidth: number,
    containerHeight: number,
    containerDepth: number,
    BoxPosition: number,
    size: number,
    positionType: "width" | "height" | "depth",
  ) => {
    let boxSize: number = 0;
    switch (positionType) {
      case "width":
        boxSize = GetBoxSize(containerWidth / 2 - BoxPosition, size);
        break;
      case "height":
        boxSize = GetBoxSize(-containerHeight / 2 + BoxPosition, -size);
        break;
      case "depth":
        boxSize = GetBoxSize(containerDepth / 2 - BoxPosition, size);
        break;
    }
    return boxSize;
  };

  const SetBoxPosition = (
    Box: BoxType[],
    containerWidth: number,
    containerHeight: number,
    containerDepth: number,
  ): BoxType[] => {
    return Box.map((_box, index) => {
      const W_POS = _box.position
        ? GetSize(
            containerWidth,
            containerHeight,
            containerDepth,
            _box.position.x,
            _box.size.width,
            "width",
          )
        : 0;
      const H_POS = _box.position
        ? GetSize(
            containerWidth,
            containerHeight,
            containerDepth,
            _box.position.y,
            _box.size.height,
            "height",
          )
        : 0;
      const L_POS = _box.position
        ? GetSize(
            containerWidth,
            containerHeight,
            containerDepth,
            _box.position.z,
            _box.size.depth,
            "depth",
          )
        : 0;
      return {
        ..._box,
        index,
        sortNumber: index,
        position: {
          x: W_POS,
          y: H_POS,
          z: L_POS,
        },
      };
    });
  };

  const SetColor = (Boxes: BoxType[]) => {
    return Boxes.map((_box) => {
      return {
        ..._box,
        color:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0"),
      };
    });
  };

  const canPlace = (newBox: BoxType, placed: BoxType[]): boolean => {
    const newBoxX = newBox.position ? newBox.position.x : 0;
    const newBoxY = newBox.position ? newBox.position.y : 0;
    const newBoxZ = newBox.position ? newBox.position.z : 0;
    return !placed.some((box) => {
      const boxX = box.position ? box.position.x : 0;
      const boxY = box.position ? box.position.y : 0;
      const boxZ = box.position ? box.position.z : 0;
      return (
        Math.abs(boxX - newBoxX) < (box.size.width + newBox.size.width) / 2 &&
        Math.abs(boxY - newBoxY) < (box.size.height + newBox.size.height) / 2 &&
        Math.abs(boxZ - newBoxZ) < (box.size.depth + newBox.size.depth) / 2
      );
    });
  };

  const fitBoxes = (large: ContainerType, smallBoxes: BoxType[]): BoxType[] => {
    const placed: BoxType[] = [];
    let _smallBoxes = [...smallBoxes];
    for (let x = 0; x < large.width; x++) {
      for (let y = 0; y < large.height; y++) {
        for (let z = 0; z < large.depth; z++) {
          for (const box of _smallBoxes) {
            const newBox: BoxType = {
              ...box,
              position: {
                x: x + box.size.width / 2,
                y: y + box.size.height / 2,
                z: z + box.size.depth / 2,
              },
            };

            const X = newBox.position ? newBox.position.x : 0;
            const Y = newBox.position ? newBox.position.y : 0;
            const Z = newBox.position ? newBox.position.z : 0;

            if (
              X + box.size.width / 2 <= large.width &&
              Y + box.size.height / 2 <= large.height &&
              Z + box.size.depth / 2 <= large.depth &&
              canPlace(newBox, placed)
            ) {
              placed.push(newBox);
              _smallBoxes = [
                ..._smallBoxes.filter((_f) => _f.index !== box.index),
              ];
              break;
            }
          }
        }
      }
    }

    return placed;
  };

  const fitBoxesIntoContainer = (
    allContainers: ContainerType[],
    Boxes: BoxType[],
    defaultContainer?: ContainerType,
  ) => {
    let def = defaultContainer;
    if (!def) {
      let _fitBox = 0;
      allContainers.forEach((_container) => {
        const _Fit = fitBoxes(_container, Boxes);
        if (_Fit.length > _fitBox) {
          _fitBox = _Fit.length;
          def = _container;
        }
      });
    }

    if (def) {
      const ArrangeBoxClass = new ArrangeBox();
      ArrangeBoxClass.Boxes = Boxes;
      ArrangeBoxClass.ContainerWidth = def?.width ?? 0;
      ArrangeBoxClass.ContainerHeight = def?.height ?? 0;
      ArrangeBoxClass.ContainerDepth = def?.depth ?? 0;

      ArrangeBoxClass.TopGap = def?.gap?.Top ?? 0;
      ArrangeBoxClass.BottomGap = def?.gap?.Bottom ?? 0;
      ArrangeBoxClass.LeftGap = def?.gap?.Left ?? 0;
      ArrangeBoxClass.RightGap = def?.gap?.Right ?? 0;
      ArrangeBoxClass.BackGap = def?.gap?.Back ?? 0;
      ArrangeBoxClass.FrontGap = def?.gap?.Front ?? 0;

      ArrangeBoxClass.GenerateMatrix3D();
      const tmpBox: BoxType[] = ArrangeBoxClass.GetBoxWithPosition();
      // 0.1 =>if box not fit in container
      // 0.2 => if box larger than container
      BoxesIntoContainer.push({
        container: def,
        boxes: tmpBox.filter(
          (_box) => ![0.1, 0.2].includes(_box.position?.x ?? 0),
        ),
      });
      LargeBox.push(...ArrangeBoxClass.LargeBoxes);
      if (ArrangeBoxClass.ExtraBoxes.length > 0)
        return fitBoxesIntoContainer(
          allContainers,
          ArrangeBoxClass.ExtraBoxes,
          defaultContainer,
        );
    } else return;
  };

  return {
    ArrangingBox: false,
    SetArrangingBox: (state) => {
      set(() => ({ ArrangingBox: state }));
    },
    allContainers: [],
    SetAllContainers: (containers) => {
      set(() => ({ allContainers: containers }));
    },

    defaultContainer: undefined,
    SetDefaultContainer: (type) => {
      const _allContainers = get().allContainers;

      if (type == "auto") set(() => ({ defaultContainer: undefined }));
      else {
        const _Container = _allContainers.find(
          (_container) => _container.containerID.toString() == type,
        );
        set(() => ({ defaultContainer: _Container }));
      }
    },

    boxes: [],
    SetBoxes: (_boxes) => {
      set(() => ({ boxes: _boxes }));
    },

    ContainerBox: [],
    AddContainerBox: (_container, _boxes) => {
      const _ContainerBox = get().ContainerBox;
      _ContainerBox.push({ container: _container, boxes: _boxes });
      set(() => ({ ContainerBox: [..._ContainerBox] }));
    },
    SetContainerBox: (_container) => {
      set(() => ({ ContainerBox: _container }));
    },
    ClearContainerBox: () => {
      set(() => ({ ContainerBox: [] }));
    },
    BoxLargeThanContainer: [],
    ReArrange: () => {
      const _Boxes = get().boxes;
      const _DefaultContainer = get().defaultContainer;
      const _AllContainers = get().allContainers;
      set(() => ({ ContainerBox: [] }));
      BoxesIntoContainer.length = 0;
      LargeBox.length = 0;
      fitBoxesIntoContainer(_AllContainers, _Boxes, _DefaultContainer);

      BoxesIntoContainer.forEach((_container) => {
        const _BoxesIntoContainer = SetBoxPosition(
          _container.boxes,
          _container.container?.width ?? 0,
          _container.container?.height ?? 0,
          _container.container?.depth ?? 0,
        );
        const _ContainerBox = get().ContainerBox;
        _ContainerBox.push({
          container: _container.container,
          boxes: SetColor(_BoxesIntoContainer),
        });

        set(() => ({ ContainerBox: [..._ContainerBox] }));

        set(() => ({ BoxLargeThanContainer: [...LargeBox] }));
      });

      set(() => ({ ArrangingBox: false }));
      return true;
    },
  };
});
