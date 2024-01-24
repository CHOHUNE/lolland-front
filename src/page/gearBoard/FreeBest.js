import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function FreeBest() {
  const [boardList, setBoardList] = useState(null);

  useEffect(() => {
    axios
      .get("api/gearboard/best")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList == null) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="orange">
          추천 베스트
        </Heading>
      </CardHeader>
      <Divider orientation="horizontal" color={"orange"} />
      <CardBody>
        <Stack divider={<StackDivider />} spacing="3">
          {boardList.map((item) => (
            <Flex
              key={item.gear_id}
              justify="flex-start"
              alignItems="center" // 수직 정렬 중앙으로 조정
            >
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {item.gear_title}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {item.gear_content}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
