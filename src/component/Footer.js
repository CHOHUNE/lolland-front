import { Box, Button, Flex } from "@chakra-ui/react";

export function Footer() {
  return (
    <Flex
      w={"100%"}
      h={"300px"}
      bg={"rgba(217, 217, 217, 0.36)"}
      justifyContent={"center"}
    >
      <Box w={"1296px"} h={"300px"} bg={"#D9D9D9"}>
        <Flex justifyContent={"space-around"} mt={6}>
          <Box ml={"65px"} w={"700px"}>
            <Flex fontSize={"1.2rem"}>
              <Box w={"100px"} h={"24px"}>
                회사소개
              </Box>
              <Box w={"100px"} h={"24px"}>
                이용약관
              </Box>
              <Box w={"150px"} h={"24px"}>
                개인정보처리방침
              </Box>
              <Box w={"140px"} h={"24px"}>
                입점 / 제휴 문의
              </Box>
              <Box w={"120px"} h={"24px"}>
                Contact Us
              </Box>
            </Flex>
            <Box border="3px solid gray" mt={2} w={"600px"}></Box>
            <Box mt={4}>상호명 : lolLand (롤랜드)</Box>
            <Box mt={4}>주소 : 서울시 마포구 신촌로 176</Box>
            <Box mt={4}>관리자 : 조대훈 최재희 이승원 이정훈 이승미</Box>
            <Box mt={4}>문의 번호 : 000-0000-0000</Box>
          </Box>
          <Box w={"596px"} textAlign={"right"} mr={"30px"} mt={4}>
            본 페이지는 졸업 프로젝트로 어떻한 영리
            <br />적 활동도 하지 않는 사이트임을 알립니다.
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
