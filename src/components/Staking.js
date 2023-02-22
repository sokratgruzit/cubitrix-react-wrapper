import React, { useState, useEffect } from "react";
// import axios from '../api/axios';
// import { useSelector } from "react-redux";

import { CloseCircle } from '../assets/svg';

// hooks
import { useTableParameters } from '../hooks/useTableParameters';

// UI
import { Staking, Button } from '@cubitrix/cubitrix-react-ui-module';
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";
import STACK_ABI from "../abi/stack.json";
import WBNB from "../abi/WBNB.json";
import moment from "moment";

const Stake  = () => {
    const {
        connect,
        disconnect,
        library,
        account,
        isActive,
        walletModal,
        handleWalletModal,
    } = useConnect;
    var web3Obj = library;

    var Router = "0x61d27DFd33718E47FBcFBf31B8e96439D3eccbdD"; // Staking contract Address
    var tokenAddress = "0xb2343143f814639c9b1f42961C698247171dF34a"; // Staking Token Address

    // const account = useSelector(state => state.connect.account);
    const [dipositAmount, setDipositAmount] = useState("");
    const [timeperiod, setTimeperiod] = useState(0);
    const [timeperiodDate, setTimeperiodDate] = useState(
        moment().add(30, "days").format("DD/MM/YYYY h:mm A")
    );
    // united dipositAmount and timeperiod state
    const [stakeData, setStakeData] = useState({
        amount: '',
        timeperiod: 0,
    });

    const [biddingInfo, setBiddingInfo] = useState({
        balance: 0,
        stakers: 0,
    });
    const [stackContractInfo, setStackContractInfo] = useState({
        totalStakers: 0,
        totalStakedToken: 0,
    });
    
    const [balance, setBalance] = useState(0);

    const [stakersInfo, setStakersInfo] = useState({
        currentStake: 0,
        earn: 0,
        claimedReward: 0,
        walletBalance: 0,
        totalStaked: 0,
        totalUnstaked: 0,
    });
    // const [stakersInfo, setStakersInfo] = useState({
    //     totalStakedTokenUser: 0,
    //     totalUnstakedTokenUser: 0,
    //     totalClaimedRewardTokenUser: 0,
    //     currentStaked: 0,
    //     realtimeReward: 0,
    //     stakeCount: 0,
    //     alreadyExists: false,
    // });
    const [stakersRecord, setStakersRecord] = useState([]);

    const [isAllowance, setIsAllowance] = useState(false);
    const [loading, setLoadding] = useState(false);

    const notify = (isError, msg) => {
        if (isError) {
           console.log('error')
        } else {
            console.log('success')
        }
    };

    const checkAllowance = async () => {
        try {
            setLoadding(true);

            var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
            var decimals = await tokenContract.methods.decimals().call();
            var getBalance = await tokenContract.methods.balanceOf(account).call();

            var pow = 10 ** decimals;
            var balanceInEth = getBalance / pow;
            setBalance(balanceInEth);
            var allowance = await tokenContract.methods
                .allowance(account, Router)
                .call();

            if (allowance <= 2) {
                setIsAllowance(true);
            }
            if (dipositAmount > 0) {
                var amount = dipositAmount * pow;
                if (allowance < amount) {
                    setIsAllowance(true);
                }
            }
            setLoadding(false);
        } catch (err) {
            setLoadding(false);
        }
    };

    const approve = async () => {
        setLoadding(true);
        try {
            var contract = new web3Obj.eth.Contract(WBNB, tokenAddress);

            var amountIn = 10 ** 69;
            amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });
            //   var amountIn = new web3Obj.utils.BigNumber("10").pow(69);

            await contract.methods
                .approve(Router, amountIn.toString())
                .send({ from: account })
                .then(() => {
                    setIsAllowance(false);
                    // checkAllowance("0xaae3d23a76920c9064aefdd571360289fcc80053");
                    setLoadding(false);
                });
        } catch (err) {
            console.log(err);
            setLoadding(false);
            notify(true, err.message);
        }
    };

    const stake = async () => {
        if (isNaN(parseFloat(dipositAmount)) || parseFloat(dipositAmount) <= 0) {
            notify(true, "Error! please enter amount");
            return;
        }
        await checkAllowance();
        setLoadding(true);
        try {
            var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
            const decimals = await tokenContract.methods.decimals().call();

            var contract = new web3Obj.eth.Contract(STACK_ABI, Router);

            var pow = 10 ** decimals;
            var amountIn = dipositAmount * pow;
            // var amountInNew = `${new ethers.utils.BigNumber(amountIn.toString())}`;
            amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });

            await contract.methods
                .stake(amountIn.toString(), timeperiod.toString())
                .send({ from: account })
                .then((err) => {
                    getStackerInfo();
                    setLoadding(false);
                    notify(false, "Staking process complete.");
                });
        } catch (err) {
            setLoadding(false);
            notify(true, err.message);
        }
    };

    const unstake = async (index) => {
        setLoadding(true);
        try {
            var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
            await contract.methods
                .unstake(index.toString())
                .send({ from: account })
                .then((result) => {
                    getStackerInfo();
                    setLoadding(false);
                    notify(false, "successfully unstake");
                    //   withdrawModal();
                });
        } catch (err) {
            setLoadding(false);
            notify(true, "unstake fail");
        }
    };

    const harvest = async (index) => {
        setLoadding(true);
        try {
            var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
            await contract.methods
                .harvest(index.toString())
                .send({ from: account })
                .then((err) => {
                    getStackerInfo();
                    setLoadding(false);
                    checkAllowance();
                    notify(false, "Reward successfully harvested");
                });
        } catch (err) {
            console.log(err);
            setLoadding(false);
            notify(true, err.message);
        }
    };

    const getStackerInfo = async () => {
        setLoadding(true);
        try {
            var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
            var decimals = await tokenContract.methods.decimals().call();
            var getBalance = await tokenContract.methods
                .balanceOf(account.toString())
                .call();
            var pow = 10 ** decimals;
            var balanceInEth = getBalance / pow;
            console.log(getBalance);
            console.log(balanceInEth);
            setBalance(balanceInEth);

            var contract = new web3Obj.eth.Contract(STACK_ABI, Router);
            var totalStakedToken = await contract.methods.totalStakedToken
                .call()
                .call();
            var totalStakers = await contract.methods.totalStakers.call().call();
            var realtimeReward = await contract.methods
                .realtimeReward(account)
                .call();
            var Stakers = await contract.methods.Stakers(account).call();

            var totalStakedTokenUser = Stakers.totalStakedTokenUser / pow;
            var totalUnstakedTokenUser = Stakers.totalUnstakedTokenUser / pow;
            var currentStaked = totalStakedTokenUser - totalUnstakedTokenUser;
            totalStakedToken = totalStakedToken / pow;

            Stakers.totalStakedTokenUser = totalStakedTokenUser;
            Stakers.totalUnstakedTokenUser = totalUnstakedTokenUser;
            Stakers.currentStaked = currentStaked;
            Stakers.realtimeReward = realtimeReward / pow;
            Stakers.totalClaimedRewardTokenUser =
                Stakers.totalClaimedRewardTokenUser / pow;
            var stakersRecord = [];
            for (var i = 0; i < parseInt(Stakers.stakeCount); i++) {
                var stakersRecordData = await contract.methods
                    .stakersRecord(account, i)
                    .call();

                var realtimeRewardPerBlock = await contract.methods
                    .realtimeRewardPerBlock(account, i.toString())
                    .call();

                stakersRecordData.realtimeRewardPerBlock =
                    realtimeRewardPerBlock[0] / pow;

                stakersRecordData.unstaketime = moment
                    .unix(stakersRecordData.unstaketime)
                    .format("DD/MM/YYYY h:mm A");
                stakersRecordData.staketime = moment
                    .unix(stakersRecordData.staketime)
                    .format("DD/MM/YYYY h:mm A");
                stakersRecord.push(stakersRecordData);
            }
            setStakersInfo(Stakers);
            setStakersRecord(stakersRecord);
            setStackContractInfo({
                totalStakers: totalStakers,
                totalStakedToken: totalStakedToken,
            });
            setLoadding(false);
        } catch (err) {
            // console.log(err);
            setLoadding(false);
            setStakersInfo({
                totalStakedTokenUser: 0,
                totalUnstakedTokenUser: 0,
                totalClaimedRewardTokenUser: 0,
                currentStaked: 0,
                realtimeReward: 0,
                stakeCount: 0,
                alreadyExists: false,
            });
            setStackContractInfo({
                totalStakers: 0,
                totalStakedToken: 0,
            });
            setStakersRecord([]);
            setBalance(0);
        }
    };

    const setMaxWithdrawal = async () => {
        var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
        var decimals = await tokenContract.methods.decimals().call();
        var getBalance = await tokenContract.methods
            .balanceOf(account.toString())
            .call();
        var pow = 10 ** decimals;
        var balanceInEth = getBalance / pow;
        setDipositAmount(balanceInEth.toFixed(5));
        // setWithdrawAmount(userInfo.staked);
    };

    useEffect(() => {
        if (isActive) {
            checkAllowance();
            getStackerInfo();
        }
    }, [isActive, account]);
    // const account = useSelector(state => state.connect.account);
    // async function stake() {
    //     await axios.post("/api/stake", {
    //         account: account,
    //         dipositAmount: '10000'
    //     })
    //     .then(res => {
    //         console.log(res)
    //     });
    // }
    // stake()

    const th = [
        {
            name: "Staked Amount",
            width: 15,
            mobileWidth: 45,
            id: 0,
        },
        {
            name: "Stake Date ",
            width: 15,
            id: 1,
        },
        {
            name: "Unstake Date",
            width: 15,
            id: 2,
        },
        {
            name: "Earn Reward",
            width: 15,
            id: 3,
        },
        { 
            name: "Harvest",
            width: 15,
            mobileWidth: 45,
            id: 4,
        },
        {
            name: "",
            width: 10,
            id: 5,
            mobileWidth: 35,
            position: 'right',
            className: 'buttons-th',
            onClick: () => unstake()
        },
        {
            name: "",
            width: 10,
            id: 6,
            mobileWidth: 35,
            position: 'right',
            className: 'buttons-th',
            onClick: () => harvest()
        },
    ];

    const {
        td,
        mobile,
        mobileExpand,
        mobileExpandFunc,
        width
    } = useTableParameters('staking');

    const durationOptions = [
        {
          title: "30 D",
          time: 0,
          period: 30,
        },
        {
          title: "60 D",
          time: 1,
          period: 60,
        },
        {
          title: "90 D",
          time: 2,
          period: 90,
        },
        {
          title: "180 D",
          time: 3,
          period: 180,
        },
        {
          title: "360 D",
          time: 4,
          period: 360,
        },
      ];

    const accountSummaryData = [
        [
          {
            icon: <CloseCircle />,
            title: 'Current Stake',
            value: stakersInfo?.currentStake
          },
          {
            icon: <CloseCircle />,
            title: 'Earn',
            value: stakersInfo?.earn
          },
          {
            icon: <CloseCircle />,
            title: 'Claimed Reward',
            value: stakersInfo?.claimedReward
          } 
        ],
        [
          {
            icon: <CloseCircle />,
            title: 'Your Wallet Balance',
            value: stakersInfo?.walletBalance
          },
          {
            icon: <CloseCircle />,
            title: 'Total Staked',
            value: stakersInfo?.totalStaked
          },
          {
            icon: <CloseCircle />,
            title: 'Total Unstaked',
            value: stakersInfo?.totalUnstaked
          } 
        ]
      ];

    let tableData;
    tableData = td.map((item, index) => {
    return (
        <div
            className={`table-parent ${mobileExpand === item.id ? 'active' : ''}`}
            key={index}
            onClick={() => {
                mobileExpandFunc(item.id)
            }}
        >
            <div className={'table'}>
                {th?.slice(0, 5).map((i, index) => (
                    <div
                        key={index}
                        className={`td col ${i.mobileWidth ? true : false}`}
                        style={{ width: `${mobile ? i.mobileWidth : i.width}%` }}
                    >
                        <span>{[item.staked_amount, item.stake_date, item.unstake_date, item.earn_reward, item.harvest][index]}</span>
                    </div>
                ))}
                {width > 550 && th.slice(5, 7).map((i, index) => (
                    <div
                        key={index}
                        className={`td col ${i.position} ${i.mobileWidth ? true : false}`}
                        style={{
                        width: `${mobile ? i.mobileWidth : i.width}%`,
                        marginRight: `${width < 1450 ? '10px' : '0'}`,
                        }}
                    >
                        <Button
                            element={'staking-button'}
                            label={index === 0 ? 'Unstake' : 'Harvest'}
                            active={index === 0}
                            customStyles={{ borderRadius: '32px' }}
                            onClick={() => i.onClick}
                        />
                    </div>
                ))}
            </div>
            <div className="table-more" />
            <div className="icon-place">
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.299 1.33325L6.47141 5.16089C6.01937 5.61293 5.27968 5.61293 4.82764 5.16089L1 1.33325" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="table-mobile">
                <div className="table-mobile-content">
                    {[1, 2, 3].map(index => (
                        <div className="td" key={index}>
                            <div className="mobile-ttl">{th[index].name}</div>
                            <span>{item[index === 1 ? 'stake_date' : index === 2 ? 'unstake_date' : 'earn_reward']}</span>
                        </div>
                    ))}
                    {width <= 550 && (
                        <div className="table-buttons">
                            {[5, 6].map(index => (
                            <div className="td" key={index}>
                                <Button
                                    element="staking-button"
                                    label={index === 5 ? 'Unstake' : 'Harvest'}
                                    active={index === 5}
                                    customStyles={{ borderRadius: '32px' }}
                                    onClick={() => th[index].onClick(index)}
                                />
                            </div>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        );
    });

    const handleSubmit = () => {
        if (!isActive) {
            handleWalletModal(true);
        };
        if (isActive && isAllowance) {
            approve("0xaae3d23a76920c9064aefdd571360289fcc80053");
        };
        if (isActive && !isAllowance) {
            stake("0xaae3d23a76920c9064aefdd571360289fcc80053");
        };
    };

    return (
        <>
            <Staking
                isActive={isActive}
                durationOptions={durationOptions}
                biddingInfoData={biddingInfo}
                loading={loading}
                isAllowance={isAllowance}
                handleCalculatorSubmit={handleSubmit}
                stakeData={stakeData}
                setStakeData={setStakeData}
                handleMaxClick={setMaxWithdrawal}
                accountSummaryData={accountSummaryData}
                tableData={tableData}
                handleViewAll={() => console.log('view all')}
                tableHead={th}
            />
        </>
    )
};

export default Stake;
