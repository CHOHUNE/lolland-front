import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";

import "./swiper.css";
import { Autoplay, EffectFade } from "swiper/modules";
import SwiperImg from "./SwiperImg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recent } from "./RecentViewed";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);

    navigate("?" + params);
  }

  return (
    <Box mx="35%">
      <InputGroup>
        <InputLeftElement w="25%">
          <Select
            border="1px solid black"
            borderRadius={0}
            defaultValue="all"
            _focus={{ border: "1px solid black", shadow: "none" }}
            _hover={{ border: "1px solid black" }}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="product_name">상품명</option>
            <option value="company_name">회사명</option>
          </Select>
        </InputLeftElement>
        <Input
          borderRadius={0}
          textIndent="25%"
          placeholder="검색어를 입력해주세요"
          border="1px solid black"
          _focus={{ border: "1px solid black", shadow: "none" }}
          _hover={{ border: "1px solid black" }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputRightElement bgColor="black" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

export function HomeBody() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  const [productList, setProductList] = useState([]); // 상품 목록 상태

  const [showAllCategories, setShowAllCategories] = useState(false); // 카테고리 상태
  const [mostReviewedProducts, setMostReviewedProducts] = useState([]); // 리뷰많은 3개 상품 상태
  const [boardList, setBoardList] = useState(null); // 게임장비커뮤니티 베스트게시물 상태
  const [top, setTop] = useState(null); // 게임커뮤니티 베스트게시물 상태
  const [naver, setNaver] = useState(null); // 뉴스기사 상태
  const [categoryProducts, setCategoryProducts] = useState({}); // 카테고리별 상품 상태

  // -------------------------------- 리뷰많은 상품 3개 불러오기 --------------------------------
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

  // -------------------------------- 게임장비, 게임 커뮤니티 베스트게시물 가져오기 --------------------------------
  useEffect(() => {
    const fetchGameGearAndCommunity = async () => {
      try {
        const [gearResponse, communityResponse] = await Promise.all([
          axios.get("/api/gearboard/today"),
          axios.get("/api/gameboard/list/top"),
        ]);
        setBoardList(gearResponse.data);
        setTop(communityResponse.data);
      } catch (error) {
        toast({
          title: "데이터 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      }
    };
    fetchGameGearAndCommunity();
  }, []);

  // -------------------------------- 커뮤니티 뉴스API 가져오기 --------------------------------
  useEffect(() => {
    axios.get("/api/gameboard/pc").then((response) => {
      setNaver(response.data);
    });
  }, []);

  // -------------------------------- 카테고리 & 카테고리별 상품 불러오기 --------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function fetchInitialData() {
      try {
        // 카테고리 데이터 가져오기
        const categoryResponse = await axios.get("/api/product/mainCategory");
        if (!isCancelled) {
          setCategories(categoryResponse.data);

          // 각 카테고리별 상품 데이터 가져오기
          const categoryRequests = categoryResponse.data.map((category) =>
            axios.get(`/api/product/list?c=${category.category_id}&limit=8`),
          );
          const productResponses = await axios.all(categoryRequests);
          if (!isCancelled) {
            const newCategoryProducts = productResponses.reduce(
              (acc, response, index) => {
                const categoryId = categoryResponse.data[index].category_id;
                acc[categoryId] = response.data.product;
                return acc;
              },
              {},
            );
            setCategoryProducts(newCategoryProducts);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          toast({
            title: "데이터 불러오는 도중 에러 발생",
            description: error.response.data,
            status: "error",
          });
        }
      }
    }
    fetchInitialData();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleViewAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  // -------------------------------- 최근본상품 로컬스토리지 & 애니메이션 --------------------------------
  const [scrollPosition, setScrollPosition] = useState(0);
  const fixedTopPosition = 700;
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

  // -------------------------------- 글자수가 특정개수 이상일때 자르기 --------------------------------
  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  // -------------------------------- 가격 ex) 1,000 ,로 구분지어 보여지게 처리 --------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // -------------------------------- 버튼 디자인 --------------------------------
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  // -------------------------------- 중간2 카테고리 버튼 디자인 --------------------------------
  const categoryStyle = {
    m: "auto",
    height: "150px",
    w: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  // -------------------------------- null 오류 방지 --------------------------------
  if (boardList === null) {
    return <Spinner />;
  } else if (naver === null) {
    return <Spinner />;
  } else if (top === null) {
    return <Spinner />;
  } else if (productList === null) {
    return <Spinner />;
  }

  // -------------------------------- 상품목록 이미지 매핑 --------------------------------
  // TODO : DB에 작업저장해서 사용해도 상관없음
  const categoryImages = {
    1: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176425.jpg",
    2: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174694.jpg",
    3: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174769.jpg",
    4: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174698.jpg",
    5: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_171282.jpg",
    6: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176479.jpg",
    7: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176493.jpg",
    8: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174682.jpg",
    9: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174682.jpg",
  };
  // -------------------------------- 상품목록 텍스트 매핑 --------------------------------
  const categoryDescriptions = {
    1: ["게임은 역시 장비빨", "고성능 노트북으로 승부하라!"],
    2: ["구매왕 챌린지!", "화질의 한계를 넘어서세요."],
    3: ["최상의 게임 경험을 위한 필수품", "몰입감을 높여줄 최적의 선택."],
    4: ["휴대성과 성능의 완벽한 조화", "언제 어디서나 당신의 일터."],
    5: ["비즈니스를 위한", "막강한 파워"],
    6: ["타이핑이 즐거워지는 느낌", "손끝에서 시작되는 기적."],
    7: ["빠르고 정밀한 마우스플레이", "정확한 클릭, 빠른 반응."],
    8: ["부드러운 슬립감", "안정성과 정확성의 기반."],
    9: ["레노버 서버 사은품행사", "강력한 성능, 놀라운 혜택."],
  };

  return (
    <Box minW={"1400px"}>
      {/* ------------------------ 상단 배너 슬라이드 ------------------------ */}
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box borderRadius={"20px"} background={"white"} w={"90%"} h={"100%"}>
          <SwiperImg />
        </Box>

        {/* ------------------------ 최근본상품 ------------------------ */}
        <Box style={menuStyle}>
          <Recent />
        </Box>
      </Box>

      {/* ------------------------ 중간 이미지 및 게시글 ------------------------ */}
      <Box justifyContent="center" display="flex">
        <Box
          justifyContent="center"
          display="flex"
          minW={"1400px"}
          mt={"40px"}
          mb={10}
        >
          {/* 큰 상품 박스 */}
          <Swiper
            modules={[EffectFade, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            effect="fade"
            style={{ width: "600px" }}
          >
            {mostReviewedProducts.map((product) => (
              <SwiperSlide key={product.product_id}>
                {product.productImgs && product.productImgs.length > 0 && (
                  <Box
                    mr={2}
                    mt={"40px"}
                    border="1px solid #E5E5E5"
                    w="600px"
                    h="600px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position={"relative"}
                  >
                    <Box
                      position="absolute"
                      top="10px"
                      left="10px"
                      bg="white"
                      p={2}
                      borderRadius="4px"
                      boxShadow="sm"
                    >
                      <Text fontSize={"1.7rem"} fontWeight={"bold"}>
                        실시간 뜨고있는 상품
                      </Text>
                    </Box>

                    <Box
                      position="absolute"
                      top="50px"
                      w="350px"
                      h="350px"
                      p={5}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image
                        position="absolute"
                        src={product.productImgs[0].main_img_uri}
                        alt="Product Image"
                        width="100%"
                        height="100%"
                      />
                    </Box>

                    <Flex
                      justifyContent={"flex-start"}
                      alignItems="flex-start"
                      direction="column"
                      p={10}
                      mt="390px"
                      mb="20px"
                      w={"100%"}
                    >
                      <Text>[{product.company_name}]</Text>
                      <Text mt={2} fontSize={"1.2rem"}>
                        {product.product_name}
                      </Text>
                      <Text mt={5} style={{ color: "gray" }}>
                        {truncateText(product.product_content, 40)}
                      </Text>
                      <Flex mt={3} w={"100%"} justifyContent={"space-between"}>
                        <Text mt={3} fontWeight={"bold"} fontSize={"1.4rem"}>
                          {formatPrice(product.product_price)}원
                        </Text>
                        <Flex justifyContent="flex-end" alignItems="flex-end">
                          <Button
                            {...buttonStyle}
                            mt={2}
                            borderRadius={"20px"}
                            onClick={() =>
                              navigate("/product/" + product.product_id)
                            }
                          >
                            상품 보러 가기
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/*  작은 상품 박스들  */}
          <Box mt={"40px"} display="flex" flexDirection="column" gap="24px">
            <Flex gap={4}>
              {/* ------------------------ 게임장비커뮤니티 베스트게시글 ------------------------ */}
              <Box p={2} border="1px solid #E5E5E5" w="350px" h="300px">
                <Text color={"gray"}>게임장비커뮤니티</Text>
                <Flex w={"100%"} justifyContent={"space-between"}>
                  <Text fontSize={"1.5rem"} fontWeight={"bold"}>
                    추천 게시물
                  </Text>
                  <Button
                    bg={"none"}
                    fontSize={"12px"}
                    color={"gray"}
                    _hover={{ background: "none", color: "black" }}
                    onClick={() => navigate("/gearlistlayout")}
                  >
                    더보기
                  </Button>
                </Flex>
                <Stack divider={<StackDivider />} spacing="3">
                  {boardList.slice(0, 3).map((item) => (
                    <Flex
                      key={item.gear_id}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Box mt={3}>
                        <Heading
                          _hover={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate("/gearlist/gear_id/" + item.gear_id)
                          }
                          size="xs"
                          textTransform="uppercase"
                        >
                          {item.gear_title}
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          {truncateText(item.gear_content, 30)}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>

              {/* ------------------------ 게임커뮤니티 베스트게시물 ------------------------ */}
              <Box p={2} border="1px solid #E5E5E5" w="350px" h="300px">
                <Text color={"gray"}>게임커뮤니티</Text>
                <Flex w={"100%"} justifyContent={"space-between"}>
                  <Text fontSize={"1.5rem"} fontWeight={"bold"}>
                    Best 게시물
                  </Text>
                  <Button
                    bg={"none"}
                    fontSize={"12px"}
                    color={"gray"}
                    _hover={{ background: "none", color: "black" }}
                    onClick={() => navigate("/gameboard/list?s=")}
                  >
                    더보기
                  </Button>
                </Flex>
                <Stack divider={<StackDivider />} spacing="3">
                  {top.slice(0, 3).map((item) => (
                    <Flex
                      key={item.id}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Box mt={3}>
                        <Heading
                          _hover={{ cursor: "pointer" }}
                          onClick={() => navigate("/gameboard/id/" + item.id)}
                          size="xs"
                          textTransform="uppercase"
                        >
                          {item.title}
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          {truncateText(item.board_content, 30)}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Flex>

            {/* ------------------------ 최신뉴스기사 게시글 ------------------------ */}
            <Box p={2} border="1px solid #E5E5E5" w="716px" h="275px">
              <Text color={"gray"}>리그오브레전드 관련</Text>
              <Flex w={"100%"} justifyContent={"space-between"}>
                <Text fontSize={"1.5rem"} fontWeight={"bold"}>
                  최신 뉴스 기사
                </Text>
                <Button
                  bg={"none"}
                  fontSize={"12px"}
                  color={"gray"}
                  _hover={{ background: "none", color: "black" }}
                  onClick={() => navigate("/gameboard/list?s=")}
                >
                  더보기
                </Button>
              </Flex>
              <Stack mt={3} divider={<StackDivider />} spacing="4">
                {naver &&
                  naver.items !== null &&
                  naver.items.slice(0, 4).map((news) => (
                    <Box mt={1} key={news.link}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => window.open(news.link, "_blank")}
                      >
                        {news.title
                          .replace(/&quot;/g, "") // &quot; 제거
                          .replace(/<b>/g, "") // <b> 제거
                          .replace(/<\/b>/g, "")}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ------------------------ 중간2 카테고리 이미지로 표시 ------------------------ */}
      <Box
        borderTop={"1px solid #eeeeee"}
        mt={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={10}
      >
        <Box minW={"1400px"}>
          <Text fontWeight={"bold"} fontSize="2.3rem" textAlign="center" mt={5}>
            Categories
          </Text>
          <Text textAlign="center" color="gray.500" mb={5}>
            Please select your preferred category.
          </Text>

          <SimpleGrid columns={"4"} gap={10} p={5} mt={10}>
            {categories.map((category, index) => {
              // 9번째 카테고리 숨김 처리
              // 버튼 누르면 보임
              if (index === 8 && !showAllCategories) return null;
              let imageUrl;
              switch (category.category_id) {
                case 1:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/154/31347470_3.jpg"; // 노트북
                  break;
                case 2:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/157/979307_3_600.jpg"; // 모니터
                  break;
                case 3:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/166/707105_600.jpg"; // pc/헤드셋
                  break;
                case 4:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/173/980228_2_600.jpg"; // 태블릿
                  break;
                case 5:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/177/1084277_600.jpg"; // Apple
                  break;
                case 6:
                  imageUrl =
                    "https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/183/710668_2_600.jpg"; // 키보드
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
                  css={{
                    transition: "transform 0.3s ease-in-out", // 변환 애니메이션 적용
                    "&:hover": {
                      transform: "scale(1.1)", // 확대 효과
                    },
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

      {/* ------------------------- TODO : 임시로 카테고리별 상품목록 및 텍스트/이미지 출력완료 ------------------------- */}
      <Box
        borderTop={"1px solid #eeeeee"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box mt={10} mx="10%">
          {categories.map((category) => (
            <Box mt={10} key={category.category_id} mb="40px">
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="20px"
              >
                <Heading size="xl">{category.category_name}</Heading>
                <Button
                  mb={-10}
                  onClick={() => navigate(`/category/${category.category_id}`)}
                  bg={"none"}
                  fontSize={"12px"}
                  color={"gray"}
                  _hover={{ background: "none", color: "black" }}
                >
                  더보기
                </Button>
              </Flex>
              <Flex minW={"1400px"} gap={2}>
                <VStack spacing={0}>
                  <Box
                    borderRadius={"10px"}
                    w="385px"
                    h="562px"
                    m={0}
                    overflow="hidden"
                  >
                    <Image
                      src={categoryImages[category.category_id]}
                      objectFit="contain"
                      display="block"
                    />
                  </Box>
                  <Box
                    borderBottomRadius={"10px"}
                    w={"385px"}
                    h={"200px"}
                    bg={"gray"}
                    mt={-2}
                  >
                    <Text
                      lineHeight={"100px"}
                      textAlign={"center"}
                      fontSize="1.8rem"
                      color={"white"}
                      fontWeight="bold"
                    >
                      {categoryDescriptions[category.category_id][0]}
                    </Text>
                    <Text color={"white"} textAlign={"center"} fontSize="md">
                      {categoryDescriptions[category.category_id][1]}
                    </Text>
                  </Box>
                </VStack>

                <SimpleGrid
                  borderWidth={"1px"}
                  borderRadius={"lg"}
                  columns={4}
                  spacing={9}
                >
                  {categoryProducts[category.category_id]
                    ?.slice(0, 8)
                    .map((product) => (
                      <Box
                        key={product.product_id}
                        borderRadius="lg"
                        overflow="hidden"
                        h={"100%"}
                        w={"250px"}
                        display="flex"
                        flexDirection="column"
                        _hover={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/product/${product.product_id}`)
                        }
                        css={{
                          transition: "transform 0.3s ease-in-out", // 변환 애니메이션 적용
                          "&:hover": {
                            transform: "scale(1.1)", // 확대 효과
                          },
                        }}
                      >
                        <Flex
                          h={"246px"}
                          w={"250px"}
                          align="center"
                          justify="center"
                        >
                          <Image
                            src={
                              product.mainImgs[0]?.main_img_uri ||
                              "default-product-image.jpg"
                            }
                            alt={product.product_name}
                            maxH="200px"
                            objectFit="contain"
                          />
                        </Flex>
                        <Box p="6">
                          <Box display="flex" alignItems="baseline">
                            <Box
                              color="gray.500"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                            >
                              [{product.company_name}]
                            </Box>
                          </Box>

                          <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                          >
                            {product.product_name}
                          </Box>

                          <Box>
                            {product.product_price.toLocaleString("ko-KR")}원
                            <Box as="span" color="gray.600" fontSize="sm"></Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </SimpleGrid>
              </Flex>
            </Box>
          ))}
        </Box>
      </Box>
      <SearchComponent />
    </Box>
  );
}
