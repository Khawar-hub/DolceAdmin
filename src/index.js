import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/createStore";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css"; // css file
import "bootstrap/dist/js/bootstrap.min.js"; // js file
import "./index.scss";
import { theme, snackBarPlacement } from "./theme/themeConfig";
import { SnackbarProvider } from "notistack";
import { StyledEngineProvider } from "@mui/material/styles";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              anchorOrigin={snackBarPlacement}
              autoHideDuration={3000}
              variant="success"
            >
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
