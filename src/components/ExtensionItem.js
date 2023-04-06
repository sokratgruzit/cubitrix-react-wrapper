import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import axios from "../api/axios";

import { InnerExtensions as ExtensionItemUI } from "@cubitrix/cubitrix-react-ui-module";
import { StakingIcon } from "../assets/svg";

const ExtensionItem = () => {
  const account = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();
  const { activeExtensions } = useSelector((state) => state.extensions);
  // console.log((activeExtensions));

  function testChangeExtension(title, boolean) {
    axios
      .post("/api/accounts/manage_extensions", {
        address: account,
        extensions: { [title]: boolean === true ? "true" : "false" },
      })
      .then((res) => {
        console.log(res.data);
        if (res?.data?.account) {
          dispatch({
            type: "UPDATE_ACTIVE_EXTENSIONS",
            payload: res.data.account.extensions,
          });
        }
      })
      .catch((e) => console.log(e.response));
  }

  const extensionsCardsData = [
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Trade",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, boolean) => testChangeExtension(title.toLowerCase(), boolean),
      active: activeExtensions.trade === "true" ? true : false,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Staking",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, boolean) => testChangeExtension(title.toLowerCase(), boolean),
      active: activeExtensions.staking === "true" ? true : false,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Loan",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, boolean) => testChangeExtension(title.toLowerCase(), boolean),
      active: activeExtensions.loan === "true" ? true : false,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Referral",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, boolean) => testChangeExtension(title.toLowerCase(), boolean),
      active: activeExtensions.referral === "true" ? true : false,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Notifications",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, boolean) => testChangeExtension("notify", boolean),
      active: activeExtensions.notify === "true" ? true : false,
    },
  ];

  return <ExtensionItemUI extensionsCardsData={extensionsCardsData} />;
};

export default ExtensionItem;
