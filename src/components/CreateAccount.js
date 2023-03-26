import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Dashboard from "./Dashboard";

const CreateAccount = () => {
  const dispatch = useDispatch();
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);

  const handleConnect = () => {
    if (sideBarOpen) {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen },
      });
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen, sideBar: "connect" },
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleConnect();
    }, 200);
  }, []);

  return <Dashboard />;
};

export default CreateAccount;
