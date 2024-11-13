import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Img } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

function SwiperImg(props) {
  const swiperStyles = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
  };

  return (
    <Box mt={5} w="100%" h="100%" position="relative">
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
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main1.jpeg"
            alt="Slide Image"
            style={swiperStyles}
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main2.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main3.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main4.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main5.jpeg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/main/main6.jpeg"
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}

export default SwiperImg;
