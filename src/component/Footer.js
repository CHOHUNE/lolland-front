import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";

export function Footer() {
  return (
    <>
      <Box bgColor="#F4F4F4">
        <Flex justifyContent="flex-start" mx="3%" p={5}>
          <ButtonGroup size="sm" variant="undefined">
            <Button>회사소개</Button>
            <Button>이용약관</Button>
            <Button>개인정보</Button>
            <Button>청소년보호정책</Button>
            <Button>입점/제휴 문의</Button>
            <Button>대량구매</Button>
            <Button>Contact Us</Button>
            <Button>고객센터</Button>
          </ButtonGroup>
        </Flex>
        <Center>
          <Divider w="94%" />
        </Center>
        <Flex justifyContent="space-between" mx="3%" p={5}>
          <Box>
            <HStack>
              <Text>상호명 : lolLand (롤랜드)</Text>
            </HStack>
            <HStack>주소 : 서울시 마포구 신촌로 176</HStack>
            <HStack>관리자 : 조대훈 최재희 이승원 이정훈 이승미</HStack>
            <HStack>문의 번호 : 000-0000-0000</HStack>
            <Text>
              본 페이지는 졸업 프로젝트로 어떠한 영리적 활동도 하지 않는
              사이트임을 알립니다.
            </Text>
          </Box>
          <Box>로고</Box>
        </Flex>
      </Box>
      {/*<Flex*/}
      {/*  w={"100%"}*/}
      {/*  h={"300px"}*/}
      {/*  bg={"rgba(217, 217, 217, 0.36)"}*/}
      {/*  justifyContent={"center"}*/}
      {/*>*/}
      {/*  <Box w={"1296px"} h={"300px"} bg={"#D9D9D9"}>*/}
      {/*    <Flex justifyContent={"space-around"} mt={6}>*/}
      {/*      <Box ml={"65px"} w={"700px"}>*/}
      {/*        <Flex fontSize={"1.2rem"}>*/}
      {/*          <Box w={"100px"} h={"24px"}>*/}
      {/*            회사소개*/}
      {/*          </Box>*/}
      {/*          <Box w={"100px"} h={"24px"}>*/}
      {/*            이용약관*/}
      {/*          </Box>*/}
      {/*          <Box w={"150px"} h={"24px"}>*/}
      {/*            개인정보처리방침*/}
      {/*          </Box>*/}
      {/*          <Box w={"140px"} h={"24px"}>*/}
      {/*            입점 / 제휴 문의*/}
      {/*          </Box>*/}
      {/*          <Box w={"120px"} h={"24px"}>*/}
      {/*            Contact Us*/}
      {/*          </Box>*/}
      {/*        </Flex>*/}
      {/*        <Box border="3px solid gray" mt={2} w={"600px"}></Box>*/}
      {/*        <Box mt={4}>상호명 : lolLand (롤랜드)</Box>*/}
      {/*        <Box mt={4}>주소 : 서울시 마포구 신촌로 176</Box>*/}
      {/*        <Box mt={4}>관리자 : 조대훈 최재희 이승원 이정훈 이승미</Box>*/}
      {/*        <Box mt={4}>문의 번호 : 000-0000-0000</Box>*/}
      {/*      </Box>*/}
      {/*      <Box w={"596px"} textAlign={"right"} mr={"30px"} mt={4}>*/}
      {/*        본 페이지는 졸업 프로젝트로 어떻한 영리*/}
      {/*        <br />적 활동도 하지 않는 사이트임을 알립니다.*/}
      {/*      </Box>*/}
      {/*    </Flex>*/}
      {/*  </Box>*/}
      {/*</Flex>*/}
    </>
  );
}
