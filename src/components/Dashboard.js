import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Dashboard as DasboardMain } from "@cubitrix/cubitrix-react-ui-module";
import { useSelector, useDispatch } from "react-redux";

// const dashboardImg = require("../../assets/img/dashboard/rocket.png");

const Dashboard = () => {
  const userData = useSelector((state) => state.appState?.userData);
  const account = useSelector((state) => state.connect?.account);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetStarted = () => {
    if (userData?.meta?.[0]?.email && userData?.extensions.staking === "true") {
      navigate("/staking");
    } else if (userData?.meta?.[0]?.email) {
      navigate("/extensions");
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: true, sideBar: "connect" },
      });
    }
  };

  function handleConnect() {
    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: true, sideBar: "connect" },
    });
  }
  return (
    // {balance ?? "0"} tokens
    <DasboardMain
      handleGetStarted={handleGetStarted}
      account={account}
      handleConnect={handleConnect}
      allImages={{ startNow: { bg: "/img/dashboard/startNowBG.png" } }}
    />
  );
};

export default Dashboard;
