import React, {useEffect} from "react";
import axios from '../api/axios';
// import { Staking } from "cubitrix-react-staking-module";
// import STACK_ABI from '../stack.json';
// import WBNB from '../WBNB.json';
import { useSelector } from "react-redux";
const Stake  = () => {
    const account = useSelector(state => state.connect.account);
    
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
