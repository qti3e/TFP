import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DB from "../store";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
});

const CustomAppBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            The Fuckin' Plan
          </Typography>
          <Button color="inherit" onClick={() => DB.logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default CustomAppBar;
