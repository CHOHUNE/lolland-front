import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
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

export function ProductPay() {
  const [addressOption, setAddressOption] = useState("회원 정보와 동일");
  const [purchaseInfo, setPurchaseInfo] = useState(null);
  const navigate = useNavigate();

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
      setPurchaseInfo(JSON.parse(storedPurchaseInfo));
    } else {
      console.log("No purchase info found in localStorage");
    }
  }, []);

  // ------------------------------ 결제버튼 클릭시 서버로 전송되는 로직 ------------------------------
  const handlePayment = async () => {
    const orderData = {
      productName: purchaseInfo.productName,
      optionName: purchaseInfo.selectedOptions
        .map((opt) => opt.option_name)
        .join(", "),
      price: purchaseInfo.totalOptionPrice,
      quantity: purchaseInfo.selectedOptions
        .map((opt) => opt.quantity)
        .join(", "),
      shippingFee: purchaseInfo.shippingFee,
      receiver: userInfo.receiver,
      contact: `${contactFirst}-${contactMiddle}-${contactLast}`,
      postalCode: userInfo.postalCode,
      basicAddress: userInfo.basicAddress,
      detailAddress: userInfo.detailAddress,
      deliveryMemo: userInfo.deliveryMemo, // 이 값을 state에서 가져오도록 수정해야 합니다.
      ordererName: userInfo.receiver, // 주문자명이 userInfo.receiver와 같은지 확인하세요.
      ordererContact: `${contactFirst}-${contactMiddle}-${contactLast}`, // 주문자 연락처가 이렇게 설정된 것이 맞는지 확인하세요.
      email: userInfo.email,
      productPrice: purchaseInfo.totalOptionPrice,
      totalShippingFee: purchaseInfo.shippingFee,
      finalPrice: purchaseInfo.totalOptionPrice + purchaseInfo.shippingFee,
    };
    try {
      const response = await axios.post("/api/product/order", orderData);
      // 성공적으로 전송된 후의 동작 작성. ex): 결제 성공 페이지로 navigate.
      console.log(response.data); // 서버로부터의 응답 데이터 확인
    } catch (error) {
      console.error("에러메세지 :", error);
    }
  };

  return (
    <Box mt={10} mb={10}>
      <Box justifyContent={"center"} display={"flex"} alignItems={"center"}>
        <FormControl w={"80%"}>
          <FormLabel fontSize={"1.5rem"} fontWeight={"bold"}>
            주문결제
          </FormLabel>
          <Table>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>상품명</Th>
                <Th>옵션명</Th>
                <Th>가격</Th>
                <Th>수량</Th>
                <Th>배송비</Th>
              </Tr>
            </Thead>
            {/* ------------------------------ 로컬스토리지 이용한 상품정보 가져오기 ------------------------------ */}
            <Tbody>
              {purchaseInfo && (
                <Tr>
                  <Th>
                    <Flex gap={4}>
                      {purchaseInfo.mainImgUrl && (
                        <Image
                          src={purchaseInfo.mainImgUrl}
                          alt="상품 이미지"
                          boxSize="150px" // 이미지 크기를 적당히 조정하세요.
                        />
                      )}
                      <Text
                        alignItems={"center"}
                        display={"flex"}
                        justifyContent={"center"}
                        onClick={() =>
                          navigate("/product/" + purchaseInfo.product_id)
                        }
                        _hover={{
                          cursor: "pointer",
                        }}
                      >
                        {purchaseInfo.productName}
                      </Text>
                    </Flex>
                  </Th>
                  {/* ---------------- 상세옵션선택 2개 이상일때 한줄씩 노출 ---------------- */}
                  <Th>
                    {purchaseInfo.selectedOptions.map((opt, index, array) => (
                      <React.Fragment key={index}>
                        {opt.option_name}
                        {/* 마지막 옵션명 뒤에는 줄바꿈을 추가하지 않습니다. */}
                        {index < array.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </Th>

                  <Th>
                    {purchaseInfo.totalOptionPrice.toLocaleString("ko-KR")}원
                  </Th>
                  <Th>
                    {purchaseInfo.selectedOptions.reduce(
                      (acc, opt) => acc + opt.quantity,
                      0,
                    )}
                  </Th>
                  <Th>{purchaseInfo.shippingFee.toLocaleString("ko-KR")}원</Th>
                </Tr>
              )}
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
          <Card w={"50%"} boxShadow={"2xl"}>
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
            <VStack boxShadow={"2xl"} p={5} spacing={5} align="stretch">
              <Box>
                <Heading size="lg" textAlign="center">
                  주문자 정보
                </Heading>
              </Box>

              <FormControl mb={6}>
                <Flex
                  w={"100%"}
                  justifyContent="space-between"
                  alignItems="end"
                >
                  <FormLabel w={"100px"}>주문자명</FormLabel>
                  <Box readOnly textAlign={"end"} border={"none"} flex="1">
                    {userInfo.receiver}
                  </Box>
                </Flex>

                <Flex w={"100%"} alignItems="center" mt={4}>
                  <FormLabel w={"100px"} alignItems={"end"}>
                    연락처
                  </FormLabel>
                  <Flex gap={1} flex="1" justifyContent={"end"}>
                    <Box type="tel" maxLength="3">
                      {contactFirst}
                    </Box>
                    <Text>-</Text>
                    <Box type="tel" maxLength="4">
                      {contactMiddle}
                    </Box>
                    <Text>-</Text>
                    <Box type="tel" maxLength="4">
                      {contactLast}
                    </Box>
                  </Flex>
                </Flex>

                <Flex
                  w={"100%"}
                  justifyContent="space-between"
                  alignItems="center"
                  mt={4}
                >
                  <FormLabel w={"100px"}>이메일</FormLabel>
                  <Text flex="1" textAlign={"end"}>
                    {userInfo.email || "이메일 주소를 입력해주세요."}
                  </Text>
                </Flex>
              </FormControl>

              <Box borderTop={"2px dotted #eeeeee"}>
                <Box mt={10}>
                  <Heading size="lg" textAlign="center">
                    결제 정보
                  </Heading>
                </Box>
              </Box>

              <FormControl>
                <Flex justifyContent="space-between">
                  <FormLabel>총 상품금액</FormLabel>
                  <Box>
                    {purchaseInfo
                      ? purchaseInfo.totalOptionPrice.toLocaleString("ko-KR")
                      : "0"}
                    원
                  </Box>
                </Flex>
                <Flex justifyContent="space-between">
                  <FormLabel>총 배송비</FormLabel>
                  <Box>
                    {purchaseInfo
                      ? purchaseInfo.shippingFee.toLocaleString("ko-KR")
                      : "0"}
                    원
                  </Box>
                </Flex>
              </FormControl>

              <FormControl>
                <Box borderTop={"2px dotted #eeeeee"}>
                  <Flex mt={5} justifyContent={"space-between"}>
                    <FormLabel fontWeight={"bold"} fontSize={"1.5rem"}>
                      최종 결제 금액
                    </FormLabel>
                    <Box fontWeight={"bold"} fontSize={"1.5rem"} color={"red"}>
                      {purchaseInfo
                        ? (
                            purchaseInfo.totalOptionPrice +
                            purchaseInfo.shippingFee
                          ).toLocaleString("ko-KR")
                        : "0"}
                      원
                    </Box>
                  </Flex>
                </Box>
              </FormControl>
              <Button
                background={"black"}
                color={"white"}
                size="lg"
                _hover={{ color: "black", bg: "#eeeeee" }}
                onClick={handlePayment}
              >
                결제하기
              </Button>
            </VStack>
          </Card>
        </Flex>
      </Box>

      {/* ------------------------------------- 주소변경 모달창 ------------------------------------- */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader boxShadow={"md"} mb={5}>
            주소 변경
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {userAddresses.map((address) => (
              <Box
                key={address.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                mb={2}
                bg={selectedAddress === address ? "#eeeeee" : "transparent"}
                _hover={{ cursor: "pointer", background: "#eeeeee" }}
                boxShadow={"md"}
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
