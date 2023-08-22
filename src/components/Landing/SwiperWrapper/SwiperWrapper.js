import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const SwiperWrapper = ({ children, ...props }) => {
  const [index, setIndex] = useState(0);

  return (
    <Swiper
      loop={false}
      index={index}
      onIndexChanged={setIndex}
      {...props}
      spaceBetween={30}
      slidesPerView={1}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperWrapper;
