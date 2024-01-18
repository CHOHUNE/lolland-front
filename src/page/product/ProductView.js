import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  FormLabel,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"; // 꽉 찬 아이콘
import {
  faCartShopping,
  faHeart as fasHeart,
  faSpinner,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons"; // 꽉 찬 아이콘
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"; // 빈 아이콘
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { ReviewView } from "../review/ReviewView";
import { LoginContext } from "../../component/LoginProvider";

export function ProductView() {
  const [product, setProduct] = useState(null);
  const [option, setOption] = useState([]);
  const [seletedOption, setSeletedOption] = useState("");
  const [seletedOptionList, setSeletedOptionList] = useState({});

  const { isAuthenticated } = useContext(LoginContext);

  const { product_id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false); // 찜하기

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ---------------------------- 상품 렌더링 ----------------------------
  useEffect(() => {
    axios
      .get("/api/product/product_id/" + product_id)
      .then((response) => setProduct(response.data));
  }, []);

  // ---------------------------- 상품 상세옵션 렌더링 ----------------------------
  useEffect(() => {
    axios
      .get("/api/product/option/" + product_id)
      .then((response) => setOption(response.data));
  }, [product_id]);

  // ---------------------------- 찜한 내역 가져오는 렌더링 ----------------------------
  useEffect(() => {
    if (isAuthenticated()) {
      axios.get("/api/productLike/" + product_id).then((response) => {
        setIsFavorited(response.data.productLike);
      });
    }
  }, [product_id]);

  // ---------------------------- 로딩로직 ----------------------------
  const FullPageSpinner = () => {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(0,0,0,0.3)"
        zIndex="9999"
      >
        <Spinner size="xl" color="white" />
      </Flex>
    );
  };

  if (product === null) {
    return <FullPageSpinner />;
  }

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // ------------------------------ 썸네일 클릭 시 메인 이미지 변경 ------------------------------
  const changeMainImage = (index) => {
    setSelectedImageIndex(index);
  };

  // ------------------------------ 상세 옵션 관련 로직 ------------------------------
  const handleOptionChange = (optionId) => {
    // 선택된 옵션의 정보를 가져옵니다.
    const selectedOptionInfo = option.find((opt) => opt.option_id === optionId);

    if (selectedOptionInfo) {
      // 선택된 옵션을 상태에 추가합니다.
      setSeletedOptionList((prev) => ({
        ...prev,
        [selectedOptionInfo.option_id]: {
          ...selectedOptionInfo,
          quantity: prev[selectedOptionInfo.option_id]?.quantity || 1,
        },
      }));
      // 선택된 옵션 ID를 상태에 설정합니다.
      setSeletedOption(selectedOptionInfo.option_id.toString());
    }
  };

  // ------------------------------ 목록에있는 상품 삭제 로직 ------------------------------
  const handleRemoveDetail = (key) => {
    setSeletedOptionList((prevDetails) => {
      const { [key]: _, ...rest } = prevDetails;
      return rest;
    });
  };

  // ------------------------------ 수량 증가 로직 ------------------------------
  const increaseQuantity = (key) => {
    setSeletedOptionList((prevDetails) => {
      const currentQuantity = prevDetails[key].quantity;
      const maxQuantity = prevDetails[key].stock; // 'stock'이 재고 수량을 나타냄

      // 수량이 재고 수량 이하인 경우에만 증가
      if (currentQuantity < maxQuantity) {
        return {
          ...prevDetails,
          [key]: {
            ...prevDetails[key],
            quantity: currentQuantity + 1,
          },
        };
      } else {
        // 재고 수량을 초과하는 경우, 변경 없이 현재 상태를 반환
        toast({
          title: "재고 수량 초과",
          description: "더 이상 수량을 늘릴 수 없습니다.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return prevDetails;
      }
    });
  };

  // ------------------------------ 수량 감소 로직 ------------------------------
  const decreaseQuantity = (key) => {
    setSeletedOptionList((prevDetails) => {
      // 현재 항목의 수량 확인
      const currentQuantity = prevDetails[key].quantity;

      if (currentQuantity > 1) {
        // 수량이 1보다 크면 수량 감소
        return {
          ...prevDetails,
          [key]: {
            ...prevDetails[key],
            quantity: currentQuantity - 1,
          },
        };
      } else {
        // 수량이 1이면 해당 항목을 목록에서 제거
        const { [key]: _, ...rest } = prevDetails;
        return rest;
      }
    });
  };

  // ------------------------------ 수량에 따라 총 가격 계산 로직 ------------------------------
  const calculateTotalPrice = () => {
    // 옵션이 있지만, 모든 옵션이 빈 문자열("")인 경우 기본 상품 가격 반환
    if (option.every((opt) => opt.option_name === "")) {
      return formatPrice(product.product.product_price);
    }

    // 옵션이 있고, 아직 선택되지 않았다면 0원 반환
    if (option.length > 0 && Object.keys(seletedOptionList).length === 0) {
      return formatPrice(0);
    }

    // 옵션이 있고 선택된 옵션이 있다면, 옵션 가격을 계산
    if (option.length > 0 && Object.keys(seletedOptionList).length > 0) {
      return formatPrice(
        Object.values(seletedOptionList).reduce((sum, optionItem) => {
          // 옵션 가격이 정의되어 있고, option_name이 빈 문자열이 아닐 때만 가격을 더함
          if (optionItem.price && optionItem.option_name !== "") {
            return sum + optionItem.price * optionItem.quantity;
          }
          // 옵션 가격이 정의되어 있지 않은 경우 기본 상품 가격을 사용
          return sum + product.product.product_price * optionItem.quantity;
        }, 0),
      );
    }
  };

  // ------------------------------ 게시물 삭제 로직 ------------------------------
  function handleDelete() {
    axios
      .delete("/api/product/remove/" + product_id)
      .then((response) => {
        toast({
          description: product_id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/product/list/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  // ------------------------------ 장바구니로 정보 전달 로직 ------------------------------
  function handleBucketClick() {
    const optionsArray = Object.values(seletedOptionList);

    axios
      .post("/api/cart/add", {
        product_id: product_id,
        selectedOptionList: optionsArray,
      })
      .then(() => {
        toast({
          description: "장바구니로 이동되었습니다.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "이동중 오류가 발생하였습니다.",
          status: "error",
        });
      });
  }

  // ----------------------------------- 상품 상세이미지 관련 로직 -----------------------------------
  const renderProductDetailsImages = () => {
    return product?.productDetailsImgs?.map((detailImg) => {
      return (
        <Image
          key={detailImg.details_img_id}
          src={detailImg.sub_img_uri}
          alt={`Product Detail Image ${detailImg.details_img_id}`}
          boxSize="100px"
          objectFit="cover"
        />
      );
    });
  };

  // ----------------------------------- 찜하기 -----------------------------------
  const handleFavoriteClick = () => {
    // 현재 하트 상태 토글
    const newFavoriteStatus = !isFavorited;
    // UI를 먼저 업데이트하고 서버 요청을 보냄
    setIsFavorited(newFavoriteStatus);
    // 서버에 좋아요 상태 전송
    if (isFavorited !== true) {
      axios
        .post("/api/productLike", {
          product_id: product_id,
          isFavorited: newFavoriteStatus,
        })
        .then(() => {
          toast({
            description: "상품 찜목록에 저장되었습니다.",
            status: "success",
          });
        })
        .catch((error) => {
          toast({
            description: "로그인 해주시기 바랍니다.",
            status: "error",
          });
          setIsFavorited(!newFavoriteStatus);
        });
    } else {
      axios
        .post("/api/productLike", {
          product_id: product_id,
          isFavorited: newFavoriteStatus,
        })
        .then(() => {
          toast({
            description: "상품 찜목록에서 삭제되었습니다.",
            status: "error",
          });
        })
        .catch((error) => {
          toast({
            description: "로그인 해주시기 바랍니다.",
            status: "error",
          });
          setIsFavorited(!newFavoriteStatus);
        });
    }
  };

  // ----------------------------------- 평점 별 표시 로직 -----------------------------------
  const renderStars = (rate) => {
    // 평점이 없거나 0인 경우 빈 별 5개로 출력
    if (rate == null || rate === 0) {
      return Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon icon={farStar} color="#EAEAE7" key={i} />
      ));
    }
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rate)) {
        // 꽉찬 별
        stars.push(<FontAwesomeIcon icon={faStar} color="#FFE000" key={i} />);
      } else if (i === Math.floor(rate) && !Number.isInteger(rate)) {
        // 반쪽 별
        stars.push(
          <FontAwesomeIcon icon={faStarHalfAlt} color="#FFE000" key={i} />,
        );
      } else {
        // 빈 별
        stars.push(<FontAwesomeIcon icon={farStar} color="#EAEAE7" key={i} />);
      }
    }
    return stars;
  };

  return (
    <Box mx={"15%"} p={5}>
      <Box>
        {/* ------------------------------ 상품 수정, 삭제 ------------------------------ */}
        <Button
          colorScheme="blue"
          onClick={() => navigate("/edit/" + product_id)}
        >
          수정
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          삭제
        </Button>
      </Box>

      {/* ---------------------- 카테고리 순서 ---------------------- */}
      <Box minW={"800px"}>
        <Box justify="center" align="start" maxW="100%" m="auto" mt={10} mb={7}>
          <Text ml={4} fontSize={"0.9rem"}>
            {product.category_name} > {product.subcategory_name}
          </Text>
        </Box>
        <Box justify="center" align="start" maxW="100%" m="auto">
          {/* ---------------------- 상품명 ---------------------- */}
          <Text ml={4} fontWeight={"bold"} fontSize={"1.7rem"}>
            [{product.company_name}] {product.product.product_name}
          </Text>

          {/* ---------------------- 상품설명 ---------------------- */}
          <Text ml={4} color={"gray"} fontSize={"0.9rem"}>
            {product.product.product_content}
          </Text>
        </Box>

        <Flex minW="1000px" maxW="1500px" mt={-5}>
          {/* 메인 이미지 */}
          <Box p={2}>
            {product &&
              product.productImgs &&
              product.productImgs.length > 0 && (
                <Box p={2}>
                  <Image
                    src={product.productImgs[selectedImageIndex].main_img_uri}
                    alt={`Product Image ${selectedImageIndex}`}
                    boxSize="700px"
                    objectFit="contain"
                  />
                </Box>
              )}

            {/* 썸네일 이미지 */}
            <HStack justifyContent={"center"} mt={-10}>
              {product &&
                product.productImgs &&
                product.productImgs.map((img, index) => (
                  <Box
                    key={img.main_img_id}
                    onClick={() => changeMainImage(index)}
                    onMouseEnter={() => changeMainImage(index)} // 마우스 호버 시 메인 이미지 변경
                  >
                    <Image
                      src={img.main_img_uri}
                      boxSize="100px"
                      objectFit="cover"
                    />
                  </Box>
                ))}
            </HStack>
          </Box>

          {/* 상품 정보 컨테이너 */}
          <VStack w="60%" ml={5} mt={24}>
            <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
              <Flex mb={3}>
                <FormLabel w={"100px"} fontWeight="bold">
                  판매가
                </FormLabel>
                <Box
                  fontWeight={"bold"}
                  fontSize={"1.5rem"}
                  mt={-2}
                  border={"none"}
                  flex={1}
                >
                  {formatPrice(product.product.product_price)}원
                </Box>
              </Flex>
            </HStack>

            <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
              <HStack mt={3} mb={3}>
                <FormLabel w={"100px"} fontWeight="bold">
                  제조사
                </FormLabel>
                <Text fontWeight={400} mt={-2} border={"none"} flex={1}>
                  {product.company_name}
                </Text>
              </HStack>
            </HStack>

            <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
              <HStack mt={3} mb={3}>
                <FormLabel w={"100px"} fontWeight="bold">
                  평점
                </FormLabel>
                <Text fontWeight={400} mt={-2} border={"none"} flex={1}>
                  {renderStars(product.product.average_rate)}{" "}
                  {product.product.average_rate !== null
                    ? product.product.average_rate
                    : "0"}
                </Text>
              </HStack>
            </HStack>

            <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
              <Flex alignItems={"center"} mt={3} mb={3}>
                <FormLabel w={"100px"} fontWeight="bold">
                  배송비
                </FormLabel>
                <Box w={"60px"} mt={-2}>
                  3,000원
                </Box>
              </Flex>
              <Flex alignItems="center" mt={-2} border={"none"} flex={1}>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      color={"gray"}
                      fontSize={"10px"}
                      bg={"none"}
                      border={"1px solid #eeeeee"}
                      h={"25px"}
                      w={"80px"}
                      p={0}
                    >
                      추가배송정보
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent w={"400px"}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight={"bold"}>
                      배송비 안내
                    </PopoverHeader>
                    <PopoverBody color={"gray"}>
                      도서산간 추가 배송비
                    </PopoverBody>
                    <PopoverBody color={"gray"}>
                      제주지역 5,000원, 도서산간지역 5,000원
                    </PopoverBody>
                    <PopoverFooter fontWeight={"bold"}>
                      도착예정일
                    </PopoverFooter>
                    <PopoverBody color={"gray"}>
                      판매자가 설정한 발송 예정일과 택배사의 배송 소요일을
                      기반으로 도착 예정일을 제공하고 있습니다.
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            </HStack>

            <Box w="100%" mt={5}>
              {
                // 상품 옵션 목록이 있고, 모든 옵션의 이름이 비어있지 않으면 메뉴를 표시합니다.
                // 그렇지 않은 경우(옵션이 없거나 이름이 비어있는 옵션이 있는 경우), 기본 상품명을 표시하는 목록을 렌더링합니다.
                option.length === 0 ||
                option.some((opt) => opt.option_name === "") ? (
                  // 옵션이 없거나 옵션 이름이 비어있는 경우
                  <Box mt={5} bg="#F9F9F9" border="1px solid #F9F9F9">
                    <Flex justify="space-between" p={4}>
                      <Text>{product.product.product_name}</Text>
                      {/* 수량 조절 버튼 및 수량 표시 */}
                      <HStack
                        spacing={0}
                        border="1px solid gray"
                        borderRadius="10px"
                        bg="white"
                        m={3}
                      >
                        {/* 이 부분은 상품 수량 조절 로직에 따라 조건부 렌더링되어야 합니다. */}
                      </HStack>
                    </Flex>
                  </Box>
                ) : (
                  // 옵션이 있고 모든 옵션의 이름이 비어있지 않은 경우
                  <Menu matchWidth>
                    <MenuButton as={Button} w="100%" h="50px">
                      {seletedOption
                        ? option.find(
                            (opt) => opt.option_id.toString() === seletedOption,
                          )?.option_name || "옵션을 선택하세요"
                        : "옵션을 선택하세요"}
                    </MenuButton>
                    <MenuList>
                      {option.map((opt, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => handleOptionChange(opt.option_id)}
                        >
                          <Flex justifyContent="space-between" w="100%">
                            <Text>{opt.option_name}</Text>
                            <Text>수량: {opt.stock}</Text>
                          </Flex>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                )
              }

              <Box>
                {Object.keys(seletedOptionList).length > 0 &&
                  Object.entries(seletedOptionList).map(
                    ([key, optionList], index) => (
                      <Box
                        mt={5}
                        bg="#F9F9F9"
                        border={"1px solid #F9F9F9"}
                        key={key}
                      >
                        <Box
                          border={"none"}
                          key={index}
                          p={4}
                          borderWidth="1px"
                          // mt={2}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Text>
                            {product.product.product_name}
                            <br />
                            {optionList.option_name}
                          </Text>

                          {/* ------------------- 목록상품 삭제 버튼 ------------------- */}
                          <Button
                            size={"sm"}
                            onClick={() => handleRemoveDetail(key)}
                            bg={"none"}
                            _hover={{ cursor: "background: none" }}
                            _active={{ bg: "none" }}
                          >
                            X
                          </Button>
                        </Box>
                        <HStack
                          style={{
                            display: "flex",
                            width: "80px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            margin: "3px",
                          }}
                        >
                          {/* ------------------- 수량 증가 버튼 ------------------- */}
                          <Button
                            size={"xs"}
                            style={{
                              width: "23px",
                              background: "none",
                              borderRight: "1px solid gray",
                              borderRadius: 0,
                              padding: 0,
                            }}
                            onClick={() => increaseQuantity(key)}
                            _hover={{ bg: "none" }}
                            _active={{ bg: "none" }}
                          >
                            <ChevronUpIcon />
                          </Button>

                          {/* ------------------- 수량 표시 ------------------- */}
                          <Box
                            style={{
                              flex: 1,
                              textAlign: "center",
                              fontSize: "13px",
                              width: "20px",
                            }}
                          >
                            {optionList.quantity}
                          </Box>

                          {/* ------------------- 수량 감소 버튼 ------------------- */}
                          <Button
                            size={"xs"}
                            style={{
                              width: "23px",
                              background: "none",
                              borderLeft: "1px solid gray",
                              borderRadius: 0,
                              padding: 0,
                            }}
                            onClick={() => decreaseQuantity(key)}
                            _hover={{ bg: "none" }}
                            _active={{ bg: "none" }}
                          >
                            <ChevronDownIcon />
                          </Button>
                        </HStack>
                      </Box>
                    ),
                  )}
                <Box mt={10} textAlign={"end"}>
                  <Box textAlign={"end"}>
                    <Text color={"gray"}>총 합계 금액</Text>
                    <Text
                      style={{
                        color: "red",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {calculateTotalPrice()}
                      <span style={{ fontSize: "18px" }}>원</span>
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Flex w={"100%"} mt={10}>
              {/* --------------- 찜하기 --------------- */}
              <Button
                h={"50px"}
                w={"20%"}
                bg={"none"}
                borderRadius={0}
                border={"1px solid #eeeeee"}
                onClick={handleFavoriteClick}
              >
                <FontAwesomeIcon icon={isFavorited ? fasHeart : farHeart} />
              </Button>

              {/* --------------- 장바구니 --------------- */}
              <Button
                h={"50px"}
                w={"30%"}
                borderRadius={0}
                bg={"none"}
                border={"1px solid #eeeeee"}
                onClick={handleBucketClick}
              >
                <FontAwesomeIcon icon={faCartShopping} />
              </Button>

              {/* --------------- 구매하기 --------------- */}
              <Button
                h={"50px"}
                w={"50%"}
                borderRadius={0}
                bg={"black"}
                color={"white"}
                border={"1px solid #eeeeee"}
                _hover={{ color: "black", background: "gray.300" }}
              >
                구매하기
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </Box>

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box>
        <Flex wrap="wrap" justify="center" gap={4}>
          {renderProductDetailsImages()}
        </Flex>
      </Box>

      {/* --------------- 상품 상세 설명, 리뷰 , Q&A --------------- */}
      <ReviewView
        product_id={product_id}
        product_content={product.product_content}
      />
    </Box>
  );
}
