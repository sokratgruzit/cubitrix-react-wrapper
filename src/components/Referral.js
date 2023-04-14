import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// UI
import {
  Referral as ReferralUI,
  Popup,
  PopupElement,
  LevelSystem,
  Button,
} from "@cubitrix/cubitrix-react-ui-module";

// svgs
import { StickyNoteIcon, AddSquareIcon, NoHistoryIcon } from "../assets/svg";

// api
import axios from "../api/axios";

const Referral = () => {
  const [createCodePopupActive, setCreateCodePopupActive] = useState(false);
  const [levelSystemPopupActive, setLevelSystemPopupActive] = useState(false);
  const [createCodeObject, setCreateCodeObject] = useState({});
  const [codesTableData, setCodesTableData] = useState([]);
  const [rebatesTableData, setRebatesTableData] = useState([]);
  const [levelSystemTableOptions, setLevelSystemTableOptions] = useState([]);
  const [referralCodes, setReferralCodes] = useState({});
  const [rebatesCurrentPage, setRebatesCurrentPage] = useState(1);
  const [codesCurrentPage, setCodesCurrentPage] = useState(1);
  const [codesPaginationTotal, setCodesPaginationTotal] = useState(1);
  const [rebatesPaginationTotal, setRebatesPaginationTotal] = useState(1);
  const [referralCodeTableLoading, setReferralCodeTableLoading] = useState(false);
  const [referralHistoryTableLoading, setReferralHistoryTableLoading] = useState(false);
  const [createCodeError, setCreateCodeError] = useState("");
  const [createCodeSuccess, setCreateCodeSuccess] = useState("");

  const account = useSelector((state) => state.connect.account);
  const triedReconnect = useSelector((state) => state.appState.triedReconnect);

  const [referralTotal, setReferralTotal] = useState({
    rebatesUniLevel: 0,
    rebatesBinaryTotal: 0,
    weeklyUniLevel: 0,
    weeklyBinaryTotal: 0,
    rebatesTotal: 0,
    weeklyTotal: 0,
  });
  const width = 1300;

  const handleCreateCode = () => setCreateCodePopupActive(true);
  const handleLevelSystem = () => setLevelSystemPopupActive(true);

  const referralCards = [
    {
      label: "Create Code To Start",
      description: "Your Rebate Rate",
      button: (
        <Button
          element={"referral-button"}
          label={"Create Code"}
          icon={<AddSquareIcon color={"#FFF"} />}
          active={true}
          onClick={handleCreateCode}
        />
      ),
    },
    {
      label: "Create Code To Start",
      description: "Your Tier",
      button: (
        <Button
          element={"referral-button"}
          label={"Level System"}
          icon={<StickyNoteIcon />}
          onClick={() => setLevelSystemPopupActive(true)}
        />
      ),
    },
  ];

  const generateCode = async () => {
    try {
      const { data } = await axios.post("/api/referral/get_referrals_by_address", {
        address: account,
      });

      let codesData = {};

      Array.isArray(data) &&
        data?.forEach((item) => {
          item.referral_type === "binary"
            ? (codesData = { ...codesData, binary: item.referral })
            : (codesData = { ...codesData, referral: item.referral });
        });

      if (data.length > 0) {
        setReferralCodes(codesData);
      }

      if (data.length === 0) {
        const { data: generateCodeData } = await axios.post(
          "/api/referral/bind_referral_to_user",
          {
            address: account,
          },
        );

        Array.isArray(data) &&
          generateCodeData?.forEach((item) => {
            item.referral_type === "binary"
              ? (codesData = { ...codesData, binary: item.referral })
              : (codesData = { ...codesData, referral: item.referral });
          });

        setReferralCodes(codesData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const generateTableData = async (table, page) => {
    table === "codes"
      ? setReferralCodeTableLoading(true)
      : setReferralHistoryTableLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/referral/${
          table === "codes"
            ? "get_referral_code_of_user"
            : "get_referral_rebates_history_of_user"
        }`,
        {
          address: account,
          limit: 5,
          page: page || 1,
        },
      );

      if (table === "codes") {
        setCodesTableData(data.referral_code);
        setCodesPaginationTotal(data.total_pages);
      } else {
        setRebatesTableData(data.referral_rebates_history);
        setRebatesPaginationTotal(data.total_pages);
      }
    } catch (err) {
      console.log(err);
    }
    table === "codes"
      ? setReferralCodeTableLoading(false)
      : setReferralHistoryTableLoading(false);
  };

  const getReferralTotal = async () => {
    try {
      const { data } = await axios.post("/api/referral/get_referral_data_of_user", {
        address: account,
      });

      let total = {
        rebatesUniLevel: 0,
        rebatesBinaryTotal: 0,
        weeklyUniLevel: 0,
        weeklyBinaryTotal: 0,
      };

      data.total_referral_rebates_total.forEach((item) => {
        if (item._id === "referral_bonus_uni_level") {
          return (total.rebatesUniLevel = item.amount);
        }
        total.rebatesBinaryTotal = total.rebatesBinaryTotal + item.amount;
      });

      data.total_referral_rebates_weekly.forEach((item) => {
        if (item._id === "referral_bonus_uni_level") {
          return (total.weeklyUniLevel = item.amount);
        }
        total.weeklyBinaryTotal = total.weeklyBinaryTotal + item.amount;
      });

      setReferralTotal({
        ...total,
        rebatesTotal: total.rebatesUniLevel + total.rebatesBinaryTotal,
        weeklyTotal: total.weeklyUniLevel + total.weeklyBinaryTotal,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getOptions = async () => {
    try {
      const { data } = await axios.get("/api/referral/get_referral_options");

      setLevelSystemTableOptions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCodeSubmit = async () => {
    setCreateCodeError("");
    setCreateCodeSuccess("");
    try {
      const results = await Promise.allSettled([
        axios.post("/api/referral/assign_refferal_to_user", {
          referral: createCodeObject.referral,
          address: account,
        }),
        generateCode(),
        generateTableData("codes"),
        generateTableData("rebates"),
        getReferralTotal(),
      ]);

      if (results?.[0].status === "rejected") {
        setCreateCodeError(results?.[0]?.reason?.response?.data);
      } else {
        setCreateCodeSuccess("Referral Added Successfully");
      }

      setTimeout(() => {
        setCreateCodePopupActive(false);
        setCreateCodeSuccess("");
        setCreateCodeError("");
      }, 3000);
    } catch (err) {
      console.log(err);
      setCreateCodeError(err.response.data);
      setTimeout(() => {
        setCreateCodeError("");
      }, 3000);
    }
  };

  useEffect(() => {
    if (account && triedReconnect) {
      async function handleRefferalStart() {
        await Promise.allSettled([
          generateTableData("codes"),
          generateTableData("rebates"),
          getReferralTotal(),
          generateCode(),
        ]);
      }
      handleRefferalStart();
    }
    getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  let referralCodeTh = [
    {
      name: "My Referral Code",
      width: 15,
      id: 0,
    },
    {
      name: "User Address",
      width: 15,
      mobileWidth: 45,
      id: 1,
    },
    {
      name: "User Level",
      width: 15,
      id: 2,
    },
    {
      name: "Rate",
      width: 15,
      id: 3,
    },
    {
      name: "Total Earned",
      width: 15,
      mobileWidth: 45,
      id: 4,
    },
  ];

  let referralHistoryTh = [
    {
      name: "From",
      width: 15,
      mobileWidth: 45,
      id: 0,
    },
    {
      name: "Referral Code",
      width: 15,
      id: 1,
    },
    {
      name: "Referral Level",
      width: 15,
      id: 2,
    },
    {
      name: "Amount",
      width: 15,
      mobileWidth: 45,
      id: 3,
    },
  ];

  let handleChange = (e) => {
    const { name, value } = e.target;
    setCreateCodeObject((prev) => ({ ...prev, [name]: value }));
  };

  const inputs = [
    {
      title: "",
      name: "referral",
      placeholder: "Enter Code",
      required: true,
      validation: "text",
      successText: "it is valid",
      failureText: "its not valid",
      onChange: (e) => handleChange(e),
    },
  ];

  let popUpTh = [
    {
      name: "Level",
      width: 15,
      id: 0,
    },
    {
      name: "Compland Holding (USD)",
      width: 30,
      id: 1,
    },
    {
      name: "Rebate Rate",
      width: 15,
      id: 2,
    },
  ];

  let popUpTd = [
    {
      level: "UNI LVL",
      complandHolding: "-",
      rebaseRate: "-",
    },
    {
      level: "VIP 1",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_1 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_1
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_1 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 2",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_2 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_2
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_2 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 3",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_3 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_3
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_3 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 4",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_4 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_4
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_4 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 5",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_5 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_5
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_5 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 6",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_6 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_6
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_6 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 7",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_7 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_7
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_7 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 8",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_8 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_8
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_8 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 9",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_9 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_9
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_9 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 10",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_10 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_10
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_10 + "%"
          : "-"
      }`,
    },
    {
      level: "VIP 11",
      complandHolding: levelSystemTableOptions?.referral_binary_max_amount_lvl_11 || "-",
      rebaseRate: `${
        levelSystemTableOptions.referral_binary_percentage_lvl_11
          ? levelSystemTableOptions?.referral_binary_percentage_lvl_11 + "%"
          : "-"
      }`,
    },
  ];

  const referralCodeTableEmpty = {
    label: "Please Create Your Code",
    button: (
      <Button
        element={"referral-button"}
        label={"Create Code"}
        icon={<AddSquareIcon color={"#00C6FF"} />}
        onClick={handleCreateCode}
      />
    ),
  };

  const referralHistoryTableEmpty = {
    label: "No Referral History",
    icon: <NoHistoryIcon />,
  };

  const referralRebatesTotal = [
    {
      title: "Rebates Uni Total",
      value: referralTotal?.rebatesUniLevel,
    },
    {
      title: "Rebates Binary Total",
      value: referralTotal?.rebatesBinaryTotal,
    },
    {
      title: "Rebates Total",
      value: referralTotal?.rebatesTotal,
    },
    {
      title: "Weekly Uni Total",
      value: referralTotal?.weeklyUniLevel,
    },
    {
      title: "Weekly Binary Total",
      value: referralTotal?.weeklyBinaryTotal,
    },
    {
      title: "Weekly Total",
      value: referralTotal?.weeklyTotal,
    },
  ];

  const referralCodesCardData = [
    {
      title: "Referral Code",
      value: referralCodes?.referral || "-",
    },
    {
      title: "Binary Code",
      value: referralCodes?.binary || "-",
    },
  ];

  return (
    <>
      <ReferralUI
        cards={referralCards}
        handleCreateCode={handleCreateCode}
        referralHistoryTableHead={referralHistoryTh}
        rebatesTableData={rebatesTableData}
        referralCodeTableHead={referralCodeTh}
        codesTableData={codesTableData}
        referralCodeTableEmpty={referralCodeTableEmpty}
        referralHistoryTableEmpty={referralHistoryTableEmpty}
        referralHistoryTableLoading={referralHistoryTableLoading}
        referralCodeTableLoading={referralCodeTableLoading}
        referralHistoryPaginationCurrent={rebatesCurrentPage}
        referralHistoryPaginationTotal={rebatesPaginationTotal}
        referralHistoryPaginationEvent={(page) => {
          setRebatesCurrentPage(page);
          generateTableData("rebates", page);
        }}
        referralCodePaginationCurrent={codesCurrentPage}
        referralCodePaginationTotal={codesPaginationTotal}
        referralCodePaginationEvent={(page) => {
          setCodesCurrentPage(page);
          generateTableData("codes", page);
        }}
        referralRebatesTotal={referralRebatesTotal}
        referralCodesCardData={referralCodesCardData}
        handleLevelSystem={handleLevelSystem}
      />
      {createCodePopupActive && (
        <Popup
          popUpElement={
            <PopupElement
              inputs={inputs}
              currentObject={createCodeObject}
              setCurrentObject={setCreateCodeObject}
              handleSubmit={handleCreateCodeSubmit}
              submitButtonLabel={"Enter a Code"}
              customStyles={{ gridTemplateColumns: "100%" }}
              popUpElementError={createCodeError}
              popUpElementSuccess={createCodeSuccess}
            />
          }
          label={"Create Referral Code"}
          handlePopUpClose={() => setCreateCodePopupActive(false)}
          customStyles={{ width: "423px" }}
          headerCustomStyles={{ background: "#272C57" }}
        />
      )}
      {levelSystemPopupActive && (
        <Popup
          popUpElement={
            <LevelSystem tableHead={popUpTh} tableData={popUpTd} mobile={width <= 1300} />
          }
          label={"Referrer Level System"}
          handlePopUpClose={() => setLevelSystemPopupActive(false)}
          description={
            "Everyone starts with the Casual tier, and you can level up the tier by increasing your Comland holding"
          }
          headerCustomStyles={{ background: "#272C57" }}
        />
      )}
    </>
  );
};

export default Referral;
