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
    if (userData?.meta?.email && userData?.extensions.staking === "true") {
      navigate("/staking");
    } else if (userData?.meta?.email) {
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
    },
  };

  function handleAction(act) {
    window.scrollTo(0, 0);
    if (act === "Become a Member") {
      return dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: true, sideBar: "connect" },
      });
    }

    if (userData?.meta?.email) {
      if (act === "Make Staking" && userData?.extensions.staking === "true") {
        return navigate("/staking");
      }
      if (act === "Trade Now" && userData?.extensions.trade === "true") {
        return navigate("/trade");
      }
      if (act === "Make Loan" && userData?.extensions.loan === "true") {
        return navigate("/loan");
      }
      navigate("/extensions");
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: true, sideBar: "connect" },
      });
    }
  }
  return (
    // {balance ?? "0"} tokens
    <DasboardMain
      handleGetStarted={handleGetStarted}
      account={account}
      handleConnect={handleConnect}
      allImages={allImages}
      info={[
        {
          title: "USERS",
          amount: "1.3 B",
          action: (act) => handleAction(act),
          linkTitle: "Become a Member",
        },
        {
          title: "TRADE",
          amount: "8 M",
          action: (act) => handleAction(act),
          linkTitle: "Trade Now",
        },
        {
          title: "STAKED",
          amount: "4 B",
          action: (act) => handleAction(act),
          linkTitle: "Make Staking",
        },
        {
          title: "LOAN",
          amount: "1 B",
          action: (act) => handleAction(act),
          linkTitle: "Make Loan",
        },
      ]}
    />
  );
};

export default Dashboard;
