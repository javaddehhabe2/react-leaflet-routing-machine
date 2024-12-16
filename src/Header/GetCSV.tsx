import { memo, useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useAppContext } from "../context/AppContext";

function GetCSV() {
  const { coordinates } = useAppContext();
  const [CSVResult, setCSVResult] = useState<string[][]>([]);

  const headers: string[] = [
    "شماره",
    "نوع حواله",
    "مالک حواله",
    "شماره فاکتور",
    "کد مشتری",
    "نام مشتری",
    "نام کالا",
    "تعداد کالا",
    "ارزش کالا",
    "مبدا",
    "استان مقصد",
    "شهر مقصد",
    "نوبت تحویل",
    "توضیحات تماس",
    "توضیحات",
    "مقصد",
    "منطقه",
  ];

  useEffect(() => {
    let _csvtemp: string[][] = [];

    coordinates.forEach(({ Route }, index) => {
      Route.forEach(
        ({ CustomerID, CustomerName, CustomerAddress, Products }) => {
          if (Products)
            Products.forEach(({ ProductTitle, Quantity }) => {
              _csvtemp.push([
                (index + 1).toString(),
                "",
                "",
                "",
                CustomerID,
                CustomerName,
                ProductTitle,
                Quantity.toString(),
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                CustomerAddress,
                "",
              ]);
            });
        }
      );
    });
    setCSVResult(_csvtemp);
  }, [coordinates]);

  const fileName = useCallback(() => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}-${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    return `output_${formattedDate}_${formattedTime}`;
  }, []);
  return CSVResult ? (
    <CSVLink data={CSVResult} headers={headers} filename={fileName()}>
      <i className="fi fi-rr-file-excel text-base text-setting" />
    </CSVLink>
  ) : (
    <i className="fi fi-rr-file-excel text-base text-modalside" />
  );
}

export default memo(GetCSV);
