import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { Index } from "./pages";

export const Router = () => (
  <BrowserRouter>
    <Route path="/" exact component={Index} />
  </BrowserRouter>
);
