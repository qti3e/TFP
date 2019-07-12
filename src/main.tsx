import React from "react";
import ReactDOM from "react-dom";
import domLoaded from "dom-loaded";
import { App } from "./components/app";
import "./styles.scss";

domLoaded.then(() => {
  const root = document.getElementById("root");
  ReactDOM.render(<App />, root);
});
