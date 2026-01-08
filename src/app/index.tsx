import "@/app/i18n";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { AppRouter } from "./router";
import { store } from "./store";

import "@/shared/assets/css/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>,
);
