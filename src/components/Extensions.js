import React from "react";

import { Popup, FeeWarning } from "@cubitrix/cubitrix-react-ui-module";

// hooks
import { useExtensionsData } from "../hooks/useExtensionsData";
import { useSelector, useDispatch } from "react-redux";

// UI
import { Extensions as ExtensionsUI } from "@cubitrix/cubitrix-react-ui-module";

const Extensions = () => {
  const { extensionsCardsData, handleChangeExtension } = useExtensionsData();
  const appState = useSelector((state) => state.appState);
  const dispatch = useDispatch();

  return (
    <>
      {appState.feeWarnAccountType && (
        <Popup
          popUpElement={
            <FeeWarning
              handleProceed={() => {
                if (appState.feeWarnAccountType === "loan") {
                  handleChangeExtension("loan", true);
                }
                if (appState.feeWarnAccountType === "trade") {
                  handleChangeExtension("trade", true);
                }
                dispatch({ type: "SET_FEE_WARN_TYPE", payload: null });
              }}
              handleCancel={() => dispatch({ type: "SET_FEE_WARN_TYPE", payload: null })}
            />
          }
          label={"Opening account fee"}
          handlePopUpClose={() => dispatch({ type: "SET_FEE_WARN_TYPE", payload: null })}
        />
      )}
      <ExtensionsUI
        extensionsCardsData={extensionsCardsData}
        disabledAccount={!appState?.userData?.active && appState?.userData?.step == "6"}
      />
    </>
  );
};

export default Extensions;
