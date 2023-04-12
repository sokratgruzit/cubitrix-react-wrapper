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

  const allImages = {
    dashboardHeader: {
      rocket: "/img/dashboard/rocket.png",
      dots: "/img/dashboard/dots.png",
      man: "/img/dashboard/man.png",
      planet: "/img/dashboard/planet.png",
      dotsRight: "/img/dashboard/dotsRight.png",
      bottom: "/img/dashboard/bottom.svg",
    },
    topcoins: {
      EthCard: "/img/dashboard/coinCards/EthCard.png",
      BitcoinCard: "/img/dashboard/coinCards/BitcoinCard.png",
      TetherCard: "/img/dashboard/coinCards/TetherCard.png",
      TopCoinsIcon: "/img/dashboard/TopCoinsIcon.png",
      ball: "/img/dashboard/ball.svg",
      silverCoin: "/img/dashboard/silverCoin.png",
    },
    meditation: {
      MeditationPerson: "/img/dashboard/MeditationPerson.png",
      MeditationBG: "/img/dashboard/MeditationBG.png",
    },
    startNow: {
      startNowBG: "/img/dashboard/startNowBG.png",
      bg: "/img/dashboard/startNowBG.png",
    },
  };
  return (
    // {balance ?? "0"} tokens
    <DasboardMain
      handleGetStarted={handleGetStarted}
      account={account}
      handleConnect={handleConnect}
      allImages={allImages}
    />
  );
};

export default Dashboard;
