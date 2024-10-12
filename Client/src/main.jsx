import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import store from "./redux/store";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(

    <GoogleOAuthProvider clientId="844309234209-e072sos6qgabufkk0tmgv74900fknd62.apps.googleusercontent.com">
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </GoogleOAuthProvider>
);
