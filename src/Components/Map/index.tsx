import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { type LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { MarkersDetail, Setting } from "@/Data/Map";

import Header from "./Header/Header";
import {ContextMenu, ContextMenuStateType} from "@Map/ContextMenu";
import { Storage } from "@LocalStorage/Storage";
import { useMapStore } from "@Store/MapStore";
import { useRouteStore } from "@Store/RouteStore";
import {  RouteCoordinate, RouteDetailsLS } from "./Type";
import { BottomLeft, BottomCenter } from "@Map/ControlPanel";
import { Stack } from "@mui/material";
import { RouteDetails } from "./RouteDetails";
import { RoutingMachine } from "./RoutingMachine";
import { ClusterGroup } from "./ClusterGroup";
import { useGroupMarkerStore } from "@Store/GroupMarkerStore";
import { GroupMarkerType, GroupType } from "@Store/Type";
import { GetNearDistance } from "@Utility/Map";
import { MarkerEntity } from "../Type";
import { useContainerStore } from "@Store/ContainerStore";
import { ContainerData } from "@/Data/Box";
import { Menu, type MenuProps,Modal ,Flex, Button } from "antd";
import { FaMapSigns, FaTruckPickup } from "react-icons/fa";
import { Container } from "@Container/Box";
// const Leaflet = require("leaflet");

type MenuItem = Required<MenuProps>["items"][number];

function App() {
    const [contextMenu, setContextMenu] = useState<ContextMenuStateType>({ visible: false, x: 0, y: 0, Index: 0 });
    const [openResponsive, setOpenResponsive] = useState(false);
  const { setMarkers, setShopsMarker, Markers } = useMapStore();
  const { Coordinates, setCoordinates } = useRouteStore();
  const [selectedContainer, setSelectedContainer] = useState<number>();
const {

    SetAllContainers,
  } = useContainerStore();
  const { setGroupMarker } = useGroupMarkerStore();

  const groupMarkersByDistance = useCallback(() => {
    const groups: GroupType[] = [];

    Markers.forEach((marker) => {
      let added = false;
      for (const group of groups) {
        for (const member of group.Markers) {
          const distance = GetNearDistance(
            marker.Latitude,
            marker.Longitude,
            member.Latitude,
            member.Longitude
          );
          if (distance < Setting.Threshold) {
            group.Markers.push(marker);
            added = true;
            break;
          }
        }
        if (added) break;
      }
      if (!added) {
        groups.push({ Index: groups.length + 1, Markers: [marker] });
      }
    });

    return groups;
  }, [Markers]);
  const items: MenuItem[] = useMemo( () =>([
    {
      key: "ShowContainer",
      label: "Show Container",
      icon: <FaTruckPickup />,
    },
    {
      key: "Clear Route",
      label: "Clear Route",
      icon: <FaMapSigns />,
    },
  ]),[]);
  const DefaultPosition: LatLngExpression = useMemo(() => {
    return MarkersDetail.length > 0
      ? [MarkersDetail[0].Latitude, MarkersDetail[0].Longitude]
      : [35.8, 51.47];
  }, [MarkersDetail]);

  useEffect(() => {
    const LocalRoute: RouteCoordinate[] = JSON.parse(
      Storage.getLocal("LS_Route") ?? "[]"
    );
    const LocalRouteDetail: RouteDetailsLS = JSON.parse(
      Storage.getLocal("LS_Route_Detail") ?? "{}"
    );
    if (LocalRoute.length > 0 && Coordinates.length === 0) {
      setCoordinates(LocalRoute, false);
      // if (
      //   LocalRouteDetail.currentRouteIndex &&
      //   LocalRouteDetail.currentRouteIndex < LocalRoute.length
      // )
      // setCurrentRouteIndex(LocalRouteDetail.currentRouteIndex);
    }
  }, []);

  useEffect(() => {
    setGroupMarker(groupMarkersByDistance());
  }, [Markers, setGroupMarker, groupMarkersByDistance]);

  useEffect(() => {
    setMarkers(MarkersDetail.map((_marker) => ({ ..._marker, IsHide: true })));

    const _Shops: MarkerEntity[] = [];

    let index = 1;
    MarkersDetail.forEach((marker) => {
      if (marker.Shops) {
        marker.Shops.forEach((_m) => {
          index++;
          _Shops.push({
            index: index + 100000,
            CustomerID: _m.ShopCode,
            CustomerName: _m.ShopName,
            CustomerAddress: _m.ShopAddress,
            Latitude: _m.Latitude,
            Longitude: _m.Longitude,
            MarkerID: 10,
            isVIP:false,
            Order:[]

          });
        });
      }
    });

    const ShopArray = _Shops.filter(
      (shop, index, self) =>
        index ===
        self.findIndex(
          (t) => t.Latitude === shop.Latitude && t.Longitude === shop.Longitude
        )
    );
    if (ShopArray) setShopsMarker([...ShopArray]);
  }, [MarkersDetail]);

 useEffect(() => {
    SetAllContainers(ContainerData.ContainerType);
  }, [ ContainerData]);


   const onClick: MenuProps["onClick"] = useCallback(
      (e: any) => {
    
        if(e.key==="ShowContainer"){
          setSelectedContainer(contextMenu.Index);
          setOpenResponsive(true);
          closeContextMenu()
        }
    console.log(e)
        
      },
      [contextMenu]
    );


  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  
  return (
    // <AppContextProvider initialValue={{ ...contextValue, coordinates }}>
    <>
      <Header />
      <MapContainer
        doubleClickZoom={false}
        center={DefaultPosition}
        zoom={10}
        style={{ height: "100vh", zIndex: 0 }}
        zoomControl={false}>
        <TileLayer
          attribution=""
          // url="https://{s}.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png"
        />
        {/* <WMSTileLayer
            url={`http://ows.mundialis.de/services/service?`}
            params={{transparent:true,layers:"TOPO-OSM-WMS"}}
          /> */}
        <ClusterGroup />
        {Coordinates.map((_route, index) => (
          <RoutingMachine
            key={`coor${index}`}
            waypoints={_route.Route.map((object) => [
              object.Latitude,
              object.Longitude,
            ])}
            _routeColor={_route.RouteColor}
            _index={index}
            setContextMenu={setContextMenu}
          />
        ))}

        <Control
          position="bottomleft"
          prepend
          container={{ className: "left-3" }}>
          <BottomLeft />
        </Control>
        <Control position="topright" container={{ className: "CenterControl" }}>
          <BottomCenter />
        </Control>

        <Control position="topleft">
          <Stack style={{ width: "100vw" }}>
            <RouteDetails />
          </Stack>
        </Control>
      </MapContainer>
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
            <Flex vertical gap="middle" align="flex-start">
      {/* Basic */}
     
     

      {/* Responsive */}

      <Modal
        title="Container"
        centered
        open={openResponsive}
        onCancel={() => setOpenResponsive(false)}
        footer={
          <Button type="primary" onClick={() => setOpenResponsive(false)}>
            Reload
          </Button>
        }
        // style={{height:"80vh"}}
         className="h-5/6"

         width={1000}
      >
      {selectedContainer !==undefined  ? <Container typeOfShow={"one"} containerNumber={selectedContainer??0}/>:null}
      </Modal>
    </Flex>
    </>
  );
}

export default App;
