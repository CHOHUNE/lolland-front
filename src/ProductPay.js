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

export function ProductPay() {
  const [addressOption, setAddressOption] = useState("회원 정보와 동일");
  const [purchaseInfo, setPurchaseInfo] = useState(null);

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

  // 주소 --------------------------------------------------------------------------------------
  const [productAddress, setProductAddress] = useState("");
  const [product_detail_address, setProduct_detail_address] = useState("");
  // 우편번호 --------------------------------------------------------------------------------------
  const [product_post_code, setProduct_post_code] = useState("");

  // Daum Postcode 스크립트 URL
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  // Daum Postcode 팝업을 여는 함수
  const openPostcodePopup = useDaumPostcodePopup(scriptUrl);

  // 주소 검색 완료 핸들러
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
    setProductAddress(fullAddress); // 선택된 주소를 상태에 저장
    setProduct_post_code(data.zonecode);
  };

  // ------------------------------ 주소검색 버튼 클릭시 다음 postcode 열리게 하는 로직 ------------------------------
  const handlePostCodeClick = () => {
    openPostcodePopup({ onComplete: handleComplete });
  };
  const isOptionSelected = (option) => addressOption === option;

  // ------------------------------ 로그인 정보 가져오는 로직 ------------------------------

  useEffect(() => {
    // 로그인한 사용자의 정보를 가져오는 함수
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
          postalCode: data.member_post_code,
          basicAddress: data.member_address,
          detailAddress: data.member_detail_address,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  // ------------------------------ ProductView에 로컬스토리지 이용해서 상품정보 가져오는 로직 ------------------------------
  useEffect(() => {
    const storedPurchaseInfo = localStorage.getItem("purchaseInfo");
    if (storedPurchaseInfo) {
      setPurchaseInfo(JSON.parse(storedPurchaseInfo));
    } else {
      console.log("No purchase info found in localStorage");
    }
  }, []);

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
      totalProductPrice: purchaseInfo.totalOptionPrice,
      totalShippingFee: purchaseInfo.shippingFee,
      finalAmount: purchaseInfo.totalOptionPrice + purchaseInfo.shippingFee,
    };

    try {
      const response = await axios.post("/api/product/order", orderData);
      // 성공적으로 전송된 후의 동작을 작성하세요. 예: 결제 성공 페이지로 리다이렉트.
      console.log(response.data); // 서버로부터의 응답 데이터를 확인
    } catch (error) {
      console.error("Order submission failed:", error);
      // 에러 핸들링을 작성하세요. 예: 사용자에게 에러 메시지를 보여주기.
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
            <Tbody>
              {/* ------------------------------ 로컬스토리지 이용한 정보 가져오기 ------------------------------ */}
              {purchaseInfo &&
                purchaseInfo.selectedOptions.map((opt, index) => (
                  <Tr key={index}>
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
                        >
                          {purchaseInfo.productName}
                        </Text>
                      </Flex>
                    </Th>
                    <Th>{opt.option_name}</Th>
                    <Th>
                      {purchaseInfo
                        ? purchaseInfo.totalOptionPrice.toLocaleString("ko-KR")
                        : "0"}
                      원
                    </Th>

                    <Th>{opt.quantity}</Th>
                    <Th>
                      {purchaseInfo
                        ? purchaseInfo.shippingFee.toLocaleString("ko-KR")
                        : "0"}
                      원
                    </Th>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </FormControl>
      </Box>

      {/* ------------------------------------- 구매상품 정보 ------------------------------------- */}
      <Box
        mt={10}
        justifyContent={"center"}
        display={"flex"}
        alignItems={"center"}
      >
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
                onClick={() => setAddressOption("회원 정보와 동일")}
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
                onClick={() => setAddressOption("새로운 주소")}
              >
                새로운 주소
              </Button>

              <FormControl isRequired>
                <FormLabel>받는사람</FormLabel>
                {/*<Input placeholder="이름을 입력해주세요." />*/}
                <Input
                  value={userInfo.receiver}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, receiver: e.target.value })
                  }
                />
              </FormControl>
              {/*setUserInfo({*/}
              {/*receiver: data.member_name,*/}
              {/*contact: data.member_phone_number,*/}
              {/*postalCode: data.member_post_code,*/}
              {/*basicAddress: data.member_address,*/}
              {/*detailAddress: data.member_detail_address,*/}

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
                    value={userInfo.postalCode}
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
                  value={userInfo.basicAddress}
                  placeholder="기본주소를 입력해주세요."
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, basicAddress: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>상세주소</FormLabel>
                <Input
                  value={userInfo.detailAddress}
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
                  <HStack flex="1" justifyContent={"end"}>
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
                  </HStack>
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
    </Box>
  );
}
