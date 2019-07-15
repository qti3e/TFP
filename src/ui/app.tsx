import React, { Fragment } from "react";
import pMinDelay from "p-min-delay";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import AppBar from "./appBar";
import Widget from "./widget";
import Progress from "./progress";
import Heatmap from "./heat";
import Tasks from "./tasks";
import TaskDialog from "./taskDialog";
import DB from "../store";
import { Task, History, createDailyPlan } from "../core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      position: "absolute",
      top: "50vh",
      left: "50vw"
    }
  })
);

const load = async () => {
  await DB.load();
  const tasks = await DB.getTasks();
  const history: History = [];
  const todayPlan = createDailyPlan(history, tasks, new Date());

  return {
    tasks,
    history,
    todayPlan
  };
};

const App = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<{
    loading: boolean;
    tasks: Task[];
    history: History;
    todayPlan: Task[];
  }>({ loading: true, tasks: [], history: [], todayPlan: [] });
  const [checked, setChecked] = React.useState<number[]>([]);

  if (state.loading) {
    pMinDelay(load(), 600).then(data => {
      setState({
        loading: false,
        ...data
      });
    });
    return <CircularProgress className={classes.progress} />;
  }

  const handleNewTask = () => {
    setState({
      ...state,
      loading: true
    });

    pMinDelay(load(), 600).then(data => {
      setState({
        loading: false,
        ...data
      });
    });
  };

  const plan = state.todayPlan.map((task, index) => ({
    task,
    checked: checked.indexOf(index) > -1
  }));

  const handleCheck = (index: number, value: boolean) => {
    const newChecked = checked.filter(i => i !== index);
    if (value) newChecked.push(index);
    setChecked(newChecked);
  };

  const progress = Number(((checked.length / plan.length) * 100).toFixed(2));

  return (
    <Fragment>
      <AppBar />
      <TaskDialog onChange={handleNewTask} />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Widget title="Progress">
              <Progress value={progress} />
            </Widget>
            <Widget title="Activity">
              <Heatmap />
            </Widget>
          </Grid>
          <Grid item xs={8}>
            <Widget title="Tasks">
              <Tasks items={plan} setChecked={handleCheck} />
            </Widget>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default App;
