import { BoxType } from "@Container/Type";
export class ArrangeBox {
  public Boxes: BoxType[] = [];
  public ExtraBoxes: BoxType[] = [];
  public LargeBoxes: BoxType[] = [];
  private matrix3D: number[][][] = [];

  public ContainerWidth: number = 0;
  public ContainerHeight: number = 0;
  public ContainerDepth: number = 0;

  public CheckingPosition = false;

  // countainer gap
  public TopGap: number = 0;
  public BottomGap: number = 0;
  public LeftGap: number = 0;
  public RightGap: number = 0;
  public BackGap: number = 0;
  public FrontGap: number = 0;

  public CurrentBox: BoxType | undefined;
  // public RotationArray: number[][] = [];


private CheckingRotation={
  widthToHeight:false, 
  widthToDepth:false,
  HeightToWidth:false,
  HeightToDepth:false,
  DepthToWidth :false,
  DepthToHeight:false,
  DepthToHeightToWidth:false,
  DepthToWidthToHeight:false,
}

  constructor() {
    this.CheckingPosition = true;
  }

  private AddGap(side: "top" | "bottom" | "left" | "right" | "front" | "back") {
    switch (side) {
      case "top":
        if (this.TopGap)
          for (let z = 0; z < this.ContainerDepth; z++)
            for (let w = 0; w < this.ContainerWidth; w++)
              for (
                let y = this.ContainerHeight - 1;
                y >= this.ContainerHeight - this.TopGap;
                y--
              )
                this.matrix3D[w][y][z] = -2;
        break;

      case "bottom":
        if (this.BottomGap)
          for (let z = 0; z < this.ContainerDepth; z++)
            for (let w = 0; w < this.ContainerWidth; w++)
              for (let y = 0; y < this.BottomGap; y++)
                this.matrix3D[w][y][z] = -2;
        break;

      case "left":
        if (this.LeftGap)
          for (let z = 0; z < this.ContainerDepth; z++)
            for (let y = 0; y < this.ContainerHeight; y++)
              for (
                let w = this.ContainerWidth - 1;
                w >= this.ContainerWidth - this.LeftGap;
                w--
              )
                this.matrix3D[w][y][z] = -2;
        break;

      case "right":
        if (this.RightGap)
          for (let z = 0; z < this.ContainerDepth; z++)
            for (let y = 0; y < this.ContainerHeight; y++)
              for (let w = 0; w < this.RightGap; w++)
                this.matrix3D[w][y][z] = -2;
        break;

      case "front":
        if (this.FrontGap)
          for (let y = 0; y < this.ContainerHeight; y++)
            for (let w = 0; w < this.ContainerWidth; w++)
              for (let z = 0; z < this.FrontGap; z++)
                this.matrix3D[w][y][z] = -2;
        break;

      case "back":
        if (this.BackGap)
          for (let y = 0; y < this.ContainerHeight; y++)
            for (let w = 0; w < this.ContainerWidth; w++)
              for (
                let z = this.ContainerDepth - 1;
                z >= this.ContainerDepth - this.BackGap;
                z--
              )
                this.matrix3D[w][y][z] = -2;
        break;
    }
  }

  public GenerateMatrix3D() {
    this.matrix3D = Array.from({ length: this.ContainerWidth }, () =>
      Array.from({ length: this.ContainerHeight }, () =>
        Array.from({ length: this.ContainerDepth }, () => -1),
      ),
    );
    this.AddGap("right");
    this.AddGap("left");
    this.AddGap("top");
    this.AddGap("bottom");
    this.AddGap("front");
    this.AddGap("back");
  }

  public GetBoxWithPosition(): BoxType[] {
    this.CheckingPosition = true;
    // calculate position Box
    // console.log(this.Boxes);
    this.Boxes = this.Boxes.map((box) => {
      this.CurrentBox = box;
      const { position, size } = this.CalculatePosition(box, 0, 0, 0);
      // console.log({box, position, size });
      return { ...box, size, position };
    });
    // console.log(this.Boxes);
    this.CheckingPosition = false;
    return this.Boxes;
  }

