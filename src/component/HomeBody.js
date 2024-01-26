import {
  Box,
  Button,
  Flex,
  Image,
  Img,
  SimpleGrid,
  Spinner,
  Tab,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Swiper } from "swiper/react";
import { SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";

import "./swiper.css";
import {
  Autoplay,
  EffectFade,
  Grid,
  Navigation,
  Pagination,
} from "swiper/modules";
import SwiperImg from "./SwiperImg";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recent } from "./RecentViewed";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function HomeBody() {
  const categoryStyle = {
    m: "auto",
    height: "150px",
    w: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const toast = useToast();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [mostReviewedProducts, setMostReviewedProducts] = useState([]);

  // 리뷰많은 상품 3개 불러오기
  useEffect(() => {
    axios
      .get("/api/product/most-reviewed")
      .then((response) => {
        setMostReviewedProducts(response.data);
      })
      .catch((error) => {
        console.error("에러메세지 :", error);
      });
  }, []);

  // 카테고리 불러오기
  useEffect(() => {
    axios
      .get("/api/product/mainCategory")
      .then((response) => {
        const uniqueCategories = response.data.reduce((acc, category) => {
          const existingCategory = acc.find(
            (c) => c.category_id === category.category_id,
          );
          if (!existingCategory) {
            acc.push(category);
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        toast({
          title: "카테고리 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      });
  }, []);

  const handleViewAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  // ------------------------------- 최근본상품 애니메이션 ----------------------------
  const [scrollPosition, setScrollPosition] = useState(0);

  // 메뉴가 고정될 기준 위치 (예를 들어 배너의 높이 + 상단 메뉴의 높이)
  const fixedTopPosition = 650;

  // 실제로 메뉴를 고정시킬 위치
  const stickyTopPosition = 100;

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuStyle = {
    position: "fixed",
    top:
      scrollPosition > fixedTopPosition
        ? `${stickyTopPosition}px`
        : `${fixedTopPosition - scrollPosition}px`,
    right: "2px",
    zIndex: 10,
    padding: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "lg",
    maxWidth: "sm",
    overflow: "hidden",
    borderRadius: "15px",
    transition: "top 0.3s ease-in-out",
  };

  return (
    <Box minW={"1400px"}>
      {/* ------------------------ 상단 배너 슬라이드 ------------------------ */}
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box borderRadius={"20px"} background={"white"} w={"90%"} h={"100%"}>
          <SwiperImg />
        </Box>

        {/* -------- 최근본상품 -------- */}
        <Box style={menuStyle}>
          <Recent />
        </Box>
      </Box>

      {/* ------------------------ 중간 이미지 및 게시글 ------------------------ */}
      <Box justifyContent="center" display="flex">
        <Box justifyContent="center" display="flex" minW={"1300px"} mt={"40px"}>
          {/* 큰 상품 박스 */}
          <Swiper
            modules={[EffectFade, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 9000 }}
            effect="fade"
            style={{ width: "600px" }}
          >
            {mostReviewedProducts.map((product) => (
              <SwiperSlide key={product.product_id}>
                <Box
                  mr={2}
                  mt={"40px"}
                  border="1px solid black"
                  w="600px"
                  h="600px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  position={"relative"}
                >
                  {product.productImgs && product.productImgs.length > 0 && (
                    <Box
                      position="absolute"
                      top={"0"}
                      left={"0"}
                      h={"350px"} // 높이를 고정값으로 설정
                      w={"590px"} // 너비를 고정값으로 설정
                      border={"1px solid red"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      overflow="hidden"
                    >
                      <Image
                        src={product.productImgs[0].main_img_uri}
                        alt="Product Image"
                        objectFit="contain"
                        w={"100%"}
                        h={"100%"}
                      />
                    </Box>
                  )}

                  <Text
                    mt="200px"
                    mb="20px"
                    border={"1px solid red"}
                    w={"100%"}
                  >
                    [{product.company_name}]
                    <br />
                    {product.product_name}
                  </Text>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* 작은 상품 박스들 */}
          <Box mt={"40px"} display="flex" flexDirection="column" gap="24px">
            <Flex gap={4}>
              <Box border="1px solid black" w="350px" h="300px">
                2
              </Box>
              <Box border="1px solid black" w="350px" h="300px">
                3
              </Box>
            </Flex>
            <Box border="1px solid black" w="716px" h="275px">
              4
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ------------------------- 중간2 카테고리 표시 ------------------------- */}
      <Box display="flex" justifyContent="center" alignItems="center" p={10}>
        <Box w={"70%"}>
          <Text fontWeight={"bold"} fontSize="2xl" textAlign="center" mt={5}>
            Categories
          </Text>
          <Text textAlign="center" color="gray.500" mb={5}>
            Please select your preferred category.
          </Text>

          <SimpleGrid columns={"4"} gap={10} p={5} mt={10}>
            {categories.map((category, index) => {
              // 9번째 카테고리 숨김 처리
              if (index === 8 && !showAllCategories) return null;
              let imageUrl;
              switch (category.category_id) {
                case 1:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/154/31347470_3.jpg"; // 노트북
                  break;
                case 2:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/157/979307_3_600.jpg"; // 모니터
                  break;
                case 3:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/166/707105_600.jpg"; // pc/헤드셋
                  break;
                case 4:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/173/980228_2_600.jpg"; // 태블릿
                  break;
                case 5:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/177/1084277_600.jpg"; // Apple
                  break;
                case 6:
                  imageUrl =
                    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/183/710668_2_600.jpg"; // 키보드
                  break;
                case 7:
                  imageUrl =
                    "https://image3.compuzone.co.kr/img/product_img/2023/0512/1026628/1026628_600.jpg"; // 마우스
                  break;
                case 8:
                  imageUrl =
                    "https://image3.compuzone.co.kr/img/product_img/2019/0410/562726/562726_600.jpg"; // 마우스패드
                  break;
                case 9:
                  imageUrl =
                    "https://image3.compuzone.co.kr/img/product_img/2018/0207/447472/447472_600.jpg"; // 외장하드
                  break;
              }

              return (
                <Box
                  _hover={{
                    cursor: "pointer",
                  }}
                  {...categoryStyle}
                  key={category.category_id}
                  onClick={() => navigate(`/category/${category.category_id}`)}
                >
                  <Img h={"100%"} src={imageUrl} alt={category.category_name} />
                  <Text>{category.category_name}</Text>
                </Box>
              );
            })}
          </SimpleGrid>
          <Box
            mb={10}
            mt={10}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              onClick={handleViewAllCategories}
              borderRadius={"20px"}
              bg={"none"}
              border={"1px solid black"}
              _hover={{
                bg: "none",
                color: "gray",
              }}
            >
              {showAllCategories ? "Hide Categories" : "View All Category"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ------------------------- 하단 배너 등 아직 결정안함  ------------------------- */}

      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box
          w={"90%"}
          h={"400px"}
          border={"1px solid black"}
          borderRadius={"20px"}
        >
          배너
        </Box>
      </Box>
    </Box>
  );
}
