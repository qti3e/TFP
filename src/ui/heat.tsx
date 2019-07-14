import React, { Fragment, FunctionComponent } from "react";
import ReactTooltip from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface HeatProps {}

const Heatmap: FunctionComponent<HeatProps> = props => {
  const getTooltipDataAttrs = (value: { date: Date; count: number }) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      "data-tip": `${value.date} has count: ${value.count}`
    };
  };

  return (
    <Fragment>
      <CalendarHeatmap
        startDate={new Date("2016-01-01")}
        endDate={new Date("2016-05-01")}
        classForValue={value => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-${value.count}`;
        }}
        tooltipDataAttrs={getTooltipDataAttrs}
        values={[
          { date: "2016-01-02", count: 1 },
          { date: "2016-01-03", count: 4 },
          { date: "2016-01-05", count: 2 },
          { date: "2016-02-05", count: 3 }
        ]}
      />
      <ReactTooltip />
    </Fragment>
  );
};

export default Heatmap;
