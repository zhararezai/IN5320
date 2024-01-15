import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertBar, AlertStack } from "@dhis2/ui";
import "./SnackbarStyles.css";
import PropTypes from "prop-types";

const SnackbarContext = createContext(undefined);

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbarContext must be used within SnackbarContextProvider");
  }
  return context;
};

export const SnackbarContextProvider = ({ children }) => {
  const [alertStack, setAlertStack] = useState([]);

  const launchSnackbar = useCallback(({ severity, message }) => {
    setAlertStack((prevStack) => [...prevStack, { severity, message }]);
  }, []);

  const handleAlertClose = (index) => {
    setAlertStack((prevStack) => prevStack.filter((_, i) => i !== index));
  };

  return (
    <SnackbarContext.Provider value={{ launchSnackbar }}>
      {children}
      <div className="snackbar-container">
        <AlertStack>
          {alertStack.map((alert, index) => (
            <AlertBar
              key={index}
              duration={5000}
              onHidden={() => handleAlertClose(index)}
              {...(alert.severity === "info" ? {} : { [alert.severity]: true })}
            >
              {alert.message}
            </AlertBar>
          ))}
        </AlertStack>
      </div>
    </SnackbarContext.Provider>
  );
};

SnackbarContextProvider.propTypes = {
  severity: PropTypes.oneOf(["critical", "warning", "success", "info"]).isRequired,
  message: PropTypes.string.isRequired,
};
