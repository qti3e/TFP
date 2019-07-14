import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      marginTop: theme.spacing(3)
    },
    header: {
      paddingLeft: "0.3em",
      transform: "translate(-15px, -15px)",
      height: 50,
      lineHeight: 50,
      justifyContent: "center"
    }
  })
);

interface WidgetProps {
  title: string;
}

const Widget: React.FunctionComponent<WidgetProps> = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <AppBar position="static" className={classes.header}>
        <Typography variant="h5">{props.title}</Typography>
      </AppBar>
      <div style={{ padding: 5 }}>{props.children}</div>
    </Paper>
  );
};

export default Widget;
