import React, {useEffect} from "react";
import axios from '../api/axios';
// import { Staking } from "cubitrix-react-staking-module";
// import STACK_ABI from '../stack.json';
// import WBNB from '../WBNB.json';
import { useSelector } from "react-redux";
const Stake  = () => {
    const account = useSelector(state => state.connect.account);
    async function check_allowance() {
        await axios.post("/api/check-allowance", {
            account: account,
        })
            .then(res => {
                console.log(res)
            });
    }
    async function approve() {
        await axios.post("/api/approve", {
            account: account,
        })
            .then(res => {
                console.log(res)
            });
    }
    async function stake() {
        await axios.post("/api/stake", {
            account: account,
            dipositAmount: '1000'
        })
        .then(res => {
            console.log(res)
        });
    }

    return (
        <div style={{ paddingTop: '100px'}}>
            {account}
            <div onClick={approve}>approve</div>
            <div onClick={check_allowance}>check_allowance</div>
            hiii
            {/* <Staking STACK_ABI={STACK_ABI} WBNB={WBNB}/> */}
        </div>
    )
};

export default Stake;
