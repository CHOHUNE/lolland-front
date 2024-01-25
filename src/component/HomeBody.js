import {
  Box,
  Button,
  Flex,
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
import { Autoplay, Grid } from "swiper/modules";
import SwiperImg from "./SwiperImg";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recent } from "./RecentViewed";
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

  return (
    <Box minW={"1400px"}>
      {/* ------------------------ 상단 배너 슬라이드 ------------------------ */}
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box borderRadius={"20px"} background={"white"} w={"90%"} h={"100%"}>
          <SwiperImg />
        </Box>
        <Box
          position="fixed" // 절대 위치를 사용해 오버레이 설정
          top="300" // 배너의 상단에서 시작
          right="2" // 배너의 우측에서 시작
          zIndex="10" // 다른 요소보다 위에 오도록 z-index 설정
          p="4" // 패딩 값
          bg="rgba(255, 255, 255, 0.1)" // 배경색
          boxShadow="lg" // 그림자 효과
          maxW="sm" // 최대 너비 설정
          overflow="hidden" // 내용이 넘치면 숨김
          borderRadius="15px"
        >
          <Recent />
        </Box>
      </Box>

      {/* ------------------------ 중간 이미지 및 게시글 ------------------------ */}
      <Box justifyContent="center" display="flex">
        <Box justifyContent="center" display="flex" w={"70%"} gap="24px">
          {/* 큰 상품 박스 */}
          <Box mt={"40px"} border="1px solid black" w="400px" h="500px">
            1
          </Box>
          {/* 작은 상품 박스들 */}
          <Box mt={"40px"} display="flex" flexDirection="column" gap="24px">
            <Flex gap={4}>
              <Box border="1px solid black" w="300px" h="200px">
                2
              </Box>
              <Box border="1px solid black" w="300px" h="200px">
                3
              </Box>
            </Flex>
            <Box border="1px solid black" w="617px" h="275px">
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