  private CalculatePosition(
    Box: BoxType,
    startWidth: number,
    startHeight: number,
    startDepth: number,
  ): {
    position: { x: number; y: number; z: number };
    size: { width: number; height: number; depth: number };
  } {

    const WidthIndex = this.CheckWidth(
      startWidth,
      this.ContainerWidth,
      startHeight,
      startDepth,
      Box,
    );

    const startWidthIndex = WidthIndex.startWidthIndex;
    let lastWidthIndex = WidthIndex.lastWidthIndex;
    if (lastWidthIndex !== -1 && startWidthIndex !== -1) {
      // this._log();
      lastWidthIndex = startWidthIndex + Box.size.width;
      lastWidthIndex =
        lastWidthIndex > this.ContainerWidth
          ? this.ContainerWidth
          : lastWidthIndex;

      const HeightIndex = this.CheckHeight(
        startWidthIndex,
        lastWidthIndex,
        startHeight,
        Box.size.height + startHeight > this.ContainerHeight
          ? this.ContainerHeight
          : Box.size.height + startHeight,
        startDepth,
        Box,
      );
      // this._log(HeightIndex);
      const startHeightIndex = HeightIndex.startHeightIndex;
      let lastHeightIndex = HeightIndex.lastHeightIndex;

      if (lastHeightIndex !== -1 && startHeightIndex !== -1) {
        lastHeightIndex = startHeightIndex + Box.size.height;

        const { startDepthIndex, lastDepthIndex } = this.CheckDepth(
          startWidthIndex,
          lastWidthIndex,
          startHeightIndex,
          lastHeightIndex,
          startDepth,
          Box.size.depth + startDepth + 1,
          Box,
        );

        if (lastDepthIndex !== -1 && startDepthIndex !== -1) {
          for (let d = startDepthIndex - 1; d < lastDepthIndex; d++) {
            for (let h = startHeightIndex; h < lastHeightIndex; h++) {
              for (let w = startWidthIndex; w < lastWidthIndex; w++) {
                this.matrix3D[w][h][d] = Box.sortNumber ?? 0;
              }
            }
          }
          // this.RotationArray = [];
          this.ResetCheckingRotation();
          return {
            size: Box.size,
            position: {
              x: startWidthIndex,
              y: startHeightIndex,
              z: startDepthIndex == 0 ? startDepthIndex : startDepthIndex - 1,
            },
          };
        } else {
          const { rotation, _Box } = this.CheckRotation(Box, "Depth");
          if (rotation)
            return this.CalculatePosition(
              _Box,
              startWidth,
              startHeight,
              startDepth,
            );
          else {
            // this.RotationArray = [];
            this.ResetCheckingRotation();
            const _Box = this.CurrentBox ?? Box;
            if (this.ContainerWidth > startWidth)
              return this.CalculatePosition(
                _Box,
                startWidth + 1,
                startHeight,
                startDepth,
              );
            else if (this.ContainerHeight > startHeight)
              return this.CalculatePosition(
                _Box,
                0,
                startHeight + 1,
                startDepth,
              );
            else if (this.ContainerDepth > startDepth)
              return this.CalculatePosition(_Box, 0, 0, startDepth + 1);
            else {
              this.ExtraBoxes.push(_Box);
              return {
                size: this.CurrentBox?.size ?? _Box.size,
                position: { x: 0.1, y: 0.1, z: 0.1 },
              };
            }
          }
        }
      } else {
        const { rotation, _Box } = this.CheckRotation(Box, "Height");

        if (rotation) {
          return this.CalculatePosition(
            _Box,
            startWidth,
            startHeight,
            startDepth,
          );
        } else {
          const _Box = this.CurrentBox ?? Box;
          // this.RotationArray = [];
          this.ResetCheckingRotation();
          if (
            WidthIndex.lastWidthIndex - startWidthIndex > _Box.size.width &&
            this.ContainerWidth > startWidth
          )
            return this.CalculatePosition(
              _Box,
              startWidth + 1,
              startHeight,
              startDepth,
            );
          else if (startDepth + 1 < this.ContainerDepth)
            return this.CalculatePosition(_Box, 0, 0, startDepth + 1);
          else {
            this.ExtraBoxes.push(_Box);
            return {
              size: _Box.size,
              position: { x: 0.1, y: 0.1, z: 0.1 },
            };
          }
        }
      }
    } else {
      const { rotation, _Box } = this.CheckRotation(Box, "Width");

      if (rotation)
        return this.CalculatePosition(
          _Box,
          startWidth,
          startHeight,
          startDepth,
        );
      else {
        const _Box = this.CurrentBox ?? Box;
        // this.RotationArray = [];
        this.ResetCheckingRotation()
        if (startHeight + 1 < this.ContainerHeight) {
          return this.CalculatePosition(_Box, 0, startHeight + 1, startDepth);
        } else {
          if (startDepth + 1 < this.ContainerDepth)
            return this.CalculatePosition(_Box, 0, 0, startDepth + 1);
          else {
            this.LargeBoxes.push(_Box);
            this.ExtraBoxes.push(_Box);
            return {
              size: this.CurrentBox?.size ?? _Box.size,
              position: { x: 0.2, y: 0.2, z: 0.2 },
            };
          }
        }
      }
    }
  }

