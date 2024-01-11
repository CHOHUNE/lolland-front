import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart as fasHeart,
} from "@fortawesome/free-solid-svg-icons"; // 꽉 찬 하트
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"; // 빈 하트

export function ProductView() {
  const [product, setProduct] = useState(null);
  const [option, setOption] = useState([]);
  const [seletedOption, setSeletedOption] = useState("");
  const [seletedOptionList, setSeletedOptionList] = useState({});

  const { product_id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  if (product === null) {
    return <Spinner />;
  }

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // ------------------------------ 썸네일 클릭 시 메인 이미지 변경 ------------------------------
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    setSeletedOption(selectedValue);

    // 선택된 옵션을 찾아 해당 옵션 정보를 추가
    const selectedOptionInfo = option.find(
      (opt) => opt.option_id.toString() === selectedValue,
    );
    if (selectedOptionInfo) {
      setSeletedOptionList((prev) => ({
        ...prev,
        [selectedOptionInfo.option_id]: {
          ...selectedOptionInfo,
          quantity: prev[selectedOptionInfo.option_id]
            ? prev[selectedOptionInfo.option_id].quantity
            : 1, // 기존에 선택된 옵션이면 기존 수량 유지, 새로 추가되면 수량을 1로 설정
        },
      }));
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
    setSeletedOptionList((prevDetails) => ({
      ...prevDetails,
      [key]: {
        ...prevDetails[key],
        quantity: prevDetails[key].quantity + 1,
      },
    }));
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
    // 상세선택이 있고 선택된 상세선택이 있는 경우
    if (option.length > 0 && Object.keys(seletedOptionList).length > 0) {
      return formatPrice(
        Object.values(seletedOptionList).reduce((sum, optionItem) => {
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
  function handleBucketClick() {}

  return (
    <Box w="100%" p={5}>
      <Box w="80%">
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

      <Flex>
        {product.category_name} > {product.subcategory_name}
      </Flex>
      <Flex
        direction="row"
        justify="center"
        align="center"
        maxW="1200px"
        m="auto"
      >
        {/* 메인 이미지 */}
        <Box p={2}>
          {product.mainImgUrls && product.mainImgUrls.length > 0 && (
            <Image
              src={product.mainImgUrls[currentImageIndex]}
              alt={product.product_name}
              boxSize="400px"
              objectFit="contain"
            />
          )}
          {/* 썸네일 이미지 */}
          <HStack justifyContent={"center"} mt={2}>
            {product.mainImgUrls &&
              product.mainImgUrls.map((imgUrl, index) => (
                <Box key={index} onMouseEnter={() => selectImage(index)}>
                  <Image src={imgUrl} boxSize="100px" objectFit="cover" />
                </Box>
              ))}
          </HStack>
        </Box>

        {/* 상품 정보 컨테이너 */}
        <VStack w="60%" ml={5}>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              상품명
            </FormLabel>
            <Box mt={-2} border={"none"} flex={1}>
              {product.product.product_name}
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              금액
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {formatPrice(product.product.product_price)}원
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              상품설명
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.product.product_content}
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              재고
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.product.total_stock}개
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              제조사
            </FormLabel>
            <Text fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.company_name}
            </Text>
          </HStack>

          {/* 상세옵션 로직 */}
          <Box w="100%">
            {option.length > 0 && (
              <Box w="100%" position="relative" mt={5}>
                <Box>
                  <Select value={seletedOption} onChange={handleOptionChange}>
                    <option value="">옵션을 선택하세요</option>
                    {option.map((opt, index) => (
                      <option key={index} value={opt.option_id}>
                        {opt.option_name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Box>
            )}
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
                        w={"74px"}
                        border={"1px solid gray"}
                        borderRadius={"10px"}
                        bg={"white"}
                        m={3}
                      >
                        {/* ------------------- 수량 증가 버튼 ------------------- */}
                        <Button
                          size={"xs"}
                          bg={"none"}
                          borderRight={"1px solid gray"}
                          borderRadius={0}
                          p={0}
                          onClick={() => increaseQuantity(key)}
                          _hover={{ bg: "none" }}
                          _active={{ bg: "none" }}
                        >
                          <ChevronUpIcon />
                        </Button>
                        {/* ------------------- 수량 ------------------- */}
                        <Box fontSize={"13px"}>{optionList.quantity}</Box>
                        {/* ------------------- 수량 감소 버튼 ------------------- */}
                        <Button
                          size={"xs"}
                          bg={"none"}
                          borderLeft={"1px solid gray"}
                          borderRadius={0}
                          p={0}
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
                      fontSize: "25px",
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
              onClick={() => setIsFavorited(!isFavorited)} // 클릭 시 상태 토글
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
    </Box>
  );
}
