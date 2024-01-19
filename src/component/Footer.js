import {
  AbsoluteCenter,
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
      <Box bgColor="#F4F4F4" px={10} pt={5} pb={10}>
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
            <HStack spacing={5} mb={2}>
              <HStack>
                <Text fontSize="xs">상호명</Text>
                <Text fontSize="xs">LOLLAND (롤랜드)</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs">주장</Text>
                <Text as="span" fontSize="xs" fontWeight="bold">
                  이승원
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs">사업자등록번호</Text>
                <Text fontSize="xs">000-00-00000</Text>
                <Text as="ins" fontSize="xs">
                  사업자 정보 확인
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs">소재지</Text>
                <Text fontSize="xs">서울시 마포구 신촌로 176</Text>
              </HStack>
            </HStack>
            <HStack spacing={5} mb={2}>
              <HStack>
                <Text fontSize="xs">개인정보보호책임자</Text>
                <Text fontSize="xs">없음</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs">통신판매업신고</Text>
                <Text fontSize="xs">제 0000-XXXX-0000호</Text>
              </HStack>
            </HStack>
            <Text fontSize="xs" mb={2}>
              Copyright © 0000 LOLLAND KOREA, INC. All rights reserved.
            </Text>
            <HStack mb={2}>
              <Text fontSize="xs">관리자</Text>
              <Text fontSize="xs">조대훈 최재희 이승원 이정훈 이승미</Text>
            </HStack>
            <HStack>문의 번호 : 000-0000-0000</HStack>
            <Text fontSize="sm" fontWeight="bold">
              본 페이지는 졸업 프로젝트로 어떠한 영리적 활동도 하지 않는
              사이트임을 알립니다.
            </Text>
          </Box>
          <Box
            w="200px"
            // border="1px dashed black"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Text className="logo" fontSize="6xl">
              Lolland
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
