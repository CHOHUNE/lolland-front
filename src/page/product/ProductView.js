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
import { selectOptions } from "@testing-library/user-event/dist/select-options"; // 빈 하트
import { ProductStats } from "../review/ProductStats";
import { LoginContext } from "../../component/LoginProvider"; // 빈 하트

export function ProductView() {
  const [product, setProduct] = useState(null);
  const [option, setOption] = useState([]);
  const [productDetailImg, setProductDetailImg] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionList, setSelectedOptionList] = useState([]);

  const { product_id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false); // 찜하기

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { isAuthenticated, isAdmin } = useContext(LoginContext);

  const totalOptionPrice = selectedOptionList.reduce((total, option) => {
    return (
      total + (option.price || product.product.product_price) * option.quantity
    );
  }, 0);

  // ------------------------------------ 최근 본 상품 ------------------------------------
  const saveTransToRecentViewed = (productData) => {
    const recent = JSON.parse(localStorage.getItem("recent")) || [];
    const mainImgUrl =
      productData.productImgs && productData.productImgs.length > 0
        ? productData.productImgs[0].main_img_uri
        : "기본이미지URL"; // 기본 이미지 URL 설정

    const productName = productData.product.product_name; // 상품명 추가

    // 현재 상품이 이미 recent 목록에 있는지 확인
    const isProductAlreadyInRecent = recent.some(
      (item) => item.mainImgUrl === mainImgUrl,
    );

    if (!isProductAlreadyInRecent) {
      const updatedRecentViewed = [
        { mainImgUrl, product_id: productData.product.product_id, productName },
        ...recent,
      ].slice(0, 5);
      localStorage.setItem("recent", JSON.stringify(updatedRecentViewed));
    }
  };

  // ---------------------------- 상품 렌더링 ---------------------------- @@
  useEffect(() => {
    axios.get("/api/product/product_id/" + product_id).then((response) => {
      setProduct(response.data);
      setProductDetailImg(
        response.data.productDetailsImgs.map((img) => img.sub_img_uri),
      );
      // --------------------- 최근 본 상품 ----------------------
      saveTransToRecentViewed(response.data);
    });
  }, []);

  // ---------------------------- 상품 상세옵션 렌더링 ----------------------------
  useEffect(() => {
    axios
      .get("/api/product/option/" + product_id)
      .then((response) => setOption(response.data));
  }, [product_id]);

  // ---------------------------- 찜한 내역 가져오는 렌더링 ----------------------------
  useEffect(() => {
    // 로그인 했을때만 불러오도록
    if (isAuthenticated()) {
      axios
        .get("/api/productLike/" + product_id)
        .then((response) => {
          setIsFavorited(response.data.productLike);
        })
        .catch((error) => {
          console.error("Error fetching product like status:", error);
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
    const selectedOptionInfo = option.find((opt) => opt.option_id === optionId);

    if (selectedOptionInfo) {
      setSelectedOptionList((prev) => [
        ...prev.filter((opt) => opt.option_id !== selectedOptionInfo.option_id),
        {
          ...selectedOptionInfo,
          quantity: 1,
        },
      ]);
      setSelectedOption(selectedOptionInfo.option_id.toString());
    }
  };

  // ------------------------------ 목록에있는 상품 삭제 로직 ------------------------------
  const handleRemoveDetail = (optionId) => {
    setSelectedOptionList((prevList) =>
      prevList.filter((item) => item.option_id !== optionId),
    );
  };

  // ------------------------------ 수량 증가 로직 ------------------------------
  const increaseQuantity = (optionId) => {
    setSelectedOptionList((prevList) => {
      return prevList.map((item) =>
        item.option_id === optionId
          ? {
              ...item,
              quantity:
                item.quantity < item.stock ? item.quantity + 1 : item.quantity,
            }
          : item,
      );
    });
  };

  // ------------------------------ 수량 감소 로직 ------------------------------
  const decreaseQuantity = (optionId) => {
    setSelectedOptionList((prevList) => {
      return prevList.map((item) =>
        item.option_id === optionId
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
            }
          : item,
      );
    });
  };

  // ------------------------------ 수량에 따라 총 가격 계산 로직 ------------------------------
  const calculateTotalPrice = () => {
    // 상세선택이 있고 선택된 상세선택이 있는 경우
    if (option.length > 0 && Object.keys(selectedOptionList).length > 0) {
      return formatPrice(
        Object.values(selectedOptionList).reduce((sum, optionItem) => {
          // 옵션 가격이 있으면 사용, 없으면 기본 상품 가격 사용
          const pricePerItem =
            optionItem.price || product.product.product_price;
          // 해당 옵션의 총 가격 = 가격 * 수량
          return sum + pricePerItem * optionItem.quantity;
        }, 0),
      );
    }
    // 상세선택이 없는 경우 기본 상품 가격 반환
    return formatPrice(option.length > 0 ? 0 : product.product.product_price);
  };

  // ------------------------------ 게시물 삭제(숨김) 로직 ------------------------------
  function handleDelete() {
    axios
      .put("/api/product/remove/" + product_id)
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
    // 상세 옵션이 선택되지 않았을 경우 경고 메시지를 표시하고 함수 실행 중지
    if (!selectedOptionList.length) {
      toast({
        description: "상세 옵션을 선택해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // 상세 옵션이 선택되었을 경우 서버로 데이터 전송
    axios
      .post("/api/cart/add", {
        product_id: product_id,
        selectedOptionList: Object.values(selectedOptionList),
      })
      .then(() => {
        toast({
          description: "장바구니로 이동되었습니다.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "장바구니로 이동 중 오류가 발생하였습니다.",
          status: "error",
        });
      });
  }

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
          selectedOptions: selectedOptionList,
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

  // ------------------------------ 구매하기 이동 로직 ------------------------------
  // ------------------------------ 로컬스토리지 이용 ------------------------------
  function handlePaymentClick() {
    localStorage.removeItem("purchaseInfo");

    // 상세 옵션 선택 안하면 선택하라고 토스트 표시
    if (selectedOptionList.length === 0) {
      toast({
        title: "옵션 선택 필요",
        description: "상세 옵션을 선택해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return; // 함수 실행을 여기서 중지
    }

    const mainImgUrl =
      product.productImgs && product.productImgs.length > 0
        ? product.productImgs[0].main_img_uri
        : ""; // 메인 이미지 URL

    const selectedProductInfo = selectedOptionList.map((selectedOption) => {
      return {
        productId: product_id,
        productName: product.product.product_name,
        mainImgUrl: mainImgUrl,
        options: [
          {
            optionId: selectedOption.option_id,
            optionName: selectedOption.option_name,
            quantity: selectedOption.quantity,
            price: product.product.product_price,
          },
        ],
      };
    });

    const groupedPurchaseInfo = selectedProductInfo.reduce(
      (result, purchase) => {
        const existingEntry = result.find(
          (group) => group.productId === purchase.productId,
        );

        if (existingEntry) {
          existingEntry.options.push(...purchase.options);
        } else {
          result.push(purchase);
        }

        return result;
      },
      [],
    );

    try {
      localStorage.setItem("purchaseInfo", JSON.stringify(groupedPurchaseInfo));
      navigate("/pay/");
    } catch (error) {
      console.error("Error saving to localStorage", error);
      toast({
        description: "저장 중 오류가 발생했습니다.",
        status: "error",
      });
    }
  }

  return (
    <Box mx={"15%"} p={5}>
      {/* ---------------------- 카테고리 순서 ---------------------- */}
      <Box minW={"800px"}>
        <Flex mt={10} display={"flex"} justifyContent={"space-between"}>
          <Box>
            <Text ml={4} fontSize={"0.9rem"}>
              {product.category_name} > {product.subcategory_name}
            </Text>
          </Box>
          {/* ------------------------------ 상품 수정, 삭제 ------------------------------ */}
          {isAdmin() && (
            <Box justifyContent={"end"} display={"flex"}>
              <Button
                background={"black"}
                color={"white"}
                onClick={() => navigate("/edit/" + product_id)}
              >
                수정
              </Button>
              <Button colorScheme="red" onClick={onOpen}>
                삭제
              </Button>
            </Box>
          )}
        </Flex>
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
                <FormLabel
                  w={"100px"}
                  fontWeight="bold"
                  onClick={() => navigate(`/company/${product.company_id}`)}
                >
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
                    ? product.product.average_rate.toFixed(1)
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

            {/* 상세옵션 로직 */}
            <Box w="100%" mt={5}>
              {option.length > 0 && (
                <Menu matchWidth>
                  <MenuButton as={Button} w="100%" h="50px">
                    {selectedOption
                      ? option.find(
                          (opt) => opt.option_id.toString() === selectedOption,
                        )?.option_name || "옵션을 선택하세요"
                      : "옵션을 선택하세요"}
                  </MenuButton>
                  <MenuList>
                    {option.map((opt, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleOptionChange(opt.option_id)} // 여기서 handleOptionChange 호출
                      >
                        <Flex justifyContent="space-between" w="100%">
                          <Text>{opt.option_name}</Text>
                          <Text>수량: {opt.stock}</Text>
                        </Flex>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}

              <Box>
                {Object.keys(selectedOptionList).length > 0 &&
                  Object.entries(selectedOptionList).map(
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
                            onClick={() =>
                              handleRemoveDetail(optionList.option_id)
                            }
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
                            onClick={() =>
                              increaseQuantity(optionList.option_id)
                            } // 변경: key 대신 option_id 사용
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
                            onClick={() =>
                              decreaseQuantity(optionList.option_id)
                            } // 변경: key 대신 option_id 사용
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
                onClick={() => {
                  if (isAuthenticated()) {
                    handlePaymentClick();
                  } else {
                    toast({
                      title: "로그인 되지 않았습니다",
                      description: "결제는 로그인 후 가능합니다",
                      status: "error",
                    });
                    navigate("/login");
                  }
                }}
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

      {/*--------------- 상품 스탯 --------------- */}
      <ProductStats
        product_id={product_id}
        average_rate={product.product.average_rate}
      />

      {/* --------------- 상품 상세 설명, 리뷰 , Q&A --------------- */}
      <ReviewView
        product_id={product_id}
        product_content={product.product_content}
        productDetailImg={productDetailImg}
      />
    </Box>
  );
}
