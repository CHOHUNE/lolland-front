import { Box, Heading, Text } from "@chakra-ui/react";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function AdminIndex() {
  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      textAlign="center"
      w="full"
      h="100vh"
      opacity={0.4}
      zIndex={5}
    >
      <Text fontSize="8xl">
        <FontAwesomeIcon icon={faScrewdriverWrench} />
      </Text>
      <Heading size="md">관리자 메인 페이지 공사 중...</Heading>
    </Box>
  );
}
