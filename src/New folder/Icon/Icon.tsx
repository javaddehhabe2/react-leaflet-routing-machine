import { useCallback, memo } from "react";
import { IconType1 } from "./Type/IconType";

function Icon1({
  type,
  text,
  index,
  Shadow,
  isSelected,
  routeColor,
}: IconType1) {
  const MarkerType = useCallback(() => {
    switch (type) {
      case 1:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
      case 2:
        return `fi-${isSelected ? "s" : "r"}s-land-layer-location`;
      case 3:
        return `fi-${isSelected ? "s" : "r"}s-location-alt`;
      case 4:
        return `fi-${isSelected ? "s" : "r"}s-marker-time`;
      case 10: // Shop icon
        return `fi-${isSelected ? "ss" : "rr"}-shop`;
      default:
        return `fi-${isSelected ? "s" : "r"}s-marker`;
    }
  }, [isSelected, type]);

  return (
    <div
      className={`absolute ${
        Shadow
          ? "-left-[0.35rem] -top-[1.9rem] animate-pulse "
          : "left-0 -top-6 "
      }`}
    >
      {
        <i
          className={`fi ${MarkerType()} ${Shadow ? "shadowMarker" : ""}`}
          style={{
            fontSize: Shadow ? "2.3rem" : "1.6rem",
            color: routeColor,
          }}
        ></i>
      }

      <MarkerName
        text={text}
        index={index}
        routeColor={routeColor}
        type={type}
      />
    </div>
  );
}
function MarkerName({
  text,
  index,
  routeColor,
  type,
}: {
  text: string;
  index: number;
  routeColor: string;
  type: number;
}) {
  return (
    <>
      {type === 10 ? (
        <div
          className="absolute left-[50%] p-1  translate-x-[-50%] -bottom-3 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: routeColor }}
        >
          <span className="whitespace-nowrap"> {text}</span>
          {index ? (
            <span className="p-1 rounded-sm bg-togglecolor text-black">
              {index.toString()}
            </span>
          ) : null}
        </div>
      ) : index ? (
        <span
          className="absolute w-[70%]  left-[50%]  translate-x-[-50%] bottom-0 text-center text-xxs font-medium rounded-sm text-white"
          style={{ backgroundColor: routeColor }}
        >
          {index}
        </span>
      ) : null}
    </>
  );
}
export default memo(Icon1);
