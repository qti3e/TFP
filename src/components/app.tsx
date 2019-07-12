import React, { Component } from "react";
import { SnackbarProvider } from "notistack";
import { Unsubscribe, actions } from "../actions";
import { Router } from "../router";
import { NewTask } from "./newTask";

export class App extends Component {
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <NewTask />
        <Router />
      </SnackbarProvider>
    );
  }
}
