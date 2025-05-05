import { ContainerDataType } from "@Container/Type";

export const ContainerData: ContainerDataType = {
  ContainerType: [
    {
      containerID: 3,
      name: "vanet",
      width: 4,
      height: 4,
      depth: 6,
      // gap: {
      //   Top: 1,
      //   Bottom: 1,
      //   Left: 2,
      //   Right: 2,
      //   Back: 0,
      //   Front: 0,
      // },
    },
    {
      containerID: 2,
      name: "truck",
      width: 8,
      height: 8,
      depth: 12,
      // gap: {
      //   Top: 1,
      //   Bottom: 1,
      //   Left: 2,
      //   Right: 2,
      //   Back: 4,
      //   Front: 0,
      // },
    },
    {
      containerID: 1,
      name: "Lorry",
      width: 10,
      height: 12,
      depth: 20,
      // gap: {
      //   Top: 1,
      //   Bottom: 1,
      //   Left: 2,
      //   Right: 2,
      //   Back: 4,
      //   Front: 2,
      // },
    },
  ],

  crossSection: 90,
  customer: [
    {
      customerID: '1',
      name: "Javad",
      address: "neyshabour",
      isVIP: true,
      order: [
        {
          orderID: 1001,
          box: [
            {
              title: "Heater",
              weight: 2,
              count: 1,
              size: {
                width: 8,
                height: 9,
                depth: 10,
              },
              // rotation:{
              //   widthToHeight:true,
              //   widthToDepth:true,

              //   HeightToWidth:true,
              //   HeightToDepth:true,

              //   DepthToHeight:true,
              //   DepthToWidth:true,
              // }
            },
            {
              title: "TV",
              weight: 2,
              count: 1,
              size: {
                width: 2,
                height: 7,
                depth: 4,
              },
              rotation: {
                widthToHeight: true,
                widthToDepth: true,

                HeightToWidth: true,
                HeightToDepth: true,

                DepthToHeight: true,
                DepthToWidth: true,
              },
            },
            {
              title: "Laptop",
              weight: 2,
              count: 1,
              size: {
                width: 2,
                height: 9,
                depth: 4,
              },
            },
          ],
        },
      ],
    },
    {
      customerID: '3',
      name: "reza",
      address: "neyshabour",
      isVIP: true,
      order: [
        {
          orderID: 3001,
          box: [
            {
              title: "reza1",
              weight: 2,
              count: 3,
              size: {
                width: 8,
                height: 1,
                depth: 8,
              },
            },
            {
              title: "reza2",
              weight: 2,
              count: 2,
              size: {
                width: 2,
                height: 2,
                depth: 1,
              },
            },
          ],
        },
      ],
    },
    {
      customerID: '4',
      name: "Sina",
      address: "neyshabour",
      isVIP: false,
      order: [
        {
          orderID: 4001,
          box: [
            {
              title: "Sina1",
              weight: 2,
              count: 1,
              size: {
                width: 2,
                height: 3,
                depth: 1,
              },
            },
          ],
        },
        {
          orderID: 4002,
          box: [
            {
              title: "Sina2",
              weight: 2,
              count: 1,
              size: {
                width: 7,
                height: 7,
                depth: 1,
              },
            },
            {
              title: "Sina3",
              weight: 2,
              count: 2,
              size: {
                width: 3,
                height: 4,
                depth: 3,
              },
            },
            {
              title: "Sina4",
              weight: 2,
              count: 6,
              size: {
                width: 1,
                height: 1,
                depth: 1,
              },
            },
          ],
        },
      ],
    },
    {
      customerID: '2',
      name: "Ali",
      address: "neyshabour",
      isVIP: false,
      order: [
        {
          orderID: 3001,
          box: [
            {
              title: "Ali4",
              weight: 2,
              count: 3,
              size: {
                width: 3,
                height: 4,
                depth: 1,
              },
            },
            {
              title: "Ali5",
              weight: 2,
              count: 2,
              size: {
                width: 9,
                height: 6,
                depth: 4,
              },
            },
            {
              title: "Ali6",
              weight: 2,
              count: 3,
              size: {
                width: 7,
                height: 8,
                depth: 3,
              },
              rotation: {
                widthToHeight: true,
                widthToDepth: true,

                HeightToWidth: true,
                HeightToDepth: true,

                DepthToHeight: true,
                DepthToWidth: true,
              },
            },
          ],
        },
        {
          orderID: 3002,
          box: [
            {
              title: "Ali7",
              weight: 2,
              count: 1,
              size: {
                width: 7,
                height: 2,
                depth: 10,
              },
            },
            {
              title: "Ali8",
              weight: 2,
              count: 2,
              size: {
                width: 3,
                height: 1,
                depth: 3,
              },
            },
            {
              title: "Ali90",
              weight: 2,
              count: 1,
              size: {
                width: 6,
                height: 3,
                depth: 4,
              },
              rotation: {
                widthToHeight: true,
                widthToDepth: true,

                HeightToWidth: true,
                HeightToDepth: true,

                DepthToHeight: true,
                DepthToWidth: true,
              },
            },
            {
              title: "Ali91",
              weight: 2,
              count: 1,
              size: {
                width: 6,
                height: 3,
                depth: 4,
              },
              rotation: {
                widthToHeight: true,
                widthToDepth: true,

                HeightToWidth: true,
                HeightToDepth: true,

                DepthToHeight: true,
                DepthToWidth: true,
              },
            },
            {
              title: "Ali92",
              weight: 2,
              count: 1,
              size: {
                width: 6,
                height: 3,
                depth: 4,
              },
              rotation: {
                widthToHeight: true,
                widthToDepth: true,

                HeightToWidth: true,
                HeightToDepth: true,

                DepthToHeight: true,
                DepthToWidth: true,
              },
            },
          ],
        },
      ],
    },
  ],
};
