import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { parse } from "@fortawesome/fontawesome-svg-core";

export function ProductPay() {
  const [addressOption, setAddressOption] = useState("회원 정보와 동일");
  const [purchaseInfo, setPurchaseInfo] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(3000);
  const navigate = useNavigate();
  const [orderName, setOrderName] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false); // 주소목록 모달창
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]); // 주소목록

  // 모달 여는 함수
  const openModal = () => setIsModalOpen(true);

  // 모달 닫는 함수
  const closeModal = () => setIsModalOpen(false);

  const [userInfo, setUserInfo] = useState({
    receiver: "",
    contact: "",
    postalCode: "",
    basicAddress: "",
    detailAddress: "",
  });

  const [contactFirst, setContactFirst] = useState("");
  const [contactMiddle, setContactMiddle] = useState("");
  const [contactLast, setContactLast] = useState("");

  // ------------------------------ 주소 ------------------------------
  const [productAddress, setProductAddress] = useState("");
  const [product_detail_address, setProduct_detail_address] = useState("");
  // ------------------------------ 우편번호 ------------------------------
  const [product_post_code, setProduct_post_code] = useState("");

  // ------------------------------ Daum Postcode 스크립트 URL ------------------------------
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  // ------------------------------ Daum Postcode 팝업을 여는 함수 ------------------------------
  const openPostcodePopup = useDaumPostcodePopup(scriptUrl);

  // ------------------------------ 주소검색 버튼 클릭시 다음 postcode 팝업 열리게 하는 로직 ------------------------------
  const handlePostCodeClick = () => {
    openPostcodePopup({ onComplete: handleComplete });
  };
  const isOptionSelected = (option) => addressOption === option;

  // ------------------------------ 주소선택 완료될 때 처리 함수 ------------------------------
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setUserInfo({
      ...userInfo,
      postalCode: data.zonecode,
      basicAddress: fullAddress, // 기본주소를 업데이트
      detailAddress: "", // 상세주소 초기화
    });
    setAddressOption("새로운 주소"); // 주소 옵션을 새로운 주소로 설정
  };

  // ------------------------------ 회원 정보 가져오는 로직 ------------------------------
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/member/homepageLogin");
      if (!response.ok) {
        throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      // 연락처를 하이픈으로 분리하여 상태에 저장
      const contactParts = data.member_phone_number.split("-");
      if (contactParts.length === 3) {
        setContactFirst(contactParts[0]);
        setContactMiddle(contactParts[1]);
        setContactLast(contactParts[2]);
      }
      setUserInfo({
        receiver: data.member_name,
        contact: data.member_phone_number,
        email: data.member_email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------ 회원 주소목록 가져오는 로직 ------------------------------
  const fetchUserAddress = async (isInitialLoad = false) => {
    try {
      const response = await axios.get("/api/memberAddress/loginUser");
      if (response.status !== 200) {
        throw new Error("주소 정보를 불러오는데 실패했습니다.");
      }
      const addressData = response.data;
      setUserAddresses(addressData);

      if (isInitialLoad) {
        // main 타입의 주소만 필터링하여 첫 번째 주소를 userInfo에 설정합니다.
        const mainAddress = addressData.find(
          (address) => address.member_address_type === "main",
        );
        if (mainAddress) {
          setUserInfo((prevState) => ({
            ...prevState,
            postalCode: mainAddress.member_post_code,
            basicAddress: mainAddress.member_address,
            detailAddress: mainAddress.member_detail_address,
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------ 페이지 로드 시에 회원정보, 주소 호출 ------------------------------
  useEffect(() => {
    fetchUserInfo();
    fetchUserAddress(true); // 초기 로드 시 main 주소를 설정
  }, []);

  // ------------------------------ 주소변경 클릭 시 실행되는 로직 ------------------------------
  const handleAddressChangeClick = async () => {
    await fetchUserAddress(); // 회원의 주소 목록을 불러옵니다.
    // 현재 선택된 주소를 selectedAddress 상태에 저장
    const currentSelectedAddress = userAddresses.find(
      (address) =>
        address.member_post_code === userInfo.postalCode &&
        address.member_address === userInfo.basicAddress &&
        address.member_detail_address === userInfo.detailAddress,
    );
    setSelectedAddress(currentSelectedAddress || null);
    openModal(); // 모달
  };

  // ------------------------------ 주소변경 모달창에서 주소목록 선택 할 수 있는 로직 ------------------------------
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setUserInfo({
      ...userInfo,
      postalCode: address.member_post_code,
      basicAddress: address.member_address,
      detailAddress: address.member_detail_address,
    });
    closeModal();
  };

  // ------------------------------ 새로운 주소 버튼 클릭시 빈값으로 변경 로직 ------------------------------
  const handleNewAddress = () => {
    setUserInfo({
      ...userInfo,
      postalCode: "",
      basicAddress: "",
      detailAddress: "",
    });
    setAddressOption("새로운 주소"); // 주소 옵션 상태도 업데이트
  };

  // ------------------------------ 회원정보와 동일 버튼 클릭시 main 주소를 userInfo 상태에 업데이트하는 함수 ------------------------------
  const handleMainAddress = () => {
    const mainAddress = userAddresses.find(
      (address) => address.member_address_type === "main",
    );
    if (mainAddress) {
      setUserInfo({
        ...userInfo,
        postalCode: mainAddress.member_post_code,
        basicAddress: mainAddress.member_address,
        detailAddress: mainAddress.member_detail_address,
      });
    }
    setAddressOption("회원 정보와 동일");
  };

  // ------------------------------ ProductView에 로컬스토리지 이용해서 상품정보 가져오는 로직 ------------------------------
  useEffect(() => {
    const storedPurchaseInfo = localStorage.getItem("purchaseInfo");

    if (storedPurchaseInfo) {
      const parsedPurchaseInfo = JSON.parse(storedPurchaseInfo);
      setPurchaseInfo(parsedPurchaseInfo);
      setTotalPrice(calculateTotalPrice(parsedPurchaseInfo));
      // 주문 이름 생성
      if (parsedPurchaseInfo.length > 1) {
        // 여러 상품일 경우 : 첫 상품명 외 {나머지 상품 갯수} 건
        const firstGroupProductName = parsedPurchaseInfo[0].productName;
        const numOtherGroups = parsedPurchaseInfo.length - 1;
        setOrderName(`${firstGroupProductName} 외 ${numOtherGroups}건`);
      } else if (parsedPurchaseInfo.length === 1) {
        // 한 상품일 경우 : 첫 상품명
        setOrderName(parsedPurchaseInfo[0].productName);
      } else {
        // 없을 경우 : ""
        setOrderName("");
      }
    } else {
      console.log("No purchase info found in localStorage");
    }
  }, []);

  const calculateTotalPrice = (purchaseInfo) => {
    return purchaseInfo.reduce((total, group) => {
      const groupTotal = group.options.reduce(
        (groupTotal, option) => groupTotal + option.price * option.quantity,
        0,
      );
      return total + groupTotal;
    }, 0);
  };

  return (
    <Box mt={10} mb={10}>
      <Box justifyContent={"center"} display={"flex"} alignItems={"center"}>
        <FormControl w={"80%"}>
          <FormLabel fontSize={"1.5rem"} fontWeight={"bold"}>
            상품 결제 {purchaseInfo ? ": " + orderName : ""}
          </FormLabel>
          <Table>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>상품 이미지</Th>
                <Th textAlign={"center"}>상품명</Th>
                <Th textAlign={"center"}>옵션명</Th>
                <Th textAlign={"center"}>가격</Th>
                <Th textAlign={"center"}>수량</Th>
              </Tr>
            </Thead>
            <Tbody>
              {purchaseInfo &&
                purchaseInfo.map((group, index) => (
                  <Tr key={index}>
                    <Th
                      display="flex"
                      justifyContent="center"
                      onClick={() => navigate(`/product/${group.productId}`)}
                    >
                      {group.mainImgUrl && (
                        <Image
                          src={group.mainImgUrl}
                          alt="상품 이미지"
                          boxSize="150px"
                        />
                      )}
                    </Th>
                    <Th textAlign="center" whiteSpace="pre-wrap">
                      {group.productName}
                    </Th>
                    <Th textAlign="center">
                      {group.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          {option.optionName} ({option.quantity}개)
                        </div>
                      ))}
                    </Th>
                    <Th textAlign="center">
                      {group.options
                        .reduce((total, option) => total + option.price, 0)
                        .toLocaleString("ko-KR")}{" "}
                      원
                    </Th>
                    <Th textAlign="center">
                      {group.options.reduce(
                        (total, option) => total + option.quantity,
                        0,
                      )}
                    </Th>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </FormControl>
      </Box>

      {/* ------------------------------------- 배송 및 주문자 정보 ------------------------------------- */}
      <Box
        mt={10}
        justifyContent={"center"}
        display={"flex"}
        alignItems={"center"}
      >
        {/* ------------------------------------- 배송정보 ------------------------------------- */}
        <Flex h={"100%"} w={"80%"} p={5} justifyContent={"space-evenly"}>
          <Card w={"50%"} shadow="md">
            <VStack p={5} spacing={5} align="stretch">
              <Box>
                <Heading size="lg" textAlign="center">
                  배송 정보
                </Heading>
              </Box>
              {isOptionSelected("회원 정보와 동일") && (
                <Text fontSize="md" color="gray.500">
                  ※ 회원 정보와 동일한 배송지로 발송합니다.
                </Text>
              )}
              {isOptionSelected("새로운 주소") && (
                <Text fontSize="md" color="gray.500">
                  ※ 주소를 새롭게 입력해주시기 바랍니다.
                </Text>
              )}
              <Button
                h={"50px"}
                mb={-3}
                px={5}
                py={3}
                boxShadow="md"
                background={
                  isOptionSelected("회원 정보와 동일") ? "black" : "white"
                }
                color={isOptionSelected("회원 정보와 동일") ? "white" : "black"}
                _hover={
                  isOptionSelected("회원 정보와 동일")
                    ? {}
                    : { background: "#eeeeee" }
                }
                onClick={handleMainAddress} // 이벤트 핸들러 연결
              >
                회원 정보와 동일
              </Button>
              <Button
                h={"50px"}
                px={5}
                py={3}
                boxShadow="md"
                background={isOptionSelected("새로운 주소") ? "black" : "white"}
                color={isOptionSelected("새로운 주소") ? "white" : "black"}
                _hover={
                  isOptionSelected("새로운 주소")
                    ? {}
                    : { background: "#eeeeee" }
                }
                onClick={handleNewAddress} // 이벤트 핸들러 연결
              >
                새로운 주소
              </Button>

              <Flex justifyContent="flex-end">
                <Button
                  w={"80px"}
                  h={"30px"}
                  fontSize={"0.8rem"}
                  onClick={handleAddressChangeClick}
                  bg={"white"}
                  color={"black"}
                  boxShadow={"md"}
                  _hover={{
                    background: "none",
                    color: "gray",
                  }}
                >
                  주소변경
                </Button>
              </Flex>

              <FormControl isRequired>
                <FormLabel>받는사람</FormLabel>
                {/*<Input placeholder="이름을 입력해주세요." />*/}
                <Input
                  value={userInfo.receiver || ""}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, receiver: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>연락처</FormLabel>
                <HStack>
                  <Input
                    value={contactFirst}
                    onChange={(e) => setContactFirst(e.target.value)}
                    type="tel"
                    maxLength="3"
                  />
                  <Input
                    value={contactMiddle}
                    onChange={(e) => setContactMiddle(e.target.value)}
                    type="tel"
                    maxLength="4"
                  />
                  <Input
                    value={contactLast}
                    onChange={(e) => setContactLast(e.target.value)}
                    type="tel"
                    maxLength="4"
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>우편번호</FormLabel>
                <Flex gap={2}>
                  <Input
                    readOnly
                    value={userInfo.postalCode || ""}
                    placeholder="주소를 검색해주세요."
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, postalCode: e.target.value })
                    }
                  />
                  <Button
                    onClick={handlePostCodeClick}
                    color={"white"}
                    bg={"black"}
                    w={"100px"}
                    _hover={{
                      background: "black",
                      color: "white",
                    }}
                  >
                    주소 검색
                  </Button>
                </Flex>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>기본주소</FormLabel>
                <Input
                  value={userInfo.basicAddress || ""}
                  placeholder="기본주소를 입력해주세요."
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, basicAddress: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>상세주소</FormLabel>
                <Input
                  value={userInfo.detailAddress || ""}
                  placeholder="상세주소를 입력해주세요."
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, detailAddress: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>배송메모</FormLabel>
                <Textarea placeholder="배송시 요청사항을 입력해주세요." />
              </FormControl>
            </VStack>
          </Card>

          {/* ------------------------------------- 주문자 정보 ------------------------------------- */}
          <Card h={"100%"} w={"30%"}>
            <VStack shadow="md" p={5} spacing={5} align="stretch">
              <Heading size="lg" textAlign="center">
                주문자 정보
              </Heading>

              <VStack spacing={2} my={3}>
                <Flex w="full" justifyContent="space-between">
                  <Text as="span" fontSize="md">
                    주문자명
                  </Text>
                  <Text as="span" fontSize="md" textAlign={"flex-start"}>
                    {userInfo.receiver}
                  </Text>
                </Flex>

                <Flex w="full" justifyContent="space-between">
                  <Text as="span" fontSize="md">
                    연락처
                  </Text>
                  <Text as="span" fontSize="md" textAlign={"flex-start"}>
                    {contactFirst} - {contactMiddle} - {contactLast}
                  </Text>
                </Flex>

                <Flex w="full" justifyContent="space-between">
                  <Text as="span" fontSize="md">
                    이메일
                  </Text>
                  <Text as="span" fontSize="md" textAlign={"flex-start"}>
                    {userInfo.email || "이메일 주소를 입력해주세요."}
                  </Text>
                </Flex>
              </VStack>

              <Divider variant="dashed" color="#EEEEEE" borderWidth="1px" />

              <Heading size="lg" textAlign="center">
                결제 정보
              </Heading>
              <VStack spacing={2}>
                <Flex w="full" justifyContent="space-between">
                  <Text fontSize="md">총 상품금액</Text>
                  <Text fontSize="md">
                    {purchaseInfo ? totalPrice.toLocaleString("ko-KR") : "0"}원
                  </Text>
                </Flex>
                <Flex w="full" justifyContent="space-between">
                  <Text fontSize="md">총 배송비</Text>
                  <Text fontSize="md">
                    {shippingFee.toLocaleString("kr-KR")}원
                  </Text>
                </Flex>
              </VStack>

              <Divider variant="dashed" color="#EEEEEE" borderWidth="1px" />
              <Flex justifyContent="space-between" my={2}>
                <Heading size="md">결제 금액</Heading>
                <Heading size="md" color="red">
                  {purchaseInfo
                    ? (totalPrice + shippingFee).toLocaleString("ko-Kr")
                    : 0}
                  원
                </Heading>
              </Flex>
              <Button
                background={"black"}
                color={"white"}
                size="lg"
                _hover={{ color: "black", bg: "#eeeeee" }}
                // onClick={handlePayment}
              >
                결제하기
              </Button>
            </VStack>
          </Card>
        </Flex>
      </Box>

      {/* ------------------------------------- 주소변경 모달창 ------------------------------------- */}
      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>주소 변경</ModalHeader>
          <ModalCloseButton size="lg" mt={1} />
          <ModalBody>
            {userAddresses.map((address) => (
              <Box
                key={address.id}
                p={4}
                border="1px solid #E8E8E8"
                borderRadius="lg"
                shadow="md"
                mb={2}
                bg={selectedAddress === address ? "#FFC444" : "transparent"}
                _hover={{ cursor: "pointer", background: "#FFC444" }}
                onClick={() => handleAddressSelect(address)}
              >
                <Text fontWeight="bold">{address.member_address_name}</Text>
                <Text>
                  {address.member_address} {address.member_detail_address}
                </Text>
                <Text>{address.member_post_code}</Text>
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={closeModal}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
