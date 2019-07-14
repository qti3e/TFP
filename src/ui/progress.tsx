import React, { FunctionComponent } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import theme from "../theme";

interface ProgressProps {
  value: number;
}

const Progress: FunctionComponent<ProgressProps> = props => {
  const percentage = props.value;
  const text = percentage === 100 ? "🎉" : `${percentage}%`;
  const color = percentage === 100 ? "#4CAF50" : theme.palette.secondary.light;

  return (
    <CircularProgressbar
      styles={buildStyles({
        rotation: 1 / 2 + 1 / 8,
        strokeLinecap: "butt",
        trailColor: theme.palette.grey.A100,
        pathColor: color,
        textColor: theme.palette.secondary.dark
      })}
      circleRatio={0.75}
      value={percentage}
      text={text}
    />
  );
};

export default Progress;
