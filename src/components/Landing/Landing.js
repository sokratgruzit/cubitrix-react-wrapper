import React from "react";
import Card from "./Cards/Card";

// styles
import styles from "./Landing.module.css";

const CARD_DATA = [
  {
    id: 1,
    title: "We Believe in Endless Possibilities ",
    description:
      "Access the world’s most popular instruments, ranging from forex pairs to CFDs on stocks, indices, commodities, and cryptocurrencies - all at the palm of your hand.",
    image: "/img/cardImgs/img1.png",
  },
  {
    id: 2,
    title: "Great Trading Conditions",
    description:
      "Hedging is allowed, without any restrictions on short selling and scalping. We provide fast and reliable order execution, as well as ultra-low spreads.",
    image: "/img/cardImgs/img2.png",
  },
  {
    id: 3,
    title: "We Believe You Deserve The Best ",
    description:
      "Take advantage of our Expert Advisors, Copy Trading platforms and 24/7 crypto trading. Try our unique risk management tool AvaProtectTM, or utilise the Trading Central automated analysis add-on.",
    image: "/img/cardImgs/img3.png",
  },
];

const Landing = () => {
  return (
    <div>
      <Card Card={CARD_DATA} />
    </div>
  );
};

export default Landing;
