import React from "react";
import { SnackbarContextProvider } from "./components/SnackContextProvider";
import { DataContextProvider } from "./components/DataContextProvider";
import { PageRouter } from "./components/PageRouter";

function MyApp() {

  return (
    <DataContextProvider>
      <SnackbarContextProvider>
        <PageRouter/>
      </SnackbarContextProvider>
    </DataContextProvider>
  );
}

export default MyApp;

