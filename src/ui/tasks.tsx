import React, { FunctionComponent } from "react";
import { History, Task } from "../core";
import * as date from "../core/date";
import humanizeDuration from "humanize-duration";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TimerIcon from "@material-ui/icons/Timer";
import FlagIcon from "@material-ui/icons/Flag";
import CalendarIcon from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    iconContainer: {
      display: "inline-block",
      marginRight: theme.spacing(2)
    }
  })
);

type TaskItem = {
  task: Task;
  checked: boolean;
};

interface TasksProps {
  items: TaskItem[];
  setChecked: (index: number, checked: boolean) => void;
}

const Tasks: FunctionComponent<TasksProps> = props => {
  const classes = useStyles();
  const { items, setChecked } = props;

  const handleToggle = (value: TaskItem) => () => {
    const newValue = !value.checked;
    setChecked(items.indexOf(value), newValue);
  };

  if (items.length === 0) {
    return (
      <Typography variant="h6" align="center">
        🦄 There is nothing here! Go and rest :)
      </Typography>
    );
  }

  return (
    <List className={classes.root}>
      {items.map((value, index) => {
        const { task } = value;
        const labelId = `checkbox-list-label-${value}`;
        const detailItems = [
          <span className={classes.iconContainer} key="kind">
            <FlagIcon /> {task.type}
          </span>
        ];

        if (task.duration) {
          detailItems.push(
            <span className={classes.iconContainer} key="duration">
              <TimerIcon /> {humanizeDuration(task.duration * 60 * 1000)}
            </span>
          );
        }

        if (task.startAt) {
          const { hours, minutes } = date.parseTime(task.startAt);
          const d = new Date();
          d.setHours(hours);
          d.setMinutes(minutes);
          detailItems.push(
            <span className={classes.iconContainer} key="start-at">
              <CalendarIcon />
              {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          );
        }

        return (
          <ListItem
            key={value.task.uuid + "-" + index}
            role={undefined}
            dense
            button
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={value.checked}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={value.task.title}
              secondary={detailItems}
              primaryTypographyProps={{ variant: "h4" }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default Tasks;
