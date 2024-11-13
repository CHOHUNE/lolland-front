import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Img } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

function SwiperMainList(props) {
  const swiperStyles = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
  };

  return (
    <Box w="100%" h="100%" position="relative">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/event/%E1%84%8B%E1%85%B5%E1%84%87%E1%85%A6%E1%86%AB%E1%84%90%E1%85%B31.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/event/%E1%84%8B%E1%85%B5%E1%84%87%E1%85%A6%E1%86%AB%E1%84%90%E1%85%B32.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/event/%E1%84%8B%E1%85%B5%E1%84%87%E1%85%A6%E1%86%AB%E1%84%90%E1%85%B33.jpeg"
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}

export default SwiperMainList;
