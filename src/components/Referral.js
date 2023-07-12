import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

// UI
import {
  Referral as ReferralUI,
  Popup,
  PopupElement,
  LevelSystem,
  Button,
} from "@cubitrix/cubitrix-react-ui-module";

import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

// svgs
import { StickyNoteIcon, AddSquareIcon, NoHistoryIcon } from "../assets/svg";

// api
import axios from "../api/axios";

const Referral = () => {
  const [createCodePopupActive, setCreateCodePopupActive] = useState(false);
  const [levelSystemPopupActive, setLevelSystemPopupActive] = useState(false);
  const [createCodeObject, setCreateCodeObject] = useState({});
  const [rebatesTableData, setRebatesTableData] = useState([]);
  const [levelSystemTableOptions, setLevelSystemTableOptions] = useState([]);

  const [referralCodeTableLoading, setReferralCodeTableLoading] = useState(false);
  const [createCodeError, setCreateCodeError] = useState("");
  const [createCodeSuccess, setCreateCodeSuccess] = useState("");
  const [referralBinaryType, setReferralBinaryType] = useState("visual");
  const [referralTableType, setReferralTableType] = useState("binary");
  const [referralTreeData, setReferralTreeData] = useState([]);
  const [referralTableData, setReferralTableData] = useState([]);
  const [referralAddress, setReferralAddress] = useState(null);
  const [animateTree, setAnimateTree] = useState(false);
  const [activeTreeUser, setActiveTreeUser] = useState({
    user_address: "",
  });

  const [binaryTreePage, setBinaryTreePage] = useState(1);
  const [binaryTreePageTotal, setBinaryTreePageTotal] = useState(1);
  const [referralHistoryTableLoading, setReferralHistoryTableLoading] = useState(false);

  const [referralHistoryType, setReferralHistoryType] = useState("uni");
  const [rebatesCurrentPageUni, setRebatesCurrentPageUni] = useState(1);
  const [rebatesPaginationTotalUni, setRebatesPaginationTotalUni] = useState(1);

  // const [rebatesCurrentPage, setRebatesCurrentPage] = useState(1);
  // const [rebatesPaginationTotal, setRebatesPaginationTotal] = useState(1);

  const triedReconnect = useSelector((state) => state.appState.triedReconnect);

  const { account, active } = useConnect();

  const [referralTotal, setReferralTotal] = useState(false);
  const width = 1300;
  let tableVisualType =
    referralTableType === "binary" ? (
      <div className={`referral-inner-table-more`}>
        <div
          className={`referral-table-more-svg ${
            referralBinaryType === "visual" ? "referral-table-more-svg_active" : ""
          }`}
          onClick={() => setReferralBinaryType("visual")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.25 19C11.25 19.41 11.59 19.75 12 19.75C12.41 19.75 12.75 19.41 12.75 19L12.75 11.75L17 11.75C18.58 11.75 19.25 12.42 19.25 14L19.25 19C19.25 19.41 19.59 19.75 20 19.75C20.41 19.75 20.75 19.41 20.75 19L20.75 14C20.75 11.58 19.42 10.25 17 10.25L12.75 10.25L12.75 5C12.75 4.59 12.41 4.25 12 4.25C11.59 4.25 11.25 4.59 11.25 5L11.25 10.25L7 10.25C4.58 10.25 3.25 11.58 3.25 14L3.25 19C3.25 19.41 3.59 19.75 4 19.75C4.41 19.75 4.75 19.41 4.75 19L4.75 14C4.75 12.42 5.42 11.75 7 11.75L11.25 11.75L11.25 19Z"
              fill="#B3B3B3"
            />
            <path
              d="M9.75 20C9.75 20.5967 9.98705 21.169 10.409 21.591C10.831 22.0129 11.4033 22.25 12 22.25C12.5967 22.25 13.169 22.0129 13.591 21.591C14.0129 21.169 14.25 20.5967 14.25 20C14.25 19.4033 14.0129 18.831 13.591 18.409C13.169 17.9871 12.5967 17.75 12 17.75C11.4033 17.75 10.831 17.9871 10.409 18.409C9.98705 18.831 9.75 19.4033 9.75 20Z"
              fill="white"
            />
            <path
              d="M17.75 20C17.75 20.5967 17.9871 21.169 18.409 21.591C18.831 22.0129 19.4033 22.25 20 22.25C20.5967 22.25 21.169 22.0129 21.591 21.591C22.0129 21.169 22.25 20.5967 22.25 20C22.25 19.4033 22.0129 18.831 21.591 18.409C21.169 17.9871 20.5967 17.75 20 17.75C19.4033 17.75 18.831 17.9871 18.409 18.409C17.9871 18.831 17.75 19.4033 17.75 20Z"
              fill="white"
            />
            <path
              d="M1.75 20C1.75 20.2955 1.8082 20.5881 1.92127 20.861C2.03434 21.134 2.20008 21.3821 2.40901 21.591C2.61794 21.7999 2.86598 21.9657 3.13896 22.0787C3.41194 22.1918 3.70453 22.25 4 22.25C4.29547 22.25 4.58806 22.1918 4.86104 22.0787C5.13402 21.9657 5.38206 21.7999 5.59099 21.591C5.79992 21.3821 5.96566 21.134 6.07873 20.861C6.1918 20.5881 6.25 20.2955 6.25 20C6.25 19.4033 6.01295 18.831 5.59099 18.409C5.16903 17.9871 4.59674 17.75 4 17.75C3.40326 17.75 2.83097 17.9871 2.40901 18.409C1.98705 18.831 1.75 19.4033 1.75 20Z"
              fill="white"
            />
            <path
              d="M9.75 4C9.75 4.59674 9.98705 5.16903 10.409 5.59099C10.831 6.01295 11.4033 6.25 12 6.25C12.5967 6.25 13.169 6.01295 13.591 5.59099C14.0129 5.16903 14.25 4.59674 14.25 4C14.25 3.40326 14.0129 2.83097 13.591 2.40901C13.169 1.98705 12.5967 1.75 12 1.75C11.4033 1.75 10.831 1.98705 10.409 2.40901C9.98705 2.83097 9.75 3.40326 9.75 4Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          className={`referral-table-more-svg ${
            referralBinaryType === "table" ? "referral-table-more-svg_active" : ""
          }`}
          onClick={() => setReferralBinaryType("table")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.9 13.5H4.1C2.6 13.5 2 14.14 2 15.73V19.77C2 21.36 2.6 22 4.1 22H19.9C21.4 22 22 21.36 22 19.77V15.73C22 14.14 21.4 13.5 19.9 13.5Z"
              fill="#B3B3B3"
            />
            <path
              d="M19.9 2H4.1C2.6 2 2 2.64 2 4.23V8.27C2 9.86 2.6 10.5 4.1 10.5H19.9C21.4 10.5 22 9.86 22 8.27V4.23C22 2.64 21.4 2 19.9 2Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    ) : (
      <div style={{ width: "152px", height: "10px" }}></div>
    );
  let tableType = (
    <div className={`referral-inner-table-more`}>
      <div
        className={`referral-table-more-svg ${
          referralTableType === "uni" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => {
          setReferralTableType("uni");
          setReferralBinaryType("table");
        }}>
        Uni
      </div>
      <div
        className={`referral-table-more-svg ${
          referralTableType === "binary" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => setReferralTableType("binary")}>
        Binary
      </div>
    </div>
  );
  let referralStats = async () => {
    try {
      const { data } = await axios.post("/api/referral/get_reerral_global_data", {
        address: referralAddress,
      });
      setReferralTotal(data);
    } catch (err) {
      console.log(err);
    }
  };
  let referralTreeUserBackClick = async () => {
    if (account !== activeTreeUser.user_address) {
      setAnimateTree(false);
      try {
        try {
          const { data } = await axios.post("/api/referral/get_referral_parent_address", {
            address: activeTreeUser.user_address,
          });
          console.log(data);
          let newUser = {
            user_address: data,
          };
          referralTreeUserClick(newUser);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  let referralTreeUserClick = async (item) => {
    setAnimateTree(false);
    try {
      try {
        const { data } = await axios.post("/api/referral/get_referral_tree", {
          address: referralAddress,
          second_address: item.user_address,
        });

        console.log(data);
        setTimeout(() => {
          setReferralTreeData(data.final_result);
          setActiveTreeUser(item);
          setTimeout(() => {
            setAnimateTree(true);
          }, 500);
        }, 600);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };
  let referralTreeAdd = async (lvl, position) => {
    try {
      const { data } = await axios.post("/api/referral/get_referral_code", {
        address: activeTreeUser.user_address,
        lvl: lvl,
        position: position,
      });
      navigator.clipboard.writeText(data);
    } catch (err) {
      console.log(err);
    }
  };
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

  const referralTreeTableTh = useMemo(() => {
    if (referralTableType === "binary") {
      return [
        {
          name: "Member Name",
          width: 15,
          id: 0,
        },
        {
          name: "User Level / Position",
          width: 15,
          mobileWidth: 45,
          id: 1,
        },
        {
          name: "Total Staked",
          width: 15,
          id: 2,
        },
        {
          name: "Date Joined",
          width: 15,
          id: 3,
        },
      ];
    } else {
      return [
        {
          name: "Member Name",
          width: 15,
          id: 0,
        },
        {
          name: "User Level / Position",
          width: 15,
          mobileWidth: 45,
          id: 1,
        },
        {
          name: "Rate",
          width: 15,
          id: 2,
        },
        {
          name: "Total Staked",
          width: 15,
          id: 3,
        },
        {
          name: "Total Earned",
          width: 15,
          id: 4,
        },
        {
          name: "Date Joined",
          width: 15,
          id: 5,
        },
      ];
    }
  }, [referralTableType]);

  const getReferralAddress = async (address) => {
    try {
      const { data } = await axios.post("/api/referral/get_referral_address", {
        address: address,
      });
      setReferralAddress(data);
      setActiveTreeUser({
        user_address: referralAddress,
      });
      getReferralTree();
    } catch (err) {
      console.log(err);
    }
  };
  const generateTreeTableData = async (table, page) => {
    if (referralAddress) {
      try {
        const { data } = await axios.post(
          `/api/referral/${
            table === "binary" ? "get_referral_data" : "get_referral_data_uni"
          }`,
          {
            address: referralAddress,
            limit: 5,
            page: page || 1,
          },
        );

        setReferralTableData(data);
      } catch (err) {
        console.log(err);
      }
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

  const getReferralTree = async () => {
    setAnimateTree(false);
    try {
      const { data } = await axios.post("/api/referral/get_referral_tree", {
        address: referralAddress,
      });

      setReferralTreeData(data.final_result);
      setAnimateTree(true);
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
    if (account && triedReconnect && active) {
      generateTreeTableData("uni");
      getReferralAddress(account.toLowerCase());
      referralStats();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, active, triedReconnect, referralAddress]);
  useEffect(() => {
    if (account) {
      generateTreeTableData(referralTableType);
    }

    // getReferralAddress(account.toLowerCase());
    // getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, referralTableType]);

  useEffect(() => {
    console.log(referralAddress, "thissss");
    if (account && triedReconnect && active) {
      getReferralHistory();
    }
  }, [account, active, triedReconnect, referralAddress, rebatesCurrentPageUni]);

  async function getReferralHistory() {
    try {
      setReferralHistoryTableLoading(true);
      axios
        .post(`/api/referral/get_referral_uni_transactions`, {
          address: referralAddress,
          limit: 5,
          page: rebatesCurrentPageUni,
        })
        .then((res) => {
          setRebatesPaginationTotalUni(res.data.total_page);
          setRebatesTableData(res.data.transaction);
          setReferralHistoryTableLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setReferralHistoryTableLoading(false);
        });
    } catch (e) {
      console.log(e?.response);
    }
  }

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

  const referralHistoryTableEmpty = {
    label: "No Referral History",
    icon: <NoHistoryIcon />,
  };

  let referralRebatesTotal = [
    {
      title: "Binary Users",
      value: referralTotal?.binary_users,
    },
    {
      title: "Binary Comission This Month",
      value:
        referralTotal?.binary_comission_this_month &&
        referralTotal?.binary_comission_this_month.length > 0
          ? referralTotal?.binary_comission_this_month[0]?.totalAmount
          : 0,
    },
    {
      title: "Binary Comission Total",
      value:
        referralTotal?.binary_comission_total &&
        referralTotal?.binary_comission_total.length > 0
          ? referralTotal?.binary_comission_total[0]?.totalAmount
          : 0,
    },
    {
      title: "Uni Users",
      value: referralTotal?.uni_users,
    },
    {
      title: "Uni Comission This Month",
      value:
        referralTotal?.uni_comission_this_month &&
        referralTotal?.uni_comission_this_month.length > 0
          ? referralTotal?.uni_comission_this_month[0]?.totalAmount
          : 0,
    },
    {
      title: "Uni Comission Total",
      value:
        referralTotal?.uni_comission_total &&
        referralTotal?.uni_comission_total.length > 0
          ? referralTotal?.uni_comission_total[0]?.totalAmount
          : 0,
    },
  ];

  return (
    <>
      <ReferralUI
        cards={referralCards}
        handleCreateCode={handleCreateCode}
        referralTableType={referralTableType}
        referralAddress={referralAddress}
        referralTreeActiveAddress={activeTreeUser}
        referralTreeActive={animateTree}
        referralBinaryType={referralBinaryType}
        referralTreeBtnsLeft={tableVisualType}
        referralTreeBtnsRight={tableType}
        referralTreeData={referralTreeData}
        referralTreeUserClick={referralTreeUserClick}
        referralTreeUserBackClick={referralTreeUserBackClick}
        referralTreeAddClick={referralTreeAdd}
        referralTreeTableHead={referralTreeTableTh}
        referralTreeTableData={referralTableData?.list}
        referralTreePaginationCurrent={binaryTreePage}
        referralTreePaginationTotal={binaryTreePageTotal}
        referralTreePaginationEvent={(page) => {
          setBinaryTreePage(page);
        }}
        rebatesTableData={rebatesTableData}
        referralHistoryButtonsRight={<div>wtf is going on someone please help</div>}
        referralHistoryTableHead={referralHistoryTh}
        referralHistoryTableEmpty={referralHistoryTableEmpty}
        referralHistoryTableLoading={referralHistoryTableLoading}
        referralHistoryPaginationCurrent={rebatesCurrentPageUni}
        referralHistoryPaginationTotal={rebatesPaginationTotalUni}
        referralHistoryPaginationEvent={(page) => {
          setRebatesCurrentPageUni(page);
        }}
        referralRebatesTotal={referralRebatesTotal}
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
