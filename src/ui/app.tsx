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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      position: "absolute",
      top: "50vh",
      left: "50vw"
    }
  })
);

const App = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);

  if (loading) {
    pMinDelay(DB.load(), 600).then(() => setLoading(false));
    return <CircularProgress className={classes.progress} />;
  }

  return (
    <Fragment>
      <AppBar />
      <TaskDialog />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Widget title="Progress">
              <Progress value={60} />
            </Widget>
            <Widget title="Activity">
              <Heatmap />
            </Widget>
          </Grid>
          <Grid item xs={8}>
            <Widget title="Tasks">
              <Tasks items={[]} setChecked={() => null} />
            </Widget>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default App;