  private CheckWidth(
    start: number,
    last: number,
    heightIndex: number,
    depthIndex: number,
    Box: BoxType,
  ) {
    let startWidthIndex = -1;
    let lastWidthIndex = -1;
    for (let index = start; index < last; index++) {
      if (
        this.matrix3D[index][heightIndex][depthIndex] == -1 &&
        startWidthIndex == -1
      )
        startWidthIndex = index;
      if (this.matrix3D[index][heightIndex][depthIndex] == -1)
        lastWidthIndex = index;
    }

    if (Box.size.width - 1 > lastWidthIndex - startWidthIndex) {
      startWidthIndex = lastWidthIndex = -1;
    }
    return { startWidthIndex, lastWidthIndex };
  }

  private CheckHeight(
    startWidth: number,
    lastWidth: number,
    startHeight: number,
    lastHeight: number,
    depthIndex: number,
    Box: BoxType,
  ) {
    let startHeightIndex = -1;
    let lastHeightIndex = -1;

    for (let index = startHeight; index < lastHeight; index++) {
      const { startWidthIndex, lastWidthIndex } = this.CheckWidth(
        startWidth,
        lastWidth,
        index,
        depthIndex,
        Box,
      );

      if (startWidthIndex !== -1 || lastWidthIndex !== -1) {
        if (startHeightIndex == -1) startHeightIndex = index;
        lastHeightIndex = index;
      } else {
        startHeightIndex = lastHeightIndex = -1;
        break;
      }
    }

    if (Box.size.height - 1 > lastHeightIndex - startHeightIndex) {
      startHeightIndex = lastHeightIndex = -1;
    }

    return { startHeightIndex, lastHeightIndex };
  }

  private CheckDepth(
    startWidth: number,
    lastWidth: number,
    startHeight: number,
    lastHeight: number,
    startDepth: number,
    lastDepth: number,
    Box: BoxType,
  ) {
    let startDepthIndex = -1;
    let lastDepthIndex = -1;
    for (let index = startDepth + 1; index < lastDepth; index++) {
      const { startHeightIndex, lastHeightIndex } = this.CheckHeight(
        startWidth,
        lastWidth,
        startHeight,
        lastHeight,
        index,
        Box,
      );

      if (startHeightIndex !== -1 || lastHeightIndex !== -1) {
        if (startDepthIndex == -1) startDepthIndex = index;
        lastDepthIndex = index;
      } else {
        startDepthIndex = lastDepthIndex = -1;
        break;
      }
    }

    if (Box.size.depth - 1 > lastDepthIndex - startDepthIndex) {
      startDepthIndex = lastDepthIndex = -1;
    }
    if (startDepthIndex !== -1 && lastDepthIndex !== -1)
      if (
        this.CheckCrossSection(
          startWidth,
          lastWidth,
          startHeight,
          startDepth,
          lastDepth,
          Box,
        ) == false
      )
        startDepthIndex = lastDepthIndex = -1;
    return { startDepthIndex, lastDepthIndex };
  }

  private CheckCrossSection(
    startWidth: number,
    lastWidth: number,
    startHeight: number,
    startDepth: number,
    lastDepth: number,
    Box: BoxType,
  ) {
    if (startHeight != 0) {
      let CrossNumber = 0;
      let UnCrossNumber = 0;
      for (let d = startDepth; d < lastDepth; d++) {
        for (let w = startWidth; w < lastWidth; w++) {
          if (
            ![Box.sortNumber, -1].includes(this.matrix3D[w][startHeight - 1][d])
          )
            CrossNumber++;
          else UnCrossNumber++;
        }
      }
      if (UnCrossNumber > CrossNumber) return false;
      return true;
    }
  }

