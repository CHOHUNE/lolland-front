import { Box, Flex } from "@chakra-ui/react";

export function NavBar() {
  return (
    <Box>
      {/* 상단 네브바 */}
      <Box w={"100%"} h={"90px"} bg={"#D9D9D9"}>
        <Flex lineHeight={"center"} textAlign={"center"}>
          <Box w={"200px"} h={"75px"} bg={"#C4CFD7"}>
            프로젝트 로고
          </Box>
        </Flex>
      </Box>
      {/* 하단 네브바 */}
      <Box w={"100%"} h={"80px"} bg={"#5F625C"}>
        하단네브바
      </Box>
    </Box>
  );
}
