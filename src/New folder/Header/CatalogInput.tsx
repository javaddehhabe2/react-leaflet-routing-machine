import React, { useCallback, ChangeEvent } from "react";
import { useAppContext } from "../context/AppContext";

export default function CatalogInput() {
  const { catalogValues, carTypes, setCarTypes } =
    useAppContext();

  const GetCatalogValue = useCallback(
    (val: number) => {
      let _currentCar = carTypes.filter((_car) => _car.CarTypeID === val);
      return _currentCar.length > 0 ? _currentCar[0].Value : 0;
    },
    [carTypes]
  );

  const OnChangeCatalog = useCallback(
    (val: string, id: number) => {
      setCarTypes((prev) =>
        [...prev].map((_c) =>
          _c.CarTypeID === id ? { ..._c, Value: Number(val) } : _c
        )
      );
    },
    [setCarTypes]
  );
  return (
    <>
      {catalogValues.map((catalog,indx) => (
        <div className="setting-item" key={`catalog${indx}`}>
          <label>{catalog.TextField}</label>
          <input
            type="number"
            min="0"
            value={GetCatalogValue(catalog.ValueField)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              OnChangeCatalog(e.currentTarget.value, catalog.ValueField)
            }
          />
          <span>متر مکعب</span>
        </div>
      ))}
    </>
  );
}
