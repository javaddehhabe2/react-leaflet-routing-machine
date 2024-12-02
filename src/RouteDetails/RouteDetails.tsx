import * as React from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import { RouteDetailsType } from "./Type/RouteDetailsType";

import CustomizedTimeLine from "../TimeLine/CustomizedTimeLine";

export default function RouteDetails({ Points, Detail }: RouteDetailsType) {
  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardContent>
        {Detail?.Distance ? (
          <Typography>Distance : {Detail.Distance}</Typography>
        ) : null}
        {Detail?.Time ? <Typography>Time: {Detail.Time}</Typography> : null}
        <Divider />
        <CustomizedTimeLine Points={Points} />
      </CardContent>
    </Card>
  );
}
