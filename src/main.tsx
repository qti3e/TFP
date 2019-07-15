import React from "react";
import ReactDOM from "react-dom";
import domLoaded from "dom-loaded";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import Index from "./ui/index";
import "typeface-roboto";
import "date-fns";
import "./styles.scss";

const AppWithTheme = () => (
  <ThemeProvider theme={theme}>
    <Index />
  </ThemeProvider>
);

domLoaded.then(() => {
  const root = document.getElementById("root");
  ReactDOM.render(<AppWithTheme />, root);
});
