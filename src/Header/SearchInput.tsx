import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Marker } from "../MarkerType";

export default function SearchInput() {
  const { allMarkers, setFlying } = useAppContext();

  const [searchResult, setSearchResult] = useState<Marker[]>([]);
  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
    const result: Marker[] = [];
    allMarkers.forEach((_marker) => {
      if (_marker.CustomerName.includes(searchValue)) result.push(_marker);
    });
    setSearchResult(result);
  }, [searchValue]);
  const FlyTo=useCallback((res:Marker)=>{
    setSearchValue('');
    setFlying({ lat: res.Latitude, lng: res.Longitude });
  },[setFlying,setSearchValue])
  return (
    <div className="flex">
      <div className="relative mr-[10px]">
        <i className="fi fi-rr-search text-base text-textcolor cursor-pointer absolute right-2 top-1 "></i>
        <input
          className="h-8 border-none rounded bg-inputcolor w-[450px] pr-8"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.currentTarget.value)
          }
        />
      </div>
      {searchResult.length > 0 ? (
        <div
          id="dropdown"
          className="absolute top-12 w-[450px] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            {searchResult.map((res,indx) => (
              <li key={`search${indx}`}
                className="p-2 border-b-[1px] border-gray-300 cursor-pointer"
                onClick={() =>FlyTo(res)}
              >
                <span>{res.CustomerName}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
