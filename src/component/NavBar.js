import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* 상단 네브바 */}
      <Box w={"100%"} h={"90px"} bg={"#D9D9D9"} >
        <Flex w={"100%"} h={"100%"} textAlign={"center"} >
          <Box w={"200px"} h={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} bg={"#C4CFD7"} onClick={() => navigate("/")}>
            프로젝트 로고
          </Box>
          <Box w={"45%"} h={"100%"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} ml={5} gap={4}>
              <Button w="150px" h="60%" borderRadius={"15px"}>HOME</Button>
              <Button w="150px" h="60%" borderRadius={"15px"}>신상품</Button>
              <Button w="150px" h="60%" borderRadius={"15px"}>인기글</Button>
              <Button w="150px" h="60%" borderRadius={"15px"}>이벤트</Button>
          </Box>
          <Box w={"100%"} alignItems={"center"} justifyContent={"end"} display={"flex"} gap={4} mr={5} >
            <Button>검색</Button>
            <Button>장바구니</Button>
            <Button>회원가입</Button>
            <Button>로그인</Button>
          </Box>
        </Flex>
      </Box>
      {/* 하단 네브바 */}
      <Box w={"100%"} h={"80px"} bg={"#5F625C"}>
        <Flex w={"100%"} h={"100%"} >
          <Box  w={"40%"} alignItems={"center"} justifyContent={"start"} display={"flex"} gap={5}>
          <Button borderRadius={0} h={"70%"}>게임 커뮤니티</Button>
          <Button borderRadius={0} h={"70%"}>게임 장비 커뮤니티</Button>
          <Button borderRadius={0} h={"70%"}>전자기기</Button>
          <Button borderRadius={0} h={"70%"}>조립pc</Button>
          <Button borderRadius={0} h={"70%"} onClick={() => navigate("product/write/")}>상품등록</Button>
          <Button borderRadius={0} h={"70%"} onClick={() => navigate("product/list/")}>상품리스트</Button>
          </Box>
          <Box w={"100%"} alignItems={"center"} justifyContent={"end"} display={"flex"} mr={5}>
            <Button>공지사항</Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
