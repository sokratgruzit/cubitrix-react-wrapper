import React from "react";

import { Staking } from "cubitrix-react-staking-module";
import STACK_ABI from '../stack.json';
import WBNB from '../WBNB.json';

const Stake  = () => {
    return (
        <div style={{ paddingTop: '100px'}}>
            <Staking STACK_ABI={STACK_ABI} WBNB={WBNB}/>
        </div>
    )
};

export default Stake;