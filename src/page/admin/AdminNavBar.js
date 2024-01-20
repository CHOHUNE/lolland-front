import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faComment,
  faPeopleGroup,
  faPlus,
  faTableList,
  faUser,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function AdminNavBar() {
  const navigate = useNavigate();

  // 회원 목록 클릭시
  function handleMemberListClick() {
    navigate("/adminPage/memberList");
  }

  const buttonStyle = {
    variant: "undefined",
    isRound: true,
    _hover: { bgColor: "orange", color: "white" },
  };

  return (
    <>
      <Flex
        flexDir="column"
        ml={5}
        my={5}
        px={2}
        py={5}
        justifyContent="center"
        borderRadius={20}
        textAlign="center"
        bgColor="#FFF"
        shadow="md"
      >
        <VStack spacing={10}>
          <Tooltip hasArrow label="상품 등록" placement="right">
            <IconButton
              {...buttonStyle}
              onClick={() => navigate("/product/write/")}
              icon={<FontAwesomeIcon icon={faPlus} />}
            />
          </Tooltip>
          <Tooltip hasArrow label="상품 리스트" placement="right">
            <IconButton
              {...buttonStyle}
              icon={<FontAwesomeIcon icon={faTableList} />}
              onClick={() => {
                navigate("/product/list/");
              }}
            />
          </Tooltip>
          <Tooltip hasArrow label="판매 현황 보기" placement="right">
            <IconButton
              {...buttonStyle}
              icon={<FontAwesomeIcon icon={faChartLine} />}
            />
          </Tooltip>
          <Tooltip hasArrow label="문의 답변 등록하기" placement="right">
            <IconButton
              {...buttonStyle}
              icon={<FontAwesomeIcon icon={faComment} />}
            />
          </Tooltip>
          <Tooltip hasArrow label="회원 목록" placement="right">
            <IconButton
              {...buttonStyle}
              icon={<FontAwesomeIcon icon={faPeopleGroup} />}
              onClick={() => navigate("/adminPage/memberList")}
            />
          </Tooltip>
        </VStack>
      </Flex>
      {/*<Card>*/}
      {/*  <CardHeader>관리자 페이지 입니다.</CardHeader>*/}

      {/*  <CardBody border={"1px solid black"} bg={"black"} color={"whitesmoke"}>*/}
      {/*    <Flex gap={10}>*/}
      {/*      /!* 상품 등록 *!/*/}
      {/*      <FormControl>*/}
      {/*        <Flex justify={"space-between"}>*/}
      {/*          <FormLabel*/}
      {/*            _hover={{ cursor: "pointer" }}*/}
      {/*            fontWeight={"900"}*/}
      {/*            onClick={() => navigate("/product/write/")}*/}
      {/*          >*/}
      {/*            상품 등록 >*/}
      {/*          </FormLabel>*/}
      {/*          <Box>*/}
      {/*            <FontAwesomeIcon icon={faPlus} />*/}
      {/*          </Box>*/}
      {/*        </Flex>*/}
      {/*      </FormControl>*/}
      {/*      <Box border={"1px solid whitesmoke"}></Box>*/}

      {/*      /!* 상품 목록 *!/*/}
      {/*      <FormControl>*/}
      {/*        <Flex justify={"space-between"}>*/}
      {/*          <FormLabel*/}
      {/*            _hover={{ cursor: "pointer" }}*/}
      {/*            fontWeight={"900"}*/}
      {/*            onClick={() => {*/}
      {/*              navigate("/product/list/");*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            상품 목록 >*/}
      {/*          </FormLabel>*/}
      {/*          <Box>*/}
      {/*            <FontAwesomeIcon icon={faTableList} />*/}
      {/*          </Box>*/}
      {/*        </Flex>*/}
      {/*      </FormControl>*/}
      {/*      <Box border={"1px solid whitesmoke"}></Box>*/}

      {/*      /!* 회원 목록 *!/*/}
      {/*      <FormControl>*/}
      {/*        <Flex justify={"space-between"}>*/}
      {/*          <FormLabel*/}
      {/*            _hover={{ cursor: "pointer" }}*/}
      {/*            fontWeight={"900"}*/}
      {/*            onClick={handleMemberListClick}*/}
      {/*          >*/}
      {/*            회원 목록 관리 >*/}
      {/*          </FormLabel>*/}
      {/*          <Box>*/}
      {/*            <FontAwesomeIcon icon={faPeopleGroup} />*/}
      {/*          </Box>*/}
      {/*        </Flex>*/}
      {/*      </FormControl>*/}
      {/*    </Flex>*/}
      {/*  </CardBody>*/}
      {/*</Card>*/}
    </>
  );
}
