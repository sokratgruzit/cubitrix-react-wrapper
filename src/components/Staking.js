import React from "react";

import { Staking } from "@cubitrix/cubitrix-react-staking-module";
import useConnect from '../hooks/use-connect'
import STACK_ABI from '../stack.json';
import WBNB from '../WBNB.json';


const Stake  = () => {
    return (
        <div style={{ paddingTop: '100px'}}>
            <Staking useConnect={useConnect} STACK_ABI={STACK_ABI} WBNB={WBNB}/>
        </div>
    )
};

export default Stake;   