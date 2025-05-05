export const GetDistance = (distance: number) =>
  (distance / 1000);

export const GetTime = (Distance: number, timeDistance: number = 2) => {
  const _time = (Distance / 1000) * timeDistance * 60;
  var h = Math.floor(_time / 3600);
  var m = Math.floor((_time % 3600) / 60);
  const _h = h < 10 ? `0${h}` : h.toString();
  const _m = m < 10 ? `0${m}` : m.toString();
  return `${_h}:${_m}`;
};

export const GetNearDistance=(lat1: number, lng1: number, lat2: number, lng2: number)=> {
  const R = 6371e3; // meters(Earth's radius ≈ 6,371 kilometers = 6,371,000 meters.)
  const toRad = (deg: number) => deg * Math.PI / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // in meters
}
