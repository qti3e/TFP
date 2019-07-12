import React from "react";
import ReactDOM from "react-dom";
import domLoaded from "dom-loaded";

const Main = () => <div>Hello</div>;

async function main() {
  await domLoaded;

  const root = document.getElementById("root");
  ReactDOM.render(<Main />, root);
}

main();
