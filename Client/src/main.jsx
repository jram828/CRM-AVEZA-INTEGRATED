import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import store from "./redux/store";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
const GOOGLE_ID = import.meta.env.VITE_GOOGLE_ID;

root.render(

    <GoogleOAuthProvider clientId={GOOGLE_ID}>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </GoogleOAuthProvider>
);
