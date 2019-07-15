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
import { Task, History, createDailyPlan, createHistoryRecord } from "../core";
import * as date from "../core/date";

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
  const history: History = await DB.getHistory();
  const today = date.jsDate2TimeRecord(new Date());
  const oldHistory = history.filter(hr => !date.isSameDay(today, hr.time));
  const todayPlan = createDailyPlan(oldHistory, tasks, new Date());

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
  const today = date.jsDate2TimeRecord(new Date());

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

  const done = state.history.filter(hr => date.isSameDay(hr.time, today));
  const doneCopy = [...done];
  const isDone = (task: Task): boolean => {
    const index = doneCopy.findIndex(hr => hr.taskUUID === task.uuid);
    if (index < 0) return false;
    doneCopy.splice(index, 1);
    return true;
  };

  const plan = state.todayPlan.map((task, index) => ({
    task,
    checked: isDone(task)
  }));

  const handleCheck = async (index: number, checked: boolean) => {
    if (plan[index].checked === checked) return;
    const task = plan[index].task;

    if (checked) {
      await DB.push2History(createHistoryRecord(task, new Date()));
    } else {
      const hr = done.find(hr => hr.taskUUID === task.uuid);
      await DB.delFromHistory(hr!);
    }

    setState({
      ...state,
      history: await DB.getHistory()
    });
  };

  plan.sort((a, b) => {
    if (a.checked === b.checked) return 0;
    if (a.checked) return -1;
    if (b.checked) return 1;
    return 0;
  });

  const checked = plan.filter(t => t.checked);
  const progress =
    plan.length > 0
      ? Number(((checked.length / plan.length) * 100).toFixed(2))
      : 100;

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
              <Heatmap history={state.history} />
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
