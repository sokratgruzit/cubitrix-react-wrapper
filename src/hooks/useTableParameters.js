import { useState, useEffect } from "react";

const tdDummyData = {
    staking: [
        {
        id:12123,
        staked_amount: "1,220,000.2",
        stake_date: "01.02.2023 10:00AM",
        unstake_date: "01.02.2023 08:15PM",
        earn_reward: "CML",
        harvest: "1,132,000.1",
        },
        {
        id:121223323,
        staked_amount: "1,220,000.2",
        stake_date: "01.02.2023 10:00AM",
        unstake_date: "01.02.2023 08:15PM",
        earn_reward: "CML",
        harvest: "1,132,000.1",
        },
        {
        id:1212323,
        staked_amount: "1,220,000.2",
        stake_date: "01.02.2023 10:00AM",
        unstake_date: "01.02.2023 08:15PM",
        earn_reward: "CML",
        harvest: "1,132,000.1",   
        },
    ],
};

const th = {
    staking: [
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
            onClick: () => console.log('unstake')
        },
        {
            name: "",
            width: 10,
            id: 6,
            mobileWidth: 35,
            position: 'right',
            className: 'buttons-th',
            onClick: () => console.log('harvest')
        },
    ],
};

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

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

export const useTableParameters = (name) => {
  let [width, setWidth] = useState(getWidth());

  const [mobileExpand, setMobileExpand] = useState(null);

  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  let mobile = false;

  if (width <= 1300) {
    mobile = true;
  }

  let mobileExpandFunc = (id) => {
    if (width <= 1300) {
      if (id !== mobileExpand) {
        setMobileExpand(id);
      } else {
        setMobileExpand(null);
      }
    }
  };

  if (name.toLowerCase() === "staking") {
    return {
      td: tdDummyData.staking,
      th: th.staking,
      durationOptions: durationOptions,
      mobileExpandFunc,
      mobileExpand,
      mobile,
      width,
    };
  }
};