  private CheckRotation(
    Box: BoxType,
    Dimensions: "Width" | "Height" | "Depth",
  ) {
    let hasRotation = false;
    switch (Dimensions) {
      case "Width":
        if (Box?.rotation?.widthToHeight || Box?.rotation?.widthToDepth)
          hasRotation = true;
        break;
      case "Height":
        if (Box?.rotation?.HeightToWidth || Box?.rotation?.HeightToDepth)
          hasRotation = true;
        break;
      case "Depth":
        if (Box?.rotation?.DepthToWidth || Box?.rotation?.DepthToHeight)
          hasRotation = true;
        break;
    }

    if (hasRotation) {
        switch (Dimensions) {
          case "Width":
            if (
              Box?.rotation?.widthToHeight &&
              Box.size.height < Box.size.width
              && !this.CheckingRotation.widthToHeight 
            ){
              this.CheckingRotation.widthToHeight=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.width,
                    width: Box.size.height,
                    depth: Box.size.depth,
                  },
                },
              };
            }
            else if (
              Box?.rotation?.widthToDepth &&
              Box.size.depth < Box.size.width
              && !this.CheckingRotation.widthToDepth 
            ){
              this.CheckingRotation.widthToDepth=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.height,
                    width: Box.size.depth,
                    depth: Box.size.width,
                  },
                },
              };
            }
            break;

          case "Height":
            if (
              Box?.rotation?.HeightToWidth &&
              Box.size.width < Box.size.height
              && !this.CheckingRotation.HeightToWidth 
            ){
              this.CheckingRotation.HeightToWidth=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.width,
                    width: Box.size.height,
                    depth: Box.size.depth,
                  },
                },
              };}
            else if (
              Box?.rotation?.HeightToDepth &&
              Box.size.depth < Box.size.height
              && !this.CheckingRotation.HeightToDepth 
            ){
              this.CheckingRotation.HeightToDepth=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.depth,
                    width: Box.size.width,
                    depth: Box.size.height,
                  },
                },
              };}
            break;
          case "Depth":
            if (Box?.rotation?.DepthToWidth && Box.size.width < Box.size.depth  && !this.CheckingRotation.DepthToWidth 
            ){
              this.CheckingRotation.DepthToWidth=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.height,
                    width: Box.size.depth,
                    depth: Box.size.width,
                  },
                },
              };}
            else if (
              Box?.rotation?.DepthToHeight &&
              Box.size.height < Box.size.depth
              && !this.CheckingRotation.DepthToHeight 
            ){
              this.CheckingRotation.DepthToHeight=true;
              return {
                rotation: true,
                _Box: {
                  ...Box,
                  size: {
                    height: Box.size.depth,
                    width: Box.size.width,
                    depth: Box.size.height,
                  },
                },
              };
            }
            break;
        }

     if (
      Box?.rotation?.DepthToHeight &&
      Box?.rotation?.HeightToWidth &&
      Box?.rotation?.widthToDepth 
      && !this.CheckingRotation.DepthToHeightToWidth
    ){
      this.CheckingRotation.DepthToHeightToWidth=true;
      return {
        rotation: true,
        _Box: {
          ...Box,
          size: {
            height: Box.size.depth,
            width: Box.size.height,
            depth: Box.size.width,
          },
        },
      };
    }else if (
      Box?.rotation?.DepthToWidth &&
      Box?.rotation?.widthToHeight &&
      Box?.rotation?.HeightToDepth 
      && !this.CheckingRotation.DepthToWidthToHeight
    ){
      this.CheckingRotation.DepthToWidthToHeight=true;
      return {
        rotation: true,
        _Box: {
          ...Box,
          size: {
            height: Box.size.width,
            width: Box.size.depth,
            depth: Box.size.height,
          },
        },
      };
    }
  }

    return { rotation: false, _Box: Box };
  }

  private ResetCheckingRotation(){
    this.CheckingRotation={
    widthToHeight:false, 
    widthToDepth:false,
    HeightToWidth:false,
    HeightToDepth:false,
    DepthToWidth :false,
    DepthToHeight:false,
    DepthToHeightToWidth:false,
    DepthToWidthToHeight:false,
    }
  }

}
