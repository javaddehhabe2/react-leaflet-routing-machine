export const GetDistance = (distance: number) =>
  (distance / 1000).toFixed(2).toString();

export const GetTime = (Distance: number, timeDistance: number = 2) => {
  const _time = (Distance / 1000) * timeDistance * 60;
  var h = Math.floor(_time / 3600);
  var m = Math.floor((_time % 3600) / 60);
  const _h = h < 10 ? `0${h}` : h.toString();
  const _m = m < 10 ? `0${m}` : m.toString();
  return `${_h}:${_m}`;
};
