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
            src="https://admin.youngjaecomputer.com/data/design2/main_c2_img1"
            alt="Slide Image"
            style={swiperStyles}
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://admin.youngjaecomputer.com/data/design2/main_c_img9"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://admin.youngjaecomputer.com/data/design2/main_c_img11"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://admin.youngjaecomputer.com/data/design2/main_c_img15"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://admin.youngjaecomputer.com/data/design2/main_c_img10"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Img
            style={swiperStyles}
            src="https://admin.youngjaecomputer.com/data/design2/main_c_img5"
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}

export default SwiperImg;
