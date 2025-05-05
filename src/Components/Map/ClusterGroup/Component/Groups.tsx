import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { Polygon } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useMapStore } from "@Store/MapStore";
import { useGroupMarkerStore } from "@Store/GroupMarkerStore";
import convexHull from "convex-hull";
import { CustomMarker } from "@Map/CustomMarker";
import { Menu } from "antd";
import {ContextMenu} from "@Map/ContextMenu";
import type { MenuProps } from "antd";
import { FaMapSigns, FaTruckPickup } from "react-icons/fa";
import { BoxType } from "@Container/Type";
import { useContainerStore } from "@Store/ContainerStore";
import { RouteCoordinate } from "@Map/Type";
import { RouteColor } from "@/Data/Map";
import { useRouteStore } from "@Store/RouteStore";

type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  {
    key: "AssignToContainer",
    label: "Assign to Container",
    icon: <FaTruckPickup />,
  },
  {
    key: "DrawRoute",
    label: "Draw Route",
    icon: <FaMapSigns />,
  },
];

function Groups() {
  const {
    ContainerBox
    ,
    ReArrange,
    SetBoxes,
  } = useContainerStore();

  const { Filter,Markers } = useMapStore();
const {setCoordinates,Coordinates}=useRouteStore();
  const {
    GroupMarker,
    CurrentGroup,
    CurrentGroupIndex,
    setCurrentGroupIndex,
    setCurrentGroup,
    showCurrentGroupMarker,
  } = useGroupMarkerStore();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    Index: number;
  }>({ visible: false, x: 0, y: 0, Index: 0 });

  const polygonPositions = useMemo(() => {
    if (
      !CurrentGroup ||
      !CurrentGroup.Markers ||
      CurrentGroup.Markers.length <= 2
    )
      return [];

    let Positions: LatLngTuple[] = [];

    const filteredMarkers = CurrentGroup?.Markers.filter(
      (_tmp) => !_tmp.IsHide
    );

    if (filteredMarkers.length > 2) {
      const points = filteredMarkers.map((marker) => [
        marker.Longitude, // Longitude (X)
        marker.Latitude, // Latitude (Y)
      ]);

      const hull = convexHull(points);
      Positions = hull.map(([a, b]) => {
        const [lng, lat] = points[a];
        return [lat, lng] as LatLngTuple;
      });

      if (Positions.length > 0) Positions.push(Positions[0]); // to close polygon nicely
    }

    return Positions;
  }, [CurrentGroup]);

  const handleContextMenu = (e: any, Index: number) => {
    e.originalEvent.preventDefault();
    setContextMenu({
      visible: true,
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY,
      Index,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const SortBox = useCallback(
    (box: BoxType[], box_size: "ASC" | "DESC", check_weight: boolean) => {
      if (box_size)
        box = box.sort((a, b) =>
          4 * (a.size.width + a.size.height + a.size.depth) <
          4 * (b.size.width + b.size.height + b.size.depth)
            ? box_size == "ASC"
              ? 1
              : -1
            : box_size == "ASC"
            ? -1
            : 1
        );
      if (check_weight)
        box = box.sort((a, b) => (a.weight < b.weight ? 1 : -1));

      return box;
    },
    []
  );

  const onClick: MenuProps["onClick"] = useCallback(
    (e: any) => {
  
      const _selectedGroupMarker = GroupMarker.find(
        (_GroupMarker) => _GroupMarker.Index === contextMenu.Index
      );
console.log({GroupMarker,_selectedGroupMarker})
      if (_selectedGroupMarker) {
        closeContextMenu();
        let customerBox: BoxType[] = [];
        _selectedGroupMarker.Markers.forEach((_markers) => {
          _markers?.Order.forEach((_order) => {
            const _Products = _order?.Products ?? [];
            _Products.forEach((_box) => {
              for (let i = 0; i < _box.Quantity; i++)
                customerBox.push({
                  title: _box.ProductTitle,
                  weight: _box.weight,
                  color: _box.color,
                  position: _box.Position,
                  size: _box.Size,
                  rotation: _box.Rotation,
                  orderId: _order.orderID,
                  customerId: _markers.CustomerID,
                });
            });
          });
        });
        customerBox = [...SortBox(customerBox, "ASC", false)];
        SetBoxes(customerBox.map((_box, index) => ({ ..._box, index })));

        ReArrange();

        setCurrentGroupIndex(_selectedGroupMarker.Index)
        setCurrentGroup(_selectedGroupMarker);
      }
    },
    [contextMenu, GroupMarker,closeContextMenu]
  );

  useEffect(() => {
    switch (Filter) {
      case "Heavy":
        showCurrentGroupMarker([1, 3]);
        break;
      case "Light":
        showCurrentGroupMarker([2, 4]);

        break;
      case "Disable":
        showCurrentGroupMarker([]);

        break;
    }
  }, [Filter, showCurrentGroupMarker]);


  useEffect(() => {
  
    if(ContainerBox){
      const _Routes:RouteCoordinate[]=[];
      ContainerBox.forEach((_container,index)=>{
        const _Route:RouteCoordinate={Route:[],RouteColor: RouteColor[index]};
        _container.boxes.forEach((_box)=>{
           const _customer = Markers.find(
                      (_c) => _c.CustomerID === _box?.customerId,
                    );
                    if(_customer){
                      _Route.Route.push(_customer)
                    }
        })
        _Routes.push(_Route);
      })
      setCoordinates(_Routes,false);
    }
  }, [ContainerBox]);

 
  return (
    <>
      {polygonPositions.length > 3 ? (
        <Polygon interactive={false} positions={polygonPositions} pathOptions={{ color: "blue" }} />
      ) : null}
      {GroupMarker.map((group, index) => (
        <CustomMarker
          key={index}
          Index={0}
          Latitude={group?.Position?.[0] ?? 0}
          Longitude={group?.Position?.[1] ?? 0}
          MarkerID={15}
          Text={`${group.Markers.length}`}
          Hide={CurrentGroupIndex === group.Index}
          EventHandlers={{
            click: () => {
              setCurrentGroup({ ...group }, Filter);
              setCurrentGroupIndex(group.Index);
            },
            contextmenu: (e) => handleContextMenu(e, group.Index),
          }}
        />
      ))}

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={closeContextMenu}>
        <Menu
          onClick={onClick}
          style={{ width: 256, direction: "ltr" }}
          mode="inline"
          items={items}
        />
      </ContextMenu>
    </>
  );
}

export default memo(Groups);
