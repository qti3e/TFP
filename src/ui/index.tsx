import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import LoginIcon from "@material-ui/icons/Face";
import App from "./app";
import DB from "../store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      top: "50vh",
      position: "relative"
    },
    loginBtn: {
      margin: theme.spacing(1)
    },
    icon: {
      marginLeft: theme.spacing(1)
    }
  })
);

const Index = () => {
  const classes = useStyles();
  const [waiting, setWaiting] = React.useState<boolean>(true);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  if (waiting && !loggedIn) {
    DB.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
      } else if (loggedIn) {
        setLoggedIn(false);
      } else {
        setWaiting(false);
      }
    });

    return null;
  }

  if (!loggedIn) {
    return (
      <div className={classes.root}>
        <Button
          variant="contained"
          color="primary"
          className={classes.loginBtn}
          onClick={() => DB.requestLogin()}
        >
          Login
          <LoginIcon className={classes.icon} />
        </Button>
      </div>
    );
  }

  return <App />;
};

export default Index;
