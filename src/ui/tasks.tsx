import React, { FunctionComponent } from "react";
import { History, Task } from "../core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
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
        const labelId = `checkbox-list-label-${value}`;

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
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.task.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Comments">
                <InfoIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Tasks;
