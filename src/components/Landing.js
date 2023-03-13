import React, { useState } from "react";

// components
import Card from "./Landing/Card/Card";
import Navbar from "./Landing/Navbar/Navbar";
import Footer from "./Landing/Footer/Footer";

// svgs
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Github, 
  TradeIcon,
  StakingIcon,
  DashboardIcon,
  ExtensionsIcon,
  LoansIcon
} from '../assets/svg';


const Landing = () => {
  const [email, setEmail] = useState("");

  const handleLaunchApp = () => {
    console.log("launch app");
  };

  const handleSubmit = () => {
    console.log("submit");
  };

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
      image: "/img/AboutProjects/img1.png",
    },
    {
      id: 2,
      title: "Trade",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/img2.png",
    },
    {
      id: 3,
      title: "Staking",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/img3.png",
    },
    {
      id: 4,
      title: "loans",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/img4.png",
    },
    {
      id: 4,
      title: "extensions",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/img5.png",
    },
    {
      id: 4,
      title: "referals",
      description:
        "Lorem ipsum dolor sit amet consectetur. Orci lobortis ut tempor pretium proin congue. Sit etiam dolor in accumsan mauris nibh. Placerat nulla ullamcorper tempus turpis tempus libero tellus. Orci facilisis quisque mollis enim felis. Eget lorem dolor sed.",
      image: "/img/AboutProjects/img6.png",
    },
  ];
  

  const becomeMemberData = [
    {
      id: 1,
      description:
        "Creating an account is easy. To get started, simply click on the 'Create Account' button and follow the instruction. We take your privacy and security seriously, so rest assured that your information will be kept safe and confidential.",
      description2:
        " Registering for an account allows you to streamline the checkout process and make future purchases faster and easier.",
      button: "create account",
      image: "/img/BecomeMember/img.png",
    },
  ];

  const dashboardData = [
    {
      id: 1,
      description:
        "Lorem ipsum dolor sit amet consectetur. Dignissim fames tortor scelerisque amet et elementum morbi velit felis. Augue mauris enim dui auctor ligula vestibulum. Tortor a at interdum a.",
      button: "Start Trading",
      bgImg: "/img/trendingPlatform/landing-background.png",
    },
  ];

  const projectsData = [
    {
      title: 'Trade',
      svg: <TradeIcon />
    },
    {
      title: 'Staking',
      svg: <StakingIcon />
    },
    {
      title: 'Dashboard',
      svg: <DashboardIcon />,
      active: true
    },
    {
      title: 'Extensions',
      svg: <ExtensionsIcon />
    },
    {
      title: 'Loans',
      svg: <LoansIcon />,
    },
  ];

  const footerData = [
    {
      svg: <Facebook />,
      onClick: () => console.log('facebook')
    },
    {
      svg: <Linkedin />,
      onClick: () => console.log('linkedin')
    },
    {
      svg: <Twitter />,
      onClick: () => console.log('twitter')
    },
    {
      svg: <Github />,
      onClick: () => console.log('github')
    }
  ];

  return (
    <>
      <Navbar handleLaunchApp={handleLaunchApp} />
      <Card
        type={"trading-platform"}
        data={dashboardData}
        handleSubmit={handleSubmit}
        projectsData={projectsData}
      />
      <Card
        type={"default"}
        data={defaultCardsData}
        customStyles={{ marginTop: "80px" }}
      />
      <Card type={"about"} data={aboutProjectsData} />
      <Card type={"become-member"} data={becomeMemberData} handleSubmit={handleSubmit} />
      <Footer data={footerData} email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
    </>
  );
};

export default Landing;
