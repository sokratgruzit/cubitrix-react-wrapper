import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Dashboard as DasboardMain } from "@cubitrix/cubitrix-react-ui-module";

const Dashboard = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [coinsList, setCoinsList] = useState([]);
  const navigate = useNavigate();

  function loadCoinsList(page, startLoading, finishLoading) {
    if (startLoading) startLoading();
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=${page}&sparkline=true&price_change_percentage=24h`
    )
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          setCoinsList((prev) => [...prev, ...data]);
        }, 200);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (finishLoading) finishLoading();
      });
  }
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h"
    )
      .then((response) => response.json())
      .then((data) => {
        setTopCoins(data);
        setCoinsList(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleGetStarted = () => {
    navigate("/staking");
  };
  return (
    // {balance ?? "0"} tokens
    <DasboardMain
      topCoins={topCoins}
      coinsList={coinsList}
      loadCoinsList={loadCoinsList}
      handleGetStarted={handleGetStarted}
    />
  );
};

export default Dashboard;
