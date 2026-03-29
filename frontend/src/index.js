import React from "react";
import { createRoot } from "react-dom/client"; // เปลี่ยนการ import ตรงนี้
import { Provider } from "react-redux";
import store from "./store/ReduxStore";
import App from "./App";


const container = document.getElementById("root");

const root = createRoot(container);


root.render(
  <Provider store={store}>
    <App />
  </Provider>
);