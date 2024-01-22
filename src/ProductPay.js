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
import { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export function ProductPay() {
  const [addressOption, setAddressOption] = useState("회원 정보와 동일");

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

  // 주소검색 버튼 클릭시 다음 postcode 열리게 하기 -------------------------------------------------------------
  const handlePostCodeClick = () => {
    openPostcodePopup({ onComplete: handleComplete });
  };

  const isOptionSelected = (option) => addressOption === option;

  return (
    <Box mt={10}>
      <Box justifyContent={"center"} display={"flex"} alignItems={"center"}>
        <FormControl w={"80%"}>
          <FormLabel fontSize={"1.5rem"} fontWeight={"bold"}>
            주문결제
          </FormLabel>
          <Table>
            <Thead>
              <Tr>
                <Th>상품명</Th>
                <Th>옵션명</Th>
                <Th>가격</Th>
                <Th>수량</Th>
                <Th>배송비</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Th>
                  [도시바] 외장HDD, Canvio BASICS 5 [USB3.2 Gen1] [1TB/블랙]
                </Th>
                <Th>기본제품</Th>
                <Th>152,000</Th>
                <Th>1</Th>
                <Th>3,000</Th>
              </Tr>
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
          <Card w={"50%"} boxShadow={"lg"}>
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
                <Input placeholder="이름을 입력해주세요." />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>연락처</FormLabel>
                <HStack>
                  <Input type="tel" />
                  <Input type="tel" />
                  <Input type="tel" />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>우편번호</FormLabel>
                <Flex gap={2}>
                  <Input
                    value={product_post_code}
                    placeholder="주소를 검색해주세요."
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
                  value={productAddress}
                  placeholder="기본주소를 입력해주세요."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>상세주소</FormLabel>
                <Input
                  value={product_detail_address}
                  placeholder="상세주소를 입력해주세요."
                  onChange={(e) => setProduct_detail_address(e.target.value)}
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
            <VStack boxShadow={"lg"} p={5} spacing={5} align="stretch">
              <Box>
                <Heading size="lg" textAlign="center">
                  주문자 정보
                </Heading>
              </Box>

              <FormControl mb={6}>
                <Flex justifyContent="space-between">
                  <FormLabel>주문자명</FormLabel>
                  <Box>홍길동</Box>
                </Flex>

                <Flex justifyContent="space-between">
                  <FormLabel>연락처</FormLabel>
                  <Box>010-3613-8304</Box>
                </Flex>

                <Flex justifyContent="space-between">
                  <FormLabel>이메일</FormLabel>
                  <Box>gns14585@naver.com</Box>
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
                  <Box>152,000</Box>
                </Flex>
                <Flex justifyContent="space-between">
                  <FormLabel>총 배송비</FormLabel>
                  <Box>3,000</Box>
                </Flex>
              </FormControl>

              <FormControl>
                <Box borderTop={"2px dotted #eeeeee"}>
                  <Flex mt={5} justifyContent={"space-between"}>
                    <FormLabel fontWeight={"bold"} fontSize={"1.5rem"}>
                      최종 결제 금액
                    </FormLabel>
                    <Box fontWeight={"bold"} fontSize={"1.5rem"} color={"red"}>
                      155,000원
                    </Box>
                  </Flex>
                </Box>
              </FormControl>
              <Button
                background={"black"}
                color={"white"}
                size="lg"
                _hover={{ color: "black", bg: "#eeeeee" }}
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
