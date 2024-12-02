import * as React from "react";
import { Typography } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import { CustomizedTimeLineType } from "./Type/CustomizedTimeLineType";

export default function CustomizedTimeline({ Points }: CustomizedTimeLineType) {
  return (
    <Timeline position="left">
      {Points.Route.map((point, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
              <KeyboardDoubleArrowDownIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography variant="h6" component="span">
              {point.CustomerFullName}
            </Typography>
            <Typography component="span">{point.CustomerCode}</Typography>
            <Typography> {point.CustomerAddress}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
