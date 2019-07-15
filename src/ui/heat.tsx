import React, { Fragment, FunctionComponent } from "react";
import ReactTooltip from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { History } from "../core";
import * as date from "../core/date";

interface HeatProps {
  history: History;
}

const Heatmap: FunctionComponent<HeatProps> = props => {
  const getTooltipDataAttrs = (value: { date: Date; count: number }) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }

    return {
      "data-tip": `${value.count} tasks done on ${value.date.toDateString()}`
    };
  };

  const countMap = new Map();

  props.history.map(hr => {
    const { year, month, date } = hr.time;
    const jsDate = new Date(Date.UTC(year, month, date));
    const key = jsDate.toDateString();
    countMap.set(key, (countMap.get(key) || 0) + 1);
  });

  const values = [...countMap.keys()].map(key => ({
    date: new Date(key),
    count: countMap.get(key)
  }));

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  return (
    <Fragment>
      <CalendarHeatmap
        startDate={startDate}
        endDate={new Date()}
        classForValue={value => {
          if (!value) return "color-empty";
          return `color-github-${value.count}`;
        }}
        tooltipDataAttrs={getTooltipDataAttrs}
        values={values}
      />
      <ReactTooltip />
    </Fragment>
  );
};

export default Heatmap;
