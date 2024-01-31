import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function CancelReqList() {
  // 버튼 css
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

  const [cancelReqList, setCancelReqList] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [refundStatus, setRefundStatus] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("/api/payment/cancel-req-member?" + params)
      .then((response) => {
        setCancelReqList(response.data.orderCancelReqDto);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "주문 내역을 불러오는 도중 에러",
            description: "백엔드 코드를 확인하세요",
            status: "error",
          });
        } else {
          toast({
            title: "주문 내역을 불러오는 도중 에러",
            description: "다시 한 번 시도하시거나, 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      })
      .finally(() => {
        setRefundStatus(false);
      });
  }, [location, refundStatus]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().substr(2); // 2024를 24로 변환
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 / ${hours}시${minutes}분`;
  };

  // 환불 버튼 클릭시 로직
  const handleRefundClick = (cancelInfo) => {
    axios
      .post("/api/payment/toss/cancel", {
        orderId: cancelInfo.order_nano_id,
      })
      .then(() =>
        toast({
          description: cancelInfo.order_name + "이 환불 처리 되었습니다.",
          status: "success",
        }),
      )
      .then(() => setRefundStatus(true))
      .catch(() => {
        toast({
          description: "환불 처리 중 문제가 발생하였습니다.",
          status: "error",
        });
      });
  };

  return (
    <Center>
      <Card shadow={"1px 1px 3px 1px #dadce0"} w={"1500px"} mt={6} mb={6}>
        <CardHeader
          mt={4}
          textAlign={"center"}
          fontSize={"2rem"}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          취소 요청 목록
        </CardHeader>

        <SimpleGrid columns={3} spacing={2}>
          {cancelReqList.map((cancelList) => (
            <CardBody key={cancelList.id}>
              <Box
                margin="auto"
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                shadow={"1px 1px 3px 1px #dadce0 inset"}
              >
                <Flex
                  borderRadius={"5px"}
                  gap={4}
                  h={"40px"}
                  lineHeight={"40px"}
                  fontSize={"0.9rem"}
                  fontWeight={"bold"}
                  bg={"black"}
                  color={"whitesmoke"}
                  justifyContent={"space-between"}
                  // shadow: "1px 1px 3px 1px #dadce0"
                >
                  <Text ml={2}>
                    주문일 : {formatDate(cancelList.order_reg_time)}
                  </Text>
                  <Box>|</Box>
                  <Text mr={2}>주문번호 : {cancelList.id}</Text>
                </Flex>
                <Box mt={2}>
                  <Text
                    borderRadius={"5px"}
                    fontSize={"0.9rem"}
                    fontWeight={"bold"}
                    bg={"#dadce0"}
                  >
                    결제 상품 정보
                  </Text>
                  <Flex gap={4} mt={2}>
                    <Box alignSelf="flex-start">
                      <Image
                        src={cancelList.main_img_uri}
                        w="100px"
                        h="100px"
                      />
                    </Box>
                    <Box textAlign={"left"}>
                      <Text fontSize={"1rem"}>{cancelList.order_name}</Text>
                      <Flex mt={2} gap={1} fontSize={"1rem"}>
                        <Text fontWeight={"bold"} color={"orangered"}>
                          {cancelList.total_price.toLocaleString()}
                        </Text>
                        원
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Box mt={2}>
                  <Text
                    borderRadius={"5px"}
                    fontSize={"0.9rem"}
                    fontWeight={"bold"}
                    bg={"#dadce0"}
                  >
                    회원 정보
                  </Text>
                  <Flex gap={4} mt={2}>
                    <Box
                      textAlign={"left"}
                      ml={2}
                      fontWeight={"bold"}
                      w={"50px"}
                    >
                      <Text mt={1}>이름</Text>
                      <Text mt={1}>아이디</Text>
                      <Text mt={1}>이메일</Text>
                      <Text mt={1}>전화번호</Text>
                    </Box>
                    <Box border={"1px solid #dadce0"}></Box>
                    <Box textAlign={"left"} ml={2} w={"220px"}>
                      <Text mt={1}>{cancelList.membersDto.member_name}</Text>
                      <Text mt={1}>
                        {cancelList.membersDto.member_login_id}
                      </Text>
                      <Text mt={1}>{cancelList.membersDto.member_email}</Text>
                      <Text mt={1}>
                        {cancelList.membersDto.member_phone_number}
                      </Text>
                    </Box>
                    <Box border={"1px solid #dadce0"}></Box>
                    <Box mt={8}>
                      <Button
                        w={"50px"}
                        h={"40px"}
                        {...buttonStyle}
                        onClick={() => {
                          handleRefundClick(cancelList);
                        }}
                      >
                        환불
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </CardBody>
          ))}
        </SimpleGrid>

        {/* 페이지 버튼  */}
        <Box mt={10} mb={10}>
          {pageInfo.prevPageNumber && (
            <Button
              bg={"white"}
              color={"black"}
              _hover={{ backgroundColor: "black", color: "whitesmoke" }}
              onClick={() => navigate("?page=" + pageInfo.prevPageNumber)}
            >
              <Flex gap={1}>
                <FontAwesomeIcon icon={faCaretLeft} />
                이전
              </Flex>
            </Button>
          )}

          {pageInfo.nextPageNumber && (
            <Button
              bg={"white"}
              color={"black"}
              _hover={{ backgroundColor: "black", color: "whitesmoke" }}
              ml={2}
              onClick={() => navigate("?page=" + pageInfo.nextPageNumber)}
            >
              <Flex gap={1}>
                다음
                <FontAwesomeIcon icon={faCaretRight} />
              </Flex>
            </Button>
          )}
        </Box>
      </Card>
    </Center>
  );
}
