import React from "react";

import { useSelector } from "react-redux";

import axios from "../api/axios";

const Extensions = () => {
  const account = useSelector((state) => state.connect.account);

  return <div>Extensions</div>;
};

export default Extensions;
