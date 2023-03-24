import React from "react";

import { useSelector } from "react-redux";

import Body from "./Layouts/Body/Body";

const Dashboard = () => {
  const balance = useSelector((state) => state.appState.userData?.system?.[0]?.balance);

  return (
    <div
      style={{ paddingTop: "100px", paddingLeft: "10px", height: "calc(100% - 90px)" }}
    >
      {balance ?? "0"} tokens
      <Body side="Side dash" main="Main dash" />
    </div>
  );
};

export default Dashboard;
