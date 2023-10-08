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
  const userData = useSelector((state) => state.appState?.userData);
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
  const [referralTreeCalcs, setReferralTreeCalcs] = useState({});
  const [referralTableData, setReferralTableData] = useState([]);
  const [referralAddress, setReferralAddress] = useState(null);

  // function setReferralAddress() {}
  // let referralAddress = "0x06fc60f6da259409b1e164942a992a09eb21ce2e";
  const [animateTree, setAnimateTree] = useState(false);
  const [lvlType, setLvlType] = useState("uni");
  const [lvlData, setLvlData] = useState(false);
  const [activeTreeUser, setActiveTreeUser] = useState({
    user_address: "",
  });

  const [binaryTreePageUni, setBinaryTreePageUni] = useState(1);
  const [binaryTreePageTotalUni, setBinaryTreePageTotalUni] = useState(1);
  const [binaryTreePage, setBinaryTreePage] = useState(1);
  const [binaryTreePageTotal, setBinaryTreePageTotal] = useState(1);

  const [referralHistoryTableLoading, setReferralHistoryTableLoading] = useState(false);
  const [referralHistoryType, setReferralHistoryType] = useState("uni");
  const [rebatesCurrentPageUni, setRebatesCurrentPageUni] = useState(1);
  const [rebatesPaginationTotalUni, setRebatesPaginationTotalUni] = useState(1);

  const isActive = useSelector((state) => state.appState?.userData?.active);
  const appState = useSelector((state) => state.appState);

  // const [rebatesCurrentPage, setRebatesCurrentPage] = useState(1);
  // const [rebatesPaginationTotal, setRebatesPaginationTotal] = useState(1);

  const triedReconnect = useSelector((state) => state.appState.triedReconnect);

  const { account, active } = useConnect();

  const [referralTotal, setReferralTotal] = useState(false);
  const width = 1300;
  const [tableFilterOutcomingData, setTableFilterOutcomingData] = useState({});
  const tableFilterData = {
    search: {
      options: [
        {
          name: "Account Owner",
          value: "account_owner",
        },
        {
          name: "Account Type Id",
          value: "account_type_id",
        },
        {
          name: "Address",
          value: "address",
        },
      ],
    },
    selects: [
      {
        name: "Tranx Type",
        value: "tx_type",
        options: [
          {
            name: "Transaction",
            value: "transaction",
          },
          {
            name: "Hash",
            value: "hash",
          },
        ],
      },
      {
        name: "Date Within",
        value: "createdAt",
        options: [
          {
            name: "Transaction",
            value: "transaction",
          },
          {
            name: "Hash",
            value: "hash",
          },
        ],
      },
      {
        name: "Transaction Status",
        value: "ts_status",
        options: [
          {
            name: "Pending",
            value: "pending",
          },
          {
            name: "Cenceled",
            value: "canceled",
          },
          {
            name: "Approved",
            value: "approved",
          },
          {
            name: "Bonuses",
            value: "bonuses",
          },
          {
            name: "Claimed",
            value: "claimed",
          },
        ],
      },
    ],
  };
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
      const { data } = await axios.post("/api/referral/get_reerral_global_data", {});
      setReferralTotal(data);
    } catch (err) {
      console.log(err);
    }
  };
  let referralTreeUserBackClick = async () => {
    if (activeTreeUser.user_address !== referralAddress) {
      setAnimateTree(false);
      try {
        try {
          const { data } = await axios.post("/api/referral/get_referral_parent_address", {
            address: activeTreeUser.user_address,
          });
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
    } else {
      return false;
    }
  };
  let referralTreeUserClick = async (item) => {
    setAnimateTree(false);
    try {
      try {
        const { data } = await axios.post("/api/referral/get_referral_tree", {
          second_address: item.user_address,
        });

        setTimeout(() => {
          let mergedResult = mergeArrays(
            data.final_result,
            data.uni_calcs ?? [],
            data.binary_calcs ?? [],
          );

          setReferralTreeData(mergedResult);

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
        main_address: referralAddress,
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
          name: "User Level",
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

  const generateTreeTableData = async (table, page) => {
    try {
      const { data } = await axios.post(
        `/api/referral/${
          table === "binary" ? "get_referral_data" : "get_referral_data_uni"
        }`,
        {
          limit: 20,
          page: page || 1
        },
      );
      setReferralTableData(data);
      // setBinaryTreePageTotalUni(data?.total_page);
    } catch (err) {
      console.log(err);
    }
  };

  const [uniLVLData, setUniLVLData] = useState([]);
  const getOptions = async (type) => {
    setLvlData([]);
    try {
      const { data } = await axios.post("/api/referral/get_referral_options", {
        name: type,
      });

      if (type == "Uni") {
        setLvlData(data.object_value.uniData.lvlOptions.maxCommPercentage);
        setUniLVLData(data.object_value.uniData.lvlOptions.maxCommPercentage);
      }
      if (type == "Binary bv") {
        setLvlData(data.object_value.binaryData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   if(lvlType == 'uni') {
  //     getOptions('Uni')
  //   }
  //   if(lvlType == 'binary') {
  //     getOptions('Binary bv')
  //   }
  // },[lvlType])
  function mergeArrays(final_result, uni_calcs, binary_calcs) {
    for (const levelObj of final_result) {
      const { documents } = levelObj;

      for (let doc of documents) {
        const { user_address: address } = doc;

        for (const uni_calc of uni_calcs) {
          if (uni_calc.address === address) {
            Object.assign(doc, { ...uni_calc });
          }
        }

        for (const binary_calc of binary_calcs) {
          if (binary_calc.address === address) {
            Object.assign(doc, { ...binary_calc });
          }
        }
      }
    }
    return final_result;
  }

  const getReferralTree = async () => {
    setAnimateTree(false);
    try {
      const { data } = await axios.post("/api/referral/get_referral_tree", {});

      const mergedResult = mergeArrays(
        data.final_result,
        data.uni_calcs ?? [],
        data.binary_calcs ?? [],
      );

      setReferralTreeData(mergedResult);
      setReferralTreeCalcs({
        binary: data.binary_calcs ?? [],
        uni: data.uni_calcs ?? [],
      });
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
    if (appState?.accountSigned) {
      generateReferralLeftRight();
      referralStats();

      getReferralTree();
      getOptions("Uni");
    }
    // eslint-disable-next-line
  }, [appState?.accountSigned]);

  useEffect(() => {
    if (appState?.userData?.address) {
      setReferralAddress(appState?.userData?.address);
      setActiveTreeUser({
        user_address: appState?.userData?.address,
      });
    }
  }, [appState?.userData?.address]);

  useEffect(() => {
    if (appState?.accountSigned) {
      generateTreeTableData(referralTableType, binaryTreePageUni);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState?.accountSigned, referralTableType, binaryTreePageUni, referralBinaryType]);

  useEffect(() => {
    if (appState?.accountSigned) {
      getReferralHistory(referralHistoryType ?? "uni");
    }
  }, [appState?.accountSigned, rebatesCurrentPageUni, referralHistoryType]);

  async function getReferralHistory(type) {
    try {
      setReferralHistoryTableLoading(true);
      axios
        .post(
          type === "uni"
            ? `/api/referral/get_referral_uni_transactions`
            : `/api/referral/get_referral_binary_transactions`,
          {
            limit: 5,
            page: rebatesCurrentPageUni,
          },
        )
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

  let referralHistoryThUni = [
    {
      name: "User Address",
      width: 15,
      mobileWidth: 45,
      id: 0,
    },
    {
      name: "User Level",
      width: 15,
      id: 1,
    },
    {
      name: "Amount",
      width: 15,
      id: 2,
    },
    {
      name: "Date",
      width: 15,
      mobileWidth: 45,
      id: 3,
    },
  ];
  let referralHistoryThBinary = [
    {
      name: "Amount",
      width: 15,
      mobileWidth: 45,
      id: 0,
    },
    {
      name: "Position",
      width: 15,
      id: 1,
    },
    {
      name: "Date",
      width: 15,
      id: 2,
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

  let lvlTableType = (
    <div className={`referral-inner-table-more`}>
      <div
        className={`referral-table-more-svg ${
          lvlType === "uni" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => {
          setLvlType("uni");
          getOptions("Uni");
        }}>
        Uni
      </div>
      <div
        className={`referral-table-more-svg ${
          lvlType === "binary" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => {
          setLvlType("binary");
          getOptions("Binary bv");
        }}>
        Binary
      </div>
    </div>
  );

  let uniTh = ["Level", "Percentage"];
  let binaryTh = ["From", "To", "Price"];

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
          ? referralTotal?.binary_comission_this_month[0]?.totalAmount?.toLocaleString(
              "en-US",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )
          : 0,
    },
    {
      title: "Binary Comission Total",
      value:
        referralTotal?.binary_comission_total &&
        referralTotal?.binary_comission_total.length > 0
          ? referralTotal?.binary_comission_total[0]?.totalAmount?.toLocaleString(
              "en-US",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )
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
          ? referralTotal?.uni_comission_this_month[0]?.totalAmount?.toLocaleString(
              "en-US",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )
          : 0,
    },
    {
      title: "Uni Comission Total",
      value:
        referralTotal?.uni_comission_total &&
        referralTotal?.uni_comission_total.length > 0
          ? referralTotal?.uni_comission_total[0]?.totalAmount?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : 0,
    },
  ];

  const referralHistoryRightButtons = (
    <div className={`referral-inner-table-more`}>
      <div
        className={`referral-table-more-svg ${
          referralHistoryType === "uni" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => {
          setReferralHistoryType("uni");
        }}>
        Uni
      </div>
      <div
        className={`referral-table-more-svg ${
          referralHistoryType === "binary" ? "referral-table-more-svg_active" : ""
        }`}
        onClick={() => setReferralHistoryType("binary")}>
        Binary
      </div>
    </div>
  );

  const [referralLeftRight, setReferralLeftRight] = useState({});
  async function generateReferralLeftRight() {
    try {
      const [binaryCommissionResponse, uniCommissionResponse] = await Promise.all([
        axios.post("/api/referral/binary_comission_count_user", {}),
        axios.post("/api/referral/uni_comission_count_user", {}),
      ]);

      const binaryResults = binaryCommissionResponse.data.results;
      const uniResults = uniCommissionResponse.data.results;

      setReferralLeftRight({ ...binaryResults, uni: uniResults });
    } catch (e) {
      console.error("An error occurred:", e);
    }
  }

  // const referralTreeMainAddressData = useMemo(() => {
  //   return {
  //     ...referralLeftRight,
  //     user_address: referralAddress,
  //     stakedToday: userData?.stakedToday,
  //     stakedTotal: userData?.stakedTotal,
  //     name: userData?.meta?.name,
  //   };
  // }, [
  //   userData?.stakedThisMonth,
  //   userData?.meta?.name,
  //   referralAddress,
  //   referralLeftRight,
  //   userData?.stakedToday,
  //   userData?.stakedTotal,
  // ]);

  const referralTreeMainAddressData = useMemo(() => {
    const matchingUni = referralTreeCalcs?.uni?.find(
      (item) => item.address === referralAddress,
    );
    const matchingBinary = referralTreeCalcs?.binary?.find(
      (item) => item.address === referralAddress,
    );

    const obj = {
      ...referralLeftRight,
      name: userData?.meta?.name,
      external_address: userData?.account_owner,
      user_address: referralAddress,
    };

    if (matchingUni) {
      obj.uni = matchingUni?.amount;
    }

    if (matchingBinary) {
      const { address, ...otherProps } = matchingBinary;

      obj.total_right = otherProps?.total_right;
      obj.total_left = otherProps?.left_total;
      obj.all_amount_sum = otherProps?.all_amount_sum;
      obj.total_staked = otherProps?.total_staked_amount;
      obj.users_sum_left = otherProps?.users_sum_left;
      obj.users_sum_right = otherProps?.users_sum_right;
    }

    return obj;
  }, [
    userData?.stakedToday,
    userData?.stakedTotal,
    userData?.meta?.name,
    referralAddress,
    referralLeftRight,
    referralTreeCalcs,
  ]);

  console.log(referralTreeMainAddressData);

  return (
    <>
      <ReferralUI
        cards={referralCards}
        handleCreateCode={handleCreateCode}
        referralTableType={referralTableType}
        referralAddress={referralAddress}
        referralTreeActiveAddress={activeTreeUser}
        referralTreeActive={animateTree}
        referralTreeMainAddressData={referralTreeMainAddressData}
        referralBinaryType={referralBinaryType}
        referralTreeBtnsLeft={tableVisualType}
        referralTreeBtnsRight={tableType}
        referralTreeData={referralTreeData}
        referralTreeUserClick={referralTreeUserClick}
        referralTreeUserBackClick={referralTreeUserBackClick}
        referralBackActive={activeTreeUser.user_address !== referralAddress}
        referralTreeAddClick={referralTreeAdd}
        referralTreeTableHead={referralTreeTableTh}
        referralTreeTableData={referralTableData?.list}
        referralTreePaginationCurrent={binaryTreePageUni}
        referralTreePaginationTotal={binaryTreePageTotalUni}
        referralTreePaginationEvent={(page) => {
          setBinaryTreePageUni(page);
        }}
        rebatesTableData={rebatesTableData}
        referralHistoryButtonsRight={referralHistoryRightButtons}
        referralHistoryTableHead={
          referralHistoryType === "uni" ? referralHistoryThUni : referralHistoryThBinary
        }
        referralHistoryTableType={
          referralHistoryType === "uni" ? "referral-history" : "referral-history-binary"
        }
        referralHistoryTableEmpty={referralHistoryTableEmpty}
        referralHistoryTableLoading={referralHistoryTableLoading}
        referralHistoryPaginationCurrent={rebatesCurrentPageUni}
        referralHistoryPaginationTotal={rebatesPaginationTotalUni}
        referralHistoryPaginationEvent={(page) => {
          setRebatesCurrentPageUni(page);
        }}
        referralRebatesTotal={referralRebatesTotal}
        handleLevelSystem={handleLevelSystem}
        isActive={isActive}
        uniLVLData={uniLVLData}
        stakedThisMonth={userData?.stakedThisMonth}
        disabledAccount={!userData?.active && userData?.step == "6"}
        tableFilterData={tableFilterData}
        tableFilterOutcomingData={tableFilterOutcomingData}
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
            <LevelSystem
              tableHead={lvlType == "uni" ? uniTh : binaryTh}
              tableData={lvlType == "uni" && lvlData ? lvlData : lvlData?.options}
              bv={lvlType == "binary" && lvlData?.bv}
              mobile={false}
              type={lvlType}
              typeBns={lvlTableType}
            />
          }
          label={"Referrer Level System"}
          handlePopUpClose={() => setLevelSystemPopupActive(false)}
          description={
            "Everyone starts with the Casual tier, and you can level up the tier by increasing your Comland holding"
          }
          headerCustomStyles={{ background: "rgba(16, 40, 43, 1)" }}
        />
      )}
    </>
  );
};

export default Referral;
