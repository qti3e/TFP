import React from "react";
import ReactDOM from "react-dom";
import domLoaded from "dom-loaded";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import App from "./ui/app";
import "typeface-roboto";
import "date-fns";
import "./styles.scss";

const AppWithTheme = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

domLoaded.then(() => {
  const root = document.getElementById("root");
  ReactDOM.render(<AppWithTheme />, root);
});
