import React, { useEffect, useState } from "react";

import { Landing as LandingMain } from "@cubitrix/cubitrix-react-ui-module";
import { Scroll } from "scrollex";
import { useSelector } from "react-redux";
import "./Landing.css";
import ABg from "../assets/img/landing/landingA.png";
import patternBg from "../assets/img/landing/patternBg.svg";
import patternBg2 from "../assets/img/landing/patternBg2.png";
import patternBg3 from "../assets/img/landing/pattern3.png";
import patternBg4 from "../assets/img/landing/pattern4.png";
import patternBg5 from "../assets/img/landing/pattern5.png";
import card1 from "../assets/img/landing/atr.svg";
import card2 from "../assets/img/landing/eth.svg";
import card3 from "../assets/img/landing/btc.svg";
import card4 from "../assets/img/landing/gold.svg";
import contentBg1 from "../assets/img/landing/contentBg1.png";
import contentBg2 from "../assets/img/landing/contentBg2.png";
import contentBg3 from "../assets/img/landing/contentBg3.png";
import contentBg4 from "../assets/img/landing/contentBg4.png";
import contentBg5 from "../assets/img/landing/contentBg5.png";
import footerBg from "../assets/img/landing/footerBg.png";
import { MiniChart } from "react-tradingview-widget-components";
const Landing = ({ step, setStep, initialRegister, setInitialRegister }) => {
  const account = useSelector((state) => state.connect.account);

  const defaultCardsData = [
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

  const aboutProjectsData = [
    {
      id: 1,
      title: "Analitical Tools",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "https://cubitrix-landing.vercel.app/img/AboutProjects/dashboard.jpg",
    },
    {
      id: 2,
      title: "Trade",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/referral.jpg",
    },
    {
      id: 3,
      title: "Staking",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/dashboard.jpg",
    },
    {
      id: 4,
      title: "Loans",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/referral.jpg",
    },
    {
      id: 5,
      title: "Extensions",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/dashboard.jpg",
    },
    {
      id: 6,
      title: "Referral",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/referral.jpg",
    },
  ];

  const allImages = {
    dashboardHeader: {
      rocket: "/img/landing/rocket.png",
      dots: "/img/landing/dots.png",
      man: "/img/landing/man.png",
      planet: "/img/landing/planet.png",
      dotsRight: "/img/landing/dotsRight.png",
      bottom: "/img/landing/bottom.svg",
    },
    topcoins: {
      EthCard: "/img/landing/coinCards/EthCard.png",
      BitcoinCard: "/img/landing/coinCards/BitcoinCard.png",
      TetherCard: "/img/landing/coinCards/TetherCard.png",
      TopCoinsIcon: "/img/landing/TopCoinsIcon.png",
      ball: "/img/landing/ball.svg",
      silverCoin: "/img/landing/silverCoin.png",
    },
    meditation: {
      MeditationPerson: "/img/landing/MeditationPerson.png",
      MeditationBG: "/img/landing/MeditationBG.png",
    },
    whyComplend: {
      bottom: "/img/landing/whyComplend-bottom.svg",
    },
  };

  const [animate, setAnimate] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeHowStart, setActiveHowStart] = useState(null);

  let openHowStart = (index) => {
    if (index !== activeHowStart) {
      setActiveHowStart(index);
    } else {
      setActiveHowStart(null);
    }
  };

  let openFaq = (index) => {
    if (index !== activeFaq) {
      setActiveFaq(index);
    } else {
      setActiveFaq(null);
    }
  };

  useEffect(() => {
    setAnimate(true);
  }, []);
  const keyframes = {
    background: {
      0: {
        scale: 1,
        opacity: 1,
      },
      200: {
        scale: 10,
        opacity: 0,
      },
    },
    opacity: {
      200: {
        translateY: 0,
        opacity: 1,
      },
      300: {
        translateY: -50,
        opacity: 0,
      },
    },
    opacityIn: {
      400: {
        scale: 0.8,
        opacity: 0,
      },
      600: {
        scale: 1,
        opacity: 1,
      },
    },
    scaleOut: {
      0: {
        scale: 0,
        opacity: 0,
        translateY: -100,
      },
      100: {
        scale: 1,
        opacity: 1,
        translateY: 0,
      },
    },
    zoomOut1: {
      3000: {
        scale: 1.2,
        opacity: 0,
      },
      3200: {
        scale: 1,
        opacity: 1,
      },
    },
    zoomOut2: {
      3400: {
        scale: 1.2,
        opacity: 0,
      },
      3600: {
        scale: 1,
        opacity: 1,
      },
    },
    zoomOut3: {
      3800: {
        scale: 1.2,
        opacity: 0,
      },
      4000: {
        scale: 1,
        opacity: 1,
      },
    },
    zoomOut4: {
      4200: {
        scale: 1.2,
        opacity: 0,
      },
      4400: {
        scale: 1,
        opacity: 1,
      },
    },
  };
  const faq = [
    {
      question: "What is this platform about?",
      answer:
        '"Atar" is a unique trading platform that seamlessly merges the premier attributes of both centralized and decentralized platforms. It enables seamless trading across forex, stocks, commodities, and cryptocurrencies under one account, removing the burden of onerous KYC obligations. The platform aims to transcend borders, empowering everyone to shape their financial destiny.',
    },
    {
      question: "Who can use this platform?",
      answer:
        "Our platform caters to everyone interested in trading, regardless of their expertise level. Whether you're a seasoned trader or a beginner, you will find our platform user-friendly and supportive of all your trading needs.",
    },
    {
      question: "What kind of trading accounts do you offer?",
      answer:
        "We offer four types of accounts: Novice Navigator (for beginners), Stellar Standard (a balance of affordability and functionality), Expert Edge (for professional traders), and Platinum Privilege (VIP account for high-volume, sophisticated traders).",
    },
    {
      question: "What is Staking? How can I benefit from it?",
      answer:
        "Staking involves locking up your tokens in our secure on-chain Vault to earn a consistent, real- time passive income. While you focus on market maneuvers, staking ensures your portfolio continues to grow passively.",
    },
    {
      question: "Can you explain the concept of Margin Trading?",
      answer:
        "Margin Trading enhances your buying power, allowing you to make larger trades. This enables you to seize timely investment opportunities without disrupting your existing financial portfolio. It also offers unprecedented liquidity, allowing you to access additional capital without the need to sell off your valuable investments.",
    },
    {
      question: "What trading instruments are available on the platform?",
      answer:
        "Our platform offers over 100 trading instruments. You can trade a broad spectrum of assets including commodities, metals, digital currencies, bonds, forex, indices, shares, and ETFs.",
    },
    {
      question: "How do I get started on your platform?",
      answer:
        "Simply sign up using your email, link your crypto wallet, transfer necessary funds, stake your funds, receive trading credit, utilize leverage, and start trading. It's a straightforward process designed to make trading easy for you.",
    },
    {
      question: "Can I take loans from this platform?",
      answer:
        "Yes, we have a cutting-edge peer-to-peer lending platform that enables smooth and efficient financial exchanges between individual lenders and borrowers. It presents an array of investment opportunities for lenders and an accessible, user-friendly approach to lending for borrowers.",
    },
    {
      question: "What educational resources do you offer for traders?",
      answer:
        "We provide a comprehensive range of learning resources. These include daily trading insights, free trading basics courses, regular webinars, and live trading sessions tailored for beginners and professional traders alike.",
    },
    {
      question: "Do you have a referral program?",
      answer:
        "Yes, we have a lucrative Referral Program. By inviting other traders to join our platform, you unlock the opportunity to earn more. The more traders you bring aboard, the higher the rewards you earn.",
    },
    {
      question: 'What is the "Atar" Elite Membership?',
      answer:
        'The "Atar" Elite Membership is a distinctive club that offers unique tools and perks to elevate your financial journey. These include an additional 1.2% APY on your savings, exclusive access to premium educational content at discounted rates, and access to members-only financial seminars. The membership is available at a reasonable fee of $20 monthly.',
    },
  ];
  const howStart = [
    {
      question: "1. Sign Up",
      answer:
        "Creating your account is a breeze. Simply enter your email address to get started - it's quick and easy!",
    },
    {
      question: "2. Link Wallet",
      answer:
        "Fund your trading account by depositing from a broad spectrum of accepted cryptocurrencies, including Bitcoin, Ethereum, BNB, Tron, and more.",
    },
    {
      question: "3. Fund Your Account",
      answer: "Transfer the necessary funds to your account to prepare for staking.",
    },
    {
      question: "4. Stake Your Funds",
      answer: "Lock your funds in staking, thereby activating your potential earnings.",
    },
    {
      question: "5. Acquire Trading Credit",
      answer:
        "Receive trading credit equivalent to the value of your staked funds, further empowering your trading potential.",
    },
    {
      question: "6. Utilize Leverage",
      answer:
        "Take advantage of leverage to magnify your trading capacity, and then you're all set to commence trading.",
    },
  ];
  return (
    <>
      <Scroll.Container style={{ height: "100vh" }} scrollAxis="y" className="h-screen">
        <Scroll.Section className="h-screen center bg-1">
          <div className="landingSlideContainer">
            <img src={patternBg} alt="paternbg" className="patternBg" />
            <div style={{ pointerEvents: "none" }}>
              <Scroll.Item keyframes={keyframes.background}>
                <div className="landingSlideContainerLogoBg">
                  <img src={ABg} alt="bg" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingSlideContainerInner">
              <Scroll.Item keyframes={keyframes.opacity}>
                <div className="landingSlideContainerTitle">
                  <h1>
                    <span className="ttl">Buy, Sell & Trade</span>
                    <span className="ttl">Crypto</span>
                  </h1>
                  <div className="landingSlideContainerBtn">
                    <svg
                      width="261"
                      height="79"
                      viewBox="0 0 261 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect
                        x="10"
                        y="10"
                        width="251"
                        height="69"
                        rx="4"
                        fill="url(#paint0_linear_390_1404)"
                      />
                      <g filter="url(#filter0_b_390_1404)">
                        <rect
                          width="251"
                          height="69"
                          rx="4"
                          fill="white"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M93.3098 34.14C93.9498 34.14 95.4098 34.04 96.1698 34.04H96.5698V34.24H96.1698C95.2898 34.24 94.8898 34.68 94.8898 35.86V40.06C94.8898 40.58 94.9898 40.8 95.6498 40.8V40.96C93.3298 41.68 91.7298 42.2 89.6698 42.2C84.7498 42.2 80.8898 39.38 80.8898 34.5C80.8898 29.62 84.7498 26.8 89.6698 26.8C91.3298 26.8 92.6698 27.16 93.9098 27.56L94.1698 27H94.3498C94.2298 28.9 94.1698 29.68 94.2898 31.56H94.0698C94.0698 28.94 92.3298 27.54 89.6698 27.54C86.3498 27.54 84.3898 30.36 84.3898 34.5C84.3898 38.64 86.3298 41.46 89.6698 41.46C90.4898 41.46 91.1498 41.32 91.7098 41.04V35.86C91.7098 34.68 91.3098 34.24 90.4298 34.24H90.0298V34.04H90.4298C91.1898 34.04 92.6698 34.14 93.3098 34.14ZM106.588 34.7C106.588 34.92 106.568 35.2 106.528 35.36H100.368C100.348 35.58 100.328 35.82 100.328 36.06C100.328 38.58 101.528 40.48 103.948 40.48C104.928 40.48 105.748 40.06 106.708 39.12L106.888 39.28C105.028 41.26 103.768 42.2 101.888 42.2C99.3477 42.2 97.5677 40.5 97.5677 37.42C97.5677 33.92 100.108 31.8 103.028 31.8C105.368 31.8 106.588 32.92 106.588 34.7ZM102.848 32.5C101.708 32.5 100.888 33.32 100.528 34.56H104.148C104.188 34.34 104.208 34.08 104.208 33.84C104.208 33.16 103.868 32.5 102.848 32.5ZM111.878 28.5H112.078V32H115.498V32.8H112.078V39.34C112.078 40.56 112.658 41.1 113.498 41.1C114.058 41.1 114.658 41.08 115.578 40.46L115.698 40.62C114.518 41.52 113.358 42.2 112.138 42.2C110.418 42.2 109.078 41.3 109.078 39.3V32.8H107.398V32.6L107.698 32.42C109.058 31.6 110.798 30.38 111.878 28.5ZM126.538 27.5C124.938 27.5 123.938 28.36 123.938 29.7C123.938 33.22 131.658 31.62 131.658 37.22C131.658 40.16 129.558 42.2 126.458 42.2C124.778 42.2 123.658 41.8 122.838 41.32L122.458 42H122.278C122.178 40.32 122.058 39.06 121.578 37.34L121.798 37.28C122.838 40.18 124.518 41.5 126.458 41.5C128.278 41.5 129.598 40.44 129.598 38.92C129.598 34.78 121.898 36.76 121.898 30.88C121.898 28.46 123.778 26.8 126.538 26.8C128.258 26.8 129.258 27.2 129.998 27.58L130.258 27H130.438C130.318 28.72 130.358 29.32 130.598 30.98L130.378 31.04C130.058 28.6 127.878 27.5 126.538 27.5ZM137.249 28.5H137.449V32H140.869V32.8H137.449V39.34C137.449 40.56 138.029 41.1 138.869 41.1C139.429 41.1 140.029 41.08 140.949 40.46L141.069 40.62C139.889 41.52 138.729 42.2 137.509 42.2C135.789 42.2 134.449 41.3 134.449 39.3V32.8H132.769V32.6L133.069 32.42C134.429 31.6 136.169 30.38 137.249 28.5ZM147.767 42.1L147.607 42V40.88C146.627 41.8 145.707 42.2 144.507 42.2C143.007 42.2 141.707 41.56 141.707 39.84C141.707 37.2 144.467 37.3 147.607 36.12V35.64C147.607 33.68 146.767 33.02 145.367 33.02C144.167 33.02 143.047 33.68 142.467 34.88L142.207 34.76C142.907 33.22 144.307 31.8 146.447 31.8C148.907 31.8 150.607 33.04 150.607 35.72V40.18C150.607 41.36 151.007 41.8 151.887 41.8H152.287V42H151.887C150.727 42 149.187 42.02 147.767 42.1ZM144.647 39.24C144.647 40.06 145.127 40.68 146.147 40.68C146.687 40.68 147.087 40.58 147.607 40.18V36.78C145.287 37.68 144.647 38.26 144.647 39.24ZM155.737 41.9C154.997 41.9 153.877 42 152.957 42H152.557V41.8H152.957C153.837 41.8 154.237 41.36 154.237 40.18V34.32C154.237 33.14 153.837 32.7 152.957 32.7H152.757V32.5H152.957C154.537 32.5 155.957 32.14 157.037 31.4H157.237V33.54C158.417 32.42 159.277 31.8 160.317 31.8C161.277 31.8 162.157 32.4 162.157 33.22C162.157 33.8 161.697 34.28 160.997 34.28C160.137 34.28 159.697 33.48 158.837 33.48C158.357 33.48 157.957 33.6 157.237 34.12V40.18C157.237 41.36 157.637 41.8 158.517 41.8H158.917V42H158.517C157.597 42 156.477 41.9 155.737 41.9ZM167.113 28.5H167.313V32H170.733V32.8H167.313V39.34C167.313 40.56 167.893 41.1 168.733 41.1C169.293 41.1 169.893 41.08 170.813 40.46L170.933 40.62C169.753 41.52 168.593 42.2 167.373 42.2C165.653 42.2 164.313 41.3 164.313 39.3V32.8H162.633V32.6L162.933 32.42C164.293 31.6 166.033 30.38 167.113 28.5Z"
                          fill="#0E2225"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_b_390_1404"
                          x="-20"
                          y="-20"
                          width="291"
                          height="109"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
                          <feComposite
                            in2="SourceAlpha"
                            operator="in"
                            result="effect1_backgroundBlur_390_1404"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_backgroundBlur_390_1404"
                            result="shape"
                          />
                        </filter>
                        <linearGradient
                          id="paint0_linear_390_1404"
                          x1="10"
                          y1="44"
                          x2="261"
                          y2="44"
                          gradientUnits="userSpaceOnUse">
                          <stop stopColor="#C38C5C" />
                          <stop offset="1" stopColor="#3D6C72" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </Scroll.Item>
            </div>
          </div>
          <div className="landingSlideContainerSecond">
            <Scroll.Item keyframes={keyframes.scaleOut}>
              <svg
                width="691"
                height="207"
                viewBox="0 0 691 207"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  opacity="0.5"
                  d="M37.5725 168.892L38.4863 169.298L38.4872 169.296L37.5725 168.892ZM112.077 0.319984V-0.680016H111.425L111.162 -0.084259L112.077 0.319984ZM114.489 0.319984L115.402 -0.0870361L115.138 -0.680016H114.489V0.319984ZM194.621 180.148L195.536 179.745L195.534 179.741L194.621 180.148ZM227.317 201.32H228.317V200.32H227.317V201.32ZM227.317 204V205H228.317V204H227.317ZM134.321 204H133.321V205H134.321V204ZM134.321 201.32V200.32H133.321V201.32H134.321ZM150.133 183.364L149.212 183.755L149.216 183.765L150.133 183.364ZM134.857 147.452L135.777 147.061L135.518 146.452H134.857V147.452ZM60.3525 147.452V146.452H59.691L59.4322 147.061L60.3525 147.452ZM51.2405 168.892L52.1581 169.29L52.1609 169.283L51.2405 168.892ZM61.9605 201.32H62.9605V200.32H61.9605V201.32ZM61.9605 204V205H62.9605V204H61.9605ZM0.588534 204H-0.411466V205H0.588534V204ZM0.588534 201.32V200.32H-0.411466V201.32H0.588534ZM65.4445 135.928L64.5251 135.535L63.9294 136.928H65.4445V135.928ZM130.033 135.928V136.928H131.543L130.953 135.538L130.033 135.928ZM97.8725 60.084L98.7932 59.6936L97.8764 57.5314L96.9531 59.6909L97.8725 60.084ZM3.26853 202.32C10.344 202.32 16.4845 200.155 22.2036 194.886C27.8801 189.657 33.1062 181.404 38.4863 169.298L36.6587 168.486C31.3189 180.5 26.227 188.461 20.8485 193.416C15.5125 198.331 9.86104 200.32 3.26853 200.32V202.32ZM38.4872 169.296L112.991 0.724236L111.162 -0.084259L36.6579 168.488L38.4872 169.296ZM112.077 1.31998H114.489V-0.680016H112.077V1.31998ZM113.575 0.727013L193.707 180.555L195.534 179.741L115.402 -0.0870361L113.575 0.727013ZM193.705 180.551C197.227 188.542 201.135 194.005 205.746 197.464C210.378 200.938 215.629 202.32 221.689 202.32V200.32C215.956 200.32 211.157 199.022 206.946 195.863C202.712 192.689 198.982 187.566 195.536 179.745L193.705 180.551ZM221.689 202.32H227.317V200.32H221.689V202.32ZM226.317 201.32V204H228.317V201.32H226.317ZM227.317 203H221.957V205H227.317V203ZM221.957 203C218.222 203 211.476 202.8 204.028 202.598C196.592 202.397 188.472 202.196 182.025 202.196V204.196C188.441 204.196 196.535 204.397 203.974 204.598C211.399 204.798 218.187 205 221.957 205V203ZM182.025 202.196C175.576 202.196 168.058 202.397 160.625 202.598C153.183 202.799 145.828 203 139.681 203V205C145.861 205 153.246 204.799 160.679 204.598C168.119 204.397 175.609 204.196 182.025 204.196V202.196ZM139.681 203H134.321V205H139.681V203ZM135.321 204V201.32H133.321V204H135.321ZM134.321 202.32H139.681V200.32H134.321V202.32ZM139.681 202.32C145.122 202.32 149.592 201.04 151.862 197.732C154.143 194.406 153.899 189.479 151.049 182.963L149.216 183.765C151.994 190.113 151.884 194.164 150.212 196.6C148.529 199.054 144.96 200.32 139.681 200.32V202.32ZM151.053 182.973L135.777 147.061L133.936 147.843L149.212 183.755L151.053 182.973ZM134.857 146.452H60.3525V148.452H134.857V146.452ZM59.4322 147.061L50.3202 168.501L52.1609 169.283L61.2729 147.843L59.4322 147.061ZM50.323 168.494C47.6992 174.549 45.8507 179.646 44.7771 183.889C43.7067 188.12 43.3854 191.581 43.8921 194.332C44.408 197.133 45.7845 199.189 48.0191 200.506C50.2012 201.793 53.1061 202.32 56.6005 202.32V200.32C53.261 200.32 50.7724 199.808 49.035 198.784C47.3501 197.79 46.2811 196.261 45.859 193.97C45.4277 191.629 45.6758 188.491 46.716 184.38C47.7528 180.282 49.5558 175.295 52.1581 169.29L50.323 168.494ZM56.6005 202.32H61.9605V200.32H56.6005V202.32ZM60.9605 201.32V204H62.9605V201.32H60.9605ZM61.9605 203H56.6005V205H61.9605V203ZM56.6005 203C52.2212 203 47.5672 202.668 43.0399 202.333C38.5311 201.999 34.1339 201.66 30.3365 201.66V203.66C34.0432 203.66 38.356 203.991 42.8922 204.327C47.4098 204.662 52.1358 205 56.6005 205V203ZM30.3365 201.66C26.6755 201.66 21.9445 201.998 17.1353 202.332C12.3032 202.668 7.38134 203 3.26853 203V205C7.46373 205 12.4579 204.662 17.2738 204.328C22.1126 203.992 26.7615 203.66 30.3365 203.66V201.66ZM3.26853 203H0.588534V205H3.26853V203ZM1.58853 204V201.32H-0.411466V204H1.58853ZM0.588534 202.32H3.26853V200.32H0.588534V202.32ZM65.4445 136.928H130.033V134.928H65.4445V136.928ZM130.953 135.538L98.7932 59.6936L96.9519 60.4744L129.112 136.318L130.953 135.538ZM96.9531 59.6909L64.5251 135.535L66.364 136.321L98.792 60.4771L96.9531 59.6909ZM303.047 23.1V22.1H302.469L302.18 22.6019L303.047 23.1ZM305.727 23.1H306.727V22.1H305.727V23.1ZM305.727 70H304.727V71H305.727V70ZM351.555 70H352.555V69H351.555V70ZM351.555 80.72V81.72H352.555V80.72H351.555ZM305.727 80.72V79.72H304.727V80.72H305.727ZM352.627 183.364L353.427 182.764L352.857 182.003L352.069 182.535L352.627 183.364ZM354.235 185.508L354.842 186.303L355.631 185.702L355.035 184.908L354.235 185.508ZM265.527 80.72H266.527V79.72H265.527V80.72ZM243.015 80.72H242.015V81.72H243.015V80.72ZM243.015 78.04L242.501 77.1825L242.015 77.4738V78.04H243.015ZM247.035 75.628L247.55 76.4855L247.552 76.4844L247.035 75.628ZM303.047 24.1H305.727V22.1H303.047V24.1ZM304.727 23.1V70H306.727V23.1H304.727ZM305.727 71H351.555V69H305.727V71ZM350.555 70V80.72H352.555V70H350.555ZM351.555 79.72H305.727V81.72H351.555V79.72ZM304.727 80.72V168.356H306.727V80.72H304.727ZM304.727 168.356C304.727 176.674 306.704 182.838 310.266 186.935C313.846 191.051 318.905 192.94 324.755 192.94V190.94C319.35 190.94 314.895 189.211 311.775 185.622C308.637 182.014 306.727 176.386 306.727 168.356H304.727ZM324.755 192.94C328.519 192.94 332.508 192.875 337.122 191.738C341.74 190.601 346.939 188.403 353.186 184.193L352.069 182.535C345.988 186.633 341.003 188.723 336.643 189.797C332.279 190.871 328.496 190.94 324.755 190.94V192.94ZM351.827 183.964L353.435 186.108L355.035 184.908L353.427 182.764L351.827 183.964ZM353.629 184.713C337.832 196.761 322.521 205.68 306.531 205.68V207.68C323.238 207.68 339.015 198.375 354.842 186.303L353.629 184.713ZM306.531 205.68C295.169 205.68 285.177 202.707 278.04 196.543C270.926 190.4 266.527 180.981 266.527 167.82H264.527C264.527 181.459 269.107 191.47 276.733 198.057C284.336 204.623 294.846 207.68 306.531 207.68V205.68ZM266.527 167.82V80.72H264.527V167.82H266.527ZM265.527 79.72H243.015V81.72H265.527V79.72ZM244.015 80.72V78.04H242.015V80.72H244.015ZM243.53 78.8975L247.55 76.4855L246.521 74.7705L242.501 77.1825L243.53 78.8975ZM247.552 76.4844C265.811 65.4752 289.311 49.0189 303.915 23.5981L302.18 22.6019C287.84 47.5651 264.708 63.8048 246.519 74.7716L247.552 76.4844ZM470.782 205.34L470.252 206.188L470.521 206.356L470.838 206.338L470.782 205.34ZM468.638 204H467.638V204.554L468.108 204.848L468.638 204ZM468.638 188.992H469.638V186.682L467.954 188.263L468.638 188.992ZM468.638 125.208L468.99 126.144L469.638 125.9V125.208H468.638ZM399.762 108.592L399.343 109.5L400.235 109.912L400.662 109.027L399.762 108.592ZM396.278 106.984L395.368 106.57L394.956 107.475L395.859 107.892L396.278 106.984ZM531.35 201.32H532.35V200.32H531.35V201.32ZM531.35 204V205H532.35V204H531.35ZM468.638 179.612L469.248 180.405L469.638 180.104V179.612H468.638ZM468.638 134.052H469.638V132.591L468.276 133.12L468.638 134.052ZM471.312 204.492L469.168 203.152L468.108 204.848L470.252 206.188L471.312 204.492ZM469.638 204V188.992H467.638V204H469.638ZM467.954 188.263C454.977 200.445 442.886 205.68 427.098 205.68V207.68C443.47 207.68 456.035 202.195 469.322 189.721L467.954 188.263ZM427.098 205.68C417.168 205.68 408.025 203.558 401.391 198.704C394.806 193.885 390.578 186.293 390.578 175.056H388.578C388.578 186.867 393.06 195.087 400.21 200.318C407.311 205.514 416.928 207.68 427.098 207.68V205.68ZM390.578 175.056C390.578 166.401 392.834 160.085 396.791 155.196C400.768 150.283 406.534 146.72 413.715 143.718C420.901 140.714 429.405 138.31 438.806 135.655C448.186 133.006 458.426 130.114 468.99 126.144L468.286 124.272C457.812 128.208 447.651 131.078 438.262 133.73C428.894 136.376 420.264 138.813 412.944 141.873C405.62 144.934 399.51 148.658 395.237 153.937C390.945 159.241 388.578 166.023 388.578 175.056H390.578ZM469.638 125.208V118.776H467.638V125.208H469.638ZM469.638 118.776C469.638 105.528 466.803 96.4489 461.394 90.6885C455.97 84.9124 448.143 82.668 438.622 82.668V84.668C447.861 84.668 455.042 86.8456 459.936 92.0575C464.845 97.2851 467.638 105.76 467.638 118.776H469.638ZM438.622 82.668C422.159 82.668 406.801 91.731 398.862 108.157L400.662 109.027C408.267 93.293 422.925 84.668 438.622 84.668V82.668ZM400.181 107.684L396.697 106.076L395.859 107.892L399.343 109.5L400.181 107.684ZM397.188 107.398C406.468 86.9829 424.94 68.32 453.094 68.32V66.32C423.896 66.32 404.848 85.7131 395.368 106.57L397.188 107.398ZM453.094 68.32C469.421 68.32 483.091 72.4355 492.667 80.8675C502.222 89.2811 507.838 102.113 507.838 119.848H509.838C509.838 101.671 504.064 88.2388 493.988 79.3665C483.933 70.5125 469.731 66.32 453.094 66.32V68.32ZM507.838 119.848V179.612H509.838V119.848H507.838ZM507.838 179.612C507.838 187.588 509.181 193.305 512.217 197.027C515.296 200.803 519.937 202.32 525.99 202.32V200.32C520.251 200.32 516.316 198.889 513.767 195.763C511.175 192.585 509.838 187.448 509.838 179.612H507.838ZM525.99 202.32H531.35V200.32H525.99V202.32ZM530.35 201.32V204H532.35V201.32H530.35ZM531.35 203H525.99V205H531.35V203ZM525.99 203C510.438 203 489.781 203.268 470.726 204.342L470.838 206.338C489.839 205.268 510.454 205 525.99 205V203ZM427.974 167.016C427.974 172.7 429.64 177.797 433.178 181.477C436.723 185.166 442.033 187.312 449.074 187.312V185.312C442.447 185.312 437.707 183.304 434.619 180.092C431.524 176.871 429.974 172.32 429.974 167.016H427.974ZM449.074 187.312C452.755 187.312 456.016 186.971 459.263 185.924C462.512 184.876 465.695 183.137 469.248 180.405L468.028 178.819C464.613 181.447 461.632 183.058 458.649 184.02C455.666 184.983 452.629 185.312 449.074 185.312V187.312ZM469.638 179.612V134.052H467.638V179.612H469.638ZM468.276 133.12C452.728 139.151 442.672 144.159 436.503 149.368C433.402 151.986 431.257 154.677 429.894 157.598C428.529 160.522 427.974 163.62 427.974 167.016H429.974C429.974 163.846 430.491 161.048 431.706 158.444C432.922 155.838 434.864 153.37 437.793 150.896C443.684 145.921 453.46 141.013 469 134.984L468.276 133.12ZM561.774 204H560.774V205H561.774V204ZM561.774 201.32V200.32H560.774V201.32H561.774ZM564.454 79.38H563.454V80.38H564.454V79.38ZM564.454 76.7V75.7H563.454V76.7H564.454ZM621.806 61.96V60.96H621.497L621.241 61.1351L621.806 61.96ZM624.486 61.96H625.486V60.96H624.486V61.96ZM624.486 90.636H623.486V92.9639L625.175 91.3613L624.486 90.636ZM624.486 98.408L623.901 97.5973L623.486 97.8967V98.408H624.486ZM646.998 201.32H647.998V200.32H646.998V201.32ZM646.998 204V205H647.998V204H646.998ZM604.386 201.66C599.396 201.66 593.134 201.997 586.614 202.331C580.077 202.667 573.269 203 567.134 203V205C573.328 205 580.187 204.664 586.716 204.329C593.26 203.993 599.46 203.66 604.386 203.66V201.66ZM567.134 203H561.774V205H567.134V203ZM562.774 204V201.32H560.774V204H562.774ZM561.774 202.32H567.134V200.32H561.774V202.32ZM567.134 202.32C573.188 202.32 577.828 200.803 580.907 197.027C583.943 193.305 585.286 187.588 585.286 179.612H583.286C583.286 187.448 581.949 192.585 579.357 195.763C576.808 198.889 572.873 200.32 567.134 200.32V202.32ZM585.286 179.612V101.088H583.286V179.612H585.286ZM585.286 101.088C585.286 93.1121 583.943 87.3952 580.907 83.6725C577.828 79.8972 573.188 78.38 567.134 78.38V80.38C572.873 80.38 576.808 81.8108 579.357 84.9365C581.949 88.1147 583.286 93.2519 583.286 101.088H585.286ZM567.134 78.38H564.454V80.38H567.134V78.38ZM565.454 79.38V76.7H563.454V79.38H565.454ZM564.454 77.7H567.134V75.7H564.454V77.7ZM567.134 77.7C588.447 77.7 607.689 72.8451 622.372 62.7849L621.241 61.1351C606.979 70.9069 588.165 75.7 567.134 75.7V77.7ZM621.806 62.96H624.486V60.96H621.806V62.96ZM623.486 61.96V90.636H625.486V61.96H623.486ZM625.175 91.3613C641 76.3406 652.261 68.32 665.758 68.32V66.32C651.383 66.32 639.596 74.9154 623.798 89.9107L625.175 91.3613ZM665.758 68.32C671.993 68.32 677.944 70.2707 682.314 73.5163C686.68 76.7586 689.414 81.2423 689.414 86.348H691.414C691.414 80.4657 688.253 75.4354 683.506 71.9107C678.765 68.3893 672.388 66.32 665.758 66.32V68.32ZM689.414 86.348C689.414 93.5206 683.746 99.552 674.87 99.552V101.552C684.754 101.552 691.414 94.7194 691.414 86.348H689.414ZM674.87 99.552C669.43 99.552 665.304 97.0368 660.922 94.3403C656.594 91.6768 652.01 88.832 645.926 88.832V90.832C651.367 90.832 655.492 93.3472 659.874 96.0437C664.202 98.7072 668.787 101.552 674.87 101.552V99.552ZM645.926 88.832C642.612 88.832 639.54 89.2485 636.057 90.5722C632.593 91.8886 628.761 94.0873 623.901 97.5973L625.072 99.2187C629.86 95.7606 633.532 93.6714 636.768 92.4418C639.984 91.2195 642.808 90.832 645.926 90.832V88.832ZM623.486 98.408V179.612H625.486V98.408H623.486ZM623.486 179.612C623.486 187.588 624.829 193.305 627.865 197.027C630.944 200.803 635.585 202.32 641.638 202.32V200.32C635.9 200.32 631.964 198.889 629.415 195.763C626.823 192.585 625.486 187.448 625.486 179.612H623.486ZM641.638 202.32H646.998V200.32H641.638V202.32ZM645.998 201.32V204H647.998V201.32H645.998ZM646.998 203H641.638V205H646.998V203ZM641.638 203C635.504 203 628.695 202.667 622.159 202.331C615.638 201.997 609.376 201.66 604.386 201.66V203.66C609.312 203.66 615.512 203.993 622.057 204.329C628.585 204.664 635.445 205 641.638 205V203Z"
                  fill="#C38C5C"
                />
              </svg>
              <p>Staking and Loan cryptocurrency</p>
            </Scroll.Item>
          </div>
          <div className="landingCardsContainer">
            <Scroll.Item keyframes={keyframes.opacityIn}>
              <div className="landingCardsContainerInner">
                <div className="landingCardBig landingCard">
                  <img src={card1} alt="atar_gard" />
                </div>
                <div className="landingCardLtls">
                  <div className="landingCard">
                    <img src={card2} alt="ltlcard1" />
                  </div>
                  <div className="landingCard">
                    <img src={card3} alt="ltlcard2" />
                  </div>
                  <div className="landingCard">
                    <img src={card4} alt="ltlcard3" />
                  </div>
                </div>
              </div>
            </Scroll.Item>
          </div>
          <div className="landingLatestPrices landingLatestPricesReverse">
            <img src={patternBg4} alt="paternbg4" className="patternBg4" />
            <div className="landingLatestPricesDescr">
              <h2 className="ttl">
                Latest Market <br />
                Prices
              </h2>
              <p>
                Our platform provides you with market intelligence and live pricing on
                thousands of global assets.
              </p>
            </div>
            <div className="landingLatestPricesItems">
              <div className="landingLatestPricesItem">
                <MiniChart width="100%" symbol="BTCUSD"></MiniChart>
              </div>
              <div className="landingLatestPricesItem">
                <MiniChart width="100%" symbol="ETHUSD"></MiniChart>
              </div>
              <div className="landingLatestPricesItem">
                <MiniChart width="100%" symbol="XAUUSD"></MiniChart>
              </div>
              <div className="landingLatestPricesItem">
                <MiniChart width="100%"></MiniChart>
              </div>
            </div>
          </div>
          <div className="landingLatestPrices landingLatestPricesColumn">
            <div className="landingLatestPricesDescr">
              <h3 className="ttl">Embark on a</h3>
              <h2 className="ttl">
                Limitless Trading <br />
                Adventure
              </h2>
              <p>
                Our platform is your steadfast companion, seamlessly supporting all of
                your deFi demands from staking, cryptocurrency to forex, gold, and stocks.
              </p>
            </div>
            <div className="landingLatestPricesItems">
              <div className="landingLatestPricesItem">
                <div className="heightOv">
                  <MiniChart width="100%"></MiniChart>
                </div>
              </div>
              <div className="landingLatestPricesItem">
                <div className="heightOv">
                  <MiniChart width="100%" symbol="XAUUSD"></MiniChart>
                </div>
              </div>
              <div className="landingLatestPricesItem">
                <div className="heightOv">
                  <MiniChart width="100%" symbol="TSLA"></MiniChart>
                </div>
              </div>
              <div className="landingLatestPricesItem">
                <div className="heightOv">
                  <MiniChart width="100%" symbol="NDX"></MiniChart>
                </div>
              </div>
              <div className="landingLatestPricesItem">
                <div className="heightOv">
                  <MiniChart width="100%" symbol="BTCUSD"></MiniChart>
                </div>
              </div>
            </div>
          </div>
          <div className="landingContentContainer landingContentContainerTxt">
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">
                  Welcome to a new era of seemingly infinite financial opportunities!
                </h2>
                <p>
                  We represent a movement dedicated to democratizing financial markets and
                  reimagining finance's future. <br />
                  <br />
                  Borders are eliminated, and tradition limitations are lifted. We cater
                  to both seasoned traders and newbies with our arsenal of features,
                  making your trading adventure as easy as possible.
                  <br />
                  <br />
                  We welcome you to join us in dreaming big and achieving even more. Join
                  our worldwide marketplace and embark on a journey of limitless
                  opportunities.
                </p>
              </div>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">Erase Boundaries, Embrace DeFi</h2>
                <p>
                  With our Decentralized Finance (DeFi) platform, you can achieve infinite
                  financial autonomy. Embrace a world of openness, involvement, and
                  increased security instead of traditional centralized methods. Our DeFi
                  Platform empowers you to take charge of your financial future by erasing
                  the lines and breaking down obstacles. Navigate through a wide range of
                  financial instruments, from staking to trading, loans, and incentives,
                  all in a trustless, permission-less environment. <br />
                  <br />
                  Join us and discover DeFi's enormous potential as your doorway to
                  financial emancipation. Begin your journey to ultimate financial freedom
                  right now.
                </p>
              </div>
            </div>
          </div>
          <div className="landingColumns">
            <img src={patternBg3} alt="paternbg3" className="patternBg3" />
            <div className="landingColumn">
              <h3 className="ttl">Novice Navigator</h3>
              <h4 className="ttl">Entry-Level Efficiency</h4>
              <p>
                This account is crafted for beginners. It offers a safe platform to learn,
                explore, and initiate your journey into the world of trading, with minimal
                risks and affordable fees & commissions.
              </p>
            </div>
            <div className="landingColumn">
              <h3 className="ttl">Stellar Standard</h3>
              <h4 className="ttl">Balance & Brilliance</h4>
              <p>
                The Stellar Standard account is the industry classic. It strikes a perfect
                balance of affordability and functionality, providing a stable market
                execution with nominal fees & commissions.
              </p>
            </div>
            <div className="landingColumn">
              <h3 className="ttl">Expert Edge</h3>
              <h4 className="ttl">Professional Prowess</h4>
              <p>
                This account caters to the needs of professional traders. It provides
                high-frequency trading, advanced technical analysis capabilities, and
                lower latency. Expert Edge is perfect for those seeking to optimize their
                trading strategies.
              </p>
            </div>
            <div className="landingColumn">
              <h3 className="ttl">Platinum Privilege</h3>
              <h4 className="ttl">VIP Versatility</h4>
              <p>
                Platinum Privilege, our VIP account, offers the utmost in trading
                flexibility and exclusivity. With the lowest fees and commissions,
                priority access to new features, and a dedicated account manager, it is
                designed for high volume, sophisticated traders who demand the best.
              </p>
            </div>
          </div>
          <div className="landingContentContainer">
            <img src={patternBg2} alt="paternbg2" className="patternBg2" />
            <div className="landingContentHalf image">
              <Scroll.Item keyframes={keyframes.zoomOut1}>
                <div className="landingContentHalfImg">
                  <img src={contentBg1} alt="contentBg1" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">Elevate Your Earnings</h2>
                <h3 className="ttl">
                  Discover the power of <span>Staking</span>
                </h3>
                <p>
                  Make your assets work for you even when you're not actively trading.
                  Simply lock-up your tokens in our secure on-chain Vault and enjoy a
                  consistent, real-time passive income. It's an efficient and
                  straightforward way to maximize your investment returns. <br />
                  While your primary focus remains on market maneuvers, staking ensures
                  your portfolio continues to grow passively. Let your tokens deliver the
                  performance you desire with “"Atar"” Staking – a smart investment
                  strategy for today's proactive trader.
                </p>
              </div>
            </div>
          </div>
          <div className="landingContentContainer rightImg">
            <div className="landingContentHalf image">
              <Scroll.Item keyframes={keyframes.zoomOut2}>
                <div className="landingContentHalfImg">
                  <img src={contentBg2} alt="contentBg1" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">Maximize Your Market Moves:</h2>
                <h3 className="ttl">
                  Achieve More with <span>Margin Trading</span>
                </h3>
                <p>
                  Empower your financial journey with the dynamic capabilities of Margin
                  Trading. With Margin Trading, you can effectively enhance your buying
                  power, making larger trades a reality. This allows you to seize timely
                  investment opportunities without causing any disruption to your existing
                  financial portfolio. But the benefits don't end there. <br />
                  Margin Trading also offers you unprecedented liquidity. Enjoy the
                  unparalleled flexibility of accessing additional capital without the
                  need to sell off your valuable investments. This feature ensures that
                  you can keep your strategic market positions unscathed while promptly
                  addressing any immediate financial requirements. Experience the
                  revolutionized trading environment that margin trading offers, and
                  optimize your financial success.
                </p>
              </div>
            </div>
          </div>
          <div className="landingContentContainer">
            <div className="landingContentHalf image">
              <Scroll.Item keyframes={keyframes.zoomOut3}>
                <div className="landingContentHalfImg">
                  <img src={contentBg3} alt="contentBg1" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">Trade (Gold/Stocks/Crypto/Forex) Without Borders</h2>
                <p>
                  Experience the potency of hybrid trade platform, designed for seamless
                  cross-asset trading through one account.
                </p>
              </div>
            </div>
          </div>
          <div className="landingContentContainer rightImg">
            <div className="landingContentHalf image">
              <Scroll.Item keyframes={keyframes.zoomOut4}>
                <div className="landingContentHalfImg">
                  <img src={contentBg4} alt="contentBg1" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">Hybrid Trading Platform</h2>
                <h3 className="ttl">Beyond Space and Time</h3>
                <p>
                  Crafted by market professionals for fellow traders, our platform
                  empowers you with unprecedented access to global markets. Engage in
                  trading at your convenience, equipped with our cutting-edge trading
                  tools, competitive leverage, and minimized trading fees.
                  <br />
                  <br />
                  Exceptional Features for a Streamlined Trading Experience:
                </p>
                <ul>
                  <li>Competitive low trading fees and tight spreads</li>
                  <li>Cutting-edge, low latency for ultra-fast order execution</li>
                  <li>Exceptional leverage ratio</li>
                  <li>Robust and user-friendly trading interfaces</li>
                  <li>Swift and secure deposit and withdrawal process</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="landingContentContainer">
            <div className="landingContentHalf image">
              <Scroll.Item keyframes={keyframes.zoomOut4}>
                <div className="landingContentHalfImg">
                  <img src={contentBg5} alt="contentBg1" />
                </div>
              </Scroll.Item>
            </div>
            <div className="landingContentHalf">
              <div className="landingContentDescription">
                <h2 className="ttl">
                  <span>100+</span> trading instruments
                </h2>
                <ul>
                  <li>
                    Trade a Broad Spectrum of Assets: Commodities, Metals, Digital
                    Currencies, Bonds, Forex and Indices to Shares and ETFs.
                  </li>
                  <li>Accurate and stable order execution</li>
                  <li>No re-quotes.</li>
                </ul>
                <br />
                <br />
                <h2 className="ttl">Unified Trading Experience</h2>
                <p>
                  All Your Accounts through One Portal, Access and Trade in Stock & Metal
                  Markets for Optimal Efficiency
                </p>
              </div>
            </div>
          </div>
          <div className="landingContentContainer landingContentContainerTxt faqContainer">
            <img src={patternBg5} alt="paternbg5" className="patternBg5" />
            <div className="landingContentHalf">
              <h2 className="ttl">How to Get Started?</h2>
            </div>
            <div className="landingContentHalf">
              <div className="faqElements">
                {howStart.map((item, index) => {
                  return (
                    <div
                      className={`faqElement ${activeHowStart == index ? "active" : ""}`}
                      onClick={() => {
                        openHowStart(index);
                      }}
                      key={index}>
                      <div className="ttl faqElementTtl">{item.question}</div>
                      <div className="faqElementAnswer">{item.answer}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="landingContentContainer landingContentContainerTxt borderedContainers">
            <div className="landingContentBordered landingContentHalf">
              <h2 className="ttl">Trading Mastery: Education for Every Trader</h2>
              <h3 className="ttl">Daily Trading Insights:</h3>
              <p>Acquire Valuable Tips for Enhanced Profitability in Trading.</p>
              <h3>Comprehensive Learning Resources:</h3>
              <p>
                Explore our Free Trading Basics Course. Benefit from Regular Webinars and
                Live Trading Sessions Tailored for Beginners and Pros Alike.
              </p>
            </div>
            <div className="landingContentBordered landingContentHalf">
              <h2 className="ttl">Unleash the Power of Referrals</h2>
              <p>
                Harness the potential to augment your earnings through our lucrative
                Referral Program. By inviting other traders to join this platform, not
                only do you contribute to a growing community of like-minded individuals,
                but you also unlock the opportunity to earn more. Our referral initiative
                is designed to reward you generously for each successful referral. The
                more traders you bring aboard, the higher the rewards you earn. It's a
                win-win - your referrals get to experience a robust and user-friendly
                trading platform, and you get to reap the benefits of your network. It's
                more than just a referral - it's an opportunity to thrive together in the
                dynamic world of trading.
              </p>
            </div>
            <div className="landingContentBordered landingContentHalf">
              <h2 className="ttl">
                Peer-to-Peer Lending <br />
                Revolutionizing Financial Dynamics
              </h2>
              <p>
                Our cutting-edge peer-to-peer lending platform serves as a streamlined
                medium, enabling smooth and efficient financial exchanges between
                individual lenders and borrowers. It epitomizes the intersection of
                technological innovation and financial solutions, ensuring secure and
                profitable interactions for all parties involved.
              </p>
              <h3 className="ttl">For Lenders: An Avenue for Optimized Capital Growth</h3>
              <p>
                Our platform serves as an innovative gateway for lenders to explore an
                array of investment opportunities, thereby diversifying and enriching
                their portfolios. By facilitating direct funding to borrowers, lenders
                stand to realize potentially appealing returns. In our endeavor to empower
                lenders, we provide the autonomy to stipulate lending terms, select
                borrowers, and monitor investments at your convenience. With our
                commitment to transparency and robust risk management strategies, we
                provide a secure and trustworthy environment for your active engagement in
                the P2P lending market.
              </p>
              <h3 className="ttl">
                For Borrowers: Transforming Financial Ambitions into Reality
              </h3>
              <p>
                For those requiring funds to actualize goals, our peer-to-peer lending
                platform emerges as the quintessential solution. Bypassing the
                labyrinthine procedures of traditional financial institutions, we present
                a more direct, user-friendly approach to lending. Our platform bestows
                numerous benefits such as swift loan approvals, competitive interest
                rates, and bespoke lending terms that acknowledge and adapt to your
                distinct financial context. By leveraging the combined prowess of our vast
                lending community, we endeavor to smooth your path towards financial
                self-sufficiency and the accomplishment of your aspirations.
              </p>
            </div>
            <div className="landingContentBordered landingContentHalf">
              <h2 className="ttl">
                "Atar" Elite Membership :Unlock the Vault of Prosperity
              </h2>
              <p>
                Are you set to seize command of your financial voyage and unlock the full
                potential of your wealth? Then, "Atar" Elite is the ultimate resource you
                have been seeking. As a distinctive membership club, "Atar" Elite extends
                an assortment of unique tools and perks designed to turbocharge your
                financial maneuvers, all available for a reasonable fee of $20 monthly.
              </p>
              <h3 className="ttl">Elevate Your Savings with Premium APY</h3>
              <p>
                "Atar" Elite enriches your saving strategy by providing an additional 1.2%
                APY. This high yield is thoughtfully engineered to bolster your savings
                and exponentially grow your wealth over time.
              </p>
              <h3 className="ttl">
                Exclusive Access to Premium Educational Content at Discounted Rates
              </h3>
              <p>
                "Atar" Elite is more than just a suite of financial tools and services.
                It's a hub for financial enlightenment. As a member, you reap the benefits
                of exclusive discounts on first-class educational content. This carefully
                curated assortment of financial literature and courses equips you with the
                knowledge to make astute financial decisions and enhance your investment
                strategies.
              </p>
              <h3 className="ttl">Access to Members-Only Financial Seminars</h3>
              <p>
                "Atar" Elite symbolizes a groundbreaking and empowering paradigm in
                personal finance. For a nominal $20 a month, you unlock access to a
                treasure trove of resources conceived to help you grow and govern your
                money more proficiently. With "Atar" Elite, your investment transcends
                beyond a mere membership, it becomes a stake in your financial future.
                Sign up for "Atar" Elite today and escalate your financial prowess.
                Together, let's construct a more robust financial future.
              </p>
            </div>
          </div>
          <div className="landingContentContainer landingContentContainerTxt faqContainer">
            <div className="landingContentHalf">
              <h2 className="ttl">Frequently Asked Questions</h2>
            </div>
            <div className="landingContentHalf">
              <div className="faqElements">
                {faq.map((item, index) => {
                  return (
                    <div
                      className={`faqElement ${activeFaq == index ? "active" : ""}`}
                      onClick={() => {
                        openFaq(index);
                      }}
                      key={index}>
                      <div className="ttl faqElementTtl">{item.question}</div>
                      <div className="faqElementAnswer">{item.answer}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="landingJoinContainer">
            <div className="footerBg">
              <img src={footerBg} alt="footerBg" />
            </div>
            <div className="landingJoinContainerHalf">
              <h3 className="ttl">
                Join the <br />
                Atar
              </h3>
            </div>
            <div className="landingJoinContainerHalf">
              <div className="landingSlideContainerBtn">
                <svg
                  width="261"
                  height="79"
                  viewBox="0 0 261 79"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="10"
                    y="10"
                    width="251"
                    height="69"
                    rx="4"
                    fill="url(#paint0_linear_390_1404)"
                  />
                  <g filter="url(#filter0_b_390_1404)">
                    <rect width="251" height="69" rx="4" fill="white" fillOpacity="0.2" />
                    <path
                      d="M93.3098 34.14C93.9498 34.14 95.4098 34.04 96.1698 34.04H96.5698V34.24H96.1698C95.2898 34.24 94.8898 34.68 94.8898 35.86V40.06C94.8898 40.58 94.9898 40.8 95.6498 40.8V40.96C93.3298 41.68 91.7298 42.2 89.6698 42.2C84.7498 42.2 80.8898 39.38 80.8898 34.5C80.8898 29.62 84.7498 26.8 89.6698 26.8C91.3298 26.8 92.6698 27.16 93.9098 27.56L94.1698 27H94.3498C94.2298 28.9 94.1698 29.68 94.2898 31.56H94.0698C94.0698 28.94 92.3298 27.54 89.6698 27.54C86.3498 27.54 84.3898 30.36 84.3898 34.5C84.3898 38.64 86.3298 41.46 89.6698 41.46C90.4898 41.46 91.1498 41.32 91.7098 41.04V35.86C91.7098 34.68 91.3098 34.24 90.4298 34.24H90.0298V34.04H90.4298C91.1898 34.04 92.6698 34.14 93.3098 34.14ZM106.588 34.7C106.588 34.92 106.568 35.2 106.528 35.36H100.368C100.348 35.58 100.328 35.82 100.328 36.06C100.328 38.58 101.528 40.48 103.948 40.48C104.928 40.48 105.748 40.06 106.708 39.12L106.888 39.28C105.028 41.26 103.768 42.2 101.888 42.2C99.3477 42.2 97.5677 40.5 97.5677 37.42C97.5677 33.92 100.108 31.8 103.028 31.8C105.368 31.8 106.588 32.92 106.588 34.7ZM102.848 32.5C101.708 32.5 100.888 33.32 100.528 34.56H104.148C104.188 34.34 104.208 34.08 104.208 33.84C104.208 33.16 103.868 32.5 102.848 32.5ZM111.878 28.5H112.078V32H115.498V32.8H112.078V39.34C112.078 40.56 112.658 41.1 113.498 41.1C114.058 41.1 114.658 41.08 115.578 40.46L115.698 40.62C114.518 41.52 113.358 42.2 112.138 42.2C110.418 42.2 109.078 41.3 109.078 39.3V32.8H107.398V32.6L107.698 32.42C109.058 31.6 110.798 30.38 111.878 28.5ZM126.538 27.5C124.938 27.5 123.938 28.36 123.938 29.7C123.938 33.22 131.658 31.62 131.658 37.22C131.658 40.16 129.558 42.2 126.458 42.2C124.778 42.2 123.658 41.8 122.838 41.32L122.458 42H122.278C122.178 40.32 122.058 39.06 121.578 37.34L121.798 37.28C122.838 40.18 124.518 41.5 126.458 41.5C128.278 41.5 129.598 40.44 129.598 38.92C129.598 34.78 121.898 36.76 121.898 30.88C121.898 28.46 123.778 26.8 126.538 26.8C128.258 26.8 129.258 27.2 129.998 27.58L130.258 27H130.438C130.318 28.72 130.358 29.32 130.598 30.98L130.378 31.04C130.058 28.6 127.878 27.5 126.538 27.5ZM137.249 28.5H137.449V32H140.869V32.8H137.449V39.34C137.449 40.56 138.029 41.1 138.869 41.1C139.429 41.1 140.029 41.08 140.949 40.46L141.069 40.62C139.889 41.52 138.729 42.2 137.509 42.2C135.789 42.2 134.449 41.3 134.449 39.3V32.8H132.769V32.6L133.069 32.42C134.429 31.6 136.169 30.38 137.249 28.5ZM147.767 42.1L147.607 42V40.88C146.627 41.8 145.707 42.2 144.507 42.2C143.007 42.2 141.707 41.56 141.707 39.84C141.707 37.2 144.467 37.3 147.607 36.12V35.64C147.607 33.68 146.767 33.02 145.367 33.02C144.167 33.02 143.047 33.68 142.467 34.88L142.207 34.76C142.907 33.22 144.307 31.8 146.447 31.8C148.907 31.8 150.607 33.04 150.607 35.72V40.18C150.607 41.36 151.007 41.8 151.887 41.8H152.287V42H151.887C150.727 42 149.187 42.02 147.767 42.1ZM144.647 39.24C144.647 40.06 145.127 40.68 146.147 40.68C146.687 40.68 147.087 40.58 147.607 40.18V36.78C145.287 37.68 144.647 38.26 144.647 39.24ZM155.737 41.9C154.997 41.9 153.877 42 152.957 42H152.557V41.8H152.957C153.837 41.8 154.237 41.36 154.237 40.18V34.32C154.237 33.14 153.837 32.7 152.957 32.7H152.757V32.5H152.957C154.537 32.5 155.957 32.14 157.037 31.4H157.237V33.54C158.417 32.42 159.277 31.8 160.317 31.8C161.277 31.8 162.157 32.4 162.157 33.22C162.157 33.8 161.697 34.28 160.997 34.28C160.137 34.28 159.697 33.48 158.837 33.48C158.357 33.48 157.957 33.6 157.237 34.12V40.18C157.237 41.36 157.637 41.8 158.517 41.8H158.917V42H158.517C157.597 42 156.477 41.9 155.737 41.9ZM167.113 28.5H167.313V32H170.733V32.8H167.313V39.34C167.313 40.56 167.893 41.1 168.733 41.1C169.293 41.1 169.893 41.08 170.813 40.46L170.933 40.62C169.753 41.52 168.593 42.2 167.373 42.2C165.653 42.2 164.313 41.3 164.313 39.3V32.8H162.633V32.6L162.933 32.42C164.293 31.6 166.033 30.38 167.113 28.5Z"
                      fill="#0E2225"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_b_390_1404"
                      x="-20"
                      y="-20"
                      width="291"
                      height="109"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
                      <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_390_1404"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_390_1404"
                        result="shape"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_390_1404"
                      x1="10"
                      y1="44"
                      x2="261"
                      y2="44"
                      gradientUnits="userSpaceOnUse">
                      <stop stopColor="#C38C5C" />
                      <stop offset="1" stopColor="#3D6C72" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div className="landingFooter">
            <div>© 2023 All rights reserved</div>
            <div className="landingFooterNav">
              <a href="##">Privacy Policy</a>
              <a href="##">Terms and Conditions</a>
            </div>
          </div>
        </Scroll.Section>
      </Scroll.Container>
      {/*<LandingMain*/}
      {/*  animate={animate}*/}
      {/*  account={account}*/}
      {/*  handleGetStarted={() => console.log("get started")}*/}
      {/*  handleConnect={() => console.log("hi")}*/}
      {/*  startTrade={() => console.log("start trade")}*/}
      {/*  allImages={allImages}*/}
      {/*  info={[*/}
      {/*    {*/}
      {/*      title: "Dashboard",*/}
      {/*      color: "#707EFD",*/}
      {/*      boxShadow: "0px 10px 60px rgba(112, 126, 253, 0.12)",*/}
      {/*      svg: (*/}
      {/*        <svg*/}
      {/*          width="26"*/}
      {/*          height="26"*/}
      {/*          viewBox="0 0 26 26"*/}
      {/*          fill="none"*/}
      {/*          xmlns="http://www.w3.org/2000/svg"*/}
      {/*        >*/}
      {/*          <path*/}
      {/*            fill-rule="evenodd"*/}
      {/*            clip-rule="evenodd"*/}
      {/*            d="M13.0726 2.66913C13.5487 2.07842 14.3023 1.80349 15.1441 1.66248L19.1286 0.99507C19.9704 0.854063 20.7725 0.86841 21.4151 1.27172C22.0834 1.69111 22.3863 2.40474 22.5187 3.19526L23.2687 7.67288C23.401 8.46284 23.3477 9.23731 22.8511 9.85093C22.3737 10.4408 21.6189 10.7123 20.7768 10.8482L16.7945 11.5152C15.9553 11.6558 15.1531 11.645 14.5098 11.243C13.8399 10.8244 13.5374 10.1089 13.4044 9.31503L12.6561 4.84727C12.5237 4.05676 12.5775 3.28339 13.0726 2.66913ZM14.2404 3.61046C14.1332 3.74347 14.0349 3.99936 14.1355 4.59947L14.8838 9.06723C14.9854 9.67381 15.1621 9.88189 15.3047 9.97098C15.474 10.0768 15.8177 10.1579 16.5467 10.0358L20.5358 9.36764C21.2625 9.25061 21.5601 9.06168 21.6851 8.90732C21.7912 8.77614 21.8899 8.52134 21.7893 7.92068L21.0393 3.44306C20.9388 2.84295 20.7625 2.63305 20.6178 2.54223C20.4474 2.43533 20.1028 2.3528 19.3764 2.47446L15.3919 3.14187C14.6656 3.26354 14.3666 3.45389 14.2404 3.61046Z"*/}
      {/*            fill="#707EFD"*/}
      {/*          />*/}
      {/*          <path*/}
      {/*            fill-rule="evenodd"*/}
      {/*            clip-rule="evenodd"*/}
      {/*            d="M14.9557 14.1031C15.4219 13.4494 16.1864 13.1483 17.0445 13.0045L21.029 12.3371C21.8872 12.1934 22.7081 12.2289 23.3618 12.6951C24.0155 13.1612 24.3166 13.9257 24.4604 14.7839L25.1278 18.7684C25.2715 19.6265 25.236 20.4474 24.7698 21.1011C24.3037 21.7548 23.5392 22.056 22.681 22.1997L18.6965 22.8671C17.8384 23.0109 17.0175 22.9753 16.3638 22.5092C15.71 22.043 15.4089 21.2785 15.2652 20.4204L14.5978 16.4359C14.454 15.5777 14.4896 14.7568 14.9557 14.1031ZM16.177 14.974C16.0541 15.1464 15.9582 15.4781 16.0772 16.1881L16.7446 20.1726C16.8635 20.8826 17.0622 21.1649 17.2346 21.2879C17.4071 21.4108 17.7387 21.5067 18.4487 21.3877L22.4332 20.7203C23.1432 20.6014 23.4255 20.4027 23.5485 20.2303C23.6715 20.0578 23.7673 19.7261 23.6484 19.0162L22.981 15.0317C22.8621 14.3217 22.6634 14.0394 22.4909 13.9164C22.3185 13.7934 21.9868 13.6976 21.2768 13.8165L17.2923 14.4839C16.5823 14.6028 16.3 14.8015 16.177 14.974Z"*/}
      {/*            fill="#707EFD"*/}
      {/*          />*/}
      {/*          <path*/}
      {/*            fill-rule="evenodd"*/}
      {/*            clip-rule="evenodd"*/}
      {/*            d="M1.73077 4.56903C2.2069 3.97832 2.96051 3.70339 3.80234 3.56239L7.78683 2.89497C8.62865 2.75397 9.43072 2.76831 10.0733 3.17162C10.7416 3.59101 11.0445 4.30465 11.1769 5.09516L11.9269 9.57278C12.0592 10.3627 12.0059 11.1372 11.5093 11.7508C11.0319 12.3407 10.2771 12.6122 9.435 12.7481L5.4527 13.4151C4.61351 13.5557 3.8113 13.5449 3.16804 13.1429C2.49806 12.7243 2.19563 12.0088 2.06264 11.2149L1.31428 6.74718C1.18187 5.95666 1.23566 5.18329 1.73077 4.56903ZM2.89863 5.51036C2.79142 5.64337 2.69315 5.89926 2.79367 6.49937L3.54203 10.9671C3.64364 11.5737 3.82035 11.7818 3.96293 11.8709C4.13221 11.9767 4.47593 12.0578 5.2049 11.9357L9.19404 11.2675C9.92073 11.1505 10.2183 10.9616 10.3433 10.8072C10.4494 10.676 10.5481 10.4212 10.4475 9.82058L9.69749 5.34296C9.59697 4.74285 9.42068 4.53295 9.27598 4.44214C9.10565 4.33524 8.76096 4.2527 8.03463 4.37436L4.05014 5.04178C3.32381 5.16344 3.02483 5.35379 2.89863 5.51036Z"*/}
      {/*            fill="#707EFD"*/}
      {/*          />*/}
      {/*          <path*/}
      {/*            fill-rule="evenodd"*/}
      {/*            clip-rule="evenodd"*/}
      {/*            d="M3.61296 16.003C4.0791 15.3493 4.84359 15.0482 5.70175 14.9044L9.68624 14.237C10.5444 14.0933 11.3653 14.1288 12.019 14.595C12.6727 15.0611 12.9738 15.8256 13.1176 16.6838L13.785 20.6683C13.9288 21.5264 13.8932 22.3473 13.427 23.001C12.9609 23.6547 12.1964 23.9559 11.3383 24.0996L7.35376 24.767C6.4956 24.9108 5.67472 24.8752 5.021 24.4091C4.36728 23.9429 4.06615 23.1784 3.92241 22.3203L3.255 18.3358C3.11125 17.4776 3.14682 16.6567 3.61296 16.003ZM4.83427 16.8739C4.7113 17.0463 4.61546 17.378 4.73439 18.088L5.4018 22.0725C5.52073 22.7825 5.71941 23.0648 5.89186 23.1878C6.06431 23.3107 6.39597 23.4066 7.10596 23.2876L11.0905 22.6202C11.8004 22.5013 12.0828 22.3026 12.2057 22.1302C12.3287 21.9577 12.4245 21.6261 12.3056 20.9161L11.6382 16.9316C11.5193 16.2216 11.3206 15.9393 11.1481 15.8163C10.9757 15.6933 10.644 15.5975 9.93404 15.7164L5.94955 16.3838C5.23956 16.5027 4.95724 16.7014 4.83427 16.8739Z"*/}
      {/*            fill="#707EFD"*/}
      {/*          />*/}
      {/*        </svg>*/}
      {/*      ),*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: "Staking",*/}
      {/*      color: "#FA6161",*/}
      {/*      boxShadow: "0px 10px 60px rgba(250, 97, 97, 0.12)",*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: "Referral",*/}
      {/*      color: "#70FDCA",*/}
      {/*      boxShadow: "box-shadow: 0px 10px 60px rgba(112, 253, 202, 0.12)",*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: "Loan",*/}
      {/*      color: "#FD70B3",*/}
      {/*      boxShadow: "0px 10px 60px rgba(253, 112, 179, 0.12)",*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: "Trade",*/}
      {/*      color: "#FDCD70",*/}
      {/*      boxShadow: "0px 10px 60px rgba(253, 205, 112, 0.12)",*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*  whyComplendData={defaultCardsData}*/}
      {/*  overviewProjectsData={aboutProjectsData}*/}
      {/*/>*/}
    </>
  );
};

export default Landing;
