import { create } from "zustand";
import { GroupMarkerType, GroupType } from "./Type";

import { LatLngTuple } from "leaflet";

export const useGroupMarkerStore = create<GroupMarkerType>((set, get) => {
  const GroupMarkerPosition = (GroupMarkers: GroupType[]): GroupType[] => {
    return GroupMarkers.map((_GroupMarker, Index) => {
      const centerLat =
        _GroupMarker.Markers.reduce((sum, m) => sum + m.Latitude, 0) /
        _GroupMarker.Markers.length;
      const centerLng =
        _GroupMarker.Markers.reduce((sum, m) => sum + m.Longitude, 0) /
        _GroupMarker.Markers.length;
      const _Position: LatLngTuple = [centerLat, centerLng];
      return {
        Index,
        Position: _Position,
        Markers: _GroupMarker.Markers,
      };
    });
  };

  return {
    GroupMarker: [],
    setGroupMarker: (_GroupMarker) => {
      set(() => ({ GroupMarker: [...GroupMarkerPosition(_GroupMarker)] }));
    },
    AddMarkerToGroup: (NewGroupIndex, marker) => {
      let _GroupMarker = get().GroupMarker.map((_group) => {
        const _Markers = _group.Markers.filter(
          (_marker) =>
            _marker.Latitude !== marker.Latitude &&
            _marker.Longitude !== marker.Longitude
        );
        return { ..._group, Markers: _Markers };
      });

      // const last = _GroupMarker[NewGroupIndex].Markers.pop();
      _GroupMarker[NewGroupIndex].Markers.push(marker);
      // if (last) _GroupMarker[NewGroupIndex].Markers.push(last);

      const tmpGroupMarkers = _GroupMarker[NewGroupIndex];
      _GroupMarker = _GroupMarker.filter((_group) => _group.Markers.length > 0);

      set(() => ({ GroupMarker: [...GroupMarkerPosition(_GroupMarker)] }));
      // console.log({ tmpGroupMarkers, _GroupMarker });

      return tmpGroupMarkers;
    },

    CurrentGroup: undefined,
    setCurrentGroup: (_Group, Filter) => {
      const _markers = _Group?.Markers ?? [];
      let FilterType: number[] = [];
      switch (Filter) {
        case "Heavy":
          FilterType = [1, 3];
          break;
        case "Light":
          FilterType = [2, 4];
          break;
      }
      const _tmpMarkers = _markers.map((marker) =>
        FilterType.includes(marker.MarkerID) || FilterType.length === 0
          ? { ...marker, IsHide: false }
          : { ...marker, IsHide: true }
      );
      set(() => ({ CurrentGroup: { ..._Group, Markers: _tmpMarkers } }));
    },
    showCurrentGroupMarker: (MarkerID) => {
      let _CurrentGroup = get().CurrentGroup;
      const _markers = _CurrentGroup?.Markers ?? [];
      const _tmpMarkers = _markers.map((marker) =>
        MarkerID.includes(marker.MarkerID) || MarkerID.length === 0
          ? { ...marker, IsHide: false }
          : { ...marker, IsHide: true }
      );
      set(() => ({
        CurrentGroup: {
          ..._CurrentGroup,
          Index: _CurrentGroup?.Index ?? 0,
          Markers: _tmpMarkers,
        },
      }));
    },

    CurrentGroupIndex: -1,
    setCurrentGroupIndex: (_CurrentGroupIndex) => {
      set(() => ({ CurrentGroupIndex: _CurrentGroupIndex }));
    },
  };
});
